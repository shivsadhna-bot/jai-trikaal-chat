export default async function handler(req, res) {
    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ error: "Method not allowed" });
    }

    try {
        const apiKey = process.env.GEMINI_API_KEY;

        // API Key check
        if (!apiKey) {
            return res.status(500).json({ error: "API Key missing in environment variables" });
        }

        // Body parsing (Vercel automatic handling)
        const body = req.body;
        const userPrompt = body.prompt || "नमस्ते";

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: userPrompt }] }]
            })
        });

        const data = await response.json();

        // Google API ki taraf se errors handle karna
        if (data.error) {
            return res.status(data.error.code || 400).json({
                error: data.error.message
            });
        }

        // Response format ko simplify karke bhej rahe hain taaki frontend par asani ho
        const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || "No response generated";

        return res.status(200).json({ 
            success: true,
            message: aiResponse 
        });

    } catch (error) {
        return res.status(500).json({ 
            success: false,
            error: "System Error: " + error.message 
        });
    }
}
