import connectDB from './db/index.js'
import dotenv from 'dotenv'
import { app } from './app.js'

// dotenv configuration
dotenv.config({
    path: './.env'
})

// execute the connectDB function
connectDB()
.then(() => {
    // if the mongoDB connection is successfull then start the server
    const port = process.env.PORT || 8000
    app.listen(port, () => {
        console.log(`⚙️ Server is running at port: ${port}`)
    })
})
.catch((error) => {
    // report the connection failed error
    console.log(`Mongodb failed to connect !!!`,error)
})



