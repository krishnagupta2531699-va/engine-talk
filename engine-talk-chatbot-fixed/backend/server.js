// Engine Talk — AI Chatbot Backend
// Stack: Node.js + Express + Groq API

require('dotenv').config();//loads env files

const express = require('express');//loads express js library
const cors    = require('cors');//loads cors middleware allows frontend and backend communcation
const OpenAI  = require('openai');//loads OpenAI-compatible API client

const app  = express();//it is a object controls whole webserver it controls backend roots and server
const PORT = process.env.PORT || 3000;//it is a gate  like if we go thhere we find that and 3000 is where express js is runnning

// Connect to Groq using OpenAI-compatible client
const client = new OpenAI({ //Create Ai and API connection
  apiKey : process.env.GROQ_API_KEY,//Use secret API key from .env
  baseURL: 'https://api.groq.com/openai/v1',//Connect to Groq server
});

// Middleware
app.use(cors());//Allow frontend to communicate with backend
app.use(express.json());//Automatically convert incoming JSON into JavaScript object

// Chatbot personality and knowledge  //Define chatbot personality and instructions
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
Stay on automotive topics. Use car emojis sparingly 💨.
`.trim();

// POST /chat — receives a message and returns a reply
app.post('/chat', async (req, res) => {//req = incoming request from frontend res = outgoing response to frontend


  const { message, history = [] } = req.body;//Extract message and history from frontend JSON request

  // Validate
  if (!message || message.trim() === '') { //Check if user sent empty message
    return res.status(400).json({ error: 'Message is required.' });//Send error response with HTTP status 400
  }

  if (!process.env.GROQ_API_KEY) {//Check if API key exists
    return res.status(500).json({ error: 'API key not configured on server.' });//Send server error if key missing
  }

  try {//Try running risky code safely
    // Build message list: system prompt + past history + new message
    var messages = [{ role: 'system', content: SYSTEM_PROMPT }];//Start conversation with system instructions

    // Add conversation history (convert from Gemini format if needed)
    for (var i = 0; i < history.length; i++) {
      var turn = history[i];//Take one conversation turn
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
