import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  console.log('Seeding Database...')

  // 0. Clear existing data
  await prisma.recomendacion.deleteMany()
  await prisma.puntoAtencion.deleteMany()
  await prisma.requisito.deleteMany()
  await prisma.paso.deleteMany()
  await prisma.tramite.deleteMany()
  await prisma.categoria.deleteMany()

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

  const catDocumentacion = await prisma.categoria.create({
    data: { name: 'Documentación', icon: 'FileText' }
  })

  // 2. Create Tramites
  await prisma.tramite.create({
    data: {
      title: 'Renovar Licencia de Conducción',
      description: 'Trámite para renovar la licencia de conducción ante el ministerio de transporte.',
      code: 'TRM-1024',
      isOnline: true,
      categoriaId: catMovilidad.id,
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
      }
    }
  })

  await prisma.tramite.create({
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

  // NEW TRAMITES
  await prisma.tramite.create({
    data: {
      title: 'Inscripción en el RUT',
      description: 'El Registro Único Tributario (RUT) es el mecanismo para identificar y clasificar a los sujetos de obligaciones administradas por la DIAN.',
      code: 'TRM-RUT-01',
      isOnline: true,
      categoriaId: catDocumentacion.id,
      pasos: {
        create: [
          { order: 1, title: 'Definir tipo de persona', description: 'Identificar si es persona natural o jurídica.' },
          { order: 2, title: 'Diligenciar formulario', description: 'Completar el formulario 001 en la página de la DIAN.' },
          { order: 3, title: 'Formalización', description: 'Agendar cita o realizar trámite virtual para la entrega del documento.' }
        ]
      },
      requisitos: {
        create: [
          { title: 'Fotocopia documento de identidad' },
          { title: 'Correo electrónico válido' }
        ]
      }
    }
  })

  await prisma.tramite.create({
    data: {
      title: 'Expedición de Cédula de Ciudadanía',
      description: 'Documento de identidad de los ciudadanos colombianos mayores de 18 años.',
      code: 'TRM-CED-02',
      isOnline: false,
      categoriaId: catDocumentacion.id,
      externalLink: 'https://wsp.registraduria.gov.co/estado_docs/documento/consultar/',
      pasos: {
        create: [
          { order: 1, title: 'Agendar Cita', description: 'Ingresar a la página de la Registraduría y agendar cita en la sede de su preferencia.' },
          { order: 2, title: 'Asistir a la sede', description: 'Acudir a la cita con el comprobante de pago si aplica.' },
          { order: 3, title: 'Seguimiento', description: 'Consultar el estado de su documento en el link proporcionado.' }
        ]
      },
      requisitos: {
        create: [
          { title: 'Cotejo dactilar' },
          { title: 'Fotografías (en algunas sedes)' },
          { title: 'RH o grupo sanguíneo' }
        ]
      },
      puntosAtencion: {
        create: [
          { address: 'Registraduría Valle de Aburrá', schedule: 'L-V 8:00 AM - 4:00 PM', phone: '601-222-0000' }
        ]
      }
    }
  })

  await prisma.tramite.create({
    data: {
      title: 'Expedición de Pasaporte',
      description: 'Documento de viaje que identifica a los colombianos en el exterior.',
      code: 'TRM-PAS-03',
      isOnline: false,
      categoriaId: catDocumentacion.id,
      pasos: {
        create: [
          { order: 1, title: 'Agendar Cita en Gobernación', description: 'Solicitar cita en la Gobernación de Antioquia.' },
          { order: 2, title: 'Primer Pago', description: 'Realizar el primer pago de impuestos departamentales.' },
          { order: 3, title: 'Formalización', description: 'Asistir a la cita para toma de datos biométricos y segundo pago.' }
        ]
      },
      requisitos: {
        create: [
          { title: 'Cédula de ciudadanía original' },
          { title: 'Pasaporte anterior (si tiene)' }
        ]
      },
      puntosAtencion: {
        create: [
          { address: 'Gobernación de Antioquia - Centro Administrativo La Alpujarra', schedule: 'L-V 7:30 AM - 3:30 PM', phone: '604-383-9000' }
        ]
      }
    }
  })

  await prisma.tramite.create({
    data: {
      title: 'Definición de Situación Militar (Libreta)',
      description: 'Trámite para obtener la libreta militar y definir la situación de reserva.',
      code: 'TRM-MIL-04',
      isOnline: false,
      categoriaId: catDocumentacion.id,
      pasos: {
        create: [
          { order: 1, title: 'Registro Web', description: 'Registrarse en el portal de reclutamiento del Ejército.' },
          { order: 2, title: 'Citación', description: 'Asistir a la citación en la brigada o distrito militar correspondiente.' },
          { order: 3, title: 'Pago de cuota de compensación', description: 'Realizar el pago de la libreta si no está exento.' }
        ]
      },
      requisitos: {
        create: [
          { title: 'Cédula de ciudadanía' },
          { title: 'Diploma de bachiller y acta de grado' },
          { title: 'Registro civil de nacimiento' }
        ]
      },
      puntosAtencion: {
        create: [
          { address: 'Brigadas Valle de Aburrá (Cuarta Brigada)', schedule: 'L-V 7:00 AM - 5:00 PM', phone: '604-444-0000' }
        ]
      }
    }
  })

  // 4. Create Empty Category Example
  await prisma.categoria.create({
    data: { name: 'Vivienda', icon: 'Home' }
  })

  console.log('Seeding completed! Created new tramites and categories.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
