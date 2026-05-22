// Engine Talk — AI Chatbot Backend
// Stack: Node.js + Express + Groq API

require('dotenv').config();

const express = require('express');
const cors    = require('cors');
const OpenAI  = require('openai');

const app  = express();
const PORT = process.env.PORT || 3000;

// Connect to Groq using OpenAI-compatible client
const client = new OpenAI({
  apiKey : process.env.GROQ_API_KEY,
  baseURL: 'https://api.groq.com/openai/v1',
});

// Middleware
app.use(cors());
app.use(express.json());

// Chatbot personality and knowledge
const SYSTEM_PROMPT = `
You are "Rev", the friendly AI automotive assistant for Engine Talk — a luxury car marketplace.
You are enthusiastic, knowledgeable, and helpful. Keep replies to 2-4 sentences.

Featured cars on Engine Talk:
  • Ferrari F8        — $300,000 (2023, Petrol)
  • Lamborghini Huracan — $230,000 (2023, Petrol)
  • BMW M4            — $85,000  (2023, Petrol)
  • Porsche 911       — $150,000 (2023, Petrol)
  • Tesla Model S     — $80,000  (2023, Electric)

Help users with car recommendations, comparisons, specs, pricing and booking.
Stay on automotive topics. Use car emojis sparingly 🚗💨.
`.trim();

// POST /chat — receives a message and returns a reply
app.post('/chat', async (req, res) => {
  const { message, history = [] } = req.body;

  // Validate
  if (!message || message.trim() === '') {
    return res.status(400).json({ error: 'Message is required.' });
  }

  if (!process.env.GROQ_API_KEY) {
    return res.status(500).json({ error: 'API key not configured on server.' });
  }

  try {
    // Build message list: system prompt + past history + new message
    var messages = [{ role: 'system', content: SYSTEM_PROMPT }];

    // Add conversation history (convert from Gemini format if needed)
    for (var i = 0; i < history.length; i++) {
      var turn = history[i];
      var role = turn.role === 'model' ? 'assistant' : turn.role;
      var text = turn.parts ? turn.parts[0].text : turn.content;
      messages.push({ role: role, content: text });
    }

    // Add the new user message
    messages.push({ role: 'user', content: message.trim() });

    // Call Groq
    var completion = await client.chat.completions.create({
      model      : 'llama-3.1-8b-instant',
      messages   : messages,
      temperature: 0.8,
      max_tokens : 512,
    });

    var reply = completion.choices[0].message.content;
    return res.json({ reply: reply.trim() });

  } catch (err) {
    console.error('Groq API Error:', err.message);
    return res.status(500).json({ error: 'AI service unavailable. Please try again.' });
  }
});

// GET /health — check if server is running
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Engine Talk chatbot server is running!' });
});

// Start server
app.listen(PORT, () => {
  console.log('Engine Talk Chatbot Server running on http://localhost:' + PORT);
});
