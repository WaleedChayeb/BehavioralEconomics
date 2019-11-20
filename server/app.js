const express = require('express')
const bodyParser = require('body-parser')
const excel = require('./controllers/excel')
const app = express()
const morgan = require('morgan')
const cors = require('cors')

app.use(cors())

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json())
app.use(morgan('tiny'))
app.use('/api/excel',excel)

module.exports = app;