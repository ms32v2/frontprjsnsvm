const editor = document.getElementById("editor");
const fontSize = document.getElementById("fontSize");
const boldBtn = document.getElementById("boldBtn");
const italicBtn = document.getElementById("italicBtn");
const downloadBtn = document.getElementById("downloadBtn");
const themeToggle = document.getElementById("themeToggle");
const status = document.getElementById("status");

// Font size
fontSize.addEventListener("change", () => {
  document.execCommand("fontSize", false, "7");
  document.querySelectorAll("font[size='7']").forEach(el => {
    el.removeAttribute("size");
    el.style.fontSize = fontSize.value;
  });
});

// Bold / Italic
boldBtn.addEventListener("click", () => document.execCommand("bold"));
italicBtn.addEventListener("click", () => document.execCommand("italic"));

// Theme switch
themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("light");
});

// Download DOCX
downloadBtn.addEventListener("click", async () => {
  try {
    status.textContent = "⏳ Converting...";
    const html = editor.innerHTML;
    const res = await fetch("/download", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ html }),
    });
    if (!res.ok) throw new Error("Download failed");

    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "front3snsvm.docx";
    a.click();
    URL.revokeObjectURL(url);

    status.textContent = "✅ Downloaded!";
  } catch (err) {
    console.error(err);
    alert("Download failed");
    status.textContent = "❌ Failed";
  }
});
