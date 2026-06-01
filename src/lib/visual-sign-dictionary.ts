import { translations } from "@/lib/translations";

export type VisualSignItem = {
  key: string;
  label: string;
  imageUrl: string;
  alt: string;
  isPlaceholder?: boolean;
};

export type VisualSignPhrase = {
  label: string;
  type: "phrase";
  sequence: VisualSignItem[];
};

const IMAGE_BASE_PATH = "/signs/visual-support/images";

export function normalizeSelectedText(value: string) {
  return value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\w\s]/g, "")
    .replace(/\s+/g, " ");
}

function formatWordLabel(word: string) {
  if (!word) return "";
  return word.charAt(0).toUpperCase() + word.slice(1);
}

const visualSignImageFiles: Record<string, string> = {
  academia: "sign-academia.png",
  acceder: "sign-acceder.png",
  accesible: "sign-accesible.png",
  admin: "sign-admin.png",
  apellido: "sign-apellido.png",
  asi: "sign-asi.png",
  asistencia: "sign-asistencia.png",
  asistente: "sign-asistente.png",
  atencion: "sign-atencion.png",
  bilingue: "sign-bilingue.png",
  buscar: "sign-buscar.png",
  busqueda: "sign-busqueda.png",
  campo: "sign-campo.png",
  cedula: "sign-cedula.png",
  ciudadania: "sign-ciudadania.png",
  clinica: "sign-clinica.png",
  codigo: "sign-codigo.png",
  como: "sign-como.png",
  consultar: "sign-consultar.png",
  cuenta: "sign-cuenta.png",
  dashboard: "sign-dashboard.png",
  descuento: "sign-descuento.png",
  digital: "sign-digital.png",
  documentacion: "sign-documentacion.png",
  documento: "sign-documento.png",
  duda: "sign-duda.png",
  edad: "sign-edad.png",
  educacion: "sign-educacion.png",
  encontrar: "sign-encontrar.png",
  experiencia: "sign-experiencia.png",
  exterior: "sign-exterior.png",
  favoritos: "sign-favoritos.png",
  filtro: "sign-filtro.png",
  finanzas: "sign-finanzas.png",
  gestiona: "sign-gestiona.png",
  gobierno: "sign-gobierno.png",
  guardar: "sign-guardar.png",
  historia: "sign-historia.png",
  hola: "sign-hola.png",
  horarios: "sign-horarios.png",
  ia: "sign-IA.png",
  idioma: "sign-idioma.png",
  ingles: "sign-ingles.png",
  inicio: "sign-inicio.png",
  inscribir: "sign-inscribir.png",
  inteligente: "sign-inteligente.png",
  libreta: "sign-libreta.png",
  licencia: "sign-licencia.png",
  lugar: "sign-lugar.png",
  militar: "sign-militar.png",
  movilidad: "sign-movilidad.png",
  nombre: "sign-nombre.png",
  numero: "sign-numero.png",
  pasaporte: "sign-pasaporte.png",
  perfil: "sign-perfil.png",
  plataforma: "sign-plataforma.png",
  puntos: "sign-puntos.png",
  rapido: "sign-rapido.png",
  recomendaciones: "sign-recomendaciones.png",
  registraduria: "sign-registraduria.png",
  registro: "sign-registro.png",
  renovar: "sign-renovar.png",
  resuelve: "sign-resuelve.png",
  salir: "sign-salir.png",
  salud: "sign-salud.png",
  social: "sign-social.png",
  solicitud: "sign-solicitud.png",
  spanish: "sign-spanish.png",
  tiempo: "sign-tiempo.png",
  tipo: "sign-tipo.png",
  tramite: "sign-tramite.png",
  vivienda: "sign-vivienda.png",
  votar: "sign-votar.png",
};

const labelOverrides: Record<string, string> = {
  ia: "IA",
  admin: "Admin",
  dashboard: "Dashboard",
  documentacion: "Documentacion",
  educacion: "Educacion",
  spanish: "Espanol",
  ingles: "Ingles",
  movilidad: "Movilidad",
  salud: "Salud",
  vivienda: "Vivienda",
};

