import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { ListItem } from '@/types/database';
import { Card } from '@/components/ui/Card';
import { Check, Edit3, Store, DollarSign } from 'lucide-react-native';

interface ListItemCardProps {
  item: ListItem;
  onToggleTicked: () => void;
  onEdit: () => void;
}

export function ListItemCard({ item, onToggleTicked, onEdit }: ListItemCardProps) {
  return (
    <Card style={[styles.card, item.is_ticked_off && styles.tickedCard]}>
      <View style={styles.content}>
        <TouchableOpacity 
          style={styles.checkbox} 
          onPress={onToggleTicked}
          activeOpacity={0.7}
        >
          <View style={[styles.checkboxInner, item.is_ticked_off && styles.checked]}>
            {item.is_ticked_off && <Check size={16} color="#FFFFFF" />}
          </View>
        </TouchableOpacity>
        
        <View style={styles.itemDetails}>
          <Text style={[styles.itemName, item.is_ticked_off && styles.tickedText]}>
            {item.item_name}
          </Text>
          
          <View style={styles.metadata}>
            <Text style={styles.quantity}>
              {item.quantity} {item.unit || 'pcs'}
            </Text>
            
            {item.category_user_defined && (
              <View style={styles.category}>
                <Text style={styles.categoryText}>{item.category_user_defined}</Text>
              </View>
            )}
          </View>
          
          {(item.optimized_store_name || item.preferred_store_name_user) && (
            <View style={styles.storeInfo}>
              <Store size={14} color="#8E8E93" />
              <Text style={styles.storeText}>
                {item.optimized_store_name || item.preferred_store_name_user}
              </Text>
            </View>
          )}
          
          {(item.optimized_price_per_unit || item.target_price_per_unit_user) && (
            <View style={styles.priceInfo}>
              <DollarSign size={14} color="#34C759" />
              <Text style={styles.priceText}>
                ${(item.optimized_price_per_unit || item.target_price_per_unit_user)?.toFixed(2)}
                {item.optimized_price_per_unit && (
                  <Text style={styles.optimizedLabel}> (optimized)</Text>
                )}
              </Text>
            </View>
          )}
          
          {item.notes_by_user && (
            <Text style={styles.notes}>{item.notes_by_user}</Text>
          )}
        </View>
        
        <TouchableOpacity style={styles.editButton} onPress={onEdit}>
          <Edit3 size={18} color="#007AFF" />
        </TouchableOpacity>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginVertical: 4,
  },
  tickedCard: {
    opacity: 0.7,
    backgroundColor: '#F8F8F8',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  checkbox: {
    marginRight: 12,
    marginTop: 2,
  },
  checkboxInner: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#D1D1D6',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  checked: {
    backgroundColor: '#34C759',
    borderColor: '#34C759',
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 4,
  },
  tickedText: {
    textDecorationLine: 'line-through',
    color: '#8E8E93',
  },
  metadata: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  quantity: {
    fontSize: 14,
    color: '#8E8E93',
    marginRight: 12,
  },
  category: {
    backgroundColor: '#E8F4FD',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  categoryText: {
    fontSize: 12,
    color: '#007AFF',
    fontWeight: '500',
  },
  storeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  storeText: {
    fontSize: 14,
    color: '#8E8E93',
    marginLeft: 4,
  },
  priceInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  priceText: {
    fontSize: 14,
    color: '#34C759',
    fontWeight: '500',
    marginLeft: 4,
  },
  optimizedLabel: {
    fontSize: 12,
    color: '#8E8E93',
    fontWeight: '400',
  },
  notes: {
    fontSize: 14,
    color: '#8E8E93',
    fontStyle: 'italic',
    marginTop: 4,
  },
  editButton: {
    padding: 8,
    marginLeft: 8,
  },
});