export default async function handler(req, res) {
    try {
        const apiKey = process.env.GEMINI_API_KEY;
        const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
        const userPrompt = body.prompt || "नमस्ते";

        // यह URL सबसे लेटेस्ट है (v1) और 1.5-flash मॉडल के लिए स्टैंडर्ड है
        const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
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
            return res.status(200).json({ 
                candidates: [{ content: { parts: [{ text: "API Error: " + data.error.message }] } }] 
            });
        }

        return res.status(200).json(data);
    } catch (error) {
        return res.status(200).json({ 
            candidates: [{ content: { parts: [{ text: "System Error: " + error.message }] } }] 
        });
    }
}
