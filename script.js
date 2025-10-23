const editor = document.getElementById("editor");
const fontSize = document.getElementById("fontSize");
const boldBtn = document.getElementById("boldBtn");
const downloadOriginalBtn = document.getElementById("downloadOriginalBtn");
const downloadBtn = document.getElementById("downloadBtn");
const themeToggle = document.getElementById("themeToggle");
const status = document.getElementById("status");

// Update status helper
const updateStatus = (message) => {
  status.textContent = `Status: ${message}`;
};

// Font size change (map px to execCommand scale: 1=10px, 2=13px, 3=16px, 4=18px, 5=24px, 6=32px, 7=48px)
fontSize.addEventListener("change", () => {
  const sizeMap = { "12px": "1", "16px": "3", "20px": "5", "24px": "7" }; // Approximate mapping
  const execSize = sizeMap[fontSize.value] || "3";
  document.execCommand("fontSize", false, execSize);
  // Apply custom style for precision
  const spans = document.querySelectorAll("font[size]");
  spans.forEach(el => {
    el.removeAttribute("size");
    el.style.fontSize = fontSize.value;
  });
  updateStatus("Font size changed");
});

// Bold text
boldBtn.addEventListener("click", () => {
  document.execCommand("bold");
  updateStatus("Bold toggled");
});

// Download Original DOCX (intact, no changes)
downloadOriginalBtn.addEventListener("click", async () => {
  updateStatus("Downloading original DOCX...");
  try {
    const defaultFileURL = 'https://raw.githubusercontent.com/ms32v2/frontprjsnsvm/main/front3snsvm.docx';
    const response = await fetch(defaultFileURL);
    if (!response.ok) throw new Error("Failed to fetch original DOCX");

    const blob = await response.blob();
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "front3snsvm_original.docx";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);

    updateStatus("✅ Original DOCX downloaded");
  } catch (err) {
    console.error(err);
    updateStatus("❌ Original download failed");
    alert("Original download failed");
  }
});

// Download Edited DOCX
downloadBtn.addEventListener("click", async () => {
  updateStatus("Generating edited DOCX...");
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

    updateStatus("✅ Edited DOCX downloaded");
  } catch (err) {
    console.error(err);
    updateStatus("❌ Edited download failed");
    alert("Edited download failed");
  }
});

// Dark / Light theme
themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("light");
  updateStatus("Theme toggled");
});

// Load the DOCX file from GitHub raw URL on page load
window.addEventListener('DOMContentLoaded', async () => {
  const defaultFileURL = 'https://raw.githubusercontent.com/ms32v2/frontprjsnsvm/main/front3snsvm.docx';

  updateStatus("Loading DOCX...");
  try {
    // Fetch the DOCX as ArrayBuffer
    const response = await fetch(defaultFileURL);
    if (!response.ok) throw new Error('Failed to fetch DOCX file.');

    const arrayBuffer = await response.arrayBuffer();

    // Extract HTML with images using Mammoth (converts images to base64 data URIs)
    const result = await mammoth.convertToHtml({ arrayBuffer });
    const htmlContent = result.value; // HTML string with <img> tags for images

    // Load into the editor
    editor.innerHTML = htmlContent;
    updateStatus("DOCX loaded and ready to edit");

  } catch (error) {
    console.error('Error loading DOCX file:', error);
    editor.innerHTML = 'Error loading document. Please check the file URL or try again.';
    updateStatus("❌ Failed to load DOCX");
  }
});
