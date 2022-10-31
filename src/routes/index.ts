// routes/index.js
import Koa from 'koa'
import Router from '@koa/router'
import config from '../config'

import Admin from './Admin'

const router = new Router()
const root = config[process.env.NODE_ENV || 'development']['contextRoot']

export default (app: Koa) => {
    router.prefix(root)

    // // api/v1/app/admin
    router.use('/admin', Admin)

    app.use(router.routes())
    app.use(router.allowedMethods())
}
