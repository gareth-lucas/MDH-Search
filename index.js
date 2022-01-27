#!/usr/bin/env node
require('dotenv').config();
const https = require('https');
const express = require('express')
const cors = require('cors');
const apiRoutes = require('./routes/api.routes');
const securityRoutes = require('./routes/security.routes');
const adminRoutes = require('./routes/admin.routes');
const profileRoutes = require('./routes/profile.routes');
const { path } = require('express/lib/application');
const fs = require('fs');

var privateKey = fs.readFileSync(process.env.SSL_CERT_KEY);
var certificate = fs.readFileSync(process.env.SSL_CERTIFICATE);

const options = {
    key: privateKey,
    cert: certificate
};

const app = express()
app.use(express.json());
app.use(cors());

// api routes
app.use('/api', apiRoutes);
app.use('/security', securityRoutes);
app.use('/admin', adminRoutes);
app.use('/profile', profileRoutes);

// #TODO: General error handler + catch all 404

const port = process.env.PORT || 3000
https.createServer(options, app).listen(port, () => {
    console.log(`MDH Search Tool listening at https://localhost:${port}`)
})