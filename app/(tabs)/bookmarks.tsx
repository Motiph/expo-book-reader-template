import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../src/hooks/useTheme';
import { useBookStore } from '../../src/store/useBookStore';
import { useTranslation } from '../../src/hooks/useTranslation';

export default function BookmarksScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const { bookmarks, removeBookmark } = useBookStore();
  const t = useTranslation();

  const handleDelete = (verseId: string) => {
    Alert.alert(t.bookmarks.deleteTitle, t.bookmarks.deleteMsg, [
      { text: t.bookmarks.cancel, style: 'cancel' },
      {
        text: t.bookmarks.delete,
        style: 'destructive',
        onPress: () => removeBookmark(verseId),
      },
    ]);
  };

  return (
    <SafeAreaView style={[s.safe, { backgroundColor: theme.background }]}>
      <View style={[s.header, { borderBottomColor: theme.border }]}>
        <Text style={[s.title, { color: theme.text }]}>{t.bookmarks.title}</Text>
        {bookmarks.length > 0 && (
          <View style={[s.badge, { backgroundColor: theme.accent }]}>
            <Text style={s.badgeText}>{bookmarks.length}</Text>
          </View>
        )}
      </View>

      {bookmarks.length === 0 && (
        <View style={s.empty}>
          <Ionicons name="bookmark-outline" size={48} color={theme.border} />
          <Text style={[s.emptyTitle, { color: theme.text }]}>{t.bookmarks.empty}</Text>
          <Text style={[s.emptySub, { color: theme.textSecondary }]}>
            {t.bookmarks.emptySub}
          </Text>
        </View>
      )}

      <FlatList
        data={bookmarks}
        keyExtractor={(item) => item.verseId}
        contentContainerStyle={s.list}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              s.card,
              {
                backgroundColor: theme.card,
                borderColor: theme.border,
                borderLeftColor: theme.accent,
              },
            ]}
            onPress={() => router.push(`/chapter/${item.chapterId}`)}
          >
            <View style={s.cardTop}>
              <Text style={[s.cardChapter, { color: theme.accent }]}>
                {item.chapterTitle}
              </Text>
              <TouchableOpacity onPress={() => handleDelete(item.verseId)}>
                <Ionicons name="trash-outline" size={16} color={theme.textSecondary} />
              </TouchableOpacity>
            </View>
            <Text style={[s.cardText, { color: theme.text }]} numberOfLines={3}>
              {item.verseText}
            </Text>
            <Text style={[s.cardDate, { color: theme.textSecondary }]}>
              {new Date(item.createdAt).toLocaleDateString('es-MX', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              })}
            </Text>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingTop: 20,
    borderBottomWidth: 1,
  },
  title: { fontSize: 22, fontWeight: '700' },
  badge: { borderRadius: 10, paddingHorizontal: 7, paddingVertical: 2 },
  badgeText: { color: '#fff', fontSize: 12, fontWeight: '600' },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12, padding: 40 },
  emptyTitle: { fontSize: 18, fontWeight: '600' },
  emptySub: { fontSize: 14, textAlign: 'center', lineHeight: 22 },
  list: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 24 },
  card: {
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderLeftWidth: 3,
    marginBottom: 8,
    gap: 6,
  },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardChapter: { fontSize: 12, fontWeight: '600' },
  cardText: { fontSize: 14, lineHeight: 22 },
  cardDate: { fontSize: 11 },
});