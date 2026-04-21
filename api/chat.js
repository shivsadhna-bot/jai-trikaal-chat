export default async function handler(req, res) {
    // सिर्फ POST रिक्वेस्ट को अनुमति दें
    if (req.method !== 'POST') {
        return res.status(405).json({ error: "Method not allowed" });
    }

    try {
        // डेटा को सुरक्षित तरीके से निकालें
        const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) {
            return res.status(500).json({ error: "API Key Missing" });
        }

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: body.prompt || "नमस्ते" }] }]
            })
        });

        const data = await response.json();

        // अगर Gemini से जवाब नहीं मिला तो एरर भेजें
        if (!data.candidates || data.candidates.length === 0) {
            console.error("Gemini Error:", data);
            return res.status(500).json({ error: "No response from AI" });
        }

        return res.status(200).json(data);
    } catch (error) {
        console.error("Server Error:", error);
        return res.status(500).json({ error: error.message });
    }
}
