import { construirApp } from './app'

const PORT = Number(process.env.PORT ?? 3001)
const app = construirApp()

app
  .listen({ port: PORT, host: '0.0.0.0' })
  .then(() => {
    console.log(`✅ trajetorias2-api rodando na porta ${PORT}`)
    console.log(`   NODE_ENV: ${process.env.NODE_ENV ?? 'development'}`)
    console.log(`   DEMO_MODE: ${process.env.DEMO_MODE ?? 'false'}`)
  })
  .catch((err) => {
    app.log.error(err)
    process.exit(1)
  })
