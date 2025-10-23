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

// Keep all existing code untouched

// Automatically load the DOCX file fully
window.addEventListener('DOMContentLoaded', async () => {
  const defaultFile = 'front3snsvm.docx';

  try {
    // Fetch the DOCX as ArrayBuffer
    const response = await fetch(defaultFile);
    const arrayBuffer = await response.arrayBuffer();

    // Create a copy for editing
    const copyFile = new File([arrayBuffer], defaultFile, { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });

    // Load full content using PizZip and Docxtemplater
    const PizZip = window.PizZip;
    const Docxtemplater = window.Docxtemplater;

    const zip = new PizZip(arrayBuffer);
    const doc = new Docxtemplater(zip, { paragraphLoop: true, linebreaks: true });

    // Get full text content
    const textContent = doc.getFullText();

    // Assuming you have a function to load content into your editor
    if (typeof loadDocxFile === 'function') {
      loadDocxFile(copyFile, textContent); // pass both copy and full text
    } else {
      console.warn('loadDocxFile function not found. Please integrate with your DOCX editor.');
    }

  } catch (error) {
    console.error('Failed to load DOCX file fully:', error);
  }
});


