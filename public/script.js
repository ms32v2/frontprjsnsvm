const EDIT_FILE_URL = "snsvmsk.docx";
let originalHTML = "";

async function loadDocx() {
  try {
    const response = await fetch(EDIT_FILE_URL);
    if (!response.ok) throw new Error("File not found, loading fallback...");

    const arrayBuffer = await response.arrayBuffer();
    const result = await mammoth.convertToHtml({ arrayBuffer });
    document.getElementById("editor").innerHTML = result.value;
    originalHTML = result.value;
  } catch (err) {
    console.error(err);
    document.getElementById("editor").innerHTML = `
      <h2>Example SNSVM Document</h2>
      <p>This is a sample <b>snsvmsk.docx</b> fallback text.</p>
      <p>You can edit it, style it, and download as .docx — the original file remains safe.</p>
    `;
    originalHTML = document.getElementById("editor").innerHTML;
  }
}

function execCmd(command) {
  document.execCommand(command, false, null);
}

function resetContent() {
  document.getElementById("editor").innerHTML = originalHTML;
}

function downloadDocx() {
  const content = `
    <!DOCTYPE html><html><body>${document.getElementById("editor").innerHTML}</body></html>
  `;
  const blob = window.htmlDocx.asBlob(content);
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "snsvmsk-edited.docx";
  link.click();
}

loadDocx();
