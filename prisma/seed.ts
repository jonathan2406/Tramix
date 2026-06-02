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
      description: 'Renueva la vigencia de tu licencia de conducción validando RUNT, SIMIT y examen de aptitud en CRC. Requiere gestión presencial ante organismo de tránsito.',
      code: 'TRM-1024',
      isOnline: false,
      estimatedTime: 'Hasta 24 horas después de documentación aceptada',
      estimatedCost: 'Variable según ciudad + examen CRC',
      targetAgeRange: null, // Sin restricción: disponible para todos los rangos de edad
      categoriaId: catMovilidad.id,
      pasos: {
        create: [
          { order: 1, title: 'Validar estado en RUNT y SIMIT', description: 'Consulta registro de licencia, fecha de vencimiento y comparendos/multas pendientes.' },
          { order: 2, title: 'Realizar examen en CRC autorizado', description: 'Presenta examen físico, mental y de coordinación motriz en un Centro de Reconocimiento de Conductores.' },
          { order: 3, title: 'Pagar examen CRC', description: 'Cancela los derechos del examen según tarifas del centro y ciudad.' },
          { order: 4, title: 'Ir al organismo de tránsito', description: 'Presenta documento original, valida examen cargado en sistema y realiza solicitud de renovación.' },
          { order: 5, title: 'Pagar derechos de tránsito y reclamar', description: 'Completa pago de derechos territoriales y recibe licencia renovada o constancia local.' }
        ]
      },
      requisitos: {
        create: [
          { title: 'Licencia registrada en RUNT y vigente para renovación' },
          { title: 'Documento de identidad original (cédula o cédula de extranjería)' },
          { title: 'Paz y salvo por multas e infracciones (SIMIT)' },
          { title: 'Certificado de aptitud en CRC vigente' },
          { title: 'Denuncia o constancia si la licencia fue perdida (cuando aplique)' }
        ]
      },
      recomendaciones: {
        create: [
          { text: 'No conduzcas con licencia vencida: puede generar comparendo e inmovilización.' },
          { text: 'Si tienes multas pendientes o no existe examen CRC vigente, el trámite puede bloquearse.' },
        ]
      }
    }
  })

  await prisma.tramite.create({
    data: {
      title: 'Solicitud Copia Historia Clínica',
      description: 'Solicita copia de historia clínica ante la IPS, clínica u hospital que prestó la atención. Es un documento reservado y solo se entrega a autorizados.',
      code: 'TRM-2055',
      isOnline: false,
      estimatedTime: 'Máximo 5 días calendario',
      estimatedCost: 'Digital autorizada: gratis; impresa: puede tener costo de reproducción',
      targetAgeRange: null, // Sin restricción: cualquier edad puede solicitar su historia clínica
      categoriaId: catSalud.id,
      puntosAtencion: {
        create: [
          { address: 'Ventanilla de atención de la IPS/hospital donde recibiste el servicio', city: 'Medellín', schedule: 'Según horario de cada prestador', phone: 'Línea de atención de la IPS' },
          { address: 'Canal web o correo institucional de solicitudes de historia clínica', city: 'Medellín', schedule: 'Disponible según plataforma del prestador', phone: 'Canal virtual del prestador' }
        ]
      },
      pasos: {
        create: [
          { order: 1, title: 'Identificar el prestador correcto', description: 'Ubica la IPS, clínica u hospital que custodia la historia clínica de la atención.' },
          { order: 2, title: 'Completar solicitud', description: 'Diligencia formato por web, correo o ventanilla de atención del prestador.' },
          { order: 3, title: 'Adjuntar soportes', description: 'Incluye documento del paciente y autorización/documentos extra si solicita un tercero.' },
          { order: 4, title: 'Definir alcance de la copia', description: 'Indica periodo o tipo de documento: historia completa, epicrisis, laboratorio, imágenes, etc.' },
          { order: 5, title: 'Autorizar canal de entrega', description: 'Si autorizas entrega digital por correo, el envío electrónico debe ser gratuito.' }
        ]
      },
      requisitos: {
        create: [
          { title: 'Formato de solicitud diligenciado del prestador' },
          { title: 'Documento de identidad del paciente' },
          { title: 'Autorización firmada y documentos del autorizado (si aplica tercero)' },
          { title: 'Soportes especiales para menor, fallecido, incapacitado u orden judicial' }
        ]
      },
      recomendaciones: {
        create: [
          { text: 'La historia clínica es reservada: protege datos sensibles y comparte solo con autorización válida.' },
          { text: 'Para recibirla digital, autoriza explícitamente el envío por correo electrónico.' },
        ]
      }
    }
  })

  // NEW TRAMITES
  await prisma.tramite.create({
    data: {
      title: 'Inscripción en el RUT',
      description: 'Inscríbete en el RUT ante la DIAN para identificar obligaciones tributarias. Para persona natural con cédula colombiana, la ruta puede ser 100% en línea y gratuita.',
      code: 'TRM-RUT-01',
      externalLink: 'https://muisca.dian.gov.co/WebRutVirtualInscripcion/#/proceso-guiado/tipoPersona',
      isOnline: true,
      estimatedTime: 'Mismo día si validaciones son exitosas',
      estimatedCost: 'Gratuito',
      targetAgeRange: '18-25', // Mínimo 18 años para registro independiente ante la DIAN
      categoriaId: catDocumentacion.id,
      pasos: {
        create: [
          { order: 1, title: 'Ingresar a DIAN - RUT inscripción virtual', description: 'Accede al portal DIAN y selecciona opción de inscripción para persona natural.' },
          { order: 2, title: 'Validar identidad y datos', description: 'Ingresa número de cédula, acepta tratamiento de datos y verifica correo electrónico.' },
          { order: 3, title: 'Adjuntar soporte si el sistema lo solicita', description: 'Carga imagen nítida del documento de identidad (físico o digital).' },
          { order: 4, title: 'Diligenciar formulario completo', description: 'Registra ubicación, contacto, actividad económica y responsabilidades tributarias.' },
          { order: 5, title: 'Finalizar y descargar RUT', description: 'Revisa información, formaliza inscripción y descarga el documento RUT en PDF.' }
        ]
      },
      requisitos: {
        create: [
          { title: 'Cédula de ciudadanía colombiana vigente' },
          { title: 'Correo electrónico activo para validación' },
          { title: 'No estar previamente inscrito en el RUT' },
          { title: 'Acceso a internet para trámite virtual' }
        ]
      },
      recomendaciones: {
        create: [
          { text: 'Si eres menor, extranjero, apoderado o requieres registro mercantil, usa ruta especial o atención asistida.' },
          { text: 'Revisa muy bien dirección, teléfono y correo antes de finalizar para evitar inconsistencias.' },
        ]
      }
    }
  })

  await prisma.tramite.create({
    data: {
      title: 'Expedición de Cédula de Ciudadanía',
      description: 'Expedición de cédula de ciudadanía para mayores de 18 años ante Registraduría. La captura biométrica es presencial.',
      code: 'TRM-CED-02',
      isOnline: false,
      estimatedTime: 'Según sede y disponibilidad de producción',
      estimatedCost: 'Primera vez y renovación: gratuito',
      targetAgeRange: '18-25', // Exclusivo para mayores de 18 años
      categoriaId: catDocumentacion.id,
      externalLink: 'https://wsp.registraduria.gov.co/estado_docs/documento/consultar/',
      pasos: {
        create: [
          { order: 1, title: 'Confirmar mayoría de edad', description: 'Valida que ya cumpliste 18 años para iniciar la ruta de cédula.' },
          { order: 2, title: 'Agendar o acudir a Registraduría', description: 'Gestiona cita si la sede lo exige o acércate a registraduría auxiliar/especial/municipal.' },
          { order: 3, title: 'Presentar documentos base', description: 'Entrega copia auténtica del registro civil o tarjeta de identidad original.' },
          { order: 4, title: 'Captura de datos biométricos', description: 'Registra fotografía, huellas, firma y datos biográficos (incluye RH y grupo sanguíneo).' },
          { order: 5, title: 'Recibir contraseña y reclamar cédula', description: 'Conserva el comprobante de trámite y consulta disponibilidad para entrega personal.' }
        ]
      },
      requisitos: {
        create: [
          { title: 'Tener 18 años cumplidos' },
          { title: 'Registro civil auténtico o tarjeta de identidad original' },
          { title: 'Conocer RH y grupo sanguíneo' },
          { title: 'Fotos 4x5 fondo blanco (solo en sedes que lo exijan)' }
        ]
      },
      puntosAtencion: {
        create: [
          { address: 'Registraduría Valle de Aburrá', schedule: 'L-V 8:00 AM - 4:00 PM', phone: '601-222-0000' }
        ]
      },
      recomendaciones: {
        create: [
          { text: 'Si tienes menos de 18 años, la ruta correcta es tarjeta de identidad.' },
          { text: 'Duplicado, rectificación o actualización siguen una ruta diferente.' },
        ]
      }
    }
  })

  await prisma.tramite.create({
    data: {
      title: 'Expedición de Pasaporte',
      description: 'Expedición de pasaporte colombiano ante Cancillería, gobernación autorizada o consulado. Requiere atención presencial para biometría y entrega.',
      code: 'TRM-PAS-03',
      isOnline: false,
      estimatedTime: 'Bogotá 24h hábiles; gobernaciones 48h hábiles; consulados hasta 8 días hábiles',
      estimatedCost: 'Ordinario $116.600 + impuesto; Ejecutivo $256.400 + impuesto; Emergencia $201.700',
      targetAgeRange: null, // Sin restricción: cualquier edad puede tramitar pasaporte
      categoriaId: catDocumentacion.id,
      pasos: {
        create: [
          { order: 1, title: 'Diligenciar solicitud previa', description: 'Completa formulario en línea cuando aplique para agilizar la atención.' },
          { order: 2, title: 'Asistir a oficina habilitada', description: 'Acude personalmente a sede de pasaportes, gobernación o consulado autorizado.' },
          { order: 3, title: 'Presentar documentos', description: 'Entrega cédula vigente; para menores, registro civil y acompañamiento de representante legal.' },
          { order: 4, title: 'Tomar biometría y realizar pago', description: 'Se captura foto, huellas y firma; luego se pagan derechos e impuestos aplicables.' },
          { order: 5, title: 'Reclamar pasaporte', description: 'La entrega es personal: mayor de edad con documento válido, menor con su representante.' }
        ]
      },
      requisitos: {
        create: [
          { title: 'Cédula de ciudadanía original' },
          { title: 'Pasaporte anterior (si aplica)' },
          { title: 'Para menor: registro civil y tarjeta de identidad (si aplica edad)' },
          { title: 'Reportar pérdida/hurto del pasaporte anterior bajo gravedad de juramento (si aplica)' }
        ]
      },
      puntosAtencion: {
        create: [
          { address: 'Gobernación de Antioquia - Centro Administrativo La Alpujarra', schedule: 'L-V 7:30 AM - 3:30 PM', phone: '604-383-9000' }
        ]
      },
      recomendaciones: {
        create: [
          { text: 'No uses intermediarios: verifica siempre canales oficiales de Cancillería o gobernación.' },
          { text: 'El costo final cambia por impuestos departamentales según la ciudad de trámite.' },
        ]
      }
    }
  })

  await prisma.tramite.create({
    data: {
      title: 'Definición de Situación Militar (Libreta)',
      description: 'Define situación militar ante el Comando de Reclutamiento del Ejército. La ruta inicia en línea y puede incluir citaciones presenciales.',
      code: 'TRM-MIL-04',
      externalLink: 'https://www.libretamilitar.mil.co/modules/consult/militarysituation',
      isOnline: true,
      estimatedTime: 'Variable según validación del distrito militar',
      estimatedCost: 'Puede aplicar cuota de compensación militar',
      targetAgeRange: '18-25', // Aplica a partir de los 18 años
      categoriaId: catDocumentacion.id,
      pasos: {
        create: [
          { order: 1, title: 'Consultar estado inicial', description: 'Revisa en portal de libreta militar si ya tienes situación definida.' },
          { order: 2, title: 'Crear y activar cuenta', description: 'Si no estás registrado, crea usuario con correo personal y activa la cuenta.' },
          { order: 3, title: 'Completar inscripción', description: 'Diligencia información personal, académica, laboral y familiar.' },
          { order: 4, title: 'Cargar documentos', description: 'Adjunta foto, documento del ciudadano, documentos de padres y soportes de exención si aplica.' },
          { order: 5, title: 'Atender citaciones del distrito', description: 'Asiste a validaciones, exámenes psicofísicos y pasos definidos por autoridad militar.' },
          { order: 6, title: 'Liquidar y generar certificado', description: 'Si aplica, paga cuota de compensación y descarga certificado/libreta digital.' }
        ]
      },
      requisitos: {
        create: [
          { title: 'Cédula de ciudadanía' },
          { title: 'Registro civil de nacimiento' },
          { title: 'Documento de identidad de los padres' },
          { title: 'Soportes académicos y laborales' },
          { title: 'Soportes de exención o aplazamiento (si aplica)' },
          { title: 'Fotografía tipo documento en fondo azul' }
        ]
      },
      puntosAtencion: {
        create: [
          { address: 'Brigadas Valle de Aburrá (Cuarta Brigada)', schedule: 'L-V 7:00 AM - 5:00 PM', phone: '604-444-0000' }
        ]
      },
      recomendaciones: {
        create: [
          { text: 'No hay aprobación automática: el distrito militar valida cada caso.' },
          { text: 'Valida condiciones especiales: estudiante, exención, discapacidad, víctima, exterior o estado de remiso.' },
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
