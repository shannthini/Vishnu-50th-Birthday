export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { name, count, diet } = req.body;

  try {
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'onboarding@resend.dev',
        to: 'shannthini@gmail.com',
        subject: `RSVP for Vishnu's 50th — ${name}`,
        text: `Name: ${name}\nParty size: ${count}\nDietary needs: ${diet || 'None'}`
      })
    });
    res.status(200).json({ ok: true });
  } catch(e) {
    res.status(500).json({ ok: false });
  }
}
