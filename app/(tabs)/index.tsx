import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useShoppingStore } from '@/store/shoppingStore';
import { useAuthStore } from '@/store/authStore';
import { 
  ShoppingCart, 
  DollarSign, 
  TrendingUp, 
  Plus,
  CheckCircle,
  Clock,
  Target
} from 'lucide-react-native';

export default function DashboardScreen() {
  const { user } = useAuthStore();
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

  const activeLists = lists.filter(list => list.status === 'active');
  const totalItems = 0; // This would be calculated from actual items
  const totalSavings = 0; // This would be calculated from optimizations
  const recentLists = lists.slice(0, 3);

  if (loading && !refreshing) {
    return <LoadingSpinner />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Good morning!</Text>
            <Text style={styles.userName}>{user?.email?.split('@')[0] || 'User'}</Text>
          </View>
          <TouchableOpacity 
            style={styles.addButton}
            onPress={() => router.push('/lists/create')}
          >
            <Plus size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Quick Stats */}
        <View style={styles.statsContainer}>
          <Card style={styles.statCard}>
            <View style={styles.statContent}>
              <View style={styles.statIcon}>
                <ShoppingCart size={24} color="#007AFF" />
              </View>
              <View style={styles.statText}>
                <Text style={styles.statNumber}>{activeLists.length}</Text>
                <Text style={styles.statLabel}>Active Lists</Text>
              </View>
            </View>
          </Card>

          <Card style={styles.statCard}>
            <View style={styles.statContent}>
              <View style={styles.statIcon}>
                <CheckCircle size={24} color="#34C759" />
              </View>
              <View style={styles.statText}>
                <Text style={styles.statNumber}>{totalItems}</Text>
                <Text style={styles.statLabel}>Items to Buy</Text>
              </View>
            </View>
          </Card>
        </View>

        {/* Savings Hub */}
        <Card style={styles.savingsCard}>
          <View style={styles.cardHeader}>
            <View style={styles.cardTitleContainer}>
              <DollarSign size={24} color="#34C759" />
              <Text style={styles.cardTitle}>Your Savings Hub</Text>
            </View>
            <TrendingUp size={20} color="#34C759" />
          </View>
          
          <View style={styles.savingsContent}>
            <View style={styles.savingsItem}>
              <Text style={styles.savingsAmount}>${totalSavings.toFixed(2)}</Text>
              <Text style={styles.savingsLabel}>Total Saved</Text>
            </View>
            <View style={styles.savingsItem}>
              <Text style={styles.savingsAmount}>$0.00</Text>
              <Text style={styles.savingsLabel}>This Month</Text>
            </View>
            <View style={styles.savingsItem}>
              <Text style={styles.savingsAmount}>$0.00</Text>
              <Text style={styles.savingsLabel}>Last Optimization</Text>
            </View>
          </View>
        </Card>

        {/* Quick Actions */}
        <Card style={styles.actionsCard}>
          <Text style={styles.cardTitle}>Quick Actions</Text>
          <View style={styles.actionsGrid}>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => router.push('/lists/create')}
            >
              <Plus size={32} color="#007AFF" />
              <Text style={styles.actionText}>New List</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => router.push('/lists')}
            >
              <ShoppingCart size={32} color="#007AFF" />
              <Text style={styles.actionText}>My Lists</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => router.push('/history')}
            >
              <Clock size={32} color="#007AFF" />
              <Text style={styles.actionText}>History</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => router.push('/analytics')}
            >
              <Target size={32} color="#007AFF" />
              <Text style={styles.actionText}>Analytics</Text>
            </TouchableOpacity>
          </View>
        </Card>

        {/* Recent Lists */}
        {recentLists.length > 0 && (
          <Card style={styles.recentCard}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Recent Lists</Text>
              <TouchableOpacity onPress={() => router.push('/lists')}>
                <Text style={styles.seeAllText}>See All</Text>
              </TouchableOpacity>
            </View>
            
            {recentLists.map((list) => (
              <TouchableOpacity
                key={list.id}
                style={styles.recentItem}
                onPress={() => router.push(`/lists/${list.id}`)}
              >
                <View style={styles.recentItemContent}>
                  <ShoppingCart size={20} color="#007AFF" />
                  <View style={styles.recentItemText}>
                    <Text style={styles.recentItemTitle}>{list.list_title}</Text>
                    <Text style={styles.recentItemDate}>
                      {new Date(list.updated_at).toLocaleDateString()}
                    </Text>
                  </View>
                  {list.is_currently_optimized && (
                    <View style={styles.optimizedBadge}>
                      <DollarSign size={12} color="#34C759" />
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </Card>
        )}

        {/* Empty State */}
        {activeLists.length === 0 && (
          <Card style={styles.emptyCard}>
            <ShoppingCart size={48} color="#8E8E93" />
            <Text style={styles.emptyTitle}>No Active Lists</Text>
            <Text style={styles.emptyDescription}>
              Create your first shopping list to get started with smart shopping
            </Text>
            <Button
              title="Create Your First List"
              onPress={() => router.push('/lists/create')}
              style={styles.emptyButton}
            />
          </Card>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  greeting: {
    fontSize: 16,
    color: '#8E8E93',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1C1C1E',
    textTransform: 'capitalize',
  },
  addButton: {
    backgroundColor: '#007AFF',
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  statCard: {
    flex: 1,
    marginHorizontal: 4,
    padding: 16,
  },
  statContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statIcon: {
    marginRight: 12,
  },
  statText: {
    flex: 1,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1C1C1E',
  },
  statLabel: {
    fontSize: 14,
    color: '#8E8E93',
  },
  savingsCard: {
    marginHorizontal: 16,
    marginBottom: 8,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1C1C1E',
    marginLeft: 8,
  },
  savingsContent: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  savingsItem: {
    alignItems: 'center',
  },
  savingsAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#34C759',
  },
  savingsLabel: {
    fontSize: 12,
    color: '#8E8E93',
    marginTop: 4,
  },
  actionsCard: {
    marginHorizontal: 16,
    marginBottom: 8,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  actionButton: {
    width: '48%',
    aspectRatio: 1,
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  actionText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1C1C1E',
    marginTop: 8,
  },
  recentCard: {
    marginHorizontal: 16,
    marginBottom: 8,
  },
  seeAllText: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '500',
  },
  recentItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F7',
  },
  recentItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  recentItemText: {
    flex: 1,
    marginLeft: 12,
  },
  recentItemTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1C1C1E',
  },
  recentItemDate: {
    fontSize: 14,
    color: '#8E8E93',
    marginTop: 2,
  },
  optimizedBadge: {
    backgroundColor: '#E8F5E8',
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyCard: {
    marginHorizontal: 16,
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyTitle: {
    fontSize: 20,
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
    paddingHorizontal: 32,
  },
  emptyButton: {
    paddingHorizontal: 32,
  },
});