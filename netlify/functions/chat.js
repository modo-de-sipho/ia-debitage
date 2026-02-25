const Groq = require("groq-sdk")
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
          { role: "system", content: "You are a fast AI assistant." },
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
