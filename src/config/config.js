import dotenv from 'dotenv' 
dotenv.config()

export default {
    apiserver: {
        port: process.env.PORT
    },
    persistence: process.env.PERSISTENCE,
    environment: process.env.ENVIRONMENT,
    nodemailer: {
        user: process.env.MAILER_USER,
        pass: process.env.MAILER_PASS
    },
    mongo: {
        uri: process.env.MONGO_URI,
        dbname: process.env.MONGO_DB_NAME
    }
}