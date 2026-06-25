const express = require("express");
const path = require("path");
const session = require("express-session");

require("dotenv").config();


require("./db");

const app = express();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Session
app.use(
    session({
        secret: "mysecretkey",
        resave: false,
        saveUninitialized: true,
    })
);


app.use(express.static(path.join(__dirname, "public")));


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Routes
const authRoutes = require("./routes/auth");
app.use("/", authRoutes);

// Start Server
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});