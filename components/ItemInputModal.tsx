import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { ListItem } from '@/types/database';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { X } from 'lucide-react-native';

interface ItemInputModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (item: Partial<ListItem>) => void;
  item?: ListItem | null;
  title?: string;
}

export function ItemInputModal({
  visible,
  onClose,
  onSave,
  item,
  title = 'Add Item',
}: ItemInputModalProps) {
  const [formData, setFormData] = useState({
    item_name: '',
    quantity: '1',
    unit: '',
    category_user_defined: '',
    notes_by_user: '',
    preferred_store_name_user: '',
    target_price_per_unit_user: '',
  });

  useEffect(() => {
    if (item) {
      setFormData({
        item_name: item.item_name || '',
        quantity: item.quantity?.toString() || '1',
        unit: item.unit || '',
        category_user_defined: item.category_user_defined || '',
        notes_by_user: item.notes_by_user || '',
        preferred_store_name_user: item.preferred_store_name_user || '',
        target_price_per_unit_user: item.target_price_per_unit_user?.toString() || '',
      });
    } else {
      setFormData({
        item_name: '',
        quantity: '1',
        unit: '',
        category_user_defined: '',
        notes_by_user: '',
        preferred_store_name_user: '',
        target_price_per_unit_user: '',
      });
    }
  }, [item, visible]);

  const handleSave = () => {
    if (!formData.item_name.trim()) return;

    const itemData: Partial<ListItem> = {
      item_name: formData.item_name.trim(),
      quantity: parseInt(formData.quantity) || 1,
      unit: formData.unit.trim() || null,
      category_user_defined: formData.category_user_defined.trim() || null,
      notes_by_user: formData.notes_by_user.trim() || null,
      preferred_store_name_user: formData.preferred_store_name_user.trim() || null,
      target_price_per_unit_user: formData.target_price_per_unit_user 
        ? parseFloat(formData.target_price_per_unit_user) 
        : null,
    };

    onSave(itemData);
    onClose();
  };

  const categories = [
    'Groceries', 'Electronics', 'Clothing', 'Home & Garden', 
    'Health & Beauty', 'Sports & Outdoors', 'Books', 'Other'
  ];

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView 
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.header}>
          <Text style={styles.title}>{title}</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <X size={24} color="#1C1C1E" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <Input
            label="Item Name *"
            value={formData.item_name}
            onChangeText={(text) => setFormData(prev => ({ ...prev, item_name: text }))}
            placeholder="Enter item name"
            autoFocus
          />

          <View style={styles.row}>
            <View style={styles.halfWidth}>
              <Input
                label="Quantity"
                value={formData.quantity}
                onChangeText={(text) => setFormData(prev => ({ ...prev, quantity: text }))}
                placeholder="1"
                keyboardType="numeric"
              />
            </View>
            <View style={styles.halfWidth}>
              <Input
                label="Unit"
                value={formData.unit}
                onChangeText={(text) => setFormData(prev => ({ ...prev, unit: text }))}
                placeholder="pcs, kg, lbs..."
              />
            </View>
          </View>

          <View>
            <Text style={styles.label}>Category</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
              {categories.map((category) => (
                <TouchableOpacity
                  key={category}
                  style={[
                    styles.categoryChip,
                    formData.category_user_defined === category && styles.selectedCategory
                  ]}
                  onPress={() => setFormData(prev => ({ 
                    ...prev, 
                    category_user_defined: prev.category_user_defined === category ? '' : category 
                  }))}
                >
                  <Text style={[
                    styles.categoryText,
                    formData.category_user_defined === category && styles.selectedCategoryText
                  ]}>
                    {category}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <Input
              value={formData.category_user_defined}
              onChangeText={(text) => setFormData(prev => ({ ...prev, category_user_defined: text }))}
              placeholder="Or enter custom category"
              style={{ marginTop: 8 }}
            />
          </View>

          <Input
            label="Preferred Store"
            value={formData.preferred_store_name_user}
            onChangeText={(text) => setFormData(prev => ({ ...prev, preferred_store_name_user: text }))}
            placeholder="Walmart, Amazon, etc."
          />

          <Input
            label="Target Price per Unit"
            value={formData.target_price_per_unit_user}
            onChangeText={(text) => setFormData(prev => ({ ...prev, target_price_per_unit_user: text }))}
            placeholder="0.00"
            keyboardType="decimal-pad"
          />

          <Input
            label="Notes"
            value={formData.notes_by_user}
            onChangeText={(text) => setFormData(prev => ({ ...prev, notes_by_user: text }))}
            placeholder="Any additional notes..."
            multiline
            numberOfLines={3}
            style={{ height: 80, textAlignVertical: 'top' }}
          />
        </ScrollView>

        <View style={styles.footer}>
          <Button
            title="Cancel"
            onPress={onClose}
            variant="secondary"
            style={styles.footerButton}
          />
          <Button
            title={item ? "Update Item" : "Add Item"}
            onPress={handleSave}
            disabled={!formData.item_name.trim()}
            style={styles.footerButton}
          />
        </View>
      </KeyboardAvoidingView>
    </Modal>
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
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1C1C1E',
  },
  closeButton: {
    padding: 4,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfWidth: {
    width: '48%',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 8,
  },
  categoryScroll: {
    marginBottom: 8,
  },
  categoryChip: {
    backgroundColor: '#F2F2F7',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  selectedCategory: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  categoryText: {
    fontSize: 14,
    color: '#1C1C1E',
    fontWeight: '500',
  },
  selectedCategoryText: {
    color: '#FFFFFF',
  },
  footer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
  },
  footerButton: {
    flex: 1,
    marginHorizontal: 8,
  },
});