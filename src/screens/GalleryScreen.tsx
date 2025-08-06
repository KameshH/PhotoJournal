import React, { useState, useCallback } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Text,
  Image,
  RefreshControl,
  useColorScheme,
  Alert,
  Dimensions,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getEntries } from '../database';

interface Entry {
  id: number;
  uri: string;
  title: string;
  timestamp: string;
}

interface GalleryScreenProps {
  navigation: any;
}

const { width } = Dimensions.get('window');
const ITEM_WIDTH = (width - 30) / 2; // 2 columns with padding

const GalleryScreen: React.FC<GalleryScreenProps> = ({ navigation }) => {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const isDarkMode = useColorScheme() === 'dark';

  const styles = getStyles(isDarkMode);

  const loadEntries = async () => {
    try {
      const data = await getEntries();
      setEntries(data);
    } catch (error) {
      Alert.alert('Error', 'Failed to load photos');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadEntries();
    setRefreshing(false);
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadEntries();
    }, []),
  );

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp + 'Z');
    return (
      date.toLocaleDateString() +
      ' ' +
      date.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      })
    );
  };

  const renderItem = ({ item }: { item: Entry }) => (
    <TouchableOpacity
      style={styles.itemContainer}
      onPress={() => navigation.navigate('Detail', { entry: item })}
    >
      <Image source={{ uri: `file://${item.uri}` }} style={styles.thumbnail} />
      <View style={styles.itemInfo}>
        <Text style={styles.title} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={styles.timestamp}>{formatDate(item.timestamp)}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>No photos yet</Text>
      <Text style={styles.emptySubtext}>
        Tap the camera button to capture your first photo
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Photo Journal</Text>
        <TouchableOpacity
          style={styles.cameraButton}
          onPress={() => navigation.navigate('Camera')}
        >
          <Text style={styles.cameraButtonText}>📷</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={entries}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        numColumns={2}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={isDarkMode ? '#fff' : '#000'}
          />
        }
        ListEmptyComponent={!loading ? renderEmptyComponent : null}
        showsVerticalScrollIndicator={false}
      />
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
    headerTitle: {
      fontSize: 24,
      fontWeight: 'bold',
      color: isDarkMode ? '#fff' : '#000',
    },
    cameraButton: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: '#007AFF',
      justifyContent: 'center',
      alignItems: 'center',
    },
    cameraButtonText: {
      fontSize: 20,
    },
    listContainer: {
      padding: 10,
      flexGrow: 1,
    },
    itemContainer: {
      width: ITEM_WIDTH,
      marginHorizontal: 5,
      marginVertical: 5,
      backgroundColor: isDarkMode ? '#1a1a1a' : '#f8f8f8',
      borderRadius: 12,
      overflow: 'hidden',
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 3.84,
    },
    thumbnail: {
      width: '100%',
      height: ITEM_WIDTH * 0.75,
      backgroundColor: isDarkMode ? '#333' : '#ddd',
    },
    itemInfo: {
      padding: 12,
    },
    title: {
      fontSize: 14,
      fontWeight: '600',
      color: isDarkMode ? '#fff' : '#000',
      marginBottom: 4,
    },
    timestamp: {
      fontSize: 12,
      color: isDarkMode ? '#aaa' : '#666',
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingTop: 100,
    },
    emptyText: {
      fontSize: 18,
      fontWeight: '600',
      color: isDarkMode ? '#fff' : '#000',
      marginBottom: 8,
    },
    emptySubtext: {
      fontSize: 14,
      color: isDarkMode ? '#aaa' : '#666',
      textAlign: 'center',
      paddingHorizontal: 40,
    },
  });

export default GalleryScreen;
