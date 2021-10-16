const express = require('express');
const router = express.Router();
const securityService = require('../services/security/security.service');

router.post('/login', login);
router.get('/logout', logout);
router.post('/changePassword', changePassword);
router.post('/resetPassword', resetPassword);

async function login(req, res, next) {
    try {
        const login = await securityService.login(req.body.email, req.body.password);
        if (!login) {
            return res.status(401).send({ error: "Username o Password errato" });
        }

        if (login.changePassword) {
            return res.status(400).send({ message: "Utente deve cambiare la password" });
        }

        res.send(login);
    } catch (err) {
        console.error(err);
        next(err);
    }
}

async function logout(req, res, next) {
    try {
        res.status(400).send({ message: "Not Implemented" })
    } catch (err) {
        console.error(err);
        next(err);
    }
}

async function changePassword(req, res, next) {
    try {
        res.status(400).send({ message: "Not Implemented" })
    } catch (err) {
        console.error(err);
        next(err);
    }
}

async function resetPassword(req, res, next) {
    try {
        res.status(400).send({ message: "Not Implemented" })
    } catch (err) {
        console.error(err);
        next(err);
    }
}

module.exports = router;
