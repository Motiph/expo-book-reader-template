import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { useTheme } from '../../src/hooks/useTheme';
import { useBookStore } from '../../src/store/useBookStore';
import { useTranslation } from '../../src/hooks/useTranslation';
import LanguageModal from '../../src/components/LanguageModal';
import { useBookData } from '../../src/hooks/useBookData';

export default function HomeScreen() {
  const router = useRouter();
  const { theme, isDarkMode } = useTheme();
  const { toggleTheme, lastReadChapter, getProgress } = useBookStore();
  const t = useTranslation();

  const [showLangModal, setShowLangModal] = useState(false);

  const bookData = useBookData();
  const progress = getProgress(bookData.chapters.length);

  return (
    <SafeAreaView style={[s.safe, { backgroundColor: theme.background }]}>
      <View style={[s.header, { borderBottomColor: theme.border }]}>
        <View>
          <Text style={[s.title, { color: theme.text }]}>{bookData.title}</Text>
          <Text style={[s.subtitle, { color: theme.textSecondary }]}>
            {bookData.subtitle}
          </Text>
        </View>
        <View style={s.headerActions}>
          <TouchableOpacity
            onPress={() => setShowLangModal(true)}
            style={s.actionBtn}
          >
            <Ionicons name="language-outline" size={22} color={theme.accent} />
          </TouchableOpacity>
          <TouchableOpacity onPress={toggleTheme} style={s.actionBtn}>
            <Ionicons
              name={isDarkMode ? 'sunny-outline' : 'moon-outline'}
              size={22}
              color={theme.accent}
            />
          </TouchableOpacity>
        </View>
      </View>

      <View style={[s.progressCard, { backgroundColor: theme.surface }]}>
        <View style={s.progressRow}>
          <Text style={[s.progressLabel, { color: theme.textSecondary }]}>
            {t.home.readingProgress}
          </Text>
          <Text style={[s.progressPct, { color: theme.accent }]}>{progress}%</Text>
        </View>
        <View style={[s.progressBg, { backgroundColor: theme.border }]}>
          <View
            style={[
              s.progressFill,
              { backgroundColor: theme.accent, width: `${progress}%` },
            ]}
          />
        </View>
        <Text style={[s.progressSub, { color: theme.textSecondary }]}>
          {t.home.lastRead} {lastReadChapter}
        </Text>
      </View>

      <FlatList
        data={bookData.chapters}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={s.list}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              s.chapterCard,
              {
                backgroundColor: theme.card,
                borderColor: theme.border,
                borderLeftColor:
                  item.id === lastReadChapter ? theme.accent : theme.border,
              },
            ]}
            onPress={() => router.push(`/chapter/${item.id}`)}
          >
            <View style={s.chapterLeft}>
              <Text style={[s.chapterNum, { color: theme.accent }]}>
                {String(item.id).padStart(2, '0')}
              </Text>
              <View>
                <Text style={[s.chapterTitle, { color: theme.text }]}>
                  {item.title}
                </Text>
                {item.subtitle ? (
                  <Text style={[s.chapterSub, { color: theme.textSecondary }]}>
                    {item.subtitle}
                  </Text>
                ) : null}
              </View>
            </View>
            <Ionicons name="chevron-forward" size={16} color={theme.textSecondary} />
          </TouchableOpacity>
        )}
      />

      <LanguageModal
        visible={showLangModal}
        onClose={() => setShowLangModal(false)}
      />
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingTop: 20,
    borderBottomWidth: 1,
  },
  title: { fontSize: 22, fontWeight: '700', letterSpacing: 0.3 },
  subtitle: { fontSize: 13, marginTop: 2 },
  headerActions: { flexDirection: 'row', gap: 4 },
  actionBtn: { padding: 8 },
  progressCard: { margin: 16, padding: 16, borderRadius: 12 },
  progressRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  progressLabel: { fontSize: 13 },
  progressPct: { fontSize: 13, fontWeight: '600' },
  progressBg: { height: 4, borderRadius: 2, overflow: 'hidden' },
  progressFill: { height: 4, borderRadius: 2 },
  progressSub: { fontSize: 12, marginTop: 8 },
  list: { paddingHorizontal: 16, paddingBottom: 24 },
  chapterCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderLeftWidth: 3,
    marginBottom: 8,
  },
  chapterLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  chapterNum: { fontSize: 18, fontWeight: '700', width: 32 },
  chapterTitle: { fontSize: 15, fontWeight: '500' },
  chapterSub: { fontSize: 12, marginTop: 2 },
});