import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ShoppingListCard } from '@/components/ShoppingListCard';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useShoppingStore } from '@/store/shoppingStore';
import { History, Calendar } from 'lucide-react-native';

export default function HistoryScreen() {
  const { lists, loading, fetchLists } = useShoppingStore();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchLists();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchLists();
    setRefreshing(false);
  };

  // For now, we'll show all lists as history
  // In a real app, you'd filter by archived status or completion date
  const historyLists = lists.slice().reverse();

  if (loading && !refreshing) {
    return <LoadingSpinner />;
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <History size={28} color="#007AFF" />
          <Text style={styles.title}>Shopping History</Text>
        </View>
        <TouchableOpacity style={styles.filterButton}>
          <Calendar size={24} color="#007AFF" />
        </TouchableOpacity>
      </View>

      {/* History Lists */}
      <FlatList
        data={historyLists}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ShoppingListCard
            list={item}
            itemCount={0} // This would be fetched from the database
            onPress={() => {
              // Navigate to history detail view
              console.log('View history details for:', item.id);
            }}
          />
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <History size={64} color="#8E8E93" />
            <Text style={styles.emptyTitle}>No Shopping History</Text>
            <Text style={styles.emptyDescription}>
              Your completed shopping lists will appear here
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1C1C1E',
    marginLeft: 12,
  },
  filterButton: {
    padding: 8,
  },
  listContainer: {
    paddingVertical: 16,
    flexGrow: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1C1C1E',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 16,
    color: '#8E8E93',
    textAlign: 'center',
  },
});