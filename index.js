require('dotenv').config();
const express = require('express')
const cors = require('cors');
const apiRoutes = require('./routes/api.routes.js');

const app = express()
app.use(express.json());
app.use(cors());
const port = 3000

// #TODO: Frontend homepage should respond at "/"
app.get('/', (req, res) => {

})

// #TODO: Backend should respond to "/api"
app.use('/api', apiRoutes);

// #TODO: General error handler + catch all 404

app.listen(port, () => {
    console.log(`MDH Search Tool listening at http://localhost:${port}`)
})