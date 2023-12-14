import * as XLSX from "xlsx";
import B2 from "backblaze-b2";

async function uploadFile(
  applicationKeyId,
  applicationKey,
  bucketId,
  fileName,
  fileContents,
) {
  const b2 = new B2({ applicationKeyId, applicationKey });

  try {
    await b2.authorize();
    const uploadUrl = await b2.getUploadUrl({ bucketId });

    const uploadInfo = await b2.uploadFile({
      uploadUrl: uploadUrl.data.uploadUrl,
      uploadAuthToken: uploadUrl.data.authorizationToken,
      fileName,
      data: fileContents,
      contentLength: fileContents.length,
    });

    console.log("File uploaded:", uploadInfo.data.fileName);
  } catch (err) {
    console.error("Error uploading file:", err);
  }
}

module.exports = uploadFile;
