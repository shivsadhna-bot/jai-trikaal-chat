export default async function handler(req, res) {
    try {
        const apiKey = process.env.GEMINI_API_KEY;
        const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
        const userPrompt = body.prompt || "नमस्ते";

        // 'gemini-1.5-flash' सबसे ज़्यादा कम्पैटिबल मॉडल है
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: userPrompt }] }]
            })
        });

        const data = await response.json();

        if (data.error) {
            // अगर अब भी नहीं मिलता, तो हम सीधे 'gemini-pro' (बिना वर्शन नंबर के) ट्राई करेंगे
            return res.status(200).json({ 
                candidates: [{ content: { parts: [{ text: "Google Error: " + data.error.message }] } }] 
            });
        }

        return res.status(200).json(data);
    } catch (error) {
        return res.status(200).json({ 
            candidates: [{ content: { parts: [{ text: "System Error: " + error.message }] } }] 
        });
    }
}
