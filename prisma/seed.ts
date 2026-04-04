import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  console.log('Seeding Database...')

  // 1. Create Categorias
  const catMovilidad = await prisma.categoria.create({
    data: { name: 'Movilidad', icon: 'Car' }
  })
  
  const catEducacion = await prisma.categoria.create({
    data: { name: 'Educación', icon: 'GraduationCap' }
  })
  
  const catSalud = await prisma.categoria.create({
    data: { name: 'Salud', icon: 'HeartPulse' }
  })

  // 2. Create Tramite (Online)
  const t1 = await prisma.tramite.create({
    data: {
      title: 'Renovar Licencia de Conducción',
      description: 'Trámite para renovar la licencia de conducción ante el ministerio de transporte.',
      code: 'TRM-1024',
      isOnline: true,
      categoriaId: catMovilidad.id,
      targetAgeRange: null,
      pasos: {
        create: [
          { order: 1, title: 'Inscripción RUNT', description: 'Realizar inscripción virtual en la plataforma RUNT.' },
          { order: 2, title: 'Examen Médico', description: 'Aprobar examen médico en un centro autorizado.' },
          { order: 3, title: 'Pago de Derechos', description: 'Llevar a cabo el pago a través de PSE.' }
        ]
      },
      requisitos: {
        create: [
          { title: 'Fotocopia Cédula al 150%' },
          { title: 'Paz y salvo de multas (SIMIT)' }
        ]
      },
      recomendaciones: {
        create: [
          { text: 'Asegúrate de no tener multas pendientes.', targetAgeRange: null },
          { text: 'Tip personalizado: Por tu edad, el examen visual es de especial cuidado.', targetAgeRange: '60+' }
        ]
      }
    }
  })

  // 3. Create Tramite (Presencial)
  const t2 = await prisma.tramite.create({
    data: {
      title: 'Solicitud Copia Historia Clínica',
      description: 'Solicitud formal para obtener la historia clínica de un paciente.',
      code: 'TRM-2055',
      isOnline: false,
      categoriaId: catSalud.id,
      puntosAtencion: {
        create: [
          { address: 'Av Salud #12-34 Bloque A', schedule: 'L-V 8:00 AM - 4:00 PM', phone: '601-555-0101' },
          { address: 'Calle Principal #4-20', schedule: 'L-V 7:00 AM - 2:00 PM', phone: '601-555-0202' }
        ]
      },
      requisitos: {
        create: [
          { title: 'Formato de solicitud diligenciado' },
          { title: 'Documento original de identidad' }
        ]
      }
    }
  })

  // 4. Create Empty Category Example
  const catVivienda = await prisma.categoria.create({
    data: { name: 'Vivienda', icon: 'Home' }
  })

  console.log('Seeding completed! Created mock tramites TRM-1024 and TRM-2055')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
