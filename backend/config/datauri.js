import DataUriParser from "datauri/parser.js"

import path from 'path'

//chuyển file thành 1 chuỗi data url

export default function getDataUri(file) {
    const parser = new DataUriParser() // khởi tạo đối tượng
    const extName = path.extname(file.originalname).toString() // lấy tiện ích mở rộng
    return parser.format(extName, file.buffer) // chuyển file thành data url
    // data:image/png;base64,/9j/4AAQSkZJRgABAQEAAAAAAAD...
}