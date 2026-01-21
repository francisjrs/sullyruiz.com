import React from 'react';
import { renderToFile, DocumentProps } from '@react-pdf/renderer';
import sharp from 'sharp';
import path from 'path';
import fs from 'fs';
import { BuyersGuide } from '../src/pdf/buyers-guide';
import { SellersGuide } from '../src/pdf/sellers-guide';

const PUBLIC_DIR = path.join(process.cwd(), 'public');
const GUIDES_DIR = path.join(PUBLIC_DIR, 'guides');
const IMAGES_DIR = path.join(PUBLIC_DIR, 'images');

async function convertPhoto(): Promise<string> {
  const inputPath = path.join(IMAGES_DIR, 'sully-ruiz.webp');
  const outputPath = path.join(IMAGES_DIR, 'sully-ruiz-pdf.png');

  // Check if source exists
  if (!fs.existsSync(inputPath)) {
    console.warn('⚠️  Photo not found, generating PDF without photo');
    return '';
  }

  // Convert webp to png for PDF compatibility
  await sharp(inputPath)
    .resize(300, 300, { fit: 'cover' })
    .png()
    .toFile(outputPath);

  console.log('✓ Converted photo to PNG');
  return outputPath;
}

async function generateBuyersGuide(locale: 'en' | 'es', photoPath: string): Promise<void> {
  const fileName = locale === 'es'
    ? 'guia-comprador-casa-texas-es.pdf'
    : 'texas-home-buyers-guide-en.pdf';

  const outputPath = path.join(GUIDES_DIR, fileName);

  console.log(`→ Generating Buyer's Guide (${locale.toUpperCase()})...`);

  await renderToFile(
    React.createElement(BuyersGuide, {
      locale,
      photoPath: photoPath || undefined,
    }) as React.ReactElement<DocumentProps>,
    outputPath
  );

  const stats = fs.statSync(outputPath);
  const sizeMB = (stats.size / (1024 * 1024)).toFixed(2);

  console.log(`✓ Generated: ${fileName} (${sizeMB} MB)`);
}

async function generateSellersGuide(locale: 'en' | 'es', photoPath: string): Promise<void> {
  const fileName = locale === 'es'
    ? 'guia-vendedor-casa-texas-es.pdf'
    : 'texas-home-sellers-guide-en.pdf';

  const outputPath = path.join(GUIDES_DIR, fileName);

  console.log(`→ Generating Seller's Guide (${locale.toUpperCase()})...`);

  await renderToFile(
    React.createElement(SellersGuide, {
      locale,
      photoPath: photoPath || undefined,
    }) as React.ReactElement<DocumentProps>,
    outputPath
  );

  const stats = fs.statSync(outputPath);
  const sizeMB = (stats.size / (1024 * 1024)).toFixed(2);

  console.log(`✓ Generated: ${fileName} (${sizeMB} MB)`);
}

async function main(): Promise<void> {
  console.log('\n📚 Texas Home Guides Generator\n');
  console.log('━'.repeat(40));

  // Ensure guides directory exists
  if (!fs.existsSync(GUIDES_DIR)) {
    fs.mkdirSync(GUIDES_DIR, { recursive: true });
    console.log('✓ Created guides directory');
  }

  // Convert photo
  const photoPath = await convertPhoto();

  // Generate Buyer's Guides
  console.log('\n📖 Generating Buyer\'s Guides...');
  await generateBuyersGuide('en', photoPath);
  await generateBuyersGuide('es', photoPath);

  // Generate Seller's Guides
  console.log('\n📖 Generating Seller\'s Guides...');
  await generateSellersGuide('en', photoPath);
  await generateSellersGuide('es', photoPath);

  console.log('\n━'.repeat(40));
  console.log('✅ All guides generated successfully!\n');
  console.log('Files:');
  console.log('  Buyer\'s Guides:');
  console.log(`    • public/guides/texas-home-buyers-guide-en.pdf`);
  console.log(`    • public/guides/guia-comprador-casa-texas-es.pdf`);
  console.log('  Seller\'s Guides:');
  console.log(`    • public/guides/texas-home-sellers-guide-en.pdf`);
  console.log(`    • public/guides/guia-vendedor-casa-texas-es.pdf`);
  console.log('\n');
}

main().catch((error) => {
  console.error('❌ Error generating guides:', error);
  process.exit(1);
});
