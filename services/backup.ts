import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { Note } from '../types';

export async function exportNotes() {
  try {
    // Get notes from storage
    const notesJson = await AsyncStorage.getItem('note-storage');
    if (!notesJson) {
      throw new Error('No notes found');
    }

    // Create a formatted JSON string
    const notes = JSON.parse(notesJson);
    const formattedJson = JSON.stringify(notes, null, 2);

    // Create file path and write file
    const fileName = `notes_backup_${new Date().toISOString().split('T')[0]}.json`;
    const filePath = `${FileSystem.documentDirectory}${fileName}`;
    await FileSystem.writeAsStringAsync(filePath, formattedJson);

    // Check if sharing is available
    const isSharingAvailable = await Sharing.isAvailableAsync();
    if (!isSharingAvailable) {
      throw new Error('Sharing is not available');
    }

    // Share the file
    await Sharing.shareAsync(filePath, {
      mimeType: 'application/json',
      dialogTitle: 'Export Notes',
      UTI: 'public.json',
    });

    return true;
  } catch (error) {
    console.error('Error exporting notes:', error);
    throw error;
  }
}

export async function importNotes(uri: string): Promise<Note[]> {
  try {
    // Read the file content
    const content = await FileSystem.readAsStringAsync(uri);
    
    // Parse the JSON content
    const data = JSON.parse(content);
    
    // Check if the data has the expected structure
    if (!data.state || !Array.isArray(data.state.notes)) {
      throw new Error('Invalid backup file format');
    }

    // Validate and format each note
    const notes: Note[] = data.state.notes.map((note: any) => ({
      id: note.id,
      title: note.title,
      content: note.content,
      tags: Array.isArray(note.tags) ? note.tags : [],
      createdAt: new Date(note.createdAt),
      updatedAt: new Date(note.updatedAt),
      isFavorite: Boolean(note.isFavorite),
    }));

    return notes;
  } catch (error) {
    console.error('Error importing notes:', error);
    throw error;
  }
} 