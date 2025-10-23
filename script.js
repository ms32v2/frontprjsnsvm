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
