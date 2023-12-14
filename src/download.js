import * as XLSX from "xlsx";
import B2 from "backblaze-b2";

/* replace these constants */
const applicationKeyId = "YOUR_BACKBLAZE_KEY_ID";
const applicationKey = "YOUR_BACKBLAZE_APP_KEY";
const fileId = "file_ID";

async function download() {
  try {
    const b2 = new B2({ applicationKeyId, applicationKey });
    await b2.authorize();

    // Download file by fileId
    const { data: streamData } = await b2.downloadFileById({
      fileId: fileId,
      responseType: "stream",
    });

    /* array of buffers */
    const bufs = [];

    /* collect data chunks into an array */
    streamData.on("data", function (data) {
      bufs.push(data);
    });

    /* the callback will be called after all of the data is collected */
    streamData.on("end", function () {
      /* concatenate */
      const buf = Buffer.concat(bufs);
      /* AT THIS POINT, `buf` is a NodeJS Buffer */
      /* parse */
      var wb = XLSX.read(buf, { type: "buffer" });

      /* generate CSV from first worksheet */
      var first_ws = wb.Sheets[wb.SheetNames[0]];
      var csv = XLSX.utils.sheet_to_csv(first_ws);
      console.log(csv);
    });
  } catch (err) {
    console.error("Error reading file:", err);
  }
}

download();
