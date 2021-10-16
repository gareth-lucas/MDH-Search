require('dotenv').config();
const express = require('express')
const cors = require('cors');
const apiRoutes = require('./routes/api.routes');
const securityRoutes = require('./routes/security.routes');
const adminRoutes = require('./routes/admin.routes');

const app = express()
app.use(express.json());
app.use(cors());

// #TODO: Add administrator routes (create/delete users)

// api routes
app.use('/api', apiRoutes);
app.use('/security', securityRoutes);
app.use('/admin', adminRoutes);

// #TODO: General error handler + catch all 404

const port = process.env.PORT || 3000
app.listen(port, () => {
    console.log(`MDH Search Tool listening at http://localhost:${port}`)
})