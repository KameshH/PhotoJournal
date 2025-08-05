# Photo Journal - React Native App

A React Native photo journal application that allows users to capture photos with a rule-of-thirds grid overlay, store them locally with SQLite, and view them in a gallery with dark mode support.

## Features

- 📷 **Camera Integration**: Capture photos using react-native-vision-camera
- 📐 **Rule-of-Thirds Grid**: Toggle overlay grid for better photo composition
- 💾 **Local Storage**: SQLite database for persistent photo storage
- 🌙 **Dark Mode**: Automatic system appearance detection
- 📱 **Gallery View**: Grid layout with pull-to-refresh functionality
- 🔍 **Detail View**: Full-size image display with delete functionality
- 🎨 **Responsive Design**: Optimized for both iOS and Android

## Tech Stack

- **Framework**: React Native CLI (no Expo)
- **Database**: SQLite via react-native-sqlite-storage
- **Camera**: react-native-vision-camera
- **Navigation**: React Navigation v6
- **Language**: TypeScript

## Project Structure

```
PhotoJournal/
├── src/
│   ├── components/          # Reusable components
│   ├── screens/            # Screen components
│   │   ├── CameraScreen.tsx
│   │   ├── GalleryScreen.tsx
│   │   └── DetailScreen.tsx
│   ├── navigation/         # Navigation configuration
│   │   └── AppNavigator.tsx
│   ├── theme/             # Theme and styling
│   │   └── ThemeContext.tsx
│   ├── database.js        # SQLite operations
│   └── App.tsx           # Main app component
├── android/              # Android-specific files
├── ios/                 # iOS-specific files
└── __tests__/          # Test files
```

## Installation & Setup

### Prerequisites

- Node.js (v14 or higher)
- React Native CLI
- Android Studio (for Android development)
- Xcode (for iOS development, macOS only)

### 1. Clone the Repository

```bash
git clone <repository-url>
cd PhotoJournal
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Install iOS Dependencies (iOS only)

```bash
cd ios && pod install && cd ..
```

### 4. Link Native Modules

The project uses autolinking, but if you encounter issues:

```bash
npx react-native link
```

## Permissions Configuration

### Android Permissions

The app requires camera and storage permissions. Add these to `android/app/src/main/AndroidManifest.xml`:

```xml
<uses-permission android:name="android.permission.CAMERA" />
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
```

### iOS Permissions

Add these permissions to `ios/PhotoJournal/Info.plist`:

```xml
<key>NSCameraUsageDescription</key>
<string>This app needs access to camera to take photos for your journal.</string>
<key>NSPhotoLibraryUsageDescription</key>
<string>This app needs access to photo library to save your journal photos.</string>
```

## Running the App

### Android

1. Start Metro bundler:
```bash
npm start
```

2. Run on Android device/emulator:
```bash
npm run android
```

### iOS

1. Start Metro bundler:
```bash
npm start
```

2. Run on iOS device/simulator:
```bash
npm run ios
```

## Testing Dark Mode

To test dark mode functionality:

### Android
1. Go to Settings > Display > Dark theme
2. Toggle dark mode on/off
3. Return to the app to see theme changes

### iOS
1. Go to Settings > Display & Brightness
2. Select Light/Dark mode
3. Return to the app to see theme changes

## Database Schema

The app uses SQLite with the following table structure:

```sql
CREATE TABLE entries (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  uri TEXT NOT NULL,
  title TEXT NOT NULL,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

## Key Features Implementation

### Rule-of-Thirds Grid
- Toggle button in camera screen
- Overlay with 3x3 grid lines
- Real-time show/hide functionality

### Dark Mode
- Uses React Native's `useColorScheme()` hook
- Automatic system appearance detection
- Consistent theming across all screens

### Photo Storage
- Photos saved to device storage
- File paths stored in SQLite database
- CRUD operations for photo entries

## Troubleshooting

### Common Issues

1. **Metro bundler issues**:
```bash
npm start -- --reset-cache
```

2. **Android build issues**:
```bash
cd android && ./gradlew clean && cd ..
npm run android
```

3. **iOS build issues**:
```bash
cd ios && pod install && cd ..
npm run ios
```

4. **Camera permissions not working**:
- Ensure permissions are added to platform-specific files
- Restart the app after adding permissions
- Check device settings for app permissions

### Performance Tips

- The app automatically optimizes image loading
- Database queries are optimized for performance
- Pull-to-refresh prevents unnecessary re-renders

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Acknowledgments

- React Native community for excellent documentation
- react-native-vision-camera for robust camera functionality
- react-native-sqlite-storage for reliable local storage

