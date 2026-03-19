

import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Share,
  Dimensions,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../src/hooks/useTheme';
import { useBookStore } from '../../src/store/useBookStore';
import { useTranslation } from '../../src/hooks/useTranslation';
import { useEffect, useRef, useState } from 'react';
import { useBookData } from '../../src/hooks/useBookData';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function ChapterScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { theme } = useTheme();
  const { addBookmark, removeBookmark, isBookmarked, setLastRead } = useBookStore();
  const t = useTranslation();

  const bookData = useBookData();

  const initialIndex = bookData.chapters.findIndex((c) => c.id === Number(id));
  const [currentIndex, setCurrentIndex] = useState(initialIndex === -1 ? 0 : initialIndex);
  const flatListRef = useRef<FlatList>(null);

  const chapter = bookData.chapters[currentIndex];

  useEffect(() => {
    if (chapter) {
      setLastRead(chapter.id, chapter.paragraphs[0].id);
    }
  }, [currentIndex]);

  useEffect(() => {
    if (initialIndex > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToIndex({
          index: initialIndex,
          animated: false,
        });
      }, 50);
    }
  }, []);

  const handleBookmark = (paragraph: (typeof chapter.paragraphs)[0]) => {
    if (isBookmarked(paragraph.id)) {
      removeBookmark(paragraph.id);
    } else {
      addBookmark({
        chapterId: chapter.id,
        verseId: paragraph.id,
        verseText: paragraph.text,
        chapterTitle: chapter.title,
      });
    }
  };

  const handleShare = async (paragraph: (typeof chapter.paragraphs)[0]) => {
    await Share.share({
      message: `"${paragraph.text}"\n\n— ${chapter.title}, ${bookData.title}`,
    });
  };

  const renderChapter = ({ item }: { item: (typeof bookData.chapters)[0] }) => (
    <View style={[s.page, { width: SCREEN_WIDTH }]}>
      <View style={[s.chapterHeader, { borderBottomColor: theme.border }]}>
        <Text style={[s.chapterTitle, { color: theme.text }]}>{item.title}</Text>
        {item.subtitle ? (
          <Text style={[s.chapterSubtitle, { color: theme.textSecondary }]}>
            {item.subtitle}
          </Text>
        ) : null}
      </View>

      <FlatList
        data={item.paragraphs}
        keyExtractor={(p) => p.id}
        contentContainerStyle={s.verseList}
        renderItem={({ item: paragraph }) => {
          const bookmarked = isBookmarked(paragraph.id);
          return (
            <View style={[s.verseCard, { borderBottomColor: theme.border }]}>
              <View style={s.verseRow}>
                <Text style={[s.verseNum, { color: theme.accent }]}>
                  {paragraph.verse}
                </Text>
                <Text style={[s.verseText, { color: theme.text }]}>
                  {paragraph.text}
                </Text>
              </View>
              <View style={s.verseActions}>
                <TouchableOpacity
                  onPress={() => handleBookmark(paragraph)}
                  style={s.actionBtn}
                >
                  <Ionicons
                    name={bookmarked ? 'bookmark' : 'bookmark-outline'}
                    size={18}
                    color={bookmarked ? theme.accent : theme.textSecondary}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleShare(paragraph)}
                  style={s.actionBtn}
                >
                  <Ionicons
                    name="share-outline"
                    size={18}
                    color={theme.textSecondary}
                  />
                </TouchableOpacity>
              </View>
            </View>
          );
        }}
      />
    </View>
  );

  return (
    <SafeAreaView style={[s.safe, { backgroundColor: theme.background }]}>
      <View style={[s.header, { borderBottomColor: theme.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={s.backBtn}>
          <Ionicons name="arrow-back" size={22} color={theme.accent} />
        </TouchableOpacity>
        <Text style={[s.headerTitle, { color: theme.text }]}>
          {chapter?.title}
        </Text>
        <Text style={[s.headerCounter, { color: theme.textSecondary }]}>
          {currentIndex + 1}/{bookData.chapters.length}
        </Text>
      </View>

      <FlatList
        ref={flatListRef}
        data={bookData.chapters}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderChapter}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(e) => {
          const index = Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH);
          setCurrentIndex(index);
        }}
        getItemLayout={(_, index) => ({
          length: SCREEN_WIDTH,
          offset: SCREEN_WIDTH * index,
          index,
        })}
        initialScrollIndex={initialIndex === -1 ? 0 : initialIndex}
      />

      <View style={[s.footer, { backgroundColor: theme.card, borderTopColor: theme.border }]}>
        <TouchableOpacity
          onPress={() => {
            if (currentIndex > 0) {
              flatListRef.current?.scrollToIndex({
                index: currentIndex - 1,
                animated: true,
              });
            }
          }}
          disabled={currentIndex === 0}
          style={[s.navBtn, { opacity: currentIndex === 0 ? 0.3 : 1 }]}
        >
          <Ionicons name="chevron-back" size={20} color={theme.accent} />
          <Text style={[s.navText, { color: theme.accent }]}>{t.chapter.previous}</Text>
        </TouchableOpacity>

        <View style={[s.progressDot, { backgroundColor: theme.border }]}>
          <View
            style={[
              s.progressDotFill,
              {
                backgroundColor: theme.accent,
                width: `${((currentIndex + 1) / bookData.chapters.length) * 100}%`,
              },
            ]}
          />
        </View>

        <TouchableOpacity
          onPress={() => {
            if (currentIndex < bookData.chapters.length - 1) {
              flatListRef.current?.scrollToIndex({
                index: currentIndex + 1,
                animated: true,
              });
            }
          }}
          disabled={currentIndex === bookData.chapters.length - 1}
          style={[s.navBtn, { opacity: currentIndex === bookData.chapters.length - 1 ? 0.3 : 1 }]}
        >
          <Text style={[s.navText, { color: theme.accent }]}>{t.chapter.next}</Text>
          <Ionicons name="chevron-forward" size={20} color={theme.accent} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    paddingTop: 20,
  },
  backBtn: { width: 38 },
  headerTitle: { fontSize: 15, fontWeight: '600', flex: 1, textAlign: 'center' },
  headerCounter: { fontSize: 13, width: 38, textAlign: 'right' },
  page: { flex: 1 },
  chapterHeader: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  chapterTitle: { fontSize: 18, fontWeight: '700' },
  chapterSubtitle: { fontSize: 13, marginTop: 4 },
  verseList: { paddingHorizontal: 20, paddingVertical: 8, paddingBottom: 24 },
  verseCard: { paddingVertical: 16, borderBottomWidth: 1 },
  verseRow: { flexDirection: 'row', gap: 12 },
  verseNum: { fontSize: 13, fontWeight: '700', width: 20, marginTop: 2 },
  verseText: { flex: 1, fontSize: 16, lineHeight: 26 },
  verseActions: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 8, gap: 8 },
  actionBtn: { padding: 6 },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderTopWidth: 1,
  },
  navBtn: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  navText: { fontSize: 14, fontWeight: '500' },
  progressDot: { flex: 1, height: 3, borderRadius: 2, marginHorizontal: 16, overflow: 'hidden' },
  progressDotFill: { height: 3, borderRadius: 2 },
});