import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { StitchColors, StitchTypography } from '@/constants/stitch-theme';
import { useApp } from '@/context/AppContext';
import { StitchHeader } from '@/components/stitch/StitchHeader';

export default function CustomerBookingSummaryScreen() {
  const router = useRouter();
  const { services, selectedServiceIds, selectedDate, selectedTime } = useApp();

  const chosenServices = services.filter((s) => selectedServiceIds.includes(s.id));
  const subtotal = chosenServices.reduce((sum, s) => sum + s.price, 0);

  const formatNaira = (amount: number) => {
    return `₦${amount.toLocaleString()}`;
  };

  const handleProceedToPayment = () => {
    router.push('/(customer)/payment');
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StitchHeader title="Booking Summary" showBack />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        
        <View style={styles.headerBlock}>
          <Text style={styles.headline}>Booking Summary</Text>
          <Text style={styles.subtitle}>Review your bespoke reservation details</Text>
        </View>

        {/* Appointment Timing & Location Details Card */}
        <View style={styles.card}>
          <View style={styles.detailRow}>
            <View style={styles.iconCircle}>
              <Ionicons name="calendar-outline" size={18} color={StitchColors.primary} />
            </View>
            <View style={styles.detailText}>
              <Text style={styles.metaLabel}>APPOINTMENT DATE & TIME</Text>
              <Text style={styles.metaValue}>
                Thursday, 27 October 2024 at {selectedTime}
              </Text>
            </View>
          </View>

          <View style={styles.cardDivider} />

          <View style={styles.detailRow}>
            <View style={styles.iconCircle}>
              <Ionicons name="location-outline" size={18} color={StitchColors.primary} />
            </View>
            <View style={styles.detailText}>
              <Text style={styles.metaLabel}>LOCATION</Text>
              <Text style={styles.metaValue}>
                Crafted Studio — Victoria Island, Lagos
              </Text>
            </View>
          </View>
        </View>

        {/* Selected Services Breakdown */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <Text style={styles.cardSectionTitle}>SELECTED SERVICES</Text>
            <TouchableOpacity
              onPress={() => router.push('/(customer)/services')}
              activeOpacity={0.7}>
              <Text style={styles.editText}>Edit Services</Text>
            </TouchableOpacity>
          </View>

          {chosenServices.map((service, index) => (
            <View
              key={service.id}
              style={[
                styles.serviceRow,
                index > 0 && styles.serviceRowBorder,
              ]}>
              <View style={styles.serviceInfo}>
                <Text style={styles.serviceName}>{service.name}</Text>
                <Text style={styles.serviceMeta}>
                  {service.description || 'Precision styling'} • {service.durationMinutes} mins
                </Text>
              </View>
              <Text style={styles.servicePrice}>{formatNaira(service.price)}</Text>
            </View>
          ))}
        </View>

        {/* Price Summary */}
        <View style={styles.priceCard}>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Subtotal</Text>
            <Text style={styles.priceAmount}>{formatNaira(subtotal)}</Text>
          </View>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Studio Service Fee</Text>
            <Text style={styles.priceAmount}>₦0</Text>
          </View>

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>TOTAL PRICE</Text>
            <Text style={styles.totalAmount}>{formatNaira(subtotal)}</Text>
          </View>
        </View>

        {/* Action Button */}
        <TouchableOpacity
          style={styles.payButton}
          onPress={handleProceedToPayment}
          activeOpacity={0.85}>
          <Ionicons name="lock-closed" size={16} color={StitchColors.onPrimary} />
          <Text style={styles.payButtonText}>
            Proceed to Payment ({formatNaira(subtotal)})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.editBookingBtn}
          onPress={() => router.push('/(customer)/choose-time')}
          activeOpacity={0.7}>
          <Text style={styles.editBookingText}>Edit Date & Time</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: StitchColors.surface,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 40,
  },
  headerBlock: {
    marginBottom: 20,
  },
  headline: {
    fontFamily: StitchTypography.serif,
    fontSize: 24,
    color: StitchColors.onSurface,
    fontWeight: '600',
  },
  subtitle: {
    fontFamily: StitchTypography.sans,
    fontSize: 13,
    color: StitchColors.onSurfaceVariant,
    marginTop: 4,
  },
  card: {
    backgroundColor: StitchColors.surfaceContainerLow,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: StitchColors.divider,
    padding: 16,
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: StitchColors.surfaceContainerHigh,
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailText: {
    flex: 1,
  },
  metaLabel: {
    fontFamily: StitchTypography.sans,
    fontSize: 10,
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: StitchColors.onSurfaceVariant,
  },
  metaValue: {
    fontFamily: StitchTypography.sans,
    fontSize: 13,
    fontWeight: '500',
    color: StitchColors.onSurface,
    marginTop: 2,
  },
  cardDivider: {
    height: 1,
    backgroundColor: StitchColors.divider,
    marginVertical: 14,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardSectionTitle: {
    fontFamily: StitchTypography.sans,
    fontSize: 11,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    color: StitchColors.primary,
    fontWeight: '600',
  },
  editText: {
    fontFamily: StitchTypography.sans,
    fontSize: 12,
    color: StitchColors.onSurfaceVariant,
  },
  serviceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  serviceRowBorder: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: StitchColors.divider,
  },
  serviceInfo: {
    flex: 1,
    paddingRight: 10,
  },
  serviceName: {
    fontFamily: StitchTypography.serif,
    fontSize: 14,
    color: StitchColors.onSurface,
    fontWeight: '600',
  },
  serviceMeta: {
    fontFamily: StitchTypography.sans,
    fontSize: 12,
    color: StitchColors.onSurfaceVariant,
    marginTop: 2,
  },
  servicePrice: {
    fontFamily: StitchTypography.sans,
    fontSize: 14,
    fontWeight: '600',
    color: StitchColors.onSurface,
  },
  priceCard: {
    backgroundColor: StitchColors.surfaceContainerLow,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: StitchColors.divider,
    padding: 16,
    marginBottom: 24,
    gap: 8,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceLabel: {
    fontFamily: StitchTypography.sans,
    fontSize: 13,
    color: StitchColors.onSurfaceVariant,
  },
  priceAmount: {
    fontFamily: StitchTypography.sans,
    fontSize: 13,
    fontWeight: '500',
    color: StitchColors.onSurface,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: StitchColors.divider,
    paddingTop: 12,
    marginTop: 6,
  },
  totalLabel: {
    fontFamily: StitchTypography.sans,
    fontSize: 11,
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: StitchColors.onSurfaceVariant,
    fontWeight: '600',
  },
  totalAmount: {
    fontFamily: StitchTypography.sans,
    fontSize: 20,
    fontWeight: '700',
    color: StitchColors.onSurface,
  },
  payButton: {
    backgroundColor: StitchColors.primary,
    height: 52,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 12,
  },
  payButtonText: {
    fontFamily: StitchTypography.sans,
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    color: StitchColors.onPrimary,
  },
  editBookingBtn: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  editBookingText: {
    fontFamily: StitchTypography.sans,
    fontSize: 12,
    color: StitchColors.onSurfaceVariant,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
});
