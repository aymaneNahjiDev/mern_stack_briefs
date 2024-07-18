
import multer from 'multer'

import path from 'path'

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // just files that have mimeTypes JPEG and PNG
        if (['image/jpeg', 'image/png'].includes(file.mimetype)) {
            cb(null, 'uploads/')
        }
        else {
            cb(new Error('Type of image is not correct.'), 'uploads/')
        }
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        const extension = path.extname(file.originalname)
        cb(null, file.fieldname + '-' + uniqueSuffix + extension)
    },

})

export const upload = multer({ dest: 'uploads/', storage: storage, })