const wordAliases: Record<string, string> = {
  academico: "academia",
  academicos: "academia",
  academica: "academia",
  academicas: "academia",
  acceso: "acceder",
  acceder: "acceder",
  ingresar: "acceder",
  ingresa: "acceder",
  ingrese: "acceder",
  ingreso: "acceder",
  entrar: "acceder",
  entrada: "acceder",
  iniciar: "acceder",
  inicia: "acceder",
  inicio: "inicio",
  iniciaras: "acceder",
  sesion: "acceder",
  registro: "registro",
  registrar: "registro",
  registrarse: "registro",
  registrate: "registro",
  administracion: "admin",
  administrador: "admin",
  administradores: "admin",
  administra: "admin",
  administrar: "admin",
  administrativo: "admin",
  administrativa: "admin",
  dashboard: "dashboard",
  ciudadano: "ciudadania",
  ciudadanos: "ciudadania",
  ciudadana: "ciudadania",
  ciudadanas: "ciudadania",
  usuario: "perfil",
  usuarios: "perfil",
  cuenta: "cuenta",
  cuentas: "cuenta",
  perfil: "perfil",
  perfiles: "perfil",
  favorito: "favoritos",
  favoritas: "favoritos",
  documentos: "documento",
  documentacion: "documentacion",
  documentaciones: "documentacion",
  documental: "documentacion",
  cedula: "cedula",
  pasaporte: "pasaporte",
  licencia: "licencia",
  identidad: "documento",
  identificacion: "documento",
  nombres: "nombre",
  apellidos: "apellido",
  numeros: "numero",
  numero: "numero",
  codigo: "codigo",
  codigos: "codigo",
  tramites: "tramite",
  tramitar: "tramite",
  procedimiento: "tramite",
  procedimientos: "tramite",
  proceso: "tramite",
  procesos: "tramite",
  gestion: "gestiona",
  gestiones: "gestiona",
  gestionar: "gestiona",
  gestionando: "gestiona",
  gestionado: "gestiona",
  gestionada: "gestiona",
  idiomas: "idioma",
  lenguaje: "idioma",
  lenguajes: "idioma",
  lengua: "idioma",
  lenguas: "idioma",
  espanol: "spanish",
  castellano: "spanish",
  english: "ingles",
  ingles: "ingles",
  ai: "ia",
  gubernamental: "gobierno",
  gubernamentales: "gobierno",
  estatal: "gobierno",
  busquedas: "busqueda",
  buscar: "buscar",
  consulta: "consultar",
  consultas: "consultar",
  consultar: "consultar",
  filtrar: "busqueda",
  filtra: "busqueda",
  filtro: "filtro",
  filtros: "busqueda",
  filtrado: "busqueda",
  filtrados: "busqueda",
  ayuda: "duda",
  ayudar: "asistencia",
  ayudas: "asistencia",
  apoyo: "asistencia",
  soporte: "asistencia",
  duda: "duda",
  dudas: "duda",
  resuelve: "resuelve",
  resolver: "resuelve",
  chatbot: "asistente",
  bot: "asistente",
  asistente: "asistente",
  asistentes: "asistente",
  accesibilidad: "accesible",
  experiencia: "experiencia",
  experiencias: "experiencia",
  inteligencia: "inteligente",
  inteligentes: "inteligente",
  digital: "digital",
  plataforma: "plataforma",
  online: "digital",
  sociales: "social",
  social: "social",
  categoria: "tipo",
  categorias: "tipo",
  campo: "campo",
  campos: "campo",
  puntos: "puntos",
  punto: "puntos",
  centro: "lugar",
  centros: "lugar",
  sede: "lugar",
  sedes: "lugar",
  oficina: "lugar",
  oficinas: "lugar",
  presencial: "atencion",
  presenciales: "atencion",
  servicio: "atencion",
  servicios: "atencion",
  horario: "atencion",
  horarios: "horarios",
  telefono: "atencion",
  telefonos: "atencion",
  direccion: "lugar",
  direcciones: "lugar",
  ubicacion: "lugar",
  ubicaciones: "lugar",
  ubica: "lugar",
  lugar: "lugar",
  edad: "edad",
  ano: "edad",
  anos: "edad",
  anios: "edad",
  actualizar: "renovar",
  actualizacion: "renovar",
  actualizado: "renovar",
  actualizada: "renovar",
  guardar: "guardar",
  guardado: "guardar",
  guardada: "guardar",
  guardaras: "guardar",
  salir: "salir",
  cerrar: "salir",
  logout: "salir",
  financiero: "finanzas",
  financieros: "finanzas",
  finanzas: "finanzas",
  descuento: "descuento",
  rapido: "rapido",
  rapida: "rapido",
  rapidos: "rapido",
  rapidas: "rapido",
  recomendaciones: "recomendaciones",
  recomendacion: "recomendaciones",
  recomendadas: "recomendaciones",
  recomendado: "recomendaciones",
  registraduria: "registraduria",
  inscribir: "inscribir",
  inscripcion: "inscribir",
  solicitud: "solicitud",
  solicitar: "solicitud",
  votar: "votar",
  votacion: "votar",
  exterior: "exterior",
  militar: "militar",
  libreta: "libreta",
  educacion: "educacion",
  movilidad: "movilidad",
  salud: "salud",
  vivienda: "vivienda",
  historia: "historia",
  tiempo: "tiempo",
  encontrar: "encontrar",
  encuentra: "encontrar",
  encuentro: "encontrar",
};

