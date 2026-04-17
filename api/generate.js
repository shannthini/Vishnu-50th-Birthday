export default async function handler(req, res) {
  try {
    const { name, words } = req.body || {};

    if (!name || !words || !Array.isArray(words)) {
      return res.status(400).json({ error: "Invalid input" });
    }

    const prompt = `
Vishnu is turning 50. Someone described him using these words:
Name: ${name}
Words: ${words.join(", ")}

Write exactly 3 funny, affectionate sentences that naturally use all the words. Make it sound like a real friend telling a story at a birthday party. Avoid generic compliments and avoid sounding like AI.
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
