// Existing button functionality (keep as is)
document.getElementById('btn').addEventListener('click', () => {
  alert('Button clicked!');
});

// Load a copy of the default DOCX file on page load
window.addEventListener('DOMContentLoaded', async () => {
  const defaultFile = 'front3snsvm.docx';

  try {
    const response = await fetch(defaultFile);
    const blob = await response.blob();

    // Create a copy for editing
    const copyFile = new File([blob], defaultFile, { type: blob.type });

    // Load the copied file into your DOCX editor
    // Replace `loadDocxFile` with your actual editor function
    if (typeof loadDocxFile === 'function') {
      loadDocxFile(copyFile);
    } else {
      console.warn('loadDocxFile function not found. Integrate with your DOCX editor.');
    }
  } catch (error) {
    console.error('Failed to load the default DOCX file:', error);
  }
});
