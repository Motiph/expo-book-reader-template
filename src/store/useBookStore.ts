import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Bookmark {
  chapterId: number;
  verseId: string;
  verseText: string;
  chapterTitle: string;
  createdAt: number;
}

interface BookStore {
  // Tema
  isDarkMode: boolean;
  toggleTheme: () => void;

  // Progreso
  lastReadChapter: number;
  lastReadVerse: string | null;
  setLastRead: (chapterId: number, verseId: string) => void;
  getProgress: (totalChapters: number) => number;

  // Bookmarks
  bookmarks: Bookmark[];
  addBookmark: (bookmark: Omit<Bookmark, 'createdAt'>) => void;
  removeBookmark: (verseId: string) => void;
  isBookmarked: (verseId: string) => boolean;
}

export const useBookStore = create<BookStore>()(
  persist(
    (set, get) => ({
      // Tema
      isDarkMode: false,
      toggleTheme: () => set((state) => ({ isDarkMode: !state.isDarkMode })),

      // Progreso
      lastReadChapter: 1,
      lastReadVerse: null,
      setLastRead: (chapterId, verseId) =>
        set({ lastReadChapter: chapterId, lastReadVerse: verseId }),
      getProgress: (totalChapters) => {
        const { lastReadChapter } = get();
        return Math.round((lastReadChapter / totalChapters) * 100);
      },

      // Bookmarks
      bookmarks: [],
      addBookmark: (bookmark) =>
        set((state) => ({
          bookmarks: [
            { ...bookmark, createdAt: Date.now() },
            ...state.bookmarks,
          ],
        })),
      removeBookmark: (verseId) =>
        set((state) => ({
          bookmarks: state.bookmarks.filter((b) => b.verseId !== verseId),
        })),
      isBookmarked: (verseId) =>
        get().bookmarks.some((b) => b.verseId === verseId),
    }),
    {
      name: 'book-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);