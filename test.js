const express = require("express");
const multer = require("multer");
const cors = require("cors");
const app = express();
const port = 8000;
const dotenv = require("dotenv");
dotenv.config();
app.use(cors());
const uploadAndGenerateUrlMiddleware = require("./middleware/uploadAndGenerateUrl");
// // 使用multer設置文件上傳中間件
const upload = multer({ dest: "uploads/" });

// 將中間件應用於'/upload'路由
app.post(
  "/upload",
  upload.single("file"),
  uploadAndGenerateUrlMiddleware,
  (req, res) => {
    // 中間件處理完成後的處理邏輯
    res.json({ uploadedUrl: req.uploadedUrl });
  }
);

// 啟動服務器
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
