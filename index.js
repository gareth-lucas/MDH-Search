require('dotenv').config();
const express = require('express')
const cors = require('cors');
const apiRoutes = require('./routes/api.routes.js');

const app = express()
app.use(express.json());
app.use(cors());
const port = 3000


app.get('/', (req, res) => {
    res.send("Hello World");
})

app.use('/api', apiRoutes);

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})