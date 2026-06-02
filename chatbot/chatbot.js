
var H=[];

async function send(){
  var i=document.getElementById('chat-input'),t=i.value.trim();
  if(!t)return; i.value='';
  bubble('user',t); var d=bubble('bot','...');
  H.push({role:'user',content:t});
  try{
    var r=await(await fetch('https://api.groq.com/openai/v1/chat/completions',{method:'POST',
      headers:{'Content-Type':'application/json','Authorization':'Bearer '+KEY},
      body:JSON.stringify({model:'llama-3.1-8b-instant',messages:[{role:'system',content:'You are Rev, car assistant for Engine Talk. Cars: Ferrari $300k, Lamborghini $230k, BMW M4 $85k, Porsche $150k, Tesla $80k. Max 2 sentences.'}].concat(H)})})).json();
    d.textContent=r.choices[0].message.content;
    H.push({role:'assistant',content:d.textContent});
  }catch(e){d.textContent='⚠️ Check API key.';}
}

function bubble(w,t){
  var b=document.createElement('div');
  b.className='chat-bubble '+w; b.textContent=t;
  var box=document.getElementById('chat-messages');
  box.appendChild(b); box.scrollTop=box.scrollHeight; return b;
}

function toggle(){
  var w=document.getElementById('chatbot-window');
  w.classList.toggle('chat-open');
  document.getElementById('chatbot-toggle-btn').innerHTML=w.classList.contains('chat-open')?'✕':'⚙️';
  if(!document.getElementById('chat-messages').children.length) bubble('bot',"👋 I'm Rev! Ask me about cars or prices.");
}

document.addEventListener('DOMContentLoaded',()=>document.body.insertAdjacentHTML('beforeend','<button id="chatbot-toggle-btn" onclick="toggle()">⚙️</button><div id="chatbot-window"><div id="chat-header"><div class="chat-avatar">⚡</div><div class="chat-info"><h4>Rev — AI Assistant</h4><p>Engine Talk</p></div><button onclick="toggle()">✕</button></div><div id="chat-messages"></div><div id="chat-input-area"><input id="chat-input" placeholder="Ask about cars…" onkeydown="if(event.key===\'Enter\')send()"/><button onclick="send()">➤</button></div></div>'));
