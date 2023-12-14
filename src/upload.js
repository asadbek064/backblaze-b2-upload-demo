import * as XLSX from "xlsx";
import B2 from "backblaze-b2";

async function upload(
  applicationKeyId,
  applicationKey,
  bucketId,
  fileName,
  fileContents,
) {
  const b2 = new B2({ applicationKeyId, applicationKey });

  try {
    const { data: authData } = await b2.authorize();
    const uploadUrl = await b2.getUploadUrl({ bucketId });

    const { data: uploadData } = await b2.getUploadUrl({
      bucketId: bucketId,
    });

    const { data: uploadedFile } = await b2.uploadFile({
      uploadUrl: uploadData.uploadUrl,
      uploadAuthToken: uploadData.authorizationToken,
      data: fileContents,
      fileName,
    });

    // Construct friendly URL to file
    const bucketName = authData.allowed.bucketName;
    const downloadURL = authData.downloadUrl;
    const url = `${downloadURL}/file/${bucketName}/${uploadedFile.fileName}`;
    console.log("File uploaded:", uploadedFile.fileName, url);
  } catch (err) {
    console.error("Error uploading file:", err);
  }
}

export default upload;
