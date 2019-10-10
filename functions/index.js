// Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers
const functions = require("firebase-functions");

// Bring in Express
const app = require("express")();

// Bring in cors
const cors = require("cors");
app.use(cors());

const FBAuth = require('./util/fbAuth');
const { getAllPosts, postOnePost } = require("./handlers/posts");
const { signup, login } = require("./handlers/users");

// POST ROUTES
// GET all posts
app.get("/posts", getAllPosts);
// Create one post
app.post("/post", FBAuth, postOnePost);

// USERS ROUTES
// Signup
app.post("/signup", signup);
// Login
app.post("/login", login);

exports.api = functions.https.onRequest(app);
