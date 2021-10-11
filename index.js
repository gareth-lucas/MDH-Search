require('dotenv').config();
const express = require('express')
const cors = require('cors');
const apiRoutes = require('./routes/api.routes.js');

const app = express()
app.use(express.json());
app.use(cors());

// #TODO: Add login routes for login, reset password, change password

// #TODO: Add administrator routes (create/delete users)

// api routes
app.use('/api', apiRoutes);

// #TODO: General error handler + catch all 404

const port = process.env.PORT || 3000
app.listen(port, () => {
    console.log(`MDH Search Tool listening at http://localhost:${port}`)
})