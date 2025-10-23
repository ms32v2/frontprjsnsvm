const express = require("express");
const path = require("path");
const app = express();
const PORT = process.env.PORT || 10000;

// Serve static files in root directory
app.use(express.static(__dirname));

// Serve the editor page
app.get("/", (_, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(PORT, () => {
  console.log(`✅ SNSVM DOCX Editor running on http://localhost:${PORT}`);
});
