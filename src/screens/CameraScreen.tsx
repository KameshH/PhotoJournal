import React, { useState, useRef } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Alert,
  useColorScheme,
  Modal,
  TextInput,
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
  const [showTitleModal, setShowTitleModal] = useState(false);
  const [photoPath, setPhotoPath] = useState<string>('');
  const [title, setTitle] = useState('');
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
      setPhotoPath(photo.path);
      setShowTitleModal(true);
    } catch (error) {
      console.error('Error capturing photo:', error);
      Alert.alert('Error', 'Failed to capture photo');
    } finally {
      setIsCapturing(false);
    }
  };

  const savePhoto = async () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter a title for the photo');
      return;
    }

    try {
      await addEntry(photoPath, title.trim());
      Alert.alert('Success', 'Photo saved successfully!', [
        {
          text: 'OK',
          onPress: () => {
            setShowTitleModal(false);
            setTitle('');
            setPhotoPath('');
            navigation.goBack();
          },
        },
      ]);
    } catch (error) {
      console.error('Error saving photo:', error);
      Alert.alert('Error', 'Failed to save photo');
    }
  };

  const cancelSave = () => {
    setShowTitleModal(false);
    setTitle('');
    setPhotoPath('');
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
        <TouchableOpacity
          style={styles.permissionButton}
          onPress={requestPermission}
        >
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
          <View
            style={[styles.gridLine, styles.horizontalLine, { top: '33.33%' }]}
          />
          <View
            style={[styles.gridLine, styles.horizontalLine, { top: '66.66%' }]}
          />
          <View
            style={[styles.gridLine, styles.verticalLine, { left: '33.33%' }]}
          />
          <View
            style={[styles.gridLine, styles.verticalLine, { left: '66.66%' }]}
          />
        </View>
      )}

      <View style={styles.controls}>
        <TouchableOpacity style={styles.gridButton} onPress={toggleGrid}>
          <Text style={styles.gridButtonText}>
            {showGrid ? 'Hide Grid' : 'Show Grid'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.captureButton,
            isCapturing && styles.captureButtonDisabled,
          ]}
          onPress={capturePhoto}
          disabled={isCapturing}
        >
          <View style={styles.captureButtonInner} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
      </View>
      <Modal
        visible={showTitleModal}
        transparent={true}
        animationType="slide"
        onRequestClose={cancelSave}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Photo Title</Text>
            <Text style={styles.modalSubtitle}>
              Enter a title for this photo:
            </Text>
            <TextInput
              style={styles.titleInput}
              value={title}
              onChangeText={setTitle}
              placeholder="Enter photo title..."
              placeholderTextColor="#999"
              autoFocus={true}
              returnKeyType="done"
              onSubmitEditing={savePhoto}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.modalButton} onPress={cancelSave}>
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={savePhoto}
              >
                <Text style={[styles.modalButtonText, styles.saveButtonText]}>
                  Save
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContent: {
      backgroundColor: isDarkMode ? '#333' : '#fff',
      borderRadius: 12,
      padding: 20,
      margin: 20,
      minWidth: 300,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: isDarkMode ? '#fff' : '#000',
      marginBottom: 8,
      textAlign: 'center',
    },
    modalSubtitle: {
      fontSize: 14,
      color: isDarkMode ? '#ccc' : '#666',
      marginBottom: 16,
      textAlign: 'center',
    },
    titleInput: {
      borderWidth: 1,
      borderColor: isDarkMode ? '#555' : '#ddd',
      borderRadius: 8,
      padding: 12,
      fontSize: 16,
      color: isDarkMode ? '#fff' : '#000',
      backgroundColor: isDarkMode ? '#444' : '#f9f9f9',
      marginBottom: 20,
    },
    modalButtons: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    modalButton: {
      flex: 1,
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderRadius: 8,
      marginHorizontal: 4,
      backgroundColor: isDarkMode ? '#555' : '#f0f0f0',
    },
    saveButton: {
      backgroundColor: '#007AFF',
    },
    modalButtonText: {
      textAlign: 'center',
      fontSize: 16,
      fontWeight: '600',
      color: isDarkMode ? '#fff' : '#000',
    },
    saveButtonText: {
      color: '#fff',
    },
  });

export default CameraScreen;
