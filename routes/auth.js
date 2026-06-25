const express = require("express");
const router = express.Router();
const db = require("../db");
const bcrypt = require("bcrypt");

// Home Page
router.get("/", (req, res) => {
    res.render("index");
});

// Register Page
router.get("/register", (req, res) => {
    res.render("register");
});

// Register User
router.post("/register", async (req, res) => {

    const { name, email, password } = req.body;

    try {

        const hashedPassword = await bcrypt.hash(password, 10);

        const sql = "INSERT INTO users(name,email,password) VALUES(?,?,?)";

        db.query(sql, [name, email, hashedPassword], (err, result) => {

            if (err) {
                console.log(err);
                return res.send("Registration Failed");
            }

            res.redirect("/login");

        });

    } catch (error) {

        console.log(error);
        res.send("Error");

    }

});

// Login Page
router.get("/login", (req, res) => {
    res.render("login");
});

// Login User
router.post("/login", (req, res) => {

    const { email, password } = req.body;

    const sql = "SELECT * FROM users WHERE email=?";

    db.query(sql, [email], async (err, result) => {

        if (err) {
            console.log(err);
            return res.send("Database Error");
        }

        if (result.length == 0) {
            return res.send("User Not Found");
        }

        const user = result[0];

        const match = await bcrypt.compare(password, user.password);

        if (!match) {
            return res.send("Invalid Password");
        }

        req.session.user = user;

        db.query("SELECT id,name,email FROM users", (err, users) => {

            if (err) {
                console.log(err);
                return res.send("Database Error");
            }

            res.render("dashboard", { users });

        });

    });

});

// Dashboard
router.get("/dashboard", (req, res) => {

    if (!req.session.user) {
        return res.redirect("/login");
    }

    db.query("SELECT id,name,email FROM users", (err, users) => {

        if (err) {
            console.log(err);
            return res.send("Database Error");
        }

        res.render("dashboard", { users });

    });

});

// Logout
router.get("/logout", (req, res) => {

    req.session.destroy(() => {

        res.redirect("/");

    });

});

module.exports = router;