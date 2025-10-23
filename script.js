(async function(){
  const editor = document.getElementById('editor');
  const downloadBtn = document.getElementById('downloadBtn');
  const status = document.getElementById('status');

  async function loadDoc(){
    try{
      const res = await fetch('/file');
      if(!res.ok) throw new Error('Failed to load file');
      const html = await res.text();
      editor.innerHTML = html || '<p></p>';
      status.textContent = 'Status: Loaded';
    }catch(e){
      console.error(e);
      status.textContent = 'Status: Error loading file';
    }
  }

  downloadBtn.addEventListener('click', async ()=>{
    try{
      const html = editor.innerHTML;
      const res = await fetch('/download', {
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ html })
      });
      if(!res.ok) throw new Error('Download failed');
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'edited.docx';
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    }catch(e){
      console.error(e);
      alert('Download failed');
    }
  });

  await loadDoc();
})();
