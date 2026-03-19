import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Pressable,
} from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { useLanguageStore } from '../store/useLanguageStore';
import { LANGUAGES, Language } from '../locales';
import { useTranslation } from '../hooks/useTranslation';
import { Ionicons } from '@expo/vector-icons';

interface Props {
  visible: boolean;
  onClose: () => void;
}

export default function LanguageModal({ visible, onClose }: Props) {
  const { theme } = useTheme();
  const { language, setLanguage } = useLanguageStore();
  const t = useTranslation();

  const handleSelect = (code: Language) => {
    setLanguage(code);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable
        style={s.overlay}
        onPress={onClose}
      >
        <Pressable
          style={[s.modal, { backgroundColor: theme.card, borderColor: theme.border }]}
          onPress={() => {}}
        >
          <View style={[s.modalHeader, { borderBottomColor: theme.border }]}>
            <Text style={[s.modalTitle, { color: theme.text }]}>
              {t.language.select}
            </Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={22} color={theme.textSecondary} />
            </TouchableOpacity>
          </View>

          {LANGUAGES.map((lang) => {
            const selected = lang.code === language;
            return (
              <TouchableOpacity
                key={lang.code}
                style={[
                  s.langRow,
                  {
                    borderBottomColor: theme.border,
                    backgroundColor: selected ? theme.accent + '15' : 'transparent',
                  },
                ]}
                onPress={() => handleSelect(lang.code)}
              >
                <Text style={s.flag}>{lang.flag}</Text>
                <Text style={[s.langLabel, { color: theme.text }]}>
                  {lang.label}
                </Text>
                {selected && (
                  <Ionicons name="checkmark" size={18} color={theme.accent} />
                )}
              </TouchableOpacity>
            );
          })}
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const s = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: '#00000066',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  modal: {
    width: '100%',
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
  },
  modalTitle: { fontSize: 16, fontWeight: '600' },
  langRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    gap: 12,
  },
  flag: { fontSize: 24 },
  langLabel: { flex: 1, fontSize: 15 },
});