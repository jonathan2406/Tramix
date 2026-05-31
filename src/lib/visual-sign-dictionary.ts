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

const PLACEHOLDER_IMAGE_URL = "/signs/visual-support/images/placeholder.svg";

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

function createPlaceholderItem(key: string, label: string): VisualSignItem {
  return {
    key,
    label,
    imageUrl: PLACEHOLDER_IMAGE_URL,
    alt: `Placeholder apoyo visual para ${label}`,
    isPlaceholder: true,
  };
}

function createWordDictionary(phrases: string[]) {
  const words = new Set<string>();

  phrases.forEach((phrase) => {
    const normalized = normalizeSelectedText(phrase);
    if (!normalized) return;
    normalized.split(/\s+/).forEach((word) => {
      if (word.length > 1) words.add(word);
    });
  });

  const entries: Record<string, VisualSignItem> = {};
  words.forEach((word) => {
    entries[word] = createPlaceholderItem(word, formatWordLabel(word));
  });

  return entries;
}

function createPhraseDictionary(phrases: string[], wordDictionary: Record<string, VisualSignItem>) {
  const entries: Record<string, VisualSignPhrase> = {};

  phrases.forEach((phrase) => {
    const normalized = normalizeSelectedText(phrase);
    if (!normalized) return;
    const sequence = normalized
      .split(/\s+/)
      .map((word) => wordDictionary[word])
      .filter(Boolean);

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

export const visualSignWords = createWordDictionary(phraseList);
export const visualSignPhrases = createPhraseDictionary(phraseList, visualSignWords);

export function getVisualSequence(selectedText: string) {
  const normalized = normalizeSelectedText(selectedText);
  if (!normalized) return [];

  const phrase = visualSignPhrases[normalized];
  if (phrase) return phrase.sequence;

  return normalized
    .split(/\s+/)
    .map((word) => visualSignWords[word])
    .filter(Boolean);
}
