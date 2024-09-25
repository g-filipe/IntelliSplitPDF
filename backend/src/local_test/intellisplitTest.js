import { intelliSplit } from "../index.js";
import "dotenv/config.js";

const payslipFilePath = process.env.LOCAL_INPUT_PATH_FILE;

await intelliSplit(payslipFilePath);
