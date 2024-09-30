import "dotenv/config.js";
import { intelliSplit } from "../intellisplit.js";

const payslipFilePath = process.env.LOCAL_INPUT_PATH_FILE;

await intelliSplit(payslipFilePath);
