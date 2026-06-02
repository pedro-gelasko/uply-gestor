const app    = require('./app')
const logger = require('./utils/logger')
const prisma = require('./database/prisma')
const { port } = require('./config/env')

async function bootstrap() {
  try {
    await prisma.$connect()
    logger.info('Conexão com banco de dados estabelecida')

    app.listen(port, () => {
      logger.info(`SABORR CRM API rodando na porta ${port}`)
      logger.info(`Health: http://localhost:${port}/health`)
      logger.info(`API: http://localhost:${port}/api/v1`)
    })
  } catch (err) {
    logger.error('Falha ao iniciar o servidor', err)
    process.exit(1)
  }
}

process.on('SIGINT',  async () => { await prisma.$disconnect(); process.exit(0) })
process.on('SIGTERM', async () => { await prisma.$disconnect(); process.exit(0) })

bootstrap()
