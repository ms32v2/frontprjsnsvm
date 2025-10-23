const express = require('express');
const path = require('path');
const fs = require('fs');
const mammoth = require('mammoth');
const { Document, Packer, Paragraph, TextRun } = require('docx');

const app = express();
const PORT = process.env.PORT || 3000;

const FILE_NAME = 'front3snsvm.docx';
const BACKUP_NAME = 'front3snsvm_backup.docx';
const FILE_PATH = path.join(__dirname, FILE_NAME);
const BACKUP_PATH = path.join(__dirname, BACKUP_NAME);

// Restore from backup if missing
if (!fs.existsSync(FILE_PATH)) {
  if (fs.existsSync(BACKUP_PATH)) {
    fs.copyFileSync(BACKUP_PATH, FILE_PATH);
    console.log('Restored front3snsvm.docx from backup.');
  } else {
    console.error('Missing front3snsvm.docx AND backup file.');
    process.exit(1);
  }
}

app.use(express.json({ limit: '20mb' }));
app.use(express.static(__dirname)); // serve static files from root

// Serve index.html on root
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Return the doc content as HTML
app.get('/file', async (req, res) => {
  try {
    const result = await mammoth.convertToHtml({ path: FILE_PATH });
    res.send(result.value);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error converting file');
  }
});

// Save edited HTML back to docx
app.post('/save', async (req, res) => {
  try {
    const html = req.body.html || '';
    const paragraphs = html
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<\/p>/gi, '\n')
      .replace(/<[^>]+>/g, '')
      .split(/\n+/)
      .map((s) => s.trim())
      .filter(Boolean);

    const doc = new Document();
    for (const p of paragraphs) {
      doc.addSection({
        children: [new Paragraph({ children: [new TextRun({ text: p })] })],
      });
    }

    const buffer = await Packer.toBuffer(doc);
    fs.writeFileSync(FILE_PATH, buffer);

    res.send('OK');
  } catch (err) {
    console.error(err);
    res.status(500).send('Save failed');
  }
});

app.listen(PORT, () => console.log(`Server running: http://localhost:${PORT}`));