function dedupeSequence(sequence: VisualSignItem[]) {
  const deduped: VisualSignItem[] = [];
  let lastKey: string | null = null;
  sequence.forEach((item) => {
    if (item.key === lastKey) return;
    deduped.push(item);
    lastKey = item.key;
  });
  return deduped;
}

const suffixCandidates = [
  "mente",
  "aciones",
  "acion",
  "ciones",
  "cion",
  "idades",
  "idad",
  "amientos",
  "amiento",
  "ados",
  "adas",
  "idos",
  "idas",
  "ando",
  "iendo",
  "aba",
  "ada",
  "ida",
  "ara",
  "era",
  "aria",
  "eria",
  "aste",
  "iste",
  "amos",
  "emos",
  "imos",
  "aron",
  "ieron",
  "an",
  "en",
  "as",
  "es",
  "os",
  "s",
];

function buildImageDictionary() {
  const entries: Record<string, VisualSignItem> = {};
  Object.entries(visualSignImageFiles).forEach(([key, file]) => {
    const label = labelOverrides[key] ?? formatWordLabel(key);
    entries[key] = {
      key,
      label,
      imageUrl: `${IMAGE_BASE_PATH}/${file}`,
      alt: `Imagen de apoyo visual para ${label}`,
    };
  });
  return entries;
}

function getCandidateRoots(word: string) {
  const candidates = new Set<string>();
  if (word.endsWith("es") && word.length > 4) candidates.add(word.slice(0, -2));
  if (word.endsWith("s") && word.length > 3) candidates.add(word.slice(0, -1));
  suffixCandidates.forEach((suffix) => {
    if (word.endsWith(suffix) && word.length - suffix.length >= 3) {
      candidates.add(word.slice(0, -suffix.length));
    }
  });
  return Array.from(candidates);
}

function findPrefixMatch(word: string, keys: string[]) {
  if (word.length < 4) return null;
  let best: string | null = null;
  keys.forEach((key) => {
    if (key.length < 4) return;
    if (word.startsWith(key) || (key.startsWith(word) && word.length >= 4)) {
      if (!best || key.length > best.length) best = key;
    }
  });
  return best;
}

const visualSignWordsBase = buildImageDictionary();
const baseKeys = Object.keys(visualSignWordsBase);

function resolveWordKey(word: string) {
  if (!word) return null;
  if (visualSignWordsBase[word]) return word;
  const alias = wordAliases[word];
  if (alias && visualSignWordsBase[alias]) return alias;

  const candidates = getCandidateRoots(word);
  for (const candidate of candidates) {
    if (visualSignWordsBase[candidate]) return candidate;
    const aliasCandidate = wordAliases[candidate];
    if (aliasCandidate && visualSignWordsBase[aliasCandidate]) return aliasCandidate;
  }

  const prefixMatch = findPrefixMatch(word, baseKeys);
  if (prefixMatch) return prefixMatch;

  return null;
}

function getWordItem(word: string) {
  const key = resolveWordKey(word);
  if (!key) return null;
  return visualSignWordsBase[key];
}

function createPhraseDictionary(phrases: string[]) {
  const entries: Record<string, VisualSignPhrase> = {};

  phrases.forEach((phrase) => {
    const normalized = normalizeSelectedText(phrase);
    if (!normalized) return;
    const sequence = dedupeSequence(normalized
      .split(/\s+/)
      .map((word) => getWordItem(word))
      .filter(Boolean) as VisualSignItem[]);

    if (sequence.length === 0) return;

    entries[normalized] = {
      label: phrase,
      type: "phrase",
      sequence,
    };
  });

  return entries;
}

