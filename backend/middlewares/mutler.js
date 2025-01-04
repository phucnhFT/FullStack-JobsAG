import multer from "multer";

// cấu hình lưu trữ trong bộ nhớ
const storage = multer.memoryStorage();

// tạo middleware Multer
export const singleUpload = multer({ storage }).single("file");
