import uploadFile from "./uploadFile.js";
import downloadFile from "./downloadFile.js";
import * as XLSX from "xlsx";

const fileName = "YOU_FILE_NAME";
const fileId = "YOUR_FILE_ID"; // Replace with the actual file ID to download

const applicationKeyId = "YOUR_BACKBLAZE_KEY_ID";
const applicationKey = "YOUR_BACKBLAZE_APP_KEY";
const bucketId = "YOUR_BACKBLAZE_BUCKET_ID";

/* generate sample workbook */
var wb = XLSX.read("S,h,e,e,t,J,S\n5,4,3,3,7,9,5", { type: "binary" });

/* write to XLSX file in a NodeJS Buffer */
var Body = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });

// Trigger upload function
uploadFile(applicationKeyId, applicationKey, bucketId, fileName, Body);

// Trigger download function
downloadFile(applicationKeyId, applicationKey, fileId);
