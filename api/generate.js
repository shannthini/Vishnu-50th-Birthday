export default async function handler(req, res) {
  try {
    const { name, words } = req.body || {};

    if (!name || !words || !Array.isArray(words)) {
      return res.status(400).json({ error: "Invalid input" });
    }

    const prompt = `
Write a funny, warm roast-style paragraph about Vishnu turning 50.
Name: ${name}
Words: ${words.join(", ")}
Use all words naturally in 3-4 sentences.
`;

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "mistralai/mistral-small-3.1-24b-instruct:free",
        messages: [
          { role: "user", content: prompt }
        ]
      })
    });

  const data = await response.json();

console.log("OpenRouter response:", JSON.stringify(data, null, 2));

res.status(200).json({
  text:
    data?.choices?.[0]?.message?.content ||
    data?.error?.message ||
    JSON.stringify(data)
});

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server crashed" });
  }
}
