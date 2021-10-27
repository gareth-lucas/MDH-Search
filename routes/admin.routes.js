
const express = require('express');
const router = express.Router();
const adminService = require('../services/admin/admin.service');
const jwt = require('jsonwebtoken');

router.use('/', checkToken);
router.post('/users', createUser);
router.get('/users', getUsers);
router.get('/users/:id', getUserById);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

async function checkToken(req, res, next) {
    // check if json web token is valid...
    var token = req.body.token || req.query.token || req.headers.authorization;

    if (!token) {
        return res.status(403).send({ message: `Per accedere alle API si richiede un token. Effettua il login di nuovo` });
    }

    if (token.substr(0, 6).toUpperCase() === 'BEARER') token = token.substr(7);

    // Check of Javascript Web Token here. User must be logged in.
    try {
        const decoded = jwt.decode(token, process.env.JWT_SECRET);
        if (decoded.sub.role !== 'ADMIN') {
            return res.status(403).send({ message: `Unauthorized` });
        }
        req.user = decoded;
    } catch (err) {
        console.error(err);
        return res.status(400).send({ error: "Error in JSON Web Token" });
    }

    next();
}

async function createUser(req, res, next) {
    try {
        const newUser = await adminService.createUser(req.body);
        const { password, ...rest } = newUser;
        res.send(rest);
    } catch (err) {
        console.error(err);
        next(err);
    }
}

async function getUsers(req, res, next) {
    try {
        const users = await adminService.getAllUsers();
        res.send(users);
    } catch (err) {
        console.error(err);
        next(err);
    }
}

async function getUserById(req, res, next) {
    try {
        const user = await adminService.getUserById(req.params.id);
        if (!user) {
            return res.status(404).send({ message: `User ${req.params.id} was not found` });
        }

        const { password, ...rest } = user;
        res.send(rest);
    } catch (err) {
        console.error(err);
        next(err);
    }
}

async function updateUser(req, res, next) {
    try {
        const user = await adminService.updateUser(req.params.id, req.body);

        const { password, ...rest } = user;
        res.send(rest);
    } catch (err) {
        console.error(err);
        next(err);
    }

}

async function deleteUser(req, res, next) {
    try {
        await adminService.deleteUser(req.params.id);
        res.send();
    } catch (err) {
        console.error(err);
        next(err);
    }
}

module.exports = router;