const editor = document.getElementById("editor");
const fontSize = document.getElementById("fontSize");
const boldBtn = document.getElementById("boldBtn");
const italicBtn = document.getElementById("italicBtn");
const underlineBtn = document.getElementById("underlineBtn");
const strikethroughBtn = document.getElementById("strikethroughBtn");
const superscriptBtn = document.getElementById("superscriptBtn");
const subscriptBtn = document.getElementById("subscriptBtn");
const unorderedListBtn = document.getElementById("unorderedListBtn");
const orderedListBtn = document.getElementById("orderedListBtn");
const alignLeftBtn = document.getElementById("alignLeftBtn");
const alignCenterBtn = document.getElementById("alignCenterBtn");
const alignRightBtn = document.getElementById("alignRightBtn");
const alignJustifyBtn = document.getElementById("alignJustifyBtn");
const undoBtn = document.getElementById("undoBtn");
const redoBtn = document.getElementById("redoBtn");
const linkBtn = document.getElementById("linkBtn");
const removeFormatBtn = document.getElementById("removeFormatBtn");
const downloadOriginalBtn = document.getElementById("downloadOriginalBtn");
const downloadBtn = document.getElementById("downloadBtn");
const themeToggle = document.getElementById("themeToggle");
const status = document.getElementById("status");

// Update status helper
const updateStatus = (message) => {
  status.textContent = `Status: ${message}`;
};

// Font size change
fontSize.addEventListener("change", () => {
  const sizeMap = { "12px": "1", "16px": "3", "20px": "5", "24px": "7" };
  const execSize = sizeMap[fontSize.value] || "3";
  document.execCommand("fontSize", false, execSize);
  const spans = document.querySelectorAll("font[size]");
  spans.forEach(el => {
    el.removeAttribute("size");
    el.style.fontSize = fontSize.value;
  });
  updateStatus("Font size changed");
});

// Formatting buttons
boldBtn.addEventListener("click", () => {
  document.execCommand("bold");
  updateStatus("Bold toggled");
});

italicBtn.addEventListener("click", () => {
  document.execCommand("italic");
  updateStatus("Italic toggled");
});

underlineBtn.addEventListener("click", () => {
  document.execCommand("underline");
  updateStatus("Underline toggled");
});

strikethroughBtn.addEventListener("click", () => {
  document.execCommand("strikethrough");
  updateStatus("Strikethrough toggled");
});

superscriptBtn.addEventListener("click", () => {
  document.execCommand("superscript");
  updateStatus("Superscript toggled");
});

subscriptBtn.addEventListener("click", () => {
  document.execCommand("subscript");
  updateStatus("Subscript toggled");
});

// List buttons
unorderedListBtn.addEventListener("click", () => {
  document.execCommand("insertUnorderedList");
  updateStatus("Unordered list toggled");
});

orderedListBtn.addEventListener("click", () => {
  document.execCommand("insertOrderedList");
  updateStatus("Ordered list toggled");
});

// Alignment buttons
alignLeftBtn.addEventListener("click", () => {
  document.execCommand("justifyLeft");
  updateStatus("Aligned left");
});

alignCenterBtn.addEventListener("click", () => {
  document.execCommand("justifyCenter");
  updateStatus("Aligned center");
});

alignRightBtn.addEventListener("click", () => {
  document.execCommand("justifyRight");
  updateStatus("Aligned right");
});

alignJustifyBtn.addEventListener("click", () => {
  document.execCommand("justifyFull");
  updateStatus("Justified");
});

// Undo/Redo
undoBtn.addEventListener("click", () => {
  document.execCommand("undo");
  updateStatus("Undid last action");
});

redoBtn.addEventListener("click", () => {
  document.execCommand("redo");
  updateStatus("Redid last action");
});

// Insert link
linkBtn.addEventListener("click", () => {
  const url = prompt("Enter URL:");
  if (url) {
    document.execCommand("createLink", false, url);
    updateStatus("Link inserted");
  }
});

// Remove formatting
removeFormatBtn.addEventListener("click", () => {
  document.execCommand("removeFormat");
  updateStatus("Formatting removed");
});

// Download Original DOCX
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
    const response = await fetch(defaultFileURL);
    if (!response.ok) throw new Error('Failed to fetch DOCX file.');

    const arrayBuffer = await response.arrayBuffer();
    const result = await mammoth.convertToHtml({ arrayBuffer });
    const htmlContent = result.value;

    editor.innerHTML = htmlContent;
    updateStatus("DOCX loaded and ready to edit");

  } catch (error) {
    console.error('Error loading DOCX file:', error);
    editor.innerHTML = 'Error loading document. Please check the file URL or try again.';
    updateStatus("❌ Failed to load DOCX");
  }
});
