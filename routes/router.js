import express, { Router } from "express";
import { keyGen, sign, verify } from "../app/digitalSignature.js";
const router = Router();
router.use(express.json());
router.get('/keyGen', (request, response) => {
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
    const privateKey = request.body.privateKey;
    const file = request.body.file;
    if (!privateKey || !file) response.status(400).end();
    console.log("Signing file...");
    response.status(200).json({ signature: sign(file, privateKey) });
});
router.post('/verify', (request, response) => {
    const publicKey = request.body.publicKey;
    const file = request.body.file;
    const signature = request.body.signature;
    if (!publicKey || !file || !signature) response.status(400).end();
    console.log("Verifying file...");
    response.status(200).json({ verified: verify(file, signature, publicKey) });
});
export { router };