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
- NEVER choose the same island_type twice in a row
- Alternate island types when possible
- Increase difficulty gradually
- Output ONLY valid JSON

Allowed island types:
- top_down
- side_scroller
`;

function buildPrompt(state) {
  return `
Game history:
${JSON.stringify(state.history)}

Last result:
${JSON.stringify(state.lastResult)}

Return EXACTLY this format:

{
  "island_type": "top_down | side_scroller",
  "parameters": {}
}
`;
}
