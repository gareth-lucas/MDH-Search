
const express = require('express');
const { nanoid } = require('nanoid');
const bcrypt = require('bcrypt');
const router = express.Router();
const database = require('../helpers/database')();
const emailService = require('../services/email/email.service');
const adminService = require('../services/admin/admin.service');
const { resetPassword } = require('../services/security/security.service');

router.use('/', checkToken);
router.post('/users', createUser);
router.get('/users', getUsers);
router.get('/users/:id', getUserById);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

async function checkToken(req, res, next) {
    // check the JWT...
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