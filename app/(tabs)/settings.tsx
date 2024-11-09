import { View, Text, Switch, StyleSheet, Alert, ScrollView } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import useTheme from '../../hooks/useTheme';
import { exportNotes, importNotes } from '../../services/backup';
import useNoteStore from '../../hooks/useNoteStore';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import { Ionicons } from '@expo/vector-icons';

export default function SettingsScreen() {
  const { isDark, toggleTheme, colors } = useTheme();
  const updateNotes = useNoteStore((state) => state.updateNotes);

  const handleExport = async () => {
    try {
      await exportNotes();
      Alert.alert(
        'Success',
        'Notes exported successfully. Check your downloads or shared location.'
      );
    } catch (error) {
      Alert.alert(
        'Export Failed',
        error instanceof Error ? error.message : 'Failed to export notes'
      );
    }
  };

  const handleImport = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/json',
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets?.[0]?.uri) {
        const notes = await importNotes(result.assets[0].uri);
        if (notes && Array.isArray(notes)) {
          updateNotes(notes);
          Alert.alert('Success', `${notes.length} notes imported successfully`);
        } else {
          throw new Error('Invalid backup file format');
        }
      }
    } catch (error) {
      Alert.alert(
        'Import Failed',
        error instanceof Error ? error.message : 'Failed to import notes'
      );
    }
  };

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
    >
      <Card style={styles.section}>
        <View style={styles.sectionHeader}>
          <Ionicons name="color-palette-outline" size={24} color={colors.primary} />
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Appearance
          </Text>
        </View>
        <View style={styles.setting}>
          <Text style={[styles.settingText, { color: colors.text }]}>
            Dark Mode
          </Text>
          <Switch
            value={isDark}
            onValueChange={toggleTheme}
            trackColor={{ false: colors.border, true: colors.primaryLight }}
            thumbColor={isDark ? colors.primary : colors.surface}
          />
        </View>
      </Card>

      <Card style={styles.section}>
        <View style={styles.sectionHeader}>
          <Ionicons name="cloud-upload-outline" size={24} color={colors.primary} />
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Backup & Restore
          </Text>
        </View>
        <View style={styles.buttonContainer}>
          <Button
            title="Export Notes"
            onPress={handleExport}
            style={styles.button}
          />
          <Button
            title="Import Notes"
            onPress={handleImport}
            variant="outline"
            style={styles.button}
          />
        </View>
      </Card>

      <Card style={styles.section}>
        <View style={styles.sectionHeader}>
          <Ionicons name="information-circle-outline" size={24} color={colors.primary} />
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            About
          </Text>
        </View>
        <Text style={[styles.version, { color: colors.textSecondary }]}>
          Version 1.0.0
        </Text>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
    gap: 16,
  },
  section: {
    padding: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  setting: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  settingText: {
    fontSize: 16,
  },
  buttonContainer: {
    gap: 12,
  },
  button: {
    width: '100%',
  },
  version: {
    fontSize: 16,
  },
}); 