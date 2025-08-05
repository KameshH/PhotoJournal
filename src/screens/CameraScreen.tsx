import React, { useState, useRef } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Alert,
  useColorScheme,
} from 'react-native';
import {
  Camera,
  useCameraDevices,
  useCameraPermission,
  PhotoFile,
} from 'react-native-vision-camera';
import { addEntry } from '../database';

interface CameraScreenProps {
  navigation: any;
}

const CameraScreen: React.FC<CameraScreenProps> = ({ navigation }) => {
  const [showGrid, setShowGrid] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const camera = useRef<Camera>(null);
  const devices = useCameraDevices();
  const device = devices.find(d => d.position === 'back');
  const { hasPermission, requestPermission } = useCameraPermission();
  const isDarkMode = useColorScheme() === 'dark';

  const styles = getStyles(isDarkMode);

  React.useEffect(() => {
    if (!hasPermission) {
      requestPermission();
    }
  }, [hasPermission, requestPermission]);

  const capturePhoto = async () => {
    if (!camera.current || isCapturing) return;

    try {
      setIsCapturing(true);
      const photo: PhotoFile = await camera.current.takePhoto({
        flash: 'off',
      });

      // Show title input dialog
      Alert.prompt(
        'Photo Title',
        'Enter a title for this photo:',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Save',
            onPress: async (title: string | undefined) => {
              if (title) {
                try {
                  await addEntry(photo.path, title);
                  Alert.alert('Success', 'Photo saved successfully!', [
                    {
                      text: 'OK',
                      onPress: () => navigation.goBack(),
                    },
                  ]);
                } catch (error) {
                  Alert.alert('Error', 'Failed to save photo');
                }
              }
            },
          },
        ],
        'plain-text',
        '',
        'default'
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to capture photo');
    } finally {
      setIsCapturing(false);
    }
  };

  const toggleGrid = () => {
    setShowGrid(!showGrid);
  };

  if (!hasPermission) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionText}>
          Camera permission is required to use this feature
        </Text>
        <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
          <Text style={styles.permissionButtonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!device) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionText}>No camera device found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Camera
        ref={camera}
        style={styles.camera}
        device={device}
        isActive={true}
        photo={true}
      />
      
      {showGrid && (
        <View style={styles.gridOverlay}>
          {/* Horizontal lines */}
          <View style={[styles.gridLine, styles.horizontalLine, { top: '33.33%' }]} />
          <View style={[styles.gridLine, styles.horizontalLine, { top: '66.66%' }]} />
          {/* Vertical lines */}
          <View style={[styles.gridLine, styles.verticalLine, { left: '33.33%' }]} />
          <View style={[styles.gridLine, styles.verticalLine, { left: '66.66%' }]} />
        </View>
      )}

      <View style={styles.controls}>
        <TouchableOpacity style={styles.gridButton} onPress={toggleGrid}>
          <Text style={styles.gridButtonText}>
            {showGrid ? 'Hide Grid' : 'Show Grid'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.captureButton, isCapturing && styles.captureButtonDisabled]}
          onPress={capturePhoto}
          disabled={isCapturing}
        >
          <View style={styles.captureButtonInner} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const getStyles = (isDarkMode: boolean) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDarkMode ? '#000' : '#fff',
    },
    camera: {
      flex: 1,
    },
    gridOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      pointerEvents: 'none',
    },
    gridLine: {
      position: 'absolute',
      backgroundColor: 'rgba(255, 255, 255, 0.5)',
    },
    horizontalLine: {
      left: 0,
      right: 0,
      height: 1,
    },
    verticalLine: {
      top: 0,
      bottom: 0,
      width: 1,
    },
    controls: {
      position: 'absolute',
      bottom: 50,
      left: 0,
      right: 0,
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems: 'center',
      paddingHorizontal: 20,
    },
    gridButton: {
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      paddingHorizontal: 15,
      paddingVertical: 10,
      borderRadius: 20,
    },
    gridButtonText: {
      color: '#fff',
      fontSize: 14,
      fontWeight: '600',
    },
    captureButton: {
      width: 70,
      height: 70,
      borderRadius: 35,
      backgroundColor: 'rgba(255, 255, 255, 0.3)',
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 3,
      borderColor: '#fff',
    },
    captureButtonDisabled: {
      opacity: 0.5,
    },
    captureButtonInner: {
      width: 50,
      height: 50,
      borderRadius: 25,
      backgroundColor: '#fff',
    },
    backButton: {
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      paddingHorizontal: 15,
      paddingVertical: 10,
      borderRadius: 20,
    },
    backButtonText: {
      color: '#fff',
      fontSize: 14,
      fontWeight: '600',
    },
    permissionContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: isDarkMode ? '#000' : '#fff',
      padding: 20,
    },
    permissionText: {
      color: isDarkMode ? '#fff' : '#000',
      fontSize: 16,
      textAlign: 'center',
      marginBottom: 20,
    },
    permissionButton: {
      backgroundColor: '#007AFF',
      paddingHorizontal: 20,
      paddingVertical: 10,
      borderRadius: 8,
    },
    permissionButtonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: '600',
    },
  });

export default CameraScreen;

