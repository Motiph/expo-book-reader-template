import { useBookStore } from '../store/useBookStore';
import { LIGHT_THEME, DARK_THEME } from '../constants/theme';

export const useTheme = () => {
  const isDarkMode = useBookStore((s) => s.isDarkMode);
  const theme = isDarkMode ? DARK_THEME : LIGHT_THEME;
  return { theme, isDarkMode };
};