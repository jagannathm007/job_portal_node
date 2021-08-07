let multer = require('multer');
let path = require('path');
const { v1: uuidv1 } = require('uuid');

exports.serverStorage = (storagePath) => {
    let storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, storagePath)
        },
        filename: function (req, file, cb) {
            cb(null, uuidv1() + path.extname(file.originalname))
        }
    })
    return multer({ storage: storage });
}