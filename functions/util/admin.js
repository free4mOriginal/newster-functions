// Firebase Admin SDK to access the Firebase Realtime Database
const admin = require("firebase-admin");

// Include service account info
var serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://newster-ac2aa.firebaseio.com",
  storageBucket: "newster-ac2aa.appspot.com"
});

const db = admin.firestore();

module.exports = { admin, db };