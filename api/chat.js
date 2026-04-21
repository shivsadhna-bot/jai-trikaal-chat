export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: "Method not allowed" });
    }

    try {
        const { prompt } = JSON.parse(req.body);
        const apiKey = process.env.GEMINI_API_KEY;

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }]
            })
        });

        const data = await response.json();
        
        // अगर Google कोई एरर भेजता है
        if (data.error) {
            return res.status(500).json({ error: data.error.message });
        }

        return res.status(200).json(data);
    } catch (error) {
        return res.status(500).json({ error: "Internal Server Error: " + error.message });
    }
}
