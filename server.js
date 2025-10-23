const express = require('express');
const path = require('path');
const fs = require('fs');
const mammoth = require('mammoth');

const app = express();
const PORT = process.env.PORT || 3000;
const FILE_PATH = path.join(__dirname, 'front3snsvm.docx');

app.use(express.static(__dirname));

// Serve index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Convert DOCX to HTML for display (read-only)
app.get('/file', async (req, res) => {
  try {
    const buffer = fs.readFileSync(FILE_PATH);
    const result = await mammoth.convertToHtml({ buffer });
    res.send(result.value); // raw HTML for display
  } catch (err) {
    console.error(err);
    res.status(500).send('Error loading file');
  }
});

// Download original DOCX
app.get('/download', (req, res) => {
  res.download(FILE_PATH, 'front3snsvm.docx', (err) => {
    if (err) {
      console.error(err);
      res.status(500).send('Download failed');
    }
  });
});

app.listen(PORT, () => console.log(`Server running: http://localhost:${PORT}`));
