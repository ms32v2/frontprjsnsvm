const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const { Document, Packer, Paragraph, TextRun, PictureRun } = require("docx");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json({ limit: "10mb" }));
app.use(express.static(__dirname));

// Serve index.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Convert HTML to DOCX and return as download
app.post("/download", async (req, res) => {
  try {
    const html = req.body.html || "";

    // Parse HTML for text and images
    const paragraphs = [];
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;

    // Process each child element
    const children = Array.from(tempDiv.childNodes);
    let currentParagraph = [];
    let imageBuffers = [];

    children.forEach(node => {
      if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
        currentParagraph.push(new TextRun(node.textContent.trim()));
      } else if (node.tagName === 'IMG' && node.src) {
        const base64Data = node.src.split(',')[1];
        const imageBuffer = Buffer.from(base64Data, 'base64');
        imageBuffers.push(imageBuffer);

        currentParagraph.push(
          new PictureRun({
            data: imageBuffer,
            transformation: { width: 200, height: 200 }, // Default size; adjust as needed
          })
        );
      } else if (node.tagName === 'P' || node.tagName === 'BR') {
        if (currentParagraph.length > 0) {
          paragraphs.push(new Paragraph({ children: currentParagraph }));
          currentParagraph = [];
        }
      }
    });

    if (currentParagraph.length > 0) {
      paragraphs.push(new Paragraph({ children: currentParagraph }));
    }

    if (paragraphs.length === 0) return res.status(400).send("Empty document");

    // Create DOCX with preserved characteristics (margins, page size, etc.)
    const doc = new Document({
      creator: "DOCX Editor App",
      title: "Edited Document",
      description: "Edited version of front3snsvm.docx",
      sections: [
        {
          properties: {
            page: {
              size: {
                width: 11906, // A4 width in twips (8.27 inches)
                height: 16838, // A4 height in twips (11.69 inches)
                orientation: "portrait", // Or "landscape"
              },
              margin: {
                top: 1440, // 1 inch in twips (1440 twips = 1 inch)
                right: 1440,
                bottom: 1440,
                left: 1440,
              },
            },
          },
          children: paragraphs,
        },
      ],
    });

    const buffer = await Packer.toBuffer(doc);

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
