import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { useState, useMemo } from 'react';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../src/hooks/useTheme';
import { useTranslation } from '../../src/hooks/useTranslation';
import { useBookData } from '../../src/hooks/useBookData';

interface Result {
  chapterId: number;
  chapterTitle: string;
  verseId: string;
  verse: number;
  text: string;
}

export default function SearchScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const t = useTranslation();
  const [query, setQuery] = useState('');

  const bookData = useBookData();

  const results = useMemo<Result[]>(() => {
    if (query.trim().length < 3) return [];
    const q = query.toLowerCase();
    const found: Result[] = [];
    for (const chapter of bookData.chapters) {
      for (const p of chapter.paragraphs) {
        if (p.text.toLowerCase().includes(q)) {
          found.push({
            chapterId: chapter.id,
            chapterTitle: chapter.title,
            verseId: p.id,
            verse: p.verse,
            text: p.text,
          });
        }
      }
    }
    return found;
  }, [query]);

  const highlight = (text: string) => {
    const q = query.toLowerCase();
    const idx = text.toLowerCase().indexOf(q);
    if (idx === -1)
      return <Text style={[s.resultText, { color: theme.text }]}>{text}</Text>;
    return (
      <Text style={[s.resultText, { color: theme.text }]}>
        {text.slice(0, idx)}
        <Text
          style={[
            s.highlight,
            { backgroundColor: theme.accent + '40', color: theme.accent },
          ]}
        >
          {text.slice(idx, idx + query.length)}
        </Text>
        {text.slice(idx + query.length)}
      </Text>
    );
  };

  return (
    <SafeAreaView style={[s.safe, { backgroundColor: theme.background }]}>
      <View style={[s.header, { borderBottomColor: theme.border }]}>
        <Text style={[s.title, { color: theme.text }]}>{t.search.title}</Text>
      </View>

      <View
        style={[
          s.inputWrap,
          { backgroundColor: theme.surface, borderColor: theme.border },
        ]}
      >
        <Ionicons name="search-outline" size={18} color={theme.textSecondary} />
        <TextInput
          style={[s.input, { color: theme.text }]}
          placeholder={t.search.placeholder}
          placeholderTextColor={theme.textSecondary}
          value={query}
          onChangeText={setQuery}
          autoCorrect={false}
        />
        {query.length > 0 && (
          <TouchableOpacity onPress={() => setQuery('')}>
            <Ionicons name="close-circle" size={18} color={theme.textSecondary} />
          </TouchableOpacity>
        )}
      </View>

      {query.length > 0 && query.length < 3 && (
        <Text style={[s.hint, { color: theme.textSecondary }]}>
          {t.search.minChars}
        </Text>
      )}

      {query.length >= 3 && results.length === 0 && (
        <Text style={[s.hint, { color: theme.textSecondary }]}>
          {t.search.noResults} "{query}"
        </Text>
      )}

      <FlatList
        data={results}
        keyExtractor={(item) => item.verseId}
        contentContainerStyle={s.list}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[s.card, { backgroundColor: theme.card, borderColor: theme.border }]}
            onPress={() => router.push(`/chapter/${item.chapterId}`)}
          >
            <Text style={[s.cardChapter, { color: theme.accent }]}>
              {item.chapterTitle} · {item.verse}
            </Text>
            {highlight(item.text)}
          </TouchableOpacity>
        )}
        ListHeaderComponent={
          results.length > 0 ? (
            <Text style={[s.resultsCount, { color: theme.textSecondary }]}>
              {results.length}{' '}
              {results.length !== 1 ? t.search.results_plural : t.search.results}
            </Text>
          ) : null
        }
      />
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1 },
  header: { paddingHorizontal: 20, paddingVertical: 16, paddingTop: 20, borderBottomWidth: 1 },
  title: { fontSize: 22, fontWeight: '700' },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 16,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    gap: 8,
  },
  input: { flex: 1, fontSize: 15 },
  hint: { textAlign: 'center', marginTop: 40, fontSize: 14 },
  list: { paddingHorizontal: 16, paddingBottom: 24 },
  resultsCount: { fontSize: 12, marginBottom: 10 },
  card: { padding: 14, borderRadius: 10, borderWidth: 1, marginBottom: 8, gap: 6 },
  cardChapter: { fontSize: 12, fontWeight: '600' },
  resultText: { fontSize: 14, lineHeight: 22 },
  highlight: { borderRadius: 3 },
});