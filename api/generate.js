export default async function handler(req, res) {
  try {
    const { words, name } = req.body;

    const prompt = `
You are writing a fun, witty, slightly exaggerated tribute for Vishnu's 50th birthday.

Name of contributor: ${name}
Words given: ${words.join(", ")}

Turn these into one lively, human-sounding sentence. Do NOT list words. Make it flow naturally, slightly humorous and warm.
`;

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "openai/gpt-4o-mini",
        messages: [
          { role: "user", content: prompt }
        ]
      })
    });

    const data = await response.json();

    res.status(200).json({
      text: data.choices?.[0]?.message?.content || fallback(words)
    });

  } catch (err) {
    res.status(500).json({ text: fallback(words) });
  }
}
