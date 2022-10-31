import 'dotenv/config'
import Koa from "koa"
import bodyParser from 'koa-bodyparser'
import helmet from "koa-helmet"
import cors from '@koa/cors'
import compress from 'koa-compress'
import morgan from 'koa-morgan'
import config from './config'
import routing from "./routes"
import { connectDB } from "./config/db"

const app: Koa = new Koa()
const PORT = process.env.PORT || 7000
const envConfig = config[process.env.NODE_ENV || 'development']
const log = app.context.log = envConfig.log()

connectDB()

app
  .use(bodyParser({
    enableTypes: ['json'],
    jsonLimit: '2mb',
    strict: true
  }))
  .use(cors())
  .use(compress())
  .use(helmet())
  .use(morgan('dev'))

routing(app)

app.listen(PORT, () => 
  log.info(`Server is listening on port ${PORT} in ${app.env} mode.`)
)
