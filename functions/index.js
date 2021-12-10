const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');
const cors = require('cors');
var aes256 = require('aes256');
var cookieParser = require('cookie-parser');

const app = express();
admin.initializeApp();

// Automatically allow cross-origin requests
app.use(cors({ origin: true }));
app.use(express.json());
// @ts-ignore
app.use(cookieParser());
const firestore = admin.firestore();

// Global cookie options
const cookieOptions = {
  httpOnly: true,
  secure: true,
  expires: new Date(Date.now() + 7 * 24 * 3600 * 1000),
};

// Encryption algorithms
const encrypt = (val, key) => {
  const encryptedPlainText = aes256.encrypt(key, val);
  return encryptedPlainText;
};

const decrypt = (encrypted, key) => {
  const decryptedPlainText = aes256.decrypt(key, encrypted);
  return decryptedPlainText;
};

// Middleware to make sure requests are authenticated
const verifyAuth = async (req, res, next) => {
  const { key, encryptedEmail } = req.cookies;
  if (!key || !encryptedEmail) {
    res.status(401).json({
      message: 'Unauthorized',
    });
  }

  const query = await firestore
    .collection('user')
    .where('email', '==', decrypt(encryptedEmail, functions.config().api.key))
    .limit(1)
    .get();

  const documentData = query.docs[0];

  // Set the user id to the header, and also decrypt the key cookie to produce master password
  req.headers['uid'] = documentData.id;
  req.headers['key'] = decrypt(req.cookies.key, functions.config().api.key);
  next();
};

// Route to handle creation of account, login, and retrieval of credentials
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const query = await firestore
    .collection('user')
    .where('email', '==', email)
    .limit(1)
    .get();

  if (query.empty) {
    res.status(400).json({
      message: 'Invalid request! User does not exist',
    });
  }

  const savedData = query.docs[0].data();
  if (savedData.email !== decrypt(savedData.encryptedEmail, password)) {
    res.status(401).json({
      message: 'Invalid request! Invalid credentials',
    });
  }

  res.cookie(
    'encryptedEmail',
    encrypt(email, functions.config().api.key),
    cookieOptions
  );
  res.cookie(
    'key',
    encrypt(password, functions.config().api.key),
    cookieOptions
  );
  return res.status(201).json({ message: 'Success' });
});

app.post('/signup', async (req, res) => {
  const { email, password, confirmPassword } = req.body;
  if (password !== confirmPassword) {
    res.status(400).json({
      message: "Bad request! Passwords don't match",
    });
  }

  const query = await firestore
    .collection('user')
    .where('email', '==', email)
    .limit(1)
    .get();

  if (!query.empty) {
    return res.status(400).json({
      message: 'Invalid request! Account already exists',
    });
  }

  await firestore.collection('user').add({
    email: email,
    encryptedEmail: encrypt(email, password),
  });

  const encryptedKey = encrypt(password, functions.config().api.key);
  const encryptedEmail = encrypt(email, functions.config().api.key);
  res.cookie('encryptedEmail', encryptedEmail, cookieOptions);
  res.cookie('key', encryptedKey, cookieOptions);
  return res.status(201).json({ message: 'Success' });
});

app.get('/healthCheck', (_, res) => {
  res.status(200).send('Everything is fine');
});

app.get('/getCredentials', verifyAuth, async (req, res) => {
  const { key, uid } = req.headers;

  const data = await firestore
    .collection('credentials')
    .where('uid', '==', uid)
    .get()
    .then((snapshot) => {
      if (snapshot.empty) {
        return [];
      }

      return snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          credentialId: doc.id,
          domain: decrypt(data.encryptedDomain, key),
          email: decrypt(data.encryptedEmail, key),
          password: decrypt(data.encryptedPassword, key),
        };
      });
    });

  res.status(200).json({
    data: data,
  });
});

app.post('/registerCredential', verifyAuth, async (req, res) => {
  const { key, uid } = req.headers;
  const { email, password, domain } = req.body;
  const { hostname } = new URL(domain);
  try {
    await firestore.collection('credentials').add({
      uid: uid,
      encryptedDomain: encrypt(hostname, key),
      encryptedEmail: encrypt(email, key),
      encryptedPassword: encrypt(password, key),
    });

    res.status(201).json({
      message: 'Success',
      data: {
        email: email,
        password: password,
        domain: hostname,
      },
    });
  } catch {
    (err) => {
      res.status(500).json({
        message: 'Failed to set credential',
      });
    };
  }
});

// {baseurl}/api/login
exports.api = functions.https.onRequest(app);
