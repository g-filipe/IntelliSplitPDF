import "dotenv/config.js";
import express from "express";
import https from "https";
import fileUpload from "express-fileupload";
import fs from "fs";
import path from "path";
import { intelliSplit } from "./intellisplit.js";
import cors from "cors";
import { execSync } from "child_process";

const saveInputDir = "input";

const app = express();

app.use(cors());
app.use(fileUpload());

app.post("/upload", async (req, res) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send("No file found.");
  }

  execSync(`mkdir -p ${saveInputDir}`);

  const payslipFile = req.files.payslip;
  const uploadPath = path.join(saveInputDir, payslipFile.name);

  payslipFile.mv(uploadPath, async (err) => {
    if (err) {
      return res.status(500).send(err);
    }

    try {
      const zipBuffer = await intelliSplit(uploadPath);
      res.status(200).send(zipBuffer);
    } catch (error) {
      console.error(error);
      res.status(500).send(`Error processing the file: ${error.message}`);
    } finally {
      fs.unlinkSync(uploadPath);
    }
  });
});

const PORT = process.env.PORT || 3000;

if (process.env.IS_PROD) {
  const httpsServer = https.createServer(
    {
      cert: fs.readFileSync(process.env.SSL_CERTIFICATE, "utf8"),
      key: fs.readFileSync(process.env.PRIVATE_KEY, "utf8"),
    },
    app
  );

  httpsServer.listen(PORT, () => {
    console.log(`HTTPS server running on port ${PORT}`);
  });
} else {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}
