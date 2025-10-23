const express = require('express');
const path = require('path');
const fs = require('fs');
const { Document, Packer, Paragraph, TextRun, Numbering, NumberFormat } = require('docx');
const mammoth = require('mammoth');

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
app.use(express.static(__dirname));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Load DOCX content
app.get('/file', async (req, res) => {
  try {
    const data = fs.readFileSync(FILE_PATH);
    const result = await mammoth.convertToHtml({ buffer: data });
    res.send(result.value);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error converting file');
  }
});

// Save edited content with formatting
app.post('/save', async (req, res) => {
  try {
    const html = req.body.html || '';
    const doc = new Document();

    // Parse HTML using jsdom
    const { JSDOM } = require('jsdom');
    const dom = new JSDOM(`<body>${html}</body>`);
    const body = dom.window.document.body;

    // Function to recursively convert HTML nodes to docx paragraphs/textRuns
    function parseNode(node) {
      let children = [];

      node.childNodes.forEach((child) => {
        if (child.nodeType === 3) {
          // Text node
          children.push(new TextRun({ text: child.textContent }));
        } else if (child.nodeType === 1) {
          // Element node
          let options = {};
          switch (child.tagName.toLowerCase()) {
            case 'b':
            case 'strong':
              options.bold = true;
              break;
            case 'i':
            case 'em':
              options.italics = true;
              break;
            case 'u':
              options.underline = {};
              break;
          }
          const subRuns = parseNode(child);
          subRuns.forEach(r => {
            children.push(new TextRun({ ...options, text: r.text }));
          });
          if (child.tagName.toLowerCase() === 'p') {
            doc.addSection({ children: [new Paragraph({ children })] });
            children = [];
          } else if (child.tagName.toLowerCase() === 'li') {
            doc.addSection({
              children: [new Paragraph({ children, bullet: { level: 0 } })],
            });
            children = [];
          }
        }
      });

      return children;
    }

    parseNode(body);

    // If body has remaining text not inside a <p> or <li>
    if (body.textContent.trim().length > 0) {
      doc.addSection({ children: [new Paragraph({ children: [new TextRun({ text: body.textContent })] })] });
    }

    const buffer = await Packer.toBuffer(doc);
    fs.writeFileSync(FILE_PATH, buffer);

    res.send('OK');
  } catch (err) {
    console.error(err);
    res.status(500).send('Save failed');
  }
});

// Download DOCX
app.get('/download', (req, res) => {
  res.download(FILE_PATH, 'front3snsvm.docx', (err) => {
    if (err) {
      console.error(err);
      res.status(500).send('Download failed');
    }
  });
});

app.listen(PORT, () => console.log(`Server running: http://localhost:${PORT}`));
