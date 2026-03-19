import { useLanguageStore } from '../store/useLanguageStore';

const books: Record<string, any> = {
  es: require('../data/book.es.json'),
  en: require('../data/book.en.json'),
  pt: require('../data/book.pt.json'),
  fr: require('../data/book.fr.json'),
  it: require('../data/book.it.json'),
};

export const useBookData = () => {
  const language = useLanguageStore((s) => s.language);
  return books[language] ?? books['es'];
};