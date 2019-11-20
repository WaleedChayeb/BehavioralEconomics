const app = require('./app')
const http = require('http')

const server = http.createServer(app)

const port = process.env.PORT || 3001
server.listen(port,()=>{
    console.log(`server running on port ${port}`)
})

