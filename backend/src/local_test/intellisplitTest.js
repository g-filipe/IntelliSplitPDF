import { intelliSplit } from "../intellisplit.js";
import "dotenv/config.js";

const payslipFilePath = process.env.LOCAL_INPUT_PATH_FILE;

await intelliSplit(payslipFilePath);
