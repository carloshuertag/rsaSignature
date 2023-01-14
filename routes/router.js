import { Router } from "express";
import { keyGen, sign, verify } from "../app/digitalSignature.js";
import multer from "multer"; // multer module
import { readFile, writeFile } from "node:fs";
const multerConfig = { // multipart/form-data enctypes
    storage: multer.diskStorage({
        destination: (request, file, next) => {
            next(null, './tmp');
        },
        filename: (request, file, next) => {
            const ext = file.originalname.substring(file.originalname.lastIndexOf('.') + 1);
            next(null, file.fieldname + '.' + ext);
        }
    }),
    fileFilter: (request, file, next) => {
        if (!file) next();
        const text = file.mimetype.startsWith('text/');
        if (text) {
            console.log('file supported');
            next(null, true);
        } else {
            console.log("file not supported");
            return next();
        }
    }
};
const router = Router();
router.post('/keyGen', (request, response) => {
    console.log("Generating keys...");
    keyGen.then((keyPair) => {
        console.log("Keys generated!");
        response.status(200).json(keyPair);
    }).catch((err) => {
        console.log("Error generating keys: ", err);
        response.status(500).end();
    });
});
router.post('/sign', (request, response) => {

});
router.post('/verify', (request, response) => {
});
export { router };