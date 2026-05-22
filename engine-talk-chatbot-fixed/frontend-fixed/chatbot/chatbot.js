// Engine Talk — Chatbot Widget
// Sends messages to the backend and shows replies in a chat window

var BACKEND_URL = 'http://localhost:3000/chat';
var chatHistory = [];
var waiting = false;

// Build and inject the chatbot HTML into the page
function buildChat() {
  var btn = document.createElement('button');
  btn.id = 'chatbot-toggle-btn';
  btn.innerHTML = '⚙️';
  btn.title = 'Chat with Rev';

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
}

// Open or close the chat window
function toggleChat() {
  var win = document.getElementById('chatbot-window');
  var btn = document.getElementById('chatbot-toggle-btn');

  if (win.classList.contains('chat-open')) {
    win.classList.remove('chat-open');
    btn.innerHTML = '⚙️';
  } else {
    win.classList.add('chat-open');
    btn.innerHTML = '✕';
    // Show welcome message the first time
    var msgs = document.getElementById('chat-messages');
    if (msgs.children.length === 0) {
      addBubble('bot', '👋 Hey! I\'m Rev, your Engine Talk assistant. Ask me about cars, prices or booking! 🚗');
    }
    setTimeout(function() { document.getElementById('chat-input').focus(); }, 300);
  }
}

// Add a message bubble to the chat
function addBubble(role, text) {
  var msgs = document.getElementById('chat-messages');
  var bubble = document.createElement('div');
  bubble.className = 'chat-bubble ' + role;

  if (role === 'typing') {
    bubble.innerHTML = '<div class="typing-dots"><span></span><span></span><span></span></div>';
  } else {
    bubble.textContent = text;
  }

  msgs.appendChild(bubble);
  msgs.scrollTop = msgs.scrollHeight;
  return bubble;
}

// Send the user's message to the backend
async function sendMessage() {
  var input = document.getElementById('chat-input');
  var text = input.value.trim();

  if (!text || waiting) return;

  input.value = '';
  waiting = true;
  input.disabled = true;
  document.getElementById('chat-send-btn').disabled = true;

  addBubble('user', text);
  var typing = addBubble('typing', '');

  chatHistory.push({ role: 'user', parts: [{ text: text }] });

  try {
    var res = await fetch(BACKEND_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: text, history: chatHistory.slice(0, -1) })
    });

    typing.remove();
    var data = await res.json();

    if (!res.ok) {
      addBubble('error', '⚠️ ' + (data.error || 'Something went wrong.'));
      chatHistory.pop();
    } else {
      addBubble('bot', data.reply);
      chatHistory.push({ role: 'model', parts: [{ text: data.reply }] });
      if (chatHistory.length > 10) chatHistory = chatHistory.slice(-10);
    }

  } catch (err) {
    typing.remove();
    addBubble('error', '⚠️ Cannot connect. Make sure the backend is running on port 3000.');
    chatHistory.pop();

  } finally {
    waiting = false;
    input.disabled = false;
    document.getElementById('chat-send-btn').disabled = false;
    input.focus();
  }
}

// Set up button clicks and Enter key
function attachEvents() {
  document.getElementById('chatbot-toggle-btn').addEventListener('click', toggleChat);
  document.getElementById('chat-close-btn').addEventListener('click', toggleChat);
  document.getElementById('chat-send-btn').addEventListener('click', sendMessage);
  document.getElementById('chat-input').addEventListener('keydown', function(e) {
    if (e.key === 'Enter') sendMessage();
  });
}

// Start everything once the page is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', function() { buildChat(); attachEvents(); });
} else {
  buildChat();
  attachEvents();
}
