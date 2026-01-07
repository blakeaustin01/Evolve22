export async function handler(event) {
  const body = JSON.parse(event.body);

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
        messages: [
          {
            role: "system",
            content: SYSTEM_PROMPT
          },
          {
            role: "user",
            content: buildPrompt(body)
          }
        ]
      })
    }
  );

  const data = await response.json();
  return {
    statusCode: 200,
    body: data.choices[0].message.content
  };
}

const SYSTEM_PROMPT = `
You are a game director AI.

Rules:
- Difficulty increases gradually
- Never repeat the same island type twice
- Modify parameters ONLY
- Do not invent mechanics
- Output ONLY valid JSON
`;

function buildPrompt(state) {
  return `
Current difficulty: ${state.difficultyLevel}

History:
${JSON.stringify(state.history)}

Return format:
{
  "island_type": "top_down | side_scroller",
  "parameters": {}
}
`;
}
