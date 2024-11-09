import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { Note } from '../types';

export async function exportNotes() {
  try {
    const notesJson = await AsyncStorage.getItem('note-storage');
    if (!notesJson) return;

    const filePath = `${FileSystem.documentDirectory}notes-backup.json`;
    await FileSystem.writeAsStringAsync(filePath, notesJson);

    await Sharing.shareAsync(filePath, {
      mimeType: 'application/json',
      dialogTitle: 'Export Notes',
    });
  } catch (error) {
    console.error('Error exporting notes:', error);
    throw error;
  }
}

export async function importNotes(uri: string): Promise<Note[]> {
  try {
    const content = await FileSystem.readAsStringAsync(uri);
    const data = JSON.parse(content);
    return data.state.notes;
  } catch (error) {
    console.error('Error importing notes:', error);
    throw error;
  }
} 