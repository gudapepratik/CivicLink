import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import {ApiError} from './utils/ApiError.js'
// socket.io trials
import {Server} from 'socket.io'
import {createServer} from 'node:http'

const app = express()
// socketio trials
// const server = createServer(app)
// const io = new Server(server, {
//     cors: {
//         origin: "*",
//     }
// })
// io.on('connection', (socket) => {
//     console.log("new client connected!!",socket.id)

//     socket.on("disconnect", () => {
//         console.log("Client disconnected:", socket.id);
//     });
// })
// socketio trails

// just temporary
app.use(cors({
    origin: (origin, callback) => {
        if (!origin || origin === 'http://localhost:5173' || origin  === "https://civiclink.vercel.app") {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));

app.use(cookieParser())

app.use(express.json({
    limit: "16kb"
}))

app.use(express.urlencoded({
    extended: true,
    limit: "16kb"
}))

app.use(express.static("public"))

// // user router
import userRouter from './routes/user.routes.js'
app.use('/api/v1/users',userRouter)

// post router
import postRouter from './routes/post.routes.js'
app.use('/api/v1/posts',postRouter)

//  upvote router
import upvoteRouter from './routes/upvote.routes.js'
app.use('/api/v1/upvote',upvoteRouter)

// department router
import departmentRouter from './routes/department.routes.js'
app.use('/api/v1/department',departmentRouter)

// // order router
// import orderRouter from './routes/order.routes.js'
// app.use('/api/v1/order',orderRouter)

// commnet router
import commentRouter from './routes/comment.routes.js'
app.use('/api/v1/comment',commentRouter)

app.use((err, req, res, next) => {
    if (err instanceof ApiError) {
        const { statusCode, message, errors} = err;

        res.status(statusCode).json({
            success: false,
            message,
            errors,
            stack: undefined,
        });
    } else {
        const { statusCode, message, errors} = err;
        console.log(err, "asfasagaga")
        res.status(500).json({
            success: false,
            errors,
            message
        });
    }
});

export {app}