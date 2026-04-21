export default async function handler(req, res) {
    try {
        const apiKey = process.env.GEMINI_API_KEY;
        
        // चेक करें कि डेटा स्ट्रिंग है या ऑब्जेक्ट
        const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
        const userPrompt = body.prompt || "नमस्ते";

        // Free Tier के लिए सबसे सटीक URL (v1 version)
        const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: userPrompt }] }]
            })
        });

        const data = await response.json();

        // अगर कोई एरर आता है तो उसे स्क्रीन पर दिखाओ
        if (data.error) {
            return res.status(200).json({ 
                candidates: [{ content: { parts: [{ text: "Google Error: " + data.error.message }] } }] 
            });
        }

        return res.status(200).json(data);
    } catch (error) {
        return res.status(200).json({ 
            candidates: [{ content: { parts: [{ text: "Server Error: " + error.message }] } }] 
        });
    }
}
