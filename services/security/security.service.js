const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { nanoid } = require('nanoid');
const adminService = require('../admin/admin.service');

module.exports = {
    login,
    logout,
    changePassword,
    resetPassword
}

async function login(username, inputPW) {
    const user = await adminService.getUserByEmail(username);
    if (!user) {
        console.log(`User ${username} not found`);
        return false;
    }

    if (user.role === 'DELETED') {
        console.log(`User ${username} is deleted`);
        return false;
    }

    const compare = bcrypt.compareSync(inputPW, user.password);

    if (!compare) {
        console.log(`User ${username} enetered a wrong password`);
        return false;
    }

    var pwChange = false;
    if (user.forceResetOn < new Date() && user.forceResetOn !== null) {
        const resetCode = nanoid(32);
        await adminService.updateUser(user.rowid, { resetCode: resetCode });
        pwChange = true;
    }

    // user/password are correct, Do login!
    var newUser = await adminService.updateUser(user.rowid, { lastLogin: new Date() });
    const token = jwt.sign({ sub: newUser }, process.env.JWT_SECRET);

    const { password, ...rest } = newUser;
    return { user: rest, token: token, passwordChange: pwChange }
}

async function logout() {

}

async function changePassword(oldPassword, newPassword) {

}

async function resetPassword(newPassword) {

}