// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
const functions = require("firebase-functions");
// const config = require("/util/config");

// The Firebase Admin SDK to access the Firebase Realtime Database.
const admin = require("firebase-admin");

var serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://newster-ac2aa.firebaseio.com"
});

exports.getPosts = functions.https.onRequest((req, res) => {
  admin
    .firestore()
    .collection("posts")
    .get()
    .then(data => {
      let posts = [];
      data.forEach(doc => {
        posts.push(doc.data());
      });
      return res.json(posts);
    })
    .catch(err => console.error(err));
});

exports.createPost = functions.https.onRequest((req, res) => {
  const newPost = {
    body: req.body.body,
    userHandle: req.body.userHandle,
    createdAt: admin.firestore.Timestamp.fromDate(new Date())
  };

  admin
    .firestore()
    .collection("posts")
    .add(newPost)
    .then(doc => {
      res.json({ message: `document ${doc.id} created successfully` });
    })
    .catch(err => {
      res.status("500").json({ error: "something went wrong" });
      console.error(err);
    });
});
