export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: "Method not allowed" });
    }

    try {
        const apiKey = process.env.GEMINI_API_KEY;
        const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
        const userPrompt = body.prompt || "नमस्ते";

        // Pro Tier के लिए सबसे सटीक और अपडेटेड URL (v1 version)
        const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: userPrompt }]
                }]
            })
        });

        const data = await response.json();

        if (data.error) {
            // यहाँ हम साफ़ देख पाएंगे कि Google क्या एरर दे रहा है
            console.error("Gemini API Error:", data.error);
            return res.status(200).json({ 
                candidates: [{ content: { parts: [{ text: "Google API Error: " + data.error.message }] } }] 
            });
        }

        return res.status(200).json(data);
    } catch (error) {
        console.error("Server Error:", error);
        return res.status(200).json({ 
            candidates: [{ content: { parts: [{ text: "Server Error: " + error.message }] } }] 
        });
    }
}
