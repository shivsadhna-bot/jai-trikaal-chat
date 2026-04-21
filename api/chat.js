export default async function handler(req, res) {
    const apiKey = process.env.GEMINI_API_KEY;
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: body.prompt || "नमस्ते" }] }]
            })
        });

        const data = await response.json();
        
        // अगर यहाँ भी एरर आता है, तो हम समझ जाएंगे कि Key में ही गड़बड़ है
        if (data.error) {
            return res.status(200).json({ 
                candidates: [{ content: { parts: [{ text: "Final Error: " + data.error.message }] } }] 
            });
        }

        return res.status(200).json(data);
    } catch (e) {
        return res.status(500).json({ error: e.message });
    }
}
