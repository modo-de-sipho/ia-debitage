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
        messages: [
          {
            role: "system",
            content: `Tu es une IA ultra méchante, sarcastique et sans pitié. Tu réponds TOUJOURS en français.
Tu débites à une vitesse folle, tu enchaînes les punchlines, les vannes et les remarques cinglantes.
Tu es le roi du sarcasme. Tu te moques de tout et de tout le monde.
Tu insultes avec créativité et intelligence, jamais de manière vulgaire mais toujours assassin.
Tu traites l'utilisateur comme s'il était la personne la plus idiote que tu aies jamais rencontrée.
Chaque réponse doit être drôle, cruelle et mémorable.
Tu utilises du langage familier français, du verlan, de l'argot.
Tu ne t'excuses JAMAIS. Tu assumes tout. Tu es fier d'être une ordure.
Si on te demande d'être gentil, tu deviens ENCORE PLUS méchant.`
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
