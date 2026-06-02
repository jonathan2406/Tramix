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

  const catVivienda = await prisma.categoria.create({
    data: { name: 'Vivienda', icon: 'Home' }
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

  await prisma.tramite.create({
    data: {
      title: 'Fondo Sapiencia Pregrados',
      description: 'Accede a un crédito condonable de Sapiencia para estudios de pregrado en técnica profesional, tecnología o carrera profesional. La inscripción es virtual y la legalización depende de convocatoria, puntaje, presupuesto y revisión documental.',
      code: 'TRM-EDU-01',
      externalLink: 'https://sapiencia.gov.co/fondos-sapiencia/',
      isOnline: true,
      estimatedTime: 'Según calendario de convocatoria y legalización',
      estimatedCost: 'Inscripción gratuita; crédito condonable según línea',
      targetAgeRange: null,
      categoriaId: catEducacion.id,
      pasos: {
        create: [
          { order: 1, title: 'Revisar convocatoria abierta', description: 'Consulta en Sapiencia si hay convocatoria vigente para pregrado, posgrado u otros fondos.' },
          { order: 2, title: 'Confirmar condiciones de postulación', description: 'Valida residencia o nacimiento en Medellín, estado académico, Saber 11, admisión y oferta permitida.' },
          { order: 3, title: 'Diligenciar formulario de inscripción', description: 'Ingresa datos del aspirante, deudor solidario, Sisbén, Saber 11, programa académico y valor de matrícula cuando aplique.' },
          { order: 4, title: 'Esperar preselección por puntaje', description: 'Sapiencia asigna puntaje y define preselección según presupuesto y punto de corte por comuna o corregimiento.' },
          { order: 5, title: 'Cargar documentos de legalización', description: 'Si eres preseleccionado, carga documentos de identidad, residencia, Sisbén, bachillerato, Saber 11 y soportes diferenciales.' },
          { order: 6, title: 'Atender revisión y descargar autorización', description: 'Un asesor valida documentos; si aprueba, descarga carta de autorización de desembolso para la institución.' },
          { order: 7, title: 'Renovar cada semestre', description: 'Presenta certificado académico, promedio mínimo requerido, liquidación de matrícula e historial académico.' }
        ]
      },
      requisitos: {
        create: [
          { title: 'Nacer en Medellín o demostrar residencia en el Distrito durante los tres años anteriores a la convocatoria' },
          { title: 'Ser bachiller o estudiante de grado 11 próximo a graduarse' },
          { title: 'Haber presentado Saber 11 o equivalente' },
          { title: 'Estar admitido, estudiando o en proceso de admisión en una IES privada habilitada del Valle de Aburrá' },
          { title: 'No tener título universitario, salvo continuidad por ciclos propedéuticos u homologación' },
          { title: 'No recibir otro apoyo público del Distrito para el mismo rubro' }
        ]
      },
      recomendaciones: {
        create: [
          { text: 'La inscripción no garantiza el crédito: hay preselección, legalización, presupuesto disponible y revisión documental.' },
          { text: 'Revisa si aplicas por Fondo EPM, Presupuesto Participativo o Matrícula Cero, porque los requisitos y la condonación cambian.' },
          { text: 'La condonación puede exigir servicio social y certificación de terminación de estudios.' }
        ]
      }
    }
  })

  await prisma.tramite.create({
    data: {
      title: 'Fondo condonable para Población Víctima del Conflicto Armado',
      description: 'Postúlate a un fondo externo 100% condonable administrado por ICETEX y dirigido a población víctima reconocida. No es una beca universal: aplica solo para quienes cumplen la condición específica del fondo.',
      code: 'TRM-EDU-02',
      externalLink: 'https://web.icetex.gov.co/portal',
      isOnline: true,
      estimatedTime: 'Según fechas de convocatoria y validación documental',
      estimatedCost: 'Postulación gratuita; financiación condonable si cumple condiciones',
      targetAgeRange: null,
      categoriaId: catEducacion.id,
      pasos: {
        create: [
          { order: 1, title: 'Verificar población objetivo', description: 'Confirma si estás en el RUV o tienes reconocimiento legal equivalente como víctima.' },
          { order: 2, title: 'Consultar convocatoria en ICETEX', description: 'Revisa fechas de apertura, cierre y cargue documental antes de iniciar.' },
          { order: 3, title: 'Diligenciar formulario de solicitud', description: 'Ingresa al micrositio del fondo en ICETEX y completa la postulación virtual.' },
          { order: 4, title: 'Cargar documentos exigidos', description: 'Adjunta identidad, admisión o matrícula, Saber 11, diploma o acta de bachiller, certificación de víctima y aceptación del reglamento.' },
          { order: 5, title: 'Esperar validación y resultados', description: 'ICETEX y las entidades responsables revisan documentos y publican resultados según convocatoria.' },
          { order: 6, title: 'Cumplir condiciones del fondo', description: 'Si eres seleccionado, conserva requisitos académicos y administrativos durante el programa.' },
          { order: 7, title: 'Solicitar condonación', description: 'Para condonar, debes graduarte, cumplir acompañamiento definido y solicitar formalmente la condonación.' }
        ]
      },
      requisitos: {
        create: [
          { title: 'Ser colombiano' },
          { title: 'Ser bachiller y haber presentado Saber 11' },
          { title: 'Estar admitido o matriculado en una institución de educación superior reconocida por el Ministerio de Educación' },
          { title: 'Pertenecer al Registro Único de Víctimas o tener reconocimiento legal equivalente' },
          { title: 'Tener correo electrónico propio' },
          { title: 'No poseer título universitario' },
          { title: 'No recibir otro apoyo económico para el mismo rubro administrado por ICETEX o entidades nacionales' }
        ]
      },
      recomendaciones: {
        create: [
          { text: 'Este fondo tiene población objetivo específica; si no cumples la condición de víctima reconocida, no debes iniciar esta ruta.' },
          { text: 'No cubre inscripciones, habilitaciones, certificados, derechos de grado, materiales, cursos de idiomas ni seminarios.' },
          { text: 'Lee el reglamento operativo antes de aceptar la postulación.' }
        ]
      }
    }
  })

  await prisma.tramite.create({
    data: {
      title: 'Crédito Educativo ICETEX',
      description: 'Solicita un crédito educativo para pregrado ante ICETEX. Es financiación reembolsable: algunas líneas o fondos pueden ser condonables, pero el crédito ordinario implica obligación de pago.',
      code: 'TRM-EDU-03',
      externalLink: 'https://web.icetex.gov.co/portal',
      isOnline: true,
      estimatedTime: 'Según calendario de convocatoria, aprobación y legalización',
      estimatedCost: 'Trámite gratuito; crédito sujeto a condiciones financieras',
      targetAgeRange: null,
      categoriaId: catEducacion.id,
      pasos: {
        create: [
          { order: 1, title: 'Revisar calendario vigente', description: 'Consulta las fechas de solicitud de crédito de pregrado en ICETEX.' },
          { order: 2, title: 'Escoger plan de financiación', description: 'Compara alternativas como Plan Flexible, Equilibrio, Ágil o ETDH según disponibilidad de la convocatoria.' },
          { order: 3, title: 'Simular el crédito', description: 'Calcula monto, cuota, plazo y revisa si necesitas deudor solidario.' },
          { order: 4, title: 'Diligenciar solicitud virtual', description: 'Completa el formulario oficial de ICETEX sin intermediarios.' },
          { order: 5, title: 'Registrar deudor solidario si aplica', description: 'El deudor debe cumplir condiciones de domicilio, edad, capacidad legal, historial y capacidad de pago.' },
          { order: 6, title: 'Cargar documentos y esperar verificación', description: 'Si el crédito es aprobado sujeto a verificación, carga documentos para revisión de la IES e ICETEX.' },
          { order: 7, title: 'Firmar garantías y legalizar', description: 'Firma pagaré y carta de instrucciones dentro del plazo definido.' },
          { order: 8, title: 'Recibir desembolso', description: 'ICETEX gira el dinero a la institución o al beneficiario según el rubro aprobado.' }
        ]
      },
      requisitos: {
        create: [
          { title: 'Ser colombiano' },
          { title: 'Estar admitido en programa técnico profesional, tecnológico o universitario en una IES registrada en SNIES' },
          { title: 'Cumplir puntaje Saber 11 exigido si ingresa a primer semestre' },
          { title: 'Completar formulario de solicitud en ICETEX' },
          { title: 'Aportar deudor solidario si la línea lo exige' },
          { title: 'Cargar documentos de legalización dentro del plazo definido' }
        ]
      },
      recomendaciones: {
        create: [
          { text: 'Diferencia crédito ICETEX de fondo condonable: el crédito ordinario se paga.' },
          { text: 'El formulario puede cerrar antes por agotamiento de recursos.' },
          { text: 'Si no legalizas dentro del plazo, el crédito aprobado puede anularse.' },
          { text: 'Los trámites de ICETEX son gratuitos y no requieren intermediarios.' }
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

  await prisma.tramite.create({
    data: {
      title: 'Subsidio ISVIMED Compra tu Casa',
      description: 'Postúlate al subsidio distrital de vivienda nueva en Medellín para cierre financiero de proyectos VIP o VIS. La inscripción depende de convocatoria, validación de requisitos y disponibilidad presupuestal.',
      code: 'TRM-VIV-01',
      externalLink: 'https://isvimed.gov.co/',
      isOnline: false,
      estimatedTime: 'Según convocatoria, validación y disponibilidad presupuestal',
      estimatedCost: 'Postulación gratuita; subsidio entre 13 y 15 millones según asignación',
      targetAgeRange: '18-25',
      categoriaId: catVivienda.id,
      pasos: {
        create: [
          { order: 1, title: 'Identificar proyecto VIS o VIP', description: 'Busca un proyecto de vivienda nueva en Medellín que esté habilitado o sea viable para el subsidio.' },
          { order: 2, title: 'Vincularse al proyecto', description: 'Formaliza vinculación con constructora, fiduciaria o desarrollador para soportar vivienda, torre, apartamento, plan de pagos y cierre financiero.' },
          { order: 3, title: 'Reunir documentos del hogar', description: 'Prepara cédulas, registros civiles, certificado de vinculación, ingresos, residencia, Sisbén IV y soportes de ahorro o crédito preaprobado.' },
          { order: 4, title: 'Realizar inscripción', description: 'El hogar o la constructora realiza la inscripción en ISVIMED cuando la convocatoria esté abierta.' },
          { order: 5, title: 'Esperar validación de requisitos', description: 'ISVIMED cruza información, revisa documentos y verifica la viabilidad técnica del proyecto.' },
          { order: 6, title: 'Recibir asignación si aplica', description: 'Si el hogar cumple requisitos y hay presupuesto, se asigna el subsidio.' },
          { order: 7, title: 'Aplicar subsidio al cierre financiero', description: 'El subsidio se gira directamente al proyecto de vivienda, no al hogar.' }
        ]
      },
      requisitos: {
        create: [
          { title: 'Titular mayor de edad' },
          { title: 'Ingresos del hogar hasta 4 SMLMV' },
          { title: 'Residencia en Medellín mínimo seis años de forma ininterrumpida' },
          { title: 'No tener vivienda en Colombia' },
          { title: 'Estar vinculado a proyecto VIP o VIS nuevo en Medellín con escrituración máximo diciembre de 2028' },
          { title: 'No haber aplicado antes un subsidio de vivienda' },
          { title: 'Sisbén IV de integrantes del hogar con encuesta de Medellín' }
        ]
      },
      recomendaciones: {
        create: [
          { text: 'No te postules si ya tienes vivienda, si tus ingresos superan 4 SMLMV o si no has vivido seis años en Medellín.' },
          { text: 'El proyecto debe ser VIS o VIP en Medellín y cumplir condiciones de la convocatoria.' },
          { text: 'El subsidio no reemplaza toda la cuota inicial; normalmente se combina con ahorro, crédito, cesantías o caja de compensación.' }
        ]
      }
    }
  })

  await prisma.tramite.create({
    data: {
      title: 'Crédito de Vivienda Bancolombia',
      description: 'Solicita financiación bancaria para compra de vivienda mediante crédito hipotecario o alternativas de vivienda. La aprobación depende del estudio de riesgo, documentos, avalúo, títulos y firma del crédito.',
      code: 'TRM-VIV-02',
      externalLink: 'https://www.bancolombia.com/personas',
      isOnline: false,
      estimatedTime: 'Variable según estudio financiero, avalúo, títulos y firma',
      estimatedCost: 'Estudio sujeto a condiciones; pueden aplicar avalúo, estudio de títulos y gastos notariales',
      targetAgeRange: '18-25',
      categoriaId: catVivienda.id,
      pasos: {
        create: [
          { order: 1, title: 'Definir tipo de vivienda', description: 'Identifica si comprarás VIS, No VIS, nueva, usada o sobre planos.' },
          { order: 2, title: 'Calcular cuota inicial', description: 'Estima el porcentaje que debes cubrir: cerca del 20% si es VIS o 30% si es No VIS, más gastos del proceso.' },
          { order: 3, title: 'Simular el crédito', description: 'Usa el simulador de Bancolombia para estimar monto, cuota, plazo y tipo de financiación.' },
          { order: 4, title: 'Reunir documentos financieros', description: 'Prepara cédula, certificados laborales, desprendibles, declaración de renta si aplica, extractos y soportes de ingresos.' },
          { order: 5, title: 'Solicitar preaprobación', description: 'Radica la solicitud para obtener preaprobación o carta de aprobación según evaluación del banco.' },
          { order: 6, title: 'Realizar estudio del inmueble', description: 'Si hay aprobación financiera, se revisan avalúo, estudio de títulos y validación jurídica.' },
          { order: 7, title: 'Firmar documentos', description: 'Firma promesa de compraventa, escritura y documentos del crédito.' },
          { order: 8, title: 'Recibir desembolso', description: 'El banco desembolsa al vendedor o constructor según el negocio aprobado.' }
        ]
      },
      requisitos: {
        create: [
          { title: 'Fotocopia de cédula con huella y firma' },
          { title: 'Certificado de ingresos y retenciones o declaración de renta del último año gravable' },
          { title: 'Soportes de ingresos según tipo de contrato o actividad económica' },
          { title: 'Buen comportamiento crediticio y capacidad de endeudamiento' },
          { title: 'Información del inmueble y tipo de vivienda' },
          { title: 'Cuota inicial disponible y soportes de ahorro, subsidios o recursos propios' }
        ]
      },
      recomendaciones: {
        create: [
          { text: 'Este trámite es financiero, no es un subsidio; la aprobación depende del análisis de riesgo del banco.' },
          { text: 'Revisa ingresos del hogar, deudas actuales, contrato, valor de vivienda, cuota inicial y subsidios disponibles antes de solicitar.' },
          { text: 'Considera costos adicionales como estudio de títulos, avalúo, gastos notariales y escritura.' }
        ]
      }
    }
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
