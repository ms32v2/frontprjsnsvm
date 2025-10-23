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

// Keep any existing button or other functionality
document.getElementById('btn').addEventListener('click', () => {
  alert('Button clicked!');
});

// Automatically load the full DOCX file on page load
window.addEventListener('DOMContentLoaded', async () => {
  const defaultFile = 'front3snsvm.docx';

  try {
    // Fetch the DOCX file as ArrayBuffer
    const response = await fetch(defaultFile);
    if (!response.ok) throw new Error('File not found on server.');

    const arrayBuffer = await response.arrayBuffer();

    // Create a copy for editing (original remains untouched)
    const copyFile = new File([arrayBuffer], defaultFile, {
      type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    });

    // Use Mammoth.js to extract the full text content
    const { value: textContent } = await mammoth.extractRawText({ arrayBuffer });

    // Load the content into your DOCX editor (replace with your actual function)
    if (typeof loadDocxFile === 'function') {
      loadDocxFile(copyFile, textContent); // Pass the copy and full text
    } else {
      // If no editor function, display content in a div
      const editorContainer = document.getElementById('editor-container');
      editorContainer.textContent = textContent;
    }

  } catch (error) {
    console.error('Failed to load DOCX fully:', error);
    const editorContainer = document.getElementById('editor-container');
    editorContainer.textContent = 'Error loading document. Please try again.';
  }
});


