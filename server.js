const express = require('express');
const path = require('path');
const fs = require('fs');
const { Document, Packer, Paragraph, TextRun } = require('docx');
const mammoth = require('mammoth');

const app = express();
const PORT = process.env.PORT || 3000;
const FILE_PATH = path.join(__dirname, 'front3snsvm.docx');

app.use(express.json({ limit: '20mb' }));
app.use(express.static(__dirname));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Load DOCX content as HTML for editable copy
app.get('/file', async (req, res) => {
  try {
    const buffer = fs.readFileSync(FILE_PATH);
    const result = await mammoth.convertToHtml({ buffer });
    res.send(result.value);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error loading file');
  }
});

// Download edited HTML as DOCX
app.post('/download', async (req, res) => {
  try {
    const html = req.body.html || '';
    const doc = new Document();

    const paragraphs = html
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<\/p>/gi, '\n')
      .replace(/<[^>]+>/g, '')
      .split(/\n+/)
      .map(s => s.trim())
      .filter(Boolean);

    paragraphs.forEach(p => {
      doc.addSection({
        children: [new Paragraph({ children: [new TextRun({ text: p })] })],
      });
    });

    const buffer = await Packer.toBuffer(doc);

    res.setHeader('Content-Disposition', 'attachment; filename=edited.docx');
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    res.send(buffer);
  } catch (err) {
    console.error(err);
    res.status(500).send('Download failed');
  }
});

app.listen(PORT, () => console.log(`Server running: http://localhost:${PORT}`));
