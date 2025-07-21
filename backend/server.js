require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { OpenAI } = require('openai');

const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// List of keywords that are on-topic (expand as needed)
const allowedKeywords = [
  // Topic words
  "podstatné jméno", "podstatná jména", "noun", "nouns", "definice", "příklad", "angličtina",
  // Expected answer groups and their variations
  "lidé", "člověk", "osoba", "osoby", "zvíře", "zvířata", "věc", "věci", "vlastnost", "vlastnosti", "děj", "děje"
];

// Helper function to check if the message is on-topic
function isOnTopic(message) {
  const lower = message.toLowerCase().replace(/[.,!?;:]/g, '').trim();
  return allowedKeywords.some(keyword => lower.includes(keyword));
}

app.post('/api/chat', async (req, res) => {
  const { messages } = req.body;
  const lastUserMessage = messages[messages.length - 1]?.content || "";

  if (!isOnTopic(lastUserMessage)) {
    return res.json({
      reply: "Omlouvám se, ale musíme se držet tématu podstatných jmen. Prosím, odpověz na aktuální otázku."
    });
  }

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4-1106-preview', // switched to GPT-4.1 (1106-preview) for improved performance and instruction following
      messages,
    });
    res.json({ reply: completion.choices[0].message.content });
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ error: 'AI request failed' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
