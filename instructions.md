# Note Taking App - Technical Requirements Document

## Table of Contents
- [1. Core Features](#1-core-features)
- [2. Storage Implementation](#2-storage-implementation)
- [3. UI/UX Specifications](#3-uiux-specifications)
- [4. Additional Features](#4-additional-features)
- [5. Technical Requirements](#5-technical-requirements)
- [6. Development Phases](#6-development-phases)
- [7. Testing Strategy](#7-testing-strategy)
- [8. Deployment](#8-deployment)
- [9. Project Structure](#9-project-structure)

## 1. Core Features

### CRUD Operations
- Create new notes with title and content
- Read/view existing notes in both list and detailed views
- Update/edit existing notes
- Delete notes with confirmation
- Support for plain text with basic Markdown formatting
- Categorize notes with tags (up to 3 tags per note)

### Data Structure
```typescript
interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  isFavorite: boolean;
}
```

## 2. Storage Implementation

### Local Storage
- Use AsyncStorage for local data persistence
- Implement data migration strategy for app updates
- Store notes in a structured format for efficient querying
- Regular auto-save during note editing
- Backup notes to device storage

## 3. UI/UX Specifications

### Theme Support
- Light and dark mode themes
- Custom color schemes for note categories
- Support for system theme preferences

### Layout & Navigation
- Bottom tab navigation with:
  - Notes List
  - Categories
  - Search
  - Settings
- Support both list and grid views for notes
- Swipe actions for quick note actions (delete, favorite)
- Pull-to-refresh for note list

### Search & Filtering
- Full-text search across notes
- Filter by tags
- Sort by date, title, or favorites
- Recent searches history

## 4. Additional Features

### Attachments
- Support for image attachments
- Image compression for storage efficiency
- Basic image editing (crop, rotate)

### Export/Import
- Export notes as PDF or plain text
- Batch export functionality
- Import notes from text files
- Share notes via system share sheet

### Local Backup
- Automatic daily backup to device storage
- Manual backup trigger option
- Restore from backup functionality

## 5. Technical Requirements

### Development Environment
- React Native latest stable version
- TypeScript for type safety
- ESLint and Prettier for code formatting
- Jest for unit testing

### Dependencies
```json
{
  "core": {
    "react-native": "latest",
    "react-navigation": "^6.x",
    "@react-native-async-storage/async-storage": "^1.x"
  },
  "ui": {
    "react-native-paper": "^5.x",
    "react-native-vector-icons": "^9.x"
  },
  "utils": {
    "date-fns": "^2.x",
    "react-native-markdown-display": "^7.x",
    "react-native-fs": "^2.x"
  }
}
```

### Performance Requirements
- App launch time under 2 seconds
- Smooth scrolling (60 fps)
- Offline functionality
- Maximum storage limit: Based on device storage

## 6. Development Phases

### Phase 1: Core Features (1 week)
- Basic CRUD operations
- Local storage implementation
- Simple UI implementation

### Phase 2: Enhanced Features (1 week)
- Search functionality
- Tags and categories
- Attachments support

### Phase 3: Polish & Testing (1 week)
- UI/UX improvements
- Performance optimization
- Bug fixes and testing

## 7. Testing Strategy

### Unit Testing
- Test all utility functions
- Test data persistence logic
- Test search functionality

### Integration Testing
- Test navigation flows
- Test offline functionality
- Test import/export features

### UI Testing
- Test responsive layouts
- Test theme switching
- Test accessibility features

## 8. Deployment

### App Store Requirements
- Privacy policy
- App store screenshots
- App description
- Marketing materials

### Release Strategy
- Beta testing through TestFlight/Internal Testing
- Staged rollout
- Version control strategy
## 9. Project Structure
```
├── app/
│   ├── (tabs)/
│   │   ├── index.tsx
│   │   ├── search.tsx
│   │   ├── categories.tsx
│   │   └── settings.tsx
│   ├── note/
│   │   ├── [id].tsx
│   │   └── new.tsx
│   ├── modal/
│   │   └── note-editor.tsx
│   └── _layout.tsx
├── assets/
│   ├── fonts/
│   ├── images/
│   ├── icon.png
│   ├── splash.png
│   └── adaptive-icon.png
├── components/
│   ├── notes/
│   │   ├── NoteCard.tsx
│   │   ├── NoteList.tsx
│   │   └── NoteEditor.tsx
│   ├── categories/
│   │   ├── CategoryList.tsx
│   │   └── CategoryPicker.tsx
│   └── ui/
│       ├── Button.tsx
│       ├── Input.tsx
│       └── Card.tsx
├── hooks/
│   ├── useNoteStore.ts
│   ├── useSearch.ts
│   ├── useTheme.ts
│   └── useStorage.ts
├── services/
│   ├── storage.ts
│   ├── backup.ts
│   └── sharing.ts
├── utils/
│   ├── markdown.ts
│   ├── date.ts
│   └── validation.ts
├── constants/
│   ├── Colors.ts
│   ├── Layout.ts
│   └── Config.ts
├── types/
│   └── index.ts
├── app.json
├── babel.config.js
├── tsconfig.json
├── package.json
├── eas.json
└── .gitignore
```

## 10. File Structure Details

### App Directory (`app/`)
- `(tabs)/` - Main tab navigation screens
  - `index.tsx` - Home screen with notes list
  - `search.tsx` - Search functionality
  - `categories.tsx` - Categories management
  - `settings.tsx` - App settings
- `note/` - Note-related screens
  - `[id].tsx` - Note detail/edit screen
  - `new.tsx` - Create new note screen
- `modal/` - Modal screens
  - `note-editor.tsx` - Full-screen note editor
- `_layout.tsx` - Root layout component

### Components Directory (`components/`)
- `notes/` - Note-related components
- `categories/` - Category-related components
- `ui/` - Reusable UI components

### Assets Directory (`assets/`)
- Static assets like images and fonts
- App icons and splash screens

### Configuration Files
```typescript
// app.config.ts
export default {
  expo: {
    name: "Note Taking App",
    slug: "note-taking-app",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "automatic",
    splash: {
      image: "./assets/splash.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff"
    },
    assetBundlePatterns: [
      "**/*"
    ],
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.yourcompany.notetakingapp"
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#ffffff"
      },
      package: "com.yourcompany.notetakingapp"
    },
    plugins: [
      [
        "expo-image-picker",
        {
          "photosPermission": "The app accesses your photos to let you share them with your friends."
        }
      ],
      "expo-file-system",
      "expo-sharing"
    ]
  }
};
```
