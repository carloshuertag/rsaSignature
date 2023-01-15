let privateKey;
let publicKey;
let signFile;
let signatureFile;
let verifyFile;
const downloadKeyPair = (keyPair) => {
    const publicKey = new Blob([keyPair.publicKey], { type: 'text/plain;charset=utf-8' });
    const privateKey = new Blob([keyPair.privateKey], { type: 'text/plain;charset=utf-8' });
    const publicKeyURL = URL.createObjectURL(publicKey);
    const privateKeyURL = URL.createObjectURL(privateKey);
    const publicKeyAnchor = document.createElement('a');
    const privateKeyAnchor = document.createElement('a');
    publicKeyAnchor.href = publicKeyURL;
    privateKeyAnchor.href = privateKeyURL;
    publicKeyAnchor.download = 'publicKey.pem';
    privateKeyAnchor.download = 'privateKey.pem';
    publicKeyAnchor.click();
    privateKeyAnchor.click();
    URL.revokeObjectURL(publicKeyURL);
    URL.revokeObjectURL(privateKeyURL);
    document.removeChild(publicKeyAnchor);
    document.removeChild(privateKeyAnchor);
};
const keyGenHandler = () => {
    fetch('/digitalSignature/keyGen', { method: 'GET' }).then((response) => {
        if (response.ok) {
            return response.json();
        } else {
            alert('Error generating keys!');
            throw new Error('Network response was not ok.');
        }
    }).then((keyPair) => {
        downloadKeyPair(keyPair);
    }).catch((err) => {
        throw new Error(err);
    });
};
const downloadSignature = (signature) => {
    const signatureBlob = new Blob([signature], { type: 'text/plain;charset=utf-8' });
    const signatureURL = URL.createObjectURL(signatureBlob);
    const signatureAnchor = document.createElement('a');
    signatureAnchor.href = signatureURL;
    signatureAnchor.download = 'signature.txt';
    signatureAnchor.click();
    URL.revokeObjectURL(signatureURL);
    document.removeChild(signatureAnchor);
};
const signHandler = (event) => {
    event.preventDefault();
    const data = {
        privateKey: privateKey,
        file: signFile
    }
    fetch('/digitalSignature/sign', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    }).then((response) => {
        if (response.ok) {
            return response.json();
        } else {
            alert('Error signing file!');
            throw new Error('Network response was not ok.');
        }
    }).then((result) => {
        downloadSignature(result.signature);
    }).catch((err) => {
        throw new Error(err);
    });
};
const verifyHandler = (event) => {
    event.preventDefault();
    const data = {
        publicKey: publicKey,
        file: verifyFile,
        signature: signatureFile
    }
    fetch('/digitalSignature/verify', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    }).then((response) => {
        if (response.ok) {
            return response.json();
        } else {
            alert('Error verifying file!');
            throw new Error('Network response was not ok.');
        }
    }).then((result) => {
        alert(result.verified ? 'File verified!' : 'File not verified!');
    }).catch((err) => {
        throw new Error(err);
    });
};
const privateKeyHandler = (files) => {
    const file = files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
        privateKey = reader.result;
    };
    reader.readAsText(file);
};
const publicKeyHandler = (files) => {
    const file = files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
        publicKey = reader.result;
    };
    reader.readAsText(file);
};
const signFileHandler = (files) => {
    const file = files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
        signFile = reader.result;
    };
    reader.readAsText(file);
};
const signatureHandler = (files) => {
    const file = files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
        signatureFile = reader.result;
    };
    reader.readAsText(file);
};
const verifyFileHandler = (files) => {
    const file = files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
        verifyFile = reader.result;
    };
    reader.readAsText(file);
};
const loadHandler = () => {
    const keyGenButton = document.getElementById('keyGen');
    keyGenButton.addEventListener('click', keyGenHandler);
    const signForm = document.getElementById('sign');
    signForm.addEventListener('submit', signHandler);
    const verifyForm = document.getElementById('verify');
    verifyForm.addEventListener('submit', verifyHandler);
    const privateKeyInput = document.getElementById('privateKey');
    privateKeyInput.addEventListener('change', (event) => {
        privateKeyHandler(event.target.files);
    });
    const publicKeyInput = document.getElementById('publicKey');
    publicKeyInput.addEventListener('change', (event) => {
        publicKeyHandler(event.target.files);
    });
    const signFileInput = document.getElementById('signFile');
    signFileInput.addEventListener('change', (event) => {
        signFileHandler(event.target.files);
    });
    const signatureInput = document.getElementById('signature');
    signatureInput.addEventListener('change', (event) => {
        signatureHandler(event.target.files);
    });
    const verifyFileInput = document.getElementById('verifyFile');
    verifyFileInput.addEventListener('change', (event) => {
        verifyFileHandler(event.target.files);
    });
};
window.addEventListener('load', loadHandler);