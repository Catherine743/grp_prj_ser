// import dotenv cors express
// loads .env file contents into process.env

require('dotenv').config()
const express = require('express')
const cors = require('cors')
const router = require('./Routes/router')
require('./Connection/db')

// create a server using express
const pipelineTracker = express()

// enable cors in server
pipelineTracker.use(cors())

// parse json on server
pipelineTracker.use(express.json())

// use router in server app
pipelineTracker.use(router)

// handle image from server
pipelineTracker.use('/uploads', express.static('./uploads'))

// // create port for server to available on web
// const PORT = 4000

// pipelineTracker.listen(PORT, () => {
//     console.log(`PipelineTracker started running at PORT: ${PORT}... and waiting for client request`);

// })

pipelineTracker.get('/', (req, res) => {
    res.status(200).send('<h1 style=color:blue>PipelineTracker started running successfully.....</h1>')
})