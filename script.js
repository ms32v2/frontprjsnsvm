// Keep all existing code untouched

// Automatically load a copy of the default DOCX file
window.addEventListener('DOMContentLoaded', async () => {
  const defaultFile = 'front3snsvm.docx';

  try {
    const response = await fetch(defaultFile);
    const blob = await response.blob();

    // Create a copy for editing
    const copyFile = new File([blob], defaultFile, { type: blob.type });

    // Call your existing DOCX loading function
    if (typeof loadDocxFile === 'function') {
      loadDocxFile(copyFile);
    }
  } catch (error) {
    console.error('Failed to load the default DOCX file:', error);
  }
});
