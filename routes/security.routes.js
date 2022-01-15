const express = require('express');
const { nanoid } = require('nanoid');
const router = express.Router();
const securityService = require('../services/security/security.service');
const adminService = require('../services/admin/admin.service');
const emailService = require('../services/email/email.service');
const bcyrpt = require('bcrypt');
const fs = require("fs").promises;
const path = require("path");
const interpolate = require('../helpers/interpolate');

router.post('/login', login);
router.get('/logout', logout);
router.post('/changePassword', changePassword);
router.post('/resetPassword', resetPassword);

async function login(req, res, next) {
    try {
        const login = await securityService.login(req.body.email, req.body.password);
        if (!login) {
            return res.status(401).send({ message: "Username o Password errato" });
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
        const user = await adminService.getUserByEmail(req.body.email);
        if (!user) {
            return res.status(400).send({ message: "unknown error" });
        }

        if (req.body.resetCode) {
            if (req.body.resetCode !== user.resetCode) {
                return res.status(400).send({ message: "Errore - impossibile resettare la password" });
            }
        }

        if (req.body.old_password) {
            const matches = bcyrpt.compareSync(req.body.old_password, user.password);
            if (!matches) {
                return res.status(400).send({ message: "La password vecchia digitata non è corretta" });
            }
        }

        const hashedPw = bcyrpt.hashSync(req.body.password, 10);
        const updatedUser = await adminService.updateUser(user.rowid, { password: hashedPw, resetCode: null, forceResetOn: null });
        if (!updatedUser) {
            console.error(`Unable to update user`);
            return res.status(400).send({ message: "error updating user" });
        }

        res.send();
    } catch (err) {
        console.error(err);
        next(err);
    }
}

async function resetPassword(req, res, next) {
    try {
        const email = req.body.email;

        const user = await adminService.getUserByEmail(email);
        if (!user) {
            console.error("User not found for password reset: " + email);
            return res.send();
        }

        const resetCode = nanoid(32);
        const updatedUser = await adminService.updateUser(user.rowid, { resetCode: resetCode });
        if (!updatedUser) {
            console.error("User not updated: " + email);
            return res.send();
        }

        const template = await fs.readFile(
            path.join(__dirname, "../templates/passwordResetEmail.tpl"),
            "utf-8"
        );

        const mailContent = interpolate(template, {
            user_name: updatedUser.name,
            site_url: process.env.SITE_URL,
            user_email: encodeURI(updatedUser.email),
            reset_code: encodeURI(updatedUser.resetCode),
            site_support: process.env.SITE_SUPPORT
        });

        const emailObj = {
            to: process.env.NODE_ENV === 'production' ? email : process.env.TEST_EMAIL_RECEIVER,
            from: process.env.EMAIL_USER,
            subject: 'MDH Search - Richiesta reset di password',
            body: mailContent
        }

        await emailService.sendMail(emailObj);

        res.send();

    } catch (err) {
        console.error(err);
        next(err);
    }
}

module.exports = router;
