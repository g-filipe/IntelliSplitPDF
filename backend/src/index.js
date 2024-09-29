import express from "express";
import fileUpload from "express-fileupload";
import fs from "fs";
import path from "path";
import { intelliSplit } from "./intellisplit.js";
import cors from "cors";
import { execSync } from "child_process";

const saveInputDir = 'input';

const app = express();

app.use(cors());
app.use(fileUpload());

app.post("/upload", async (req, res) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send("No file found.");
  }
  
  execSync(`mkdir -p ${saveInputDir}`)
  
  const payslipFile = req.files.payslip;
  const uploadPath = path.join(saveInputDir, payslipFile.name);

  payslipFile.mv(uploadPath, async (err) => {
    if (err) {
      return res.status(500).send(err);
    }

    try {
      await intelliSplit(uploadPath);
      res.json({ message: "File uploaded and processed successfully!" });
    } catch (error) {
      console.log(error);
      res.status(500).send(`Error processing the file: ${error.message}`);
    } finally {
      fs.unlinkSync(uploadPath);
    }
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
