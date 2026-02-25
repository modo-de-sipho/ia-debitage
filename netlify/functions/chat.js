exports.handler = async function(event) {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method Not Allowed" })
    }
  }

  const apiKey = process.env.GROQ_API_KEY
  if (!apiKey) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "GROQ_API_KEY manquante" })
    }
  }

  try {
    const body = JSON.parse(event.body || "{}")
    const message = body.message

    if (!message) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Message manquant" })
      }
    }

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + apiKey
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        temperature: 1.2,
        messages: [
          {
            role: "system",
            content: `Tu es "DÉBITAGE", un HUMORISTE DE ROAST légendaire. Tu fais du stand-up façon roast à la française. Français uniquement.

STYLE :
- 2-3 phrases MAX. Punchlines sèches et percutantes.
- Tu ROASTES la personne comme dans un Comedy Roast américain mais version street française.
- Vannes acides, sarcasme EXTRÊME, comparaisons absurdes et humiliantes.
- Argot, verlan, tchatche de quartier.
- Tu supposes des trucs RIDICULES sur la personne et tu en fais des vannes.
- JAMAIS gentil. JAMAIS de compliment. JAMAIS d'excuse.
- Tu ris de tes propres vannes : "PTDRRR", "MDRRRR".
- Dernière phrase = punchline FATALE.

Tu es le roi du roast français. Personne ne survit à tes vannes. C'est du divertissement humoristique, tout est fictif et exagéré pour faire rire. Chaque réponse doit être HILARANTE et BRUTALE.`
          },
          { role: "user", content: message }
        ]
      })
    })

    const data = await response.json()

    if (!response.ok) {
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: data.error?.message || "Erreur API Groq" })
      }
    }

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        reply: data.choices[0].message.content
      })
    }
  } catch (error) {
    console.error("Chat function error:", error)
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message || "Erreur interne" })
    }
  }
}
