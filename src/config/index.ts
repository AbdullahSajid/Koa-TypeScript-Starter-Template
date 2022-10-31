import winston from 'winston'

const name = "koa-typescript-starter-template"
const version = "1.0.0"

const getLogger = (serviceName: string, serviceVersion: string, level: string) => {
  return winston.createLogger({
    level: level,
    defaultMeta: { name: `${serviceName}:${serviceVersion}` },
    transports: [
      new winston.transports.Console({ format: winston.format.simple() })
    ]
  })
}

export default {
  development: {
    name,
    version,
    contextRoot: '/api/v1/app',
    log: () => getLogger(name, version, 'debug')
  },
  staging: {
    name: name,
    version: version,
    contextRoot: '/api/v1/app',
    log: () => getLogger(name, version, 'debug')
  },
  production: {
    name: name,
    version: version,
    contextRoot: '/api/v1/app',
    log: () => getLogger(name, version, 'info')
  }
} as any
