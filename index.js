require('dotenv').config()
const express = require('express')
require('./db/mongoose')
const userRouter = require('./src/routersst/user')
const taskRouter = require('./src/routers/task')
const app = express()

const port = process.env.PORT

app.use(express.json())
app.use(userRouter)
app.use(taskRouter)

app.listen(port, () => {
    console.log('server is running on port ' + port)
    
})


