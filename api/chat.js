export default async function handler(req, res) {
    try {
        const apiKey = process.env.GEMINI_API_KEY;
        const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
        const userPrompt = body.prompt || "नमस्ते";

        // Gemini 3 Flash Preview के लिए सबसे सटीक API Endpoint
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: userPrompt }] }],
                // यह हिस्सा 'Thinking' एबिलिटी को इनेबल करता है
                generationConfig: {
                    thinking_config: { include_thoughts: true }
                }
            })
        });

        const data = await response.json();

        if (data.error) {
            return res.status(200).json({ 
                candidates: [{ content: { parts: [{ text: "API Error: " + data.error.message }] } }] 
            });
        }

        // Gemini 3 का रिस्पॉन्स स्ट्रक्चर थोड़ा अलग हो सकता है, इसलिए इसे संभालें
        const resultText = data.candidates?.[0]?.content?.parts?.[0]?.text || "AI अभी सोच रहा है, कृपया दोबारा प्रयास करें।";

        return res.status(200).json(data);
    } catch (error) {
        return res.status(200).json({ 
            candidates: [{ content: { parts: [{ text: "Server Error: " + error.message }] } }] 
        });
    }
}
