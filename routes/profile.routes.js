const express = require('express');
const router = express.Router();
const adminService = require('../services/admin/admin.service');
const profileService = require('../services/profile/profile.service');
const jwt = require('jsonwebtoken');
const { nanoid } = require('nanoid');

router.use('/', checkJwt);
router.get('/:id([0-9]+)', getProfileById);
router.get('/:id([0-9]+)/resetPassword', resetPasswordRequest);
router.put('/:id([0-9]+)', updateProfile);
router.get('/:id([0-9]+)/searches', getSavedSearchesByUser);
router.get('/:id([0-9]+)/searches/:idSearch([0-9]+)', getSavedSearchById);
router.delete('/:id([0-9]+)/searches/:idSearch([0-9]+)', deleteSavedSearchById);

async function checkJwt(req, res, next) {
    // check if json web token is valid...
    var token = req.body.token || req.query.token || req.headers.authorization;

    if (!token) {
        return res.status(403).send({ message: `Per accedere alle API si richiede un token. Effettua il login di nuovo` });
    }

    if (token.substr(0, 6).toUpperCase() === 'BEARER') token = token.substr(7);

    // Check of Javascript Web Token here. User must be logged in.
    try {
        const decoded = jwt.decode(token, process.env.JWT_SECRET);
        req.user = decoded;
    } catch (err) {
        console.error(err);
        return res.status(400).send({ error: "Error in JSON Web Token" });
    }

    next();
}

async function getProfileById(req, res, next) {
    // users may only get their own data

    if (req.user.sub.rowid.toString() !== req.params.id) {
        return res.status(403).send({ message: `Unauthorized` });
    }

    try {
        const user = await adminService.getUserById(req.params.id);
        if (!user) {
            return res.status(404).send({ message: 'User not found' });
        }

        const { password, ...rest } = user;
        res.send(rest);
    } catch (err) {
        console.error(err);
        next(err);
    }
}

async function resetPasswordRequest(req, res, next) {
    // users may only get their own data

    if (req.user.sub.rowid.toString() !== req.params.id) {
        return res.status(403).send({ message: `Unauthorized` });
    }

    try {
        const expirePassword = new Date(1970, 1, 1);
        const resetCode = nanoid(32);
        const user = await adminService.updateUser(req.params.id, { forceResetOn: expirePassword, resetCode: resetCode });
        if (!user) {
            return res.status(404).send({ message: 'User not found' });
        }

        const token = jwt.sign({ sub: user }, process.env.JWT_SECRET);
        const { password, ...rest } = user;

        res.send({ user: rest, token: token, passwordChange: true });
    } catch (err) {
        console.error(err);
        next(err);
    }
}

async function updateProfile(req, res, next) {
    // users may only get their own data

    if (req.user.sub.rowid.toString() !== req.params.id) {
        return res.status(403).send({ message: `Unauthorized` });
    }

    try {
        const user = await adminService.updateUser(req.params.id, req.body)
        if (!user) {
            return res.status(404).send({ message: 'User not found' });
        }

        const token = jwt.sign({ sub: user }, process.env.JWT_SECRET);
        const { password, ...rest } = user;

        res.send({ user: rest, token: token, passwordChange: false });
    } catch (err) {
        console.error(err);
        next(err);
    }
}

async function getSavedSearchesByUser(req, res, next) {
    // users may only get their own data

    if (req.user.sub.rowid.toString() !== req.params.id) {
        return res.status(403).send({ message: `Unauthorized` });
    }

    try {
        const searches = await profileService.getSavedSearchesByUser(req.params.id);
        res.send(searches);
    } catch (err) {
        console.error(err);
        next(err);
    }
}

async function getSavedSearchById(req, res, next) {
    try {
        return res.status(400).send({ message: "Not yet implemented" });
    } catch (err) {
        console.error(err);
        next(err);
    }
}

async function deleteSavedSearchById(req, res, next) {
    try {
        return res.status(400).send({ message: "Not yet implemented" });
    } catch (err) {
        console.error(err);
        next(err);
    }
}

module.exports = router;