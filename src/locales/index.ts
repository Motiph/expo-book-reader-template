import es from './es';
import en from './en';
import pt from './pt';
import fr from './fr';
import it from './it';

export type Language = 'es' | 'en' | 'pt' | 'fr' | 'it';

export const locales = { es, en, pt, fr, it };

export const LANGUAGES = [
  { code: 'es' as Language, label: 'Español', flag: '🇲🇽' },
  { code: 'en' as Language, label: 'English', flag: '🇺🇸' },
  { code: 'pt' as Language, label: 'Português', flag: '🇧🇷' },
  { code: 'fr' as Language, label: 'Français', flag: '🇫🇷' },
  { code: 'it' as Language, label: 'Italiano', flag: '🇮🇹' },
];

export type Translations = typeof es;