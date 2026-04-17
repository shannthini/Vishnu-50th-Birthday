export default async function handler(req, res) {
  try {
    const { name, words } = req.body || {};

    if (!name || !words || !Array.isArray(words)) {
      return res.status(400).json({ error: "Invalid input" });
    }

    const prompt = `
Vishnu is turning 50. Someone described him using these words:
Name: ${name}
${words.join(", ")}

Write exactly 3 sentences.

The sentences should sound like a real friend at a birthday party telling an oddly specific, affectionate, funny statements about Vishnu.
Use every word naturally and meaningfully. Do not just list the words or turn them into generic compliments.
Make the humor specific, vivid, and slightly exaggerated. Build toward a punchline in the final sentence.

Avoid vague phrases like:
- "pure joy"
- "loving moments"
- "shared chaos"
- "cute memories"
- "no one missed a detail"

The tone should feel like:
"He somehow manages to be both incredibly organized and the man who once brought a spreadsheet to a barbecue. If you give Vishnu a 'quick' decision, he’ll return 14 minutes later with three backup plans, two jokes, and a detailed risk analysis. Honestly, turning 50 is the first reckless thing he’s done in years."
`;

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "openrouter/free",
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
