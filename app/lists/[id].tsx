import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ListItemCard } from '@/components/ListItemCard';
import { ItemInputModal } from '@/components/ItemInputModal';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Button } from '@/components/ui/Button';
import { useShoppingStore } from '@/store/shoppingStore';
import { ListItem } from '@/types/database';
import {
  ArrowLeft,
  Plus,
  Camera,
  Upload,
  Zap,
  MoreVertical,
  DollarSign,
} from 'lucide-react-native';

export default function ListDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const {
    currentList,
    currentItems,
    loading,
    fetchListItems,
    addItem,
    updateItem,
    deleteItem,
    toggleItemTicked,
    setCurrentList,
  } = useShoppingStore();

  const [modalVisible, setModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState<ListItem | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (id) {
      fetchListItems(id);
      // Find and set current list
      const { lists } = useShoppingStore.getState();
      const list = lists.find(l => l.id === id);
      if (list) {
        setCurrentList(list);
      }
    }
  }, [id]);

  const onRefresh = async () => {
    if (id) {
      setRefreshing(true);
      await fetchListItems(id);
      setRefreshing(false);
    }
  };

  const handleAddItem = () => {
    setEditingItem(null);
    setModalVisible(true);
  };

  const handleEditItem = (item: ListItem) => {
    setEditingItem(item);
    setModalVisible(true);
  };

  const handleSaveItem = async (itemData: Partial<ListItem>) => {
    if (!id) return;

    if (editingItem) {
      await updateItem(editingItem.id, itemData);
    } else {
      await addItem(id, itemData);
    }
  };

  const handleDeleteItem = (item: ListItem) => {
    Alert.alert(
      'Delete Item',
      `Are you sure you want to delete "${item.item_name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteItem(item.id),
        },
      ]
    );
  };

  const handleOptimizeCart = () => {
    Alert.alert(
      'Optimize Cart',
      'This feature will help you find better prices for your items. Would you like to continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Optimize',
          onPress: () => {
            // Navigate to optimization flow
            console.log('Starting optimization...');
          },
        },
      ]
    );
  };

  const handleInputMethod = () => {
    Alert.alert(
      'Add Items',
      'Choose how you want to add items to your list:',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Manual Entry', onPress: handleAddItem },
        { text: 'Camera Scan', onPress: () => console.log('Camera scan') },
        { text: 'Upload File', onPress: () => console.log('Upload file') },
      ]
    );
  };

  const completedItems = currentItems.filter(item => item.is_ticked_off);
  const pendingItems = currentItems.filter(item => !item.is_ticked_off);
  const progress = currentItems.length > 0 ? (completedItems.length / currentItems.length) * 100 : 0;

  if (loading && !refreshing) {
    return <LoadingSpinner />;
  }

  if (!currentList) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>List not found</Text>
          <Button title="Go Back" onPress={() => router.back()} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#007AFF" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.listTitle} numberOfLines={1}>
            {currentList.list_title}
          </Text>
          <Text style={styles.progressText}>
            {completedItems.length} of {currentItems.length} items
          </Text>
        </View>
        <TouchableOpacity style={styles.moreButton}>
          <MoreVertical size={24} color="#007AFF" />
        </TouchableOpacity>
      </View>

      {/* Progress Bar */}
      {currentItems.length > 0 && (
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${progress}%` }]} />
          </View>
          <Text style={styles.progressPercentage}>{Math.round(progress)}%</Text>
        </View>
      )}

      {/* Savings Display */}
      {currentList.is_currently_optimized && (
        <View style={styles.savingsContainer}>
          <DollarSign size={20} color="#34C759" />
          <Text style={styles.savingsText}>Total Savings: $0.00</Text>
        </View>
      )}

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <Button
          title="Add Items"
          onPress={handleInputMethod}
          style={styles.actionButton}
        />
        <Button
          title="Optimize Cart"
          onPress={handleOptimizeCart}
          variant="secondary"
          style={styles.actionButton}
        />
      </View>

      {/* Items List */}
      <FlatList
        data={[...pendingItems, ...completedItems]}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ListItemCard
            item={item}
            onToggleTicked={() => toggleItemTicked(item.id)}
            onEdit={() => handleEditItem(item)}
          />
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Plus size={64} color="#8E8E93" />
            <Text style={styles.emptyTitle}>No Items Yet</Text>
            <Text style={styles.emptyDescription}>
              Add items to your shopping list to get started
            </Text>
            <Button
              title="Add Your First Item"
              onPress={handleAddItem}
              style={styles.emptyButton}
            />
          </View>
        }
      />

      {/* Floating Action Button */}
      {currentItems.length > 0 && (
        <TouchableOpacity style={styles.fab} onPress={handleAddItem}>
          <Plus size={28} color="#FFFFFF" />
        </TouchableOpacity>
      )}

      {/* Item Input Modal */}
      <ItemInputModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSave={handleSaveItem}
        item={editingItem}
        title={editingItem ? 'Edit Item' : 'Add Item'}
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
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  headerContent: {
    flex: 1,
  },
  listTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1C1C1E',
  },
  progressText: {
    fontSize: 14,
    color: '#8E8E93',
    marginTop: 2,
  },
  moreButton: {
    padding: 8,
    marginLeft: 8,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: '#E5E5EA',
    borderRadius: 4,
    marginRight: 12,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#34C759',
    borderRadius: 4,
  },
  progressPercentage: {
    fontSize: 14,
    fontWeight: '600',
    color: '#34C759',
    minWidth: 40,
    textAlign: 'right',
  },
  savingsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    backgroundColor: '#E8F5E8',
    marginHorizontal: 16,
    marginTop: 8,
    borderRadius: 12,
  },
  savingsText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#34C759',
    marginLeft: 8,
  },
  actionButtons: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 4,
  },
  listContainer: {
    paddingVertical: 8,
    flexGrow: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 64,
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
    marginBottom: 24,
  },
  emptyButton: {
    paddingHorizontal: 32,
  },
  fab: {
    position: 'absolute',
    bottom: 32,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  errorText: {
    fontSize: 18,
    color: '#FF3B30',
    marginBottom: 16,
  },
});