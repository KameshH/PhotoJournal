import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Image,
  Alert,
  useColorScheme,
  ScrollView,
  Dimensions,
} from 'react-native';
import { deleteEntry } from '../database';

interface Entry {
  id: number;
  uri: string;
  title: string;
  timestamp: string;
}

interface DetailScreenProps {
  route: {
    params: {
      entry: Entry;
    };
  };
  navigation: any;
}

const { width, height } = Dimensions.get('window');

const DetailScreen: React.FC<DetailScreenProps> = ({ route, navigation }) => {
  const { entry } = route.params;
  const isDarkMode = useColorScheme() === 'dark';

  const styles = getStyles(isDarkMode);

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp + 'Z');
    return (
      date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }) +
      ' at ' +
      date.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      })
    );
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Photo',
      'Are you sure you want to delete this photo? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteEntry(entry.id);
              Alert.alert('Success', 'Photo deleted successfully', [
                {
                  text: 'OK',
                  onPress: () => navigation.goBack(),
                },
              ]);
            } catch (error) {
              Alert.alert('Error', 'Failed to delete photo');
            }
          },
        },
      ],
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
          <Text style={styles.deleteButtonText}>Delete</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: `file://${entry.uri}` }}
            style={styles.image}
            resizeMode="contain"
          />
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.title}>{entry.title}</Text>
          <Text style={styles.timestamp}>{formatDate(entry.timestamp)}</Text>
        </View>
      </ScrollView>
    </View>
  );
};

const getStyles = (isDarkMode: boolean) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDarkMode ? '#000' : '#fff',
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 20,
      paddingTop: 60,
      paddingBottom: 20,
      borderBottomWidth: 1,
      borderBottomColor: isDarkMode ? '#333' : '#eee',
    },
    backButton: {
      paddingVertical: 8,
      paddingHorizontal: 12,
    },
    backButtonText: {
      fontSize: 16,
      color: '#007AFF',
      fontWeight: '600',
    },
    deleteButton: {
      paddingVertical: 8,
      paddingHorizontal: 12,
      backgroundColor: '#FF3B30',
      borderRadius: 8,
    },
    deleteButtonText: {
      fontSize: 16,
      color: '#fff',
      fontWeight: '600',
    },
    scrollContainer: {
      flexGrow: 1,
    },
    imageContainer: {
      width: width,
      height: height * 0.6,
      backgroundColor: isDarkMode ? '#1a1a1a' : '#f8f8f8',
      justifyContent: 'center',
      alignItems: 'center',
    },
    image: {
      width: '100%',
      height: '100%',
    },
    infoContainer: {
      padding: 20,
      flex: 1,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: isDarkMode ? '#fff' : '#000',
      marginBottom: 12,
      lineHeight: 32,
    },
    timestamp: {
      fontSize: 16,
      color: isDarkMode ? '#aaa' : '#666',
      lineHeight: 24,
    },
  });

export default DetailScreen;
