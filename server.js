const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const { Document, Packer, Paragraph, TextRun } = require("docx");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json({ limit: "5mb" }));
app.use(express.static(__dirname));

// Serve index.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Convert HTML to DOCX and return as download
app.post("/download", async (req, res) => {
  try {
    const html = req.body.html || "";

    // Clean HTML -> plain text
    const text = html
      .replace(/<style[^>]*>.*?<\/style>/gi, "")
      .replace(/<script[^>]*>.*?<\/script>/gi, "")
      .replace(/<[^>]+>/g, "\n")
      .replace(/\n{2,}/g, "\n")
      .trim();

    if (!text) return res.status(400).send("Empty document");

    // Create DOCX
    const doc = new Document({
      sections: [
        {
          children: text.split("\n").map(
            (line) => new Paragraph({ children: [new TextRun(line)] })
          ),
        },
      ],
    });

    const buffer = await Packer.toBuffer(doc);

    // Send file
    res.setHeader("Content-Disposition", 'attachment; filename="edited.docx"');
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    );
    res.end(buffer);
  } catch (err) {
    console.error("Download Error:", err);
    res.status(500).send("Download failed (server error)");
  }
});

app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
