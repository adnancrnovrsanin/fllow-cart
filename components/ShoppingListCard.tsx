import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { ShoppingList } from '@/types/database';
import { Card } from '@/components/ui/Card';
import { ShoppingCart, Calendar, DollarSign } from 'lucide-react-native';

interface ShoppingListCardProps {
  list: ShoppingList;
  itemCount?: number;
  onPress: () => void;
  onLongPress?: () => void;
}

export function ShoppingListCard({ 
  list, 
  itemCount = 0, 
  onPress, 
  onLongPress 
}: ShoppingListCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <TouchableOpacity onPress={onPress} onLongPress={onLongPress} activeOpacity={0.7}>
      <Card style={styles.card}>
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <ShoppingCart size={20} color="#007AFF" />
            <Text style={styles.title} numberOfLines={1}>
              {list.list_title}
            </Text>
          </View>
          {list.is_currently_optimized && (
            <View style={styles.optimizedBadge}>
              <DollarSign size={14} color="#34C759" />
              <Text style={styles.optimizedText}>Optimized</Text>
            </View>
          )}
        </View>
        
        <View style={styles.details}>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Items</Text>
            <Text style={styles.detailValue}>{itemCount}</Text>
          </View>
          
          <View style={styles.detailItem}>
            <Calendar size={14} color="#8E8E93" />
            <Text style={styles.detailValue}>
              {formatDate(list.updated_at)}
            </Text>
          </View>
        </View>
        
        <View style={styles.statusContainer}>
          <View style={[styles.statusDot, { backgroundColor: getStatusColor(list.status) }]} />
          <Text style={styles.statusText}>{list.status.charAt(0).toUpperCase() + list.status.slice(1)}</Text>
        </View>
      </Card>
    </TouchableOpacity>
  );
}

function getStatusColor(status: string) {
  switch (status) {
    case 'active':
      return '#34C759';
    case 'template':
      return '#007AFF';
    case 'archived':
      return '#8E8E93';
    default:
      return '#8E8E93';
  }
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1C1C1E',
    marginLeft: 8,
    flex: 1,
  },
  optimizedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E8',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  optimizedText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#34C759',
    marginLeft: 4,
  },
  details: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 14,
    color: '#8E8E93',
    marginRight: 4,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1C1C1E',
    marginLeft: 4,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    color: '#8E8E93',
    fontWeight: '500',
  },
});