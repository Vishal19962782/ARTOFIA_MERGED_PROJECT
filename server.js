const express = require("express");
const socket = require("socket.io");
const app = express();
const server = require("http").createServer(app);
const io = socket(server, {
  cors: {
    origin: "*",
    methods: ["POST", "GET"],
  },
});
const methodOverride = require("method-override");
const fileUpload = require("express-fileupload");
const mongoose = require("mongoose");
const Post = require("./models/post");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const session = require("express-session");
const User = require("./models/usermodel");
const Admin = require("./models/adminmodel");
const morgan = require("morgan");
const router = require("./route/userrouter");
const Postrouter = require("./route/Posts");
const TrendingRouteer = require("./route/TrendingRoutes");
const { redirect } = require("express/lib/response");
const cors = require("cors");
const EventRoutes = require("./route/EventRouters");
const paymentRoutes = require("./route/PaymentRoutes");
const TicketRoutes = require("./route/TicketRoutes");
const adminRoutes = require("./route/AdminRoutes");
const requestRoutes = require("./route/RequestRoutes");
const ArtistInsight = require("./route/ArtistInsight");
const { log } = require("console");
require("dotenv").config();
app.use(cors());
app.use(methodOverride("_method"));
app.use(morgan("tiny"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use(fileUpload())

app.use(
  session({
    secret: uuidv4(),
    resave: false,
    saveUninitialized: true,
  })
);
app.use(express.static(path.join(__dirname, "build")));
app.use("/route", router);
app.use("/api/user", Postrouter);
app.use("/api/admin", adminRoutes);
app.use("/Event", EventRoutes);
app.use("/api/trending", TrendingRouteer);
app.use("/api/Events", EventRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/ticket", TicketRoutes);
app.use("/api/Request", requestRoutes);
app.use("/api/ArtistInsight", ArtistInsight);
app.use(express.static(path.join(__dirname, "/public")));
const DB = "mongodb://localhost:27017/FinalTestForProject";
io.on("connection", (socket) => {
  socket.on("ping", (data) => {});
  socket.on("SendMessage", (data) => {
    socket.broadcast.emit("RecieveMessage", data);
  });
});

mongoose
  .connect(DB)
  .then((message) => {
    console.log("all good");
  })
  .catch((err) => {});

server.listen(process.env.PORT, () => {});
app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});
// app.get("/", (req, res) => {
//   if (req.session.user) {
//     res.redirect("route/homepage");
//   } else {
//     req.session.isLoggedIn = false;

//     res.redirect("/route");
//     // res.render("index",{err:"",succ:''});
//   }
// });
