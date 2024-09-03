import fs from 'node:fs/promises';
import { join } from 'node:path';
import { pdf } from 'pdf-to-img';

async function convertPDFsToImages() {
  try {
    // Create images folder if it doesn't exist
    await fs.mkdir('./images', { recursive: true });

    // Read all files in the pdf folder
    const files = await fs.readdir('./pdf');
    const pdfFiles = files.filter(file => file.toLowerCase().endsWith('.pdf'));

    for (const pdfFile of pdfFiles) {
      const pdfPath = join('./pdf', pdfFile);
      const document = await pdf(pdfPath, { scale: 2 });

      console.log(`Converting ${pdfFile}...`);

      let pageNumber = 1;
      for await (const image of document) {
        const imageName = `${pdfFile.replace('.pdf', '')}_page${pageNumber}.png`;
        const imagePath = join('./images', imageName);
        await fs.writeFile(imagePath, image);
        console.log(`  Saved ${imageName}`);
        pageNumber++;
      }

      console.log(`Finished converting ${pdfFile}`);
    }

    console.log('All PDFs converted successfully!');
  } catch (error) {
    console.error('An error occurred:', error);
  }
}

convertPDFsToImages();