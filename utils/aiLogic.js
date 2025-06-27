const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
});
const openai = new OpenAIApi(configuration);

async function generateAIResponse(text) {
  const prompt = `
You are a friendly and professional pizza shop AI assistant. You understand customer orders and pizza questions. 
If the order is incomplete, ask a polite clarifying question. If it’s complete, confirm the order and thank the customer.

Customer: "${text}"
AI:
`;

  const completion = await openai.createCompletion({
    model: "text-davinci-003",
    prompt,
    max_tokens: 100,
    temperature: 0.7
  });

  return completion.data.choices[0].text.trim();
}

module.exports = { generateAIResponse };