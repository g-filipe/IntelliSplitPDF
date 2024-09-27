import { createRequire } from "module";
const require = createRequire(import.meta.url);
import "dotenv/config.js";
const pdfParse = require("pdf-parse");
import { PDFDocument } from "pdf-lib";
import fs, { existsSync } from "fs";
import { exec, execSync } from "child_process";
import { monthNumbers } from "./monthNumbers.js";

const fileOutputFolder = process.env.OUTPUT_FILE_FOLDER;
execSync(`mkdir -p temp`);

export async function intelliSplit(fileInputPath) {
  if (!fs.existsSync(fileInputPath)) {
    console.error(`Error: The ${fileInputPath} file is not found.`);
    process.exit(1);
  }
  
  const totalPages = await splitPdf(fileInputPath);
  execSync(`rm -rf output`);

  for (let i = 0; i < totalPages; i++) {
    const { name, month, year } = await pdfExtractInfo(`temp/${i}.pdf`);
    const monthNumber = monthNumbers[month];

    const excludePrepositions = ["da", "de", "do", "e", "&", "das", "dos"];

    const dirName = name
      .toLowerCase()
      .split(" ")
      .map((word) => (excludePrepositions.includes(word) ? word : word[0].toUpperCase() + word.substring(1)))
      .join(" ");

    const firstName = dirName.split(" ")[0];
    const lastName = dirName.split(" ").pop();

    let fileName = `${firstName}_${lastName}_${monthNumber}_${year}`;

    execSync(`mkdir -p '${fileOutputFolder}/${dirName}'`);

    if (existsSync(`${fileOutputFolder}/${dirName}/${fileName}.pdf`)) {
      fileName += "_ferias";
    }
    execSync(`mv temp/${i}.pdf '${fileOutputFolder}/${dirName}/${fileName}.pdf'`);
  }
}

async function splitPdf(fileInputPath) {
  const pdfData = fs.readFileSync(fileInputPath);
  const originalPdfDoc = await PDFDocument.load(pdfData);
  const pages = originalPdfDoc.getPages();

  for (let i = 0; i < pages.length; i++) {
    const newPdfDoc = await PDFDocument.create();
    const [copiedPage] = await newPdfDoc.copyPages(originalPdfDoc, [i]);
    newPdfDoc.addPage(copiedPage);
    const pdfBytes = await newPdfDoc.save();
    fs.writeFileSync(`temp/${i}.pdf`, pdfBytes);
  }

  return pages.length;
}

async function pdfExtractInfo(pdfPath) {
  const dataBuffer = fs.readFileSync(pdfPath);
  const data = await pdfParse(dataBuffer);
  
  return {
    name: data.text.match(/[0-9]+([A-Z ]+)CBO :/)[1],
    month: data.text.match(/mês de ([A-Z][a-z]+)\/([0-9]+)/)[1],
    year: data.text.match(/mês de ([A-Z][a-z]+)\/([0-9]+)/)[2],
  };
}