const landingEs = translations.es.home;
const landingEn = translations.en.home;
const navEs = translations.es.nav;
const navEn = translations.en.nav;
const dashboardEs = translations.es.dashboard;
const dashboardEn = translations.en.dashboard;
const favoritesEs = translations.es.favorites;
const favoritesEn = translations.en.favorites;
const tramiteEs = translations.es.tramite;
const tramiteEn = translations.en.tramite;
const profileEs = translations.es.profile;
const profileEn = translations.en.profile;
const loginEs = translations.es.login;
const loginEn = translations.en.login;
const registerEs = translations.es.register;
const registerEn = translations.en.register;

const landingPhrases = [
  landingEs.subtitle,
  landingEs.bentoTitle,
  landingEs.bentoSubtitle,
  landingEs.feature1Title,
  landingEs.feature1Desc,
  landingEs.feature2Title,
  landingEs.feature2Desc,
  landingEs.feature3Title,
  landingEs.feature3Desc,
  landingEs.feature4Title,
  landingEs.feature4Desc,
  landingEs.howTitle,
  landingEs.howSubtitle,
  landingEs.step1Title,
  landingEs.step1Desc,
  landingEs.step2Title,
  landingEs.step2Desc,
  landingEs.step3Title,
  landingEs.step3Desc,
  "Process",
  landingEn.subtitle,
  landingEn.bentoTitle,
  landingEn.bentoSubtitle,
  landingEn.feature1Title,
  landingEn.feature1Desc,
  landingEn.feature2Title,
  landingEn.feature2Desc,
  landingEn.feature3Title,
  landingEn.feature3Desc,
  landingEn.feature4Title,
  landingEn.feature4Desc,
  landingEn.howTitle,
  landingEn.howSubtitle,
  landingEn.step1Title,
  landingEn.step1Desc,
  landingEn.step2Title,
  landingEn.step2Desc,
  landingEn.step3Title,
  landingEn.step3Desc,
];

const navPhrases = [
  navEs.dashboard,
  navEs.favorites,
  navEs.profile,
  navEs.admin,
  navEs.login,
  navEs.register,
  navEs.logout,
  navEn.dashboard,
  navEn.favorites,
  navEn.profile,
  navEn.admin,
  navEn.login,
  navEn.register,
  navEn.logout,
];

const dashboardPhrases = [
  dashboardEs.subtitle,
  dashboardEs.searchLabel,
  dashboardEs.searchPlaceholder,
  dashboardEs.searchButton,
  dashboardEs.searchEmpty,
  dashboardEs.searchNotFound,
  dashboardEs.filterTitle,
  dashboardEs.filterAll,
  dashboardEs.filterCitizen,
  dashboardEs.filterFinancial,
  dashboardEs.categoriesTitle,
  dashboardEs.categoryAll,
  dashboardEs.resultsTitle,
  dashboardEs.tramitesTitle,
  dashboardEs.emptyTitle,
  dashboardEs.emptySubtitle,
  dashboardEs.ageNotice,
  dashboardEs.ageError,
  dashboardEn.subtitle,
  dashboardEn.searchLabel,
  dashboardEn.searchPlaceholder,
  dashboardEn.searchButton,
  dashboardEn.searchEmpty,
  dashboardEn.searchNotFound,
  dashboardEn.filterTitle,
  dashboardEn.filterAll,
  dashboardEn.filterCitizen,
  dashboardEn.filterFinancial,
  dashboardEn.categoriesTitle,
  dashboardEn.categoryAll,
  dashboardEn.resultsTitle,
  dashboardEn.tramitesTitle,
  dashboardEn.emptyTitle,
  dashboardEn.emptySubtitle,
  dashboardEn.ageNotice,
  dashboardEn.ageError,
];

const favoritesPhrases = [
  favoritesEs.title,
  favoritesEs.subtitle,
  favoritesEs.empty,
  favoritesEs.emptyHint,
  favoritesEs.explore,
  favoritesEs.view,
  favoritesEs.remove,
  favoritesEn.title,
  favoritesEn.subtitle,
  favoritesEn.empty,
  favoritesEn.emptyHint,
  favoritesEn.explore,
  favoritesEn.view,
  favoritesEn.remove,
];

const tramitePhrases = [
  tramiteEs.listenSection,
  tramiteEs.addCalendar,
  tramiteEs.synced,
  tramiteEs.saveFavorite,
  tramiteEs.removeFavorite,
  tramiteEs.procedure,
  tramiteEs.requirements,
  tramiteEs.offices,
  tramiteEs.tips,
  tramiteEs.previous,
  tramiteEs.next,
  tramiteEn.listenSection,
  tramiteEn.addCalendar,
  tramiteEn.synced,
  tramiteEn.saveFavorite,
  tramiteEn.removeFavorite,
  tramiteEn.procedure,
  tramiteEn.requirements,
  tramiteEn.offices,
  tramiteEn.tips,
  tramiteEn.previous,
  tramiteEn.next,
];

