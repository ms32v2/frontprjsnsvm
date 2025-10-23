=========================
📜 script.js
=========================
(async function(){
  const editor = document.getElementById('editor');
  const saveBtn = document.getElementById('saveBtn');
  const status = document.getElementById('status');
  const wordCount = document.getElementById('wordCount');
  const autoSaveCheckbox = document.getElementById('autoSave');

  let autoSaveTimer = null;
  let dirty = false;

  function setStatus(text){ status.textContent = 'Status: ' + text; }

  async function loadDoc(){
    setStatus('loading...');
    try{
      const res = await fetch('/file');
      if(!res.ok) throw new Error('Failed to load file');
      const html = await res.text();
      editor.innerHTML = html || '<p></p>';
      setStatus('loaded');
      updateWordCount();
    }catch(e){
      console.error(e); setStatus('error');
    }
  }

  async function saveDoc(){
    setStatus('saving...');
    const payload = { html: editor.innerHTML };
    try{
      const res = await fetch('/save', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload) });
      if(!res.ok) throw new Error(await res.text());
      setStatus('saved ' + new Date().toLocaleTimeString());
      dirty = false;
    }catch(e){
      console.error(e); setStatus('save error');
    }
  }

  function updateWordCount(){
    const text = editor.innerText || '';
    const words = text.trim().split(/\s+/).filter(Boolean).length;
    wordCount.textContent = 'Words: ' + words;
  }

  editor.addEventListener('input', ()=>{ dirty = true; updateWordCount(); });
  saveBtn.addEventListener('click', saveDoc);

  autoSaveCheckbox.addEventListener('change', ()=>{
    if(autoSaveCheckbox.checked){
      if(autoSaveTimer) clearInterval(autoSaveTimer);
      autoSaveTimer = setInterval(()=>{ if(dirty) saveDoc(); }, 30000);
    } else {
      if(autoSaveTimer) clearInterval(autoSaveTimer);
      autoSaveTimer = null;
    }
  });

  window.addEventListener('keydown', (e)=>{
    if((e.ctrlKey||e.metaKey) && e.key.toLowerCase() === 's'){
      e.preventDefault(); saveDoc();
    }
  });

  await loadDoc();
})();
