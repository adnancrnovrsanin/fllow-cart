import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card } from '@/components/ui/Card';
import { BarChart3, TrendingUp, DollarSign, ShoppingCart } from 'lucide-react-native';

export default function AnalyticsScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Analytics</Text>
          <Text style={styles.subtitle}>Track your shopping insights</Text>
        </View>

        {/* Savings Overview */}
        <Card style={styles.card}>
          <View style={styles.cardHeader}>
            <DollarSign size={24} color="#34C759" />
            <Text style={styles.cardTitle}>Savings Overview</Text>
          </View>
          <View style={styles.metricsGrid}>
            <View style={styles.metric}>
              <Text style={styles.metricValue}>$0.00</Text>
              <Text style={styles.metricLabel}>Total Saved</Text>
            </View>
            <View style={styles.metric}>
              <Text style={styles.metricValue}>$0.00</Text>
              <Text style={styles.metricLabel}>This Month</Text>
            </View>
            <View style={styles.metric}>
              <Text style={styles.metricValue}>0%</Text>
              <Text style={styles.metricLabel}>Avg. Savings</Text>
            </View>
            <View style={styles.metric}>
              <Text style={styles.metricValue}>0</Text>
              <Text style={styles.metricLabel}>Optimizations</Text>
            </View>
          </View>
        </Card>

        {/* Shopping Trends */}
        <Card style={styles.card}>
          <View style={styles.cardHeader}>
            <TrendingUp size={24} color="#007AFF" />
            <Text style={styles.cardTitle}>Shopping Trends</Text>
          </View>
          <View style={styles.chartPlaceholder}>
            <BarChart3 size={48} color="#8E8E93" />
            <Text style={styles.placeholderText}>
              Charts will appear here once you have shopping data
            </Text>
          </View>
        </Card>

        {/* Category Breakdown */}
        <Card style={styles.card}>
          <View style={styles.cardHeader}>
            <ShoppingCart size={24} color="#FF9500" />
            <Text style={styles.cardTitle}>Category Breakdown</Text>
          </View>
          <View style={styles.categoryList}>
            <Text style={styles.placeholderText}>
              Category spending analysis will appear here
            </Text>
          </View>
        </Card>

        {/* Monthly Comparison */}
        <Card style={styles.card}>
          <View style={styles.cardHeader}>
            <BarChart3 size={24} color="#AF52DE" />
            <Text style={styles.cardTitle}>Monthly Comparison</Text>
          </View>
          <View style={styles.chartPlaceholder}>
            <Text style={styles.placeholderText}>
              Monthly spending comparison will appear here
            </Text>
          </View>
        </Card>
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
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1C1C1E',
  },
  subtitle: {
    fontSize: 16,
    color: '#8E8E93',
    marginTop: 4,
  },
  card: {
    marginHorizontal: 16,
    marginVertical: 8,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1C1C1E',
    marginLeft: 8,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  metric: {
    width: '48%',
    alignItems: 'center',
    paddingVertical: 16,
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    marginBottom: 12,
  },
  metricValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1C1C1E',
  },
  metricLabel: {
    fontSize: 14,
    color: '#8E8E93',
    marginTop: 4,
  },
  chartPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
  },
  placeholderText: {
    fontSize: 16,
    color: '#8E8E93',
    textAlign: 'center',
    marginTop: 16,
    paddingHorizontal: 32,
  },
  categoryList: {
    paddingVertical: 32,
    alignItems: 'center',
  },
});