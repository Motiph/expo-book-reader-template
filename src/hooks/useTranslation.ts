import { useLanguageStore } from '../store/useLanguageStore';
import { locales, Translations } from '../locales';

export const useTranslation = (): Translations => {
  const language = useLanguageStore((s) => s.language);
  return locales[language];
};