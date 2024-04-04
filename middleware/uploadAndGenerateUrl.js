// middleware/uploadAndGenerateUrl.js

const { google } = require("googleapis");
const fs = require("fs");

const CLIENT_ID = process.env.GOOGLE_DRIVE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_DRIVE_CLIENT_SECRET;
const REDIRECT_URI = process.env.GOOGLE_DRIVE_REDIRECT_URI;
const REFRSH_TOKEN = process.env.GOOGLE_DRIVE_REFRESH_TOKEN;

const oauth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);

oauth2Client.setCredentials({ refresh_token: REFRSH_TOKEN });

const drive = google.drive({
  version: "v3",
  auth: oauth2Client,
});
async function uploadAndGenerateUrlMiddleware(req, res, next) {
  try {
    const file = req.file;
    if (!file) {
      throw new Error("No file uploaded");
    }

    // 上傳圖片至google drive
    const response = await drive.files.create({
      requestBody: {
        name: file.originalname,
        mimeType: file.mimetype,
        parents: ["1U34N6p75gUSUKPHHp-2QWtPy_vSLe3sy"],
      },
      media: {
        mimeType: file.mimetype,
        body: fs.createReadStream(file.path),
      },
    });

    // 生成url
    const fileId = response.data.id;
    await drive.permissions.create({
      fileId: fileId,
      requestBody: {
        role: "reader",
        type: "anyone",
      },
    });
    const result = await drive.files.get({
      fileId: fileId,
      fields: "webViewLink",
    });

    //提取文件的id部分
    const fileIdFromLink = result.data.webViewLink.match(/[-\w]{25,}/)[0];

    // 構建新的 URL
    const newUrl =
      "https://drive.google.com/thumbnail?id=" + fileIdFromLink + "&sz=w1200";

    // 將新的 URL 賦值給 req.uploadedUrl
    req.uploadedUrl = newUrl;

    console.log("req.uploadedUrl", req.uploadedUrl);
    // 刪除臨時文件
    fs.unlinkSync(file.path);

    next();
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Failed to upload and generate URL");
  }
}

module.exports = uploadAndGenerateUrlMiddleware;
