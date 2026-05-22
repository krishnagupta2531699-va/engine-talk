// Engine Talk — Chatbot
// Calls Groq API directly from the browser — no backend needed!

// ── YOUR API KEY ──────────────────────────────────────────────────────────────
var GROQ_API_KEY = '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'; 

// ── SETTINGS ──────────────────────────────────────────────────────────────────
var GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';
var AI_MODEL = 'llama-3.1-8b-instant'; // fast & free Groq model

// Who the bot is and what it knows about the store
var SYSTEM_PROMPT = [
  'You are Rev, a friendly AI assistant for Engine Talk — a luxury car marketplace.',
  'Keep replies short (2-4 sentences). Be enthusiastic and helpful.',
  'Featured cars: Ferrari F8 ($300,000), Lamborghini Huracan ($230,000),',
  'BMW M4 ($85,000), Porsche 911 ($150,000), Tesla Model S ($80,000).',
  'Help with car recommendations, comparisons, pricing and booking.',
  'Only talk about cars and the Engine Talk store. Use car emojis sparingly 🚗'
].join(' ');

var chatHistory = []; // remembers the conversation
var waiting     = false; // prevents sending two messages at once

// ── 1. BUILD THE CHAT UI ──────────────────────────────────────────────────────
function buildChat() {

  // Floating toggle button
  var btn = document.createElement('button');
  btn.id        = 'chatbot-toggle-btn';
  btn.innerHTML = '⚙️';
  btn.title     = 'Chat with Rev';

  // Chat window (hidden by default)
  var win = document.createElement('div');
  win.id = 'chatbot-window';
  win.innerHTML =
    '<div id="chat-header">' +
      '<div class="chat-avatar">⚡</div>' +
      '<div class="chat-info"><h4>Rev — AI Assistant</h4><p>Online • Engine Talk</p></div>' +
      '<button id="chat-close-btn">✕</button>' +
    '</div>' +
    '<div id="chat-messages"></div>' +
    '<div id="chat-input-area">' +
      '<input id="chat-input" type="text" placeholder="Ask about cars, prices, booking…" autocomplete="off" />' +
      '<button id="chat-send-btn">➤</button>' +
    '</div>';

  document.body.appendChild(btn);
  document.body.appendChild(win);

  // Hook up all buttons and Enter key
  btn.addEventListener('click', toggleChat);
  document.getElementById('chat-close-btn').addEventListener('click', toggleChat);
  document.getElementById('chat-send-btn').addEventListener('click', sendMessage);
  document.getElementById('chat-input').addEventListener('keydown', function(e) {
    if (e.key === 'Enter') sendMessage();
  });
}

// ── 2. OPEN / CLOSE THE CHAT WINDOW ──────────────────────────────────────────
function toggleChat() {
  var win    = document.getElementById('chatbot-window');
  var btn    = document.getElementById('chatbot-toggle-btn');
  var isOpen = win.classList.toggle('chat-open');

  btn.innerHTML = isOpen ? '✕' : '⚙️';

  if (isOpen) {
    // Show welcome message the very first time
    var msgs = document.getElementById('chat-messages');
    if (msgs.children.length === 0) {
      addBubble('bot', "👋 Hey! I'm Rev, your Engine Talk assistant. Ask me about cars, prices or booking! 🚗");
    }
    setTimeout(function() { document.getElementById('chat-input').focus(); }, 300);
  }
}

// ── 3. ADD A MESSAGE BUBBLE ───────────────────────────────────────────────────
function addBubble(role, text) {
  var msgs   = document.getElementById('chat-messages');
  var bubble = document.createElement('div');
  bubble.className = 'chat-bubble ' + role; // bot / user / typing / error

  if (role === 'typing') {
    bubble.innerHTML = '<div class="typing-dots"><span></span><span></span><span></span></div>';
  } else {
    bubble.textContent = text;
  }

  msgs.appendChild(bubble);
  msgs.scrollTop = msgs.scrollHeight; // auto-scroll to bottom
  return bubble; // returned so typing bubble can be removed later
}

// ── 4. SEND MESSAGE → GROQ → SHOW REPLY ──────────────────────────────────────
async function sendMessage() {
  var input = document.getElementById('chat-input');
  var text  = input.value.trim();

  if (!text || waiting) return; // ignore empty or while already waiting

  // Lock UI while waiting for reply
  input.value    = '';
  waiting        = true;
  input.disabled = true;
  document.getElementById('chat-send-btn').disabled = true;

  addBubble('user', text);           // show user message
  var dots = addBubble('typing', ''); // show animated dots

  // Save to history
  chatHistory.push({ role: 'user', content: text });

  try {
    // Call Groq directly — no backend needed!
    var response = await fetch(GROQ_URL, {
      method : 'POST',
      headers: {
        'Content-Type' : 'application/json',
        'Authorization': 'Bearer ' + GROQ_API_KEY // your key sent here
      },
      body: JSON.stringify({
        model    : AI_MODEL,
        messages : [{ role: 'system', content: SYSTEM_PROMPT }].concat(chatHistory),
        max_tokens : 512,
        temperature: 0.8
      })
    });

    dots.remove(); // hide typing dots

    var data  = await response.json();
    var reply = data.choices[0].message.content;

    addBubble('bot', reply); // show bot reply

    // Save reply to history so bot remembers context
    chatHistory.push({ role: 'assistant', content: reply });

    // Keep only last 10 messages so history stays short
    if (chatHistory.length > 10) chatHistory = chatHistory.slice(-10);

  } catch (err) {
    dots.remove();
    addBubble('error', '⚠️ Could not reach Groq. Check your API key or internet connection.');
    chatHistory.pop(); // remove failed message from history

  } finally {
    // Always unlock UI when done — whether success or error
    waiting        = false;
    input.disabled = false;
    document.getElementById('chat-send-btn').disabled = false;
    input.focus();
  }
}

// ── 5. START ──────────────────────────────────────────────────────────────────
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', buildChat);
} else {
  buildChat();
}