const profilePhrases = [
  profileEs.title,
  profileEs.subtitle,
  profileEs.name,
  profileEs.surname,
  profileEs.docType,
  profileEs.docNumber,
  profileEs.ageRange,
  profileEs.ageRangeHint,
  profileEs.language,
  profileEs.languageHint,
  profileEs.saveButton,
  profileEs.required,
  profileEs.ageSetupNotice,
  profileEs.selectOption,
  ...Object.values(profileEs.docOptions),
  ...Object.values(profileEs.ageOptions),
  ...Object.values(profileEs.langOptions),
  profileEn.title,
  profileEn.subtitle,
  profileEn.name,
  profileEn.surname,
  profileEn.docType,
  profileEn.docNumber,
  profileEn.ageRange,
  profileEn.ageRangeHint,
  profileEn.language,
  profileEn.languageHint,
  profileEn.saveButton,
  profileEn.required,
  profileEn.ageSetupNotice,
  profileEn.selectOption,
  ...Object.values(profileEn.docOptions),
  ...Object.values(profileEn.ageOptions),
  ...Object.values(profileEn.langOptions),
];

const loginPhrases = [
  loginEs.title,
  loginEs.subtitle,
  loginEs.email,
  loginEs.emailPlaceholder,
  loginEs.password,
  loginEs.submitButton,
  loginEs.orWith,
  loginEs.googleButton,
  loginEs.noAccount,
  loginEs.registerLink,
  loginEn.title,
  loginEn.subtitle,
  loginEn.email,
  loginEn.emailPlaceholder,
  loginEn.password,
  loginEn.submitButton,
  loginEn.orWith,
  loginEn.googleButton,
  loginEn.noAccount,
  loginEn.registerLink,
];

const registerPhrases = [
  registerEs.title,
  registerEs.fullName,
  registerEs.email,
  registerEs.password,
  registerEs.passwordHint,
  registerEs.termsPrefix,
  registerEs.termsLink,
  registerEs.andText,
  registerEs.privacyLink,
  registerEs.submitButton,
  registerEs.alreadyHaveAccount,
  registerEs.loginLink,
  registerEs.termsTitle,
  registerEs.termsContent,
  registerEs.termsClose,
  registerEs.successMessage,
  registerEs.emailError,
  registerEs.passwordLengthError,
  registerEs.passwordAlphanumError,
  registerEn.title,
  registerEn.fullName,
  registerEn.email,
  registerEn.password,
  registerEn.passwordHint,
  registerEn.termsPrefix,
  registerEn.termsLink,
  registerEn.andText,
  registerEn.privacyLink,
  registerEn.submitButton,
  registerEn.alreadyHaveAccount,
  registerEn.loginLink,
  registerEn.termsTitle,
  registerEn.termsContent,
  registerEn.termsClose,
  registerEn.successMessage,
  registerEn.emailError,
  registerEn.passwordLengthError,
  registerEn.passwordAlphanumError,
];

const extraPhrases = [
  "Asistente TRAMIX",
  "Escribe un mensaje",
  "Pensando",
  "Puntos de Atencion",
  "Encuentra donde realizar tus tramites presenciales",
  "Fuera de servicio",
  "Recomendaciones y Tips",
  "Consejos para que tus tramites sean mas eficientes",
  "Iniciar tramite",
  "Guardar cambios",
  "Guardar y Actualizar",
  "Registrar Punto",
  "Registrar Nuevo Punto de Atencion",
];

const phraseList = [
  ...landingPhrases,
  ...navPhrases,
  ...dashboardPhrases,
  ...favoritesPhrases,
  ...tramitePhrases,
  ...profilePhrases,
  ...loginPhrases,
  ...registerPhrases,
  ...extraPhrases,
];

export const visualSignWords = visualSignWordsBase;
export const visualSignPhrases = createPhraseDictionary(phraseList);

export function getVisualSequence(selectedText: string) {
  const normalized = normalizeSelectedText(selectedText);
  if (!normalized) return [];

  const phrase = visualSignPhrases[normalized];
  if (phrase) return phrase.sequence;

  return dedupeSequence(normalized
    .split(/\s+/)
    .map((word) => getWordItem(word))
    .filter(Boolean) as VisualSignItem[]);
}
