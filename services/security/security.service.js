const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
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
        console.log("No user found...");
        return false;
    }

    const compare = bcrypt.compareSync(inputPW, user.password);

    if (!compare) {
        console.log("Password wrong...");
        return false;
    }

    if (user.forceChangeOn < new Date()) {
        return { passwordChange: true }
    }

    // user/password are correct, Do login!
    var newUser = await adminService.updateUser(user.rowid, { lastLogin: new Date() });

    const token = jwt.sign({ sub: newUser }, process.env.JWT_SECRET);

    const { password, ...rest } = newUser;
    return { user: rest, token: token }
}

async function logout() {

}

async function changePassword(oldPassword, newPassword) {

}

async function resetPassword(newPassword) {

}