import Groq from "groq-sdk"

export async function handler(event) {
  // Autoriser seulement POST
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method Not Allowed" })
    }
  }

  // Vérifier la clé API
  if (!process.env.GROQ_API_KEY) {
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

    const groq = new Groq({
      apiKey: process.env.GROQ_API_KEY
    })

    const completion = await groq.chat.completions.create({
      model: "llama3-70b-8192",
      messages: [
        { role: "system", content: "You are a fast AI assistant." },
        { role: "user", content: message }
      ]
    })

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        reply: completion.choices[0].message.content
      })
    }

  } catch (error) {
    console.error("Chat function error:", error)

    return {
      statusCode: 500,
      body: JSON.stringify({
        error: error.message || "Erreur interne"
      })
    }
  }
}
