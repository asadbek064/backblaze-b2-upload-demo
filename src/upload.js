import * as XLSX from "xlsx";
import B2 from "backblaze-b2";

/* replace these constants */
const applicationKeyId = "YOUR_BACKBLAZE_KEY_ID";
const applicationKey = "YOUR_BACKBLAZE_APP_KEY";
const bucketId = "YOUR_BACKBLAZE_BUCKET_ID";

var Key = "test.xlsx";

/* Create a simple workbook and write XLSX to buffer */
var wb = XLSX.read("S,h,e,e,t,J,S\n5,4,3,3,7,9,5", { type: "binary" });
var Body = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });

/* upload buffer */
const b2 = new B2({ applicationKeyId, applicationKey });

try {
  const { data: authData } = await b2.authorize();
  const { data: uploadData } = await b2.getUploadUrl({
    bucketId: bucketId,
  });

  const { data: uploadedFile } = await b2.uploadFile({
    uploadUrl: uploadData.uploadUrl,
    uploadAuthToken: uploadData.authorizationToken,
    data: Body,
    fileName: Key,
  });

  // Construct friendly URL to file
  const bucketName = authData.allowed.bucketName;
  const downloadURL = authData.downloadUrl;
  const url = `${downloadURL}/file/${bucketName}/${uploadedFile.fileName}`;

  console.log("File uploaded:", uploadedFile.fileId, url);
} catch (err) {
  console.error("Error uploading file:", err);
}
