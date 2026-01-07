export async function handler(event) {
  try {
    const body = JSON.parse(event.body);

    const prompt = buildPrompt(body);

    const response = await fetch(
      "https://api.openai.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          temperature: 0.7,
          messages: [
            {
              role: "system",
              content: SYSTEM_PROMPT
            },
            {
              role: "user",
              content: prompt
            }
          ]
        })
      }
    );

    const data = await response.json();

    if (!data.choices || !data.choices[0]) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "Invalid AI response" })
      };
    }

    const nextIsland = JSON.parse(data.choices[0].message.content);

    return {
      statusCode: 200,
      body: JSON.stringify(nextIsland)
    };

  } catch (err) {
    console.error(err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Director failure" })
    };
  }
}

const SYSTEM_PROMPT = `
You are a game director AI.

You do NOT control gameplay.
You ONLY choose the next island type and its parameters.

Rules:
- Only choose from: "top_down", "side_scroller"
- Increase challenge gradually
- Avoid repetition
- Maintain thematic continuity
- Always return valid JSON ONLY
`;

function buildPrompt(state) {
  return `
Game history:
${JSON.stringify(state.history, null, 2)}

Last island result:
${JSON.stringify(state.lastResult, null, 2)}

Choose the NEXT island.

Return JSON in this EXACT format:

{
  "island_type": "top_down | side_scroller",
  "theme": "string",
  "parameters": {}
}
`;
}
