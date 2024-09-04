import express from 'express'
import handlebars from 'express-handlebars'
import { Server } from 'socket.io'
import Sockets from './sockets.js'
import mongoose from 'mongoose'
import session from 'express-session'
import MongoStore from 'connect-mongo'
import passport from "passport";
import initializePassport from "./config/passport.config.js";
import config from './config/config.js'
import loggers from './config/winston.config.js'

import swaggerUiExpress from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
export const swaggerOptions = {
    definition: {
        openapi: '3.1.0',
        info: {
            title: 'Ecommerce para Proyecto Final de Coderhouse',
            version: '1.0.0',
        }
    },
    apis: [
        `./docs/**/*.yaml`,
    ],
};
const specs = swaggerJsdoc(swaggerOptions);

import productsRouter from './routers/product.router.js'
import cartsRouter from './routers/cart.router.js'
import viewsRouter from './routers/view.router.js'
import chatRouter from './routers/chat.router.js'
import sessionRouter from './routers/session.router.js'
import sessionViewsRouter from './routers/session.view.router.js'
import errorMiddleware from './middlewares/error.middleware.js'

export const PORT = config.apiserver.port

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/docs', swaggerUiExpress.serve, swaggerUiExpress.setup(specs));

app.use(session({
    store: MongoStore.create({
        mongoUrl: config.mongo.uri,
        dbName: config.mongo.dbname
    }),
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}))

initializePassport()
app.use(passport.initialize())
app.use(passport.session())

app.use(express.static('./src/public'))
app.engine('handlebars', handlebars.engine())
app.set('views', './src/views')
app.set('view engine', 'handlebars')

try {
    await mongoose.connect(config.mongo.uri, {
        dbName: config.mongo.dbname,
        useUnifiedTopology: true
    })
    console.log('DB connected!')
    const server = app.listen(PORT, () => loggers.http('Server Up'))
    const io = new Server(server)
    app.use((req, res, next) => {
        req.io = io
        next()
    })
    
    app.use('/', sessionViewsRouter)
    app.use('/api/products', productsRouter)
    app.use('/api/carts', cartsRouter)
    app.use('/api/sessions', sessionRouter)
    app.use('/products', viewsRouter)
    app.use('/carts', viewsRouter)
    app.use("/chat", chatRouter)
    app.use(errorMiddleware)
    
    Sockets(io)
} catch (err) {
    console.log('Cannot connect to DB :(  ==> ', err.message)
    process.exit(-1)
}

