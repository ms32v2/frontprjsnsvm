const editor = document.getElementById("editor");
const fontSize = document.getElementById("fontSize");
const boldBtn = document.getElementById("boldBtn");
const downloadBtn = document.getElementById("downloadBtn");
const themeToggle = document.getElementById("themeToggle");
const status = document.getElementById("status");

// Font size change
fontSize.addEventListener("change", () => {
  document.execCommand("fontSize", false, "7");
  const span = document.querySelectorAll("font[size='7']");
  span.forEach(el => {
    el.removeAttribute("size");
    el.style.fontSize = fontSize.value;
  });
});

// Bold text
boldBtn.addEventListener("click", () => {
  document.execCommand("bold");
});

// Dark / Light theme
themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("light");
});

// Download DOCX
downloadBtn.addEventListener("click", async () => {
  try {
    const html = editor.innerHTML;
    const res = await fetch("/download", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ html }),
    });
    if (!res.ok) throw new Error("Download failed");

    const arrayBuffer = await res.arrayBuffer();
    const blob = new Blob([arrayBuffer], {
      type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "edited.docx";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);

    status.textContent = "✅ Download ready";
  } catch (err) {
    console.error(err);
    alert("Download failed");
  }
});

// Keep existing button functionality
document.getElementById('btn').addEventListener('click', () => {
  alert('Button clicked!');
});

window.addEventListener('DOMContentLoaded', async () => {
  const defaultFile = 'front3snsvm.docx';

  try {
    const response = await fetch(defaultFile);
    if (!response.ok) throw new Error('File not found.');

    const arrayBuffer = await response.arrayBuffer();

    // Copy the file for editing
    const copyFile = new File([arrayBuffer], defaultFile, {
      type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    });

    // Load DOCX using PizZip and Docxtemplater
    const zip = new PizZip(arrayBuffer);
    const doc = new Docxtemplater(zip, { paragraphLoop: true, linebreaks: true });

    // Extract full text
    const fullText = doc.getFullText();

    // Extract images
    const images = [];
    doc.zip.files.forEach((filename) => {
      if (filename.startsWith("word/media/")) {
        images.push(filename); // list of images in the DOCX
      }
    });

    // Button example (keep existing functionality)
document.getElementById('btn').addEventListener('click', () => {
  alert('Button clicked!');
});

// Load the DOCX file from GitHub raw URL
window.addEventListener('DOMContentLoaded', async () => {
  const defaultFileURL = 'https://raw.githubusercontent.com/ms32v2/frontprjsnsvm/main/front3snsvm.docx';

  try {
    // Fetch the DOCX as ArrayBuffer
    const response = await fetch(defaultFileURL);
    if (!response.ok) throw new Error('Failed to fetch DOCX file.');

    const arrayBuffer = await response.arrayBuffer();

    // Create a copy for editing so original remains untouched
    const copyFile = new File([arrayBuffer], 'front3snsvm.docx', {
      type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    });

    // Extract full text using Mammoth
    const { value: textContent } = await mammoth.extractRawText({ arrayBuffer });

    // Load into your editor (replace with your editor function)
    if (typeof loadDocxFile === 'function') {
      loadDocxFile(copyFile, textContent);
    } else {
      // Display in a div if no editor function
      const editorContainer = document.getElementById('editor-container');
      editorContainer.textContent = textContent;
    }

  } catch (error) {
    console.error('Error loading DOCX file:', error);
    const editorContainer = document.getElementById('editor-container');
    editorContainer.textContent = 'Error loading document.';
  }
});


