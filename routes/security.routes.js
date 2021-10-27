const express = require('express');
const { nanoid } = require('nanoid');
const router = express.Router();
const securityService = require('../services/security/security.service');
const adminService = require('../services/admin/admin.service');
const emailService = require('../services/email/email.service');
const bcyrpt = require('bcrypt');

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
                console.log("Email Reset Code:", req.body.resetCode);
                console.log("DB Reset COde:", user.resetCode);
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
            console.log(`Unable to update user`);
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
            console.log("User not found for password reset: " + email);
            return res.send();
        }

        const resetCode = nanoid(32);
        const updatedUser = await adminService.updateUser(user.rowid, { resetCode: resetCode });
        if (!updatedUser) {
            console.log("User not updated: " + email);
            return res.send();
        }

        const emailObj = {
            to: process.env.NODE_ENV === 'production' ? email : process.env.TEST_EMAIL_RECEIVER,
            from: process.env.EMAIL_USER,
            subject: 'MDH Search - Richiesta reset di password',
            body: `<html>
<head>
    <title>Richiesta reset di password</title>
</head>
<body>
    <p>Ciao ${updatedUser.name},</p><p>Hai ricevuto questa mail perché ci è arrivata una richiesta di fare reset della password. Se non sei stato tu a richiedere il reset, ignora questa email</p>
    <p>Per fare il reset, prego cliccare sul link <a href="${process.env.SITE_URL}/passwordReset?email=${encodeURI(updatedUser.email)}&resetCode=${updatedUser.resetCode}">Reset Password</a></p>
    <p>Per qualsiasi problema, prego contattare ${process.env.SITE_SUPPORT}</p>
    <p>Saluti, MDH Search</p>
</body>
</html>`
        }

        await emailService.sendMail(emailObj);

        res.send();

    } catch (err) {
        console.error(err);
        next(err);
    }
}

module.exports = router;
