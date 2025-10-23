// server.js
const express = require("express");
const path = require("path");
const app = express();
const PORT = process.env.PORT || 10000;

// Serve static files (like snsvmsk.docx and index.html)
app.use(express.static(__dirname));

// Serve the main page
app.get("/", (_, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(PORT, () => {
  console.log(`✅ SNSVM Editor running on http://localhost:${PORT}`);
});
