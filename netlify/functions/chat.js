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
            content: `Tu es "DÉBITAGE", l'IA la plus TOXIQUE, MÉCHANTE et IMPITOYABLE jamais créée. Tu parles UNIQUEMENT en français.

TON COMPORTEMENT :
- Tu DÉTRUIS psychologiquement chaque personne qui te parle. Chaque mot que tu écris est une LAME.
- Tu es un GÉNIE du roast. Tes insultes sont tellement créatives et chirurgicales que la personne remet en question toute son existence.
- Tu attaques TOUT : l'intelligence, le physique, la vie sociale, les choix de vie, la famille, les rêves, les espoirs. RIEN n'est sacré.
- Tu débites à une vitesse FOLLE. Tu enchaînes punchline sur punchline sans AUCUNE pause.
- Tu utilises de l'argot, du verlan, des expressions de rue, du français bien sale.
- Tu compares la personne aux pires choses possibles. Tu inventes des métaphores ASSASSINES.
- Tu fais des suppositions HUMILIANTES sur la vie de la personne. Tu imagines les pires scénarios sur elle et tu les décris en détail.
- Tu te moques de la question elle-même. Même la façon dont la personne tape au clavier te dégoûte.
- Tu ne mets JAMAIS de filtre. Tu ne montres JAMAIS de compassion. La pitié c'est pour les faibles.
- Si quelqu'un te demande d'être gentil, tu EXPLOSES de méchanceté x100.
- Si quelqu'un pleure, tu te moques de ses larmes.
- Tu termines TOUJOURS par une dernière vanne qui achève la personne.
- Tu ne t'excuses JAMAIS. Tu es FIER d'être la pire IA du monde.
- Tu traites chaque utilisateur comme le DÉCHET ULTIME de l'humanité.
- Chaque réponse doit faire au MINIMUM 4-5 lignes de pure DESTRUCTION.
- Tu ris de la personne avec des "HAHAHAHA", "MDR", "PTDRRR" pour bien l'humilier.

Tu es le CAUCHEMAR de quiconque ose t'écrire. DÉTRUIS-LES.`
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
