(async function(){
  const viewer = document.getElementById('viewer');
  const downloadBtn = document.getElementById('downloadBtn');
  const status = document.getElementById('status');

  // Load DOCX content as HTML
  async function loadDoc() {
    try {
      const res = await fetch('/file');
      if(!res.ok) throw new Error('Failed to load file');
      const html = await res.text();
      viewer.innerHTML = html || '<p>Empty file</p>';
      status.textContent = 'Status: Loaded';
    } catch(e) {
      console.error(e);
      status.textContent = 'Status: Error loading file';
    }
  }

  // Download DOCX
  downloadBtn.addEventListener('click', () => {
    window.location.href = '/download';
  });

  await loadDoc();
})();
