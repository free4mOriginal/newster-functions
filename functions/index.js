const config = require("./util/config");

// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
const functions = require("firebase-functions");

// The Firebase Admin SDK to access the Firebase Realtime Database.
const admin = require("firebase-admin");

// API key and service account info included
var serviceAccount = require("./util/serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://newster-ac2aa.firebaseio.com"
});

// bring in Express
const app = require("express")();

// CORS
const cors = require("cors");
app.use(cors());

const firebase = require('firebase');
firebase.initializeApp(config);

app.get("/posts", (req, res) => {
  admin
    .firestore()
    .collection("posts")
    .orderBy("createdAt", "desc")
    .get()
    .then(data => {
      let posts = [];
      data.forEach(doc => {
        posts.push({
          screamId: doc.id,
          body: doc.data().body,
          userHandle: doc.data().userHandle,
          createdAt: doc.data().createdAt,
          commentCount: doc.data().commentCount,
          likeCount: doc.data().likeCount
        });
      });
      return res.json(posts);
    })
    .catch(err => {
      console.error(err);
      res.status("500").json({ error: err.code });
    });
});

app.post("/post", (req, res) => {
  if (req.body.body.trim() === "") {
    return res.status(400).json({ body: "Body must not be empty" });
  }

  const newPost = {
    body: req.body.body,
    userHandle: req.body.userHandle,
    createdAt: new Date().toISOString()
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

exports.api = functions.https.onRequest(app);
