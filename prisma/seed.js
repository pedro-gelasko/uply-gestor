require('dotenv').config()
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const clientsData = [
  { name: 'Voa Fibra',       responsibleName: 'Ricardo Oliveira', email: 'marketing@voafibra.com.br',    phone: '(11) 99001-0001' },
  { name: 'Connect Internet',responsibleName: 'Ana Souza',        email: 'ana@connectinternet.com.br',   phone: '(19) 99001-0002' },
  { name: 'UltraNet Telecom',responsibleName: 'Marcos Ferreira',  email: 'marcos@ultranet.com.br',       phone: '(16) 99001-0003' },
  { name: 'Speed Max',       responsibleName: 'Carla Mendes',     email: 'carla@speedmax.net.br',        phone: '(13) 99001-0004' },
  { name: 'Brasil Fibra',    responsibleName: 'Felipe Costa',     email: 'felipe@brasilfibra.com.br',    phone: '(14) 99001-0005' },
  { name: 'NetLink',         responsibleName: 'Juliana Rocha',    email: 'juliana@netlink.com.br',       phone: '(15) 99001-0006' },
]

const eventTemplates = [
  { title: 'Criativo Promoção 600MB',    description: 'Arte criativa para divulgação do plano de 600MB.',                         category: 'CREATIVE',     status: 'PUBLISHED',        day: 3  },
  { title: 'Story Velocidade Máxima',    description: 'Story animado destacando a velocidade máxima dos planos.',                  category: 'STORY',        status: 'PLANNED',          day: 5  },
  { title: 'Vídeo Institucional',        description: 'Vídeo institucional apresentando a empresa e seus valores.',                category: 'INSTITUTIONAL',status: 'IN_PRODUCTION',    day: 10 },
  { title: 'Reels Plano Gamer',          description: 'Reels dinâmico focado no público gamer com baixo ping.',                    category: 'REELS',        status: 'PLANNED',          day: 12 },
  { title: 'Vídeo Promocional 600MB',    description: 'Publicação de vídeo promocional destacando plano de 600MB.',               category: 'VIDEO',        status: 'PLANNED',          day: 15 },
  { title: 'Story Depoimento Cliente',   description: 'Story com depoimento real de cliente satisfeito.',                         category: 'STORY',        status: 'PLANNED',          day: 19 },
  { title: 'Campanha Feriado',           description: 'Campanha especial com oferta relâmpago e instalação gratuita.',            category: 'CAMPAIGN',     status: 'PLANNED',          day: 25 },
  { title: 'Vídeo Black Friday Fibra',   description: 'Produção antecipada do vídeo Black Friday com ofertas exclusivas.',        category: 'VIDEO',        status: 'PLANNED',          day: 28 },
  { title: 'Criativo Streaming 4K',      description: 'Arte mostrando qualidade de streaming 4K sem buffering.',                  category: 'CREATIVE',     status: 'WAITING_APPROVAL', day: 22 },
  { title: 'Story Lançamento Plano 1GB', description: 'Story de lançamento do novo plano de 1GB com oferta para primeiros.',      category: 'STORY',        status: 'PLANNED',          day: 30 },
]

async function main() {
  console.log('Iniciando seed...')

  await prisma.history.deleteMany()
  await prisma.attachment.deleteMany()
  await prisma.event.deleteMany()
  await prisma.calendar.deleteMany()
  await prisma.share.deleteMany()
  await prisma.client.deleteMany()

  for (const clientData of clientsData) {
    const client = await prisma.client.create({ data: clientData })
    console.log(`  Cliente criado: ${client.name}`)

    const calendar = await prisma.calendar.create({
      data: {
        clientId: client.id,
        name:     `Calendário Junho 2026 — ${client.name}`,
        month:    6,
        year:     2026,
        status:   'ACTIVE',
      },
    })

    for (const tpl of eventTemplates) {
      await prisma.event.create({
        data: {
          calendarId:  calendar.id,
          title:       tpl.title,
          description: tpl.description,
          category:    tpl.category,
          status:      tpl.status,
          eventDate:   new Date(`2026-06-${String(tpl.day).padStart(2, '0')}T09:00:00.000Z`),
          eventTime:   '09:00',
        },
      })
    }

    await prisma.share.create({
      data: { clientId: client.id, active: true },
    })

    await prisma.history.create({
      data: {
        entityType:  'CLIENT',
        entityId:    String(client.id),
        action:      'SEED',
        description: `Cliente "${client.name}" criado via seed`,
      },
    })

    console.log(`    ✓ 1 calendário + ${eventTemplates.length} eventos criados`)
  }

  console.log('\nSeed concluído com sucesso!')
  console.log(`  ${clientsData.length} clientes`)
  console.log(`  ${clientsData.length} calendários`)
  console.log(`  ${clientsData.length * eventTemplates.length} eventos`)
  console.log(`  ${clientsData.length} links de compartilhamento`)
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
