import { generateKeyPair, createSign, createVerify } from 'node:crypto';
const algorithm = 'rsa';
const keyGenOptions = {
    modulusLength: 2048,
    publicKeyEncoding: {
        type: 'pkcs1',
        format: 'pem',
    },
    privateKeyEncoding: {
        type: 'pkcs1',
        format: 'pem'
    }
};

const keyGen = new Promise((resolve, reject) => {
    generateKeyPair(algorithm, keyGenOptions, (err, publicKey, privateKey) => {
        if (err) {
            reject(err);
        } else {
            resolve({ publicKey, privateKey });
        }
    });
});

const sign = (data, privateKey) => {
    const signer = createSign('SHA256');
    signer.update(data);
    signer.end();
    return signer.sign(privateKey, 'base64');
};

const verify = (data, signature, publicKey) => {
    const verifier = createVerify('SHA256');
    verifier.update(data);
    verifier.end();
    return verifier.verify(publicKey, signature, 'base64');
};

export { keyGen, sign, verify };