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
  ciudadania: "sign-ciudadania.png",
  codigo: "sign-codigo.png",
  como: "sign-como.png",
  dashboard: "sign-dashboard.png",
  digital: "sign-digital.png",
  documento: "sign-documento.png",
  edad: "sign-edad.png",
  experiencia: "sign-experiencia.png",
  favoritos: "sign-favoritos.png",
  gestiona: "sign-gestiona.png",
  gobierno: "sign-gobierno.png",
  guardar: "sign-guardar.png",
  ia: "sign-IA.png",
  idioma: "sign-idioma.png",
  ingles: "sign-ingles.png",
  inteligente: "sign-inteligente.png",
  nombre: "sign-nombre.png",
  numero: "sign-numero.png",
  perfil: "sign-perfil.png",
  salir: "sign-salir.png",
  social: "sign-social.png",
  spanish: "sign-spanish.png",
  tipo: "sign-tipo.png",
  tramite: "sign-tramite.png",
};

const labelOverrides: Record<string, string> = {
  ia: "IA",
  admin: "Admin",
  dashboard: "Dashboard",
  spanish: "Espanol",
  ingles: "Ingles",
};

const wordAliases: Record<string, string> = {
  academico: "academia",
  academicos: "academia",
  academica: "academia",
  academicas: "academia",
  administracion: "admin",
  administrador: "admin",
  administradores: "admin",
  administra: "admin",
  ciudadano: "ciudadania",
  ciudadanos: "ciudadania",
  ciudadana: "ciudadania",
  ciudadanas: "ciudadania",
  documentos: "documento",
  nombres: "nombre",
  apellidos: "apellido",
  numeros: "numero",
  perfiles: "perfil",
  tramites: "tramite",
  idiomas: "idioma",
  espanol: "spanish",
  english: "ingles",
  gubernamental: "gobierno",
  gubernamentales: "gobierno",
  busquedas: "busqueda",
};

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
    const sequence = normalized
      .split(/\s+/)
      .map((word) => getWordItem(word))
      .filter(Boolean) as VisualSignItem[];

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
const profileEs = translations.es.profile;
const profileEn = translations.en.profile;

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

const phraseList = [...landingPhrases, ...profilePhrases];

export const visualSignWords = visualSignWordsBase;
export const visualSignPhrases = createPhraseDictionary(phraseList);

export function getVisualSequence(selectedText: string) {
  const normalized = normalizeSelectedText(selectedText);
  if (!normalized) return [];

  const phrase = visualSignPhrases[normalized];
  if (phrase) return phrase.sequence;

  return normalized
    .split(/\s+/)
    .map((word) => getWordItem(word))
    .filter(Boolean) as VisualSignItem[];
}
