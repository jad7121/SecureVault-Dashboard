import fs from 'fs';
import path from 'path';
import PDFDocument from 'pdfkit';

const markdownPath = path.resolve(process.cwd(), 'design', 'Design_System.md');
const pdfPath = path.resolve(process.cwd(), 'design', 'SecureVault_Design_System.pdf');

const markdown = fs.readFileSync(markdownPath, 'utf8');
const lines = markdown.split(/\r?\n/);

const doc = new PDFDocument({ size: 'A4', margin: 50 });
doc.pipe(fs.createWriteStream(pdfPath));

doc.font('Helvetica-Bold').fontSize(24).fillColor('#d5fcea');
doc.text('SecureVault Design System', { align: 'center' });
doc.moveDown(1);

doc.font('Helvetica').fontSize(10).fillColor('#9fb0c5');
doc.text('Dark Mode design system export. Includes Typography Scale, Color Palette, Spacing Grid, and Component States.', {
  align: 'center'
});
doc.moveDown(1.5);

doc.font('Helvetica').fontSize(11).fillColor('#f5f7fb');

const renderLine = (line) => {
  if (line.startsWith('## ')) {
    doc.moveDown(0.5);
    doc.font('Helvetica-Bold').fontSize(16).fillColor('#9ef7ff');
    doc.text(line.replace('## ', ''));
    doc.moveDown(0.2);
    doc.font('Helvetica').fontSize(11).fillColor('#f5f7fb');
  } else if (line.startsWith('- ')) {
    doc.list([line.replace('- ', '')], { bulletRadius: 2, textIndent: 10, bulletIndent: 12 });
  } else if (line.startsWith('# ')) {
    doc.addPage();
    doc.font('Helvetica-Bold').fontSize(20).fillColor('#d5fcea');
    doc.text(line.replace('# ', ''));
    doc.moveDown(1);
    doc.font('Helvetica').fontSize(11).fillColor('#f5f7fb');
  } else if (line.trim() === '') {
    doc.moveDown(0.4);
  } else {
    doc.text(line);
  }
};

lines.forEach(renderLine);

doc.end();
console.log(`Generated PDF at ${pdfPath}`);
