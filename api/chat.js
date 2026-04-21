export default async function handler(req, res) {
    const { prompt } = JSON.parse(req.body);
    const apiKey = process.env.GEMINI_API_KEY; // यहाँ से Key सुरक्षित तरीके से लोड होगी

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }]
            })
        });
        const data = await response.json();
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: "API connection failed" });
    }
}
