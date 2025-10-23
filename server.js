app.post('/download', async (req, res) => {
  try {
    const html = req.body.html || '';

    // 🧠 Extract clean text from HTML safely
    const text = html
      .replace(/<style[^>]*>.*?<\/style>/gi, '')
      .replace(/<script[^>]*>.*?<\/script>/gi, '')
      .replace(/<[^>]+>/g, '\n')
      .replace(/\n{2,}/g, '\n')
      .trim();

    if (!text) {
      return res.status(400).send('Empty document');
    }

    // 📝 Create DOCX file
    const doc = new Document({
      sections: [
        {
          children: text.split('\n').map(
            (line) => new Paragraph({ children: [new TextRun(line)] })
          ),
        },
      ],
    });

    const buffer = await Packer.toBuffer(doc);

    // ✅ Proper headers for browser download
    res.setHeader(
      'Content-Disposition',
      'attachment; filename="edited.docx"'
    );
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    );
    res.end(buffer);

  } catch (err) {
    console.error('Download Error:', err);
    res.status(500).send('Download failed (server error)');
  }
});
