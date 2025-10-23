const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const HTMLtoDOCX = require("html-to-docx");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json({ limit: "10mb" }));
app.use(express.static(__dirname));

// Serve main page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Convert and send as DOCX
app.post("/download", async (req, res) => {
  try {
    const html = req.body.html || "";
    if (!html.trim()) return res.status(400).send("No content to convert");

    const docxBuffer = await HTMLtoDOCX(html, null, {
      table: { row: { cantSplit: true } },
      footer: false,
      pageNumber: false,
      margins: { top: 720, bottom: 720, left: 720, right: 720 },
    });

    res.setHeader("Content-Disposition", 'attachment; filename="front3snsvm.docx"');
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    );
    res.end(docxBuffer);
  } catch (error) {
    console.error("❌ Error converting HTML to DOCX:", error);
    res.status(500).send("Server error converting document");
  }
});

app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
