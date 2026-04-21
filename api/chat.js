export default async function handler(req, res) {
    try {
        const apiKey = process.env.GEMINI_API_KEY;
        const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
        const userPrompt = body.prompt || "नमस्ते";

        // आपके अकाउंट के अनुसार लेटेस्ट मॉडल: Gemini 2.5 Flash Preview TTS
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-tts:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: userPrompt }] }]
            })
        });

        const data = await response.json();

        if (data.error) {
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
