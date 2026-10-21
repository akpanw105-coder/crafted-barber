import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { StitchColors, StitchTypography } from '@/constants/stitch-theme';
import { useApp } from '@/context/AppContext';

export default function CustomerBookingConfirmationScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ bookingId?: string; reference?: string }>();
  const { bookings } = useApp();

  const currentBooking = bookings.find((b) => b.id === params.bookingId) || bookings[0];

  const formatNaira = (amount: number) => {
    return `₦${amount.toLocaleString()}`;
  };

  const handleGoToBookings = () => {
    router.replace('/(customer)/my-bookings');
  };

  const handleBookAnother = () => {
    router.replace('/(customer)/services');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        
        {/* Animated Stamp / Badge */}
        <View style={styles.badgeWrapper}>
          <View style={styles.badgeOuter}>
            <View style={styles.badgeInner}>
              <Ionicons name="checkmark-sharp" size={32} color={StitchColors.primary} />
            </View>
          </View>
        </View>

        <Text style={styles.title}>Appointment Confirmed</Text>
        <Text style={styles.subtitle}>
          Your session at Crafted Barbers has been secured.
        </Text>

        {/* Receipt Card */}
        <View style={styles.receiptCard}>
          {/* Header */}
          <View style={styles.receiptHeader}>
            <View>
              <Text style={styles.receiptMeta}>BOOKING REFERENCE</Text>
              <Text style={styles.receiptRef}>
                {currentBooking ? currentBooking.reference : '#CB-8492'}
              </Text>
            </View>
            <View style={styles.confirmedPill}>
              <Text style={styles.confirmedPillText}>Confirmed</Text>
            </View>
          </View>

          <View style={styles.cardDivider} />

          {/* Details List */}
          <View style={styles.detailsList}>
            {/* Services */}
            <View style={styles.itemRow}>
              <View style={styles.itemLeft}>
                <Ionicons name="cut-outline" size={16} color={StitchColors.outline} />
                <Text style={styles.itemLabel}>Services</Text>
              </View>
              <View style={styles.itemRight}>
                <Text style={styles.itemMainText}>
                  {currentBooking
                    ? currentBooking.services.map((s) => s.name).join(', ')
                    : "Men's Haircut, Beard Trim"}
                </Text>
                <Text style={styles.itemSubText}>
                  {currentBooking
                    ? `${currentBooking.services.reduce((sum, s) => sum + s.durationMinutes, 0)} mins Duration`
                    : '75 mins Duration'}
                </Text>
              </View>
            </View>

            {/* Date & Time */}
            <View style={styles.itemRow}>
              <View style={styles.itemLeft}>
                <Ionicons name="calendar-outline" size={16} color={StitchColors.outline} />
                <Text style={styles.itemLabel}>Date & Time</Text>
              </View>
              <View style={styles.itemRight}>
                <Text style={styles.itemMainText}>
                  {currentBooking ? currentBooking.dateLabel : 'Thursday, 27 Oct 2024'}
                </Text>
                <Text style={styles.itemGoldText}>
                  {currentBooking ? currentBooking.time : '02:30 PM'}
                </Text>
              </View>
            </View>

            {/* Location */}
            <View style={styles.itemRow}>
              <View style={styles.itemLeft}>
                <Ionicons name="location-outline" size={16} color={StitchColors.outline} />
                <Text style={styles.itemLabel}>Studio</Text>
              </View>
              <View style={styles.itemRight}>
                <Text style={styles.itemMainText}>Crafted Studio</Text>
                <Text style={styles.itemSubText}>Victoria Island, Lagos</Text>
              </View>
            </View>

            {/* Payment Summary */}
            <View style={styles.totalRow}>
              <View>
                <Text style={styles.receiptMeta}>TOTAL AMOUNT</Text>
                <Text style={styles.paymentMethodLabel}>
                  {currentBooking?.paymentMethod === 'atelier' ? 'Pay on Arrival' : 'Paid via Card'}
                </Text>
              </View>
              <Text style={styles.totalPrice}>
                {formatNaira(currentBooking ? currentBooking.totalPrice : 7500)}
              </Text>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={handleGoToBookings}
          activeOpacity={0.85}>
          <Text style={styles.primaryButtonText}>View in My Bookings</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.ghostButton}
          onPress={handleBookAnother}
          activeOpacity={0.7}>
          <Text style={styles.ghostButtonText}>Book Another Service</Text>
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
    paddingTop: 30,
    paddingBottom: 40,
    alignItems: 'center',
  },
  badgeWrapper: {
    marginBottom: 18,
  },
  badgeOuter: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: StitchColors.secondaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeInner: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: StitchColors.surfaceContainerHigh,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontFamily: StitchTypography.serif,
    fontSize: 24,
    color: StitchColors.onSurface,
    fontWeight: '600',
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: StitchTypography.sans,
    fontSize: 13,
    color: StitchColors.onSurfaceVariant,
    textAlign: 'center',
    marginTop: 6,
    marginBottom: 24,
  },
  receiptCard: {
    width: '100%',
    backgroundColor: StitchColors.surfaceContainer,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: StitchColors.divider,
    padding: 18,
    marginBottom: 24,
  },
  receiptHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  receiptMeta: {
    fontFamily: StitchTypography.sans,
    fontSize: 10,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    color: StitchColors.outline,
  },
  receiptRef: {
    fontFamily: StitchTypography.sans,
    fontSize: 16,
    fontWeight: '700',
    color: StitchColors.primary,
    marginTop: 2,
  },
  confirmedPill: {
    backgroundColor: StitchColors.surfaceContainerHighest,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  confirmedPillText: {
    fontFamily: StitchTypography.sans,
    fontSize: 11,
    color: StitchColors.onSurfaceVariant,
  },
  cardDivider: {
    height: 1,
    backgroundColor: StitchColors.divider,
    marginVertical: 16,
  },
  detailsList: {
    gap: 16,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  itemLabel: {
    fontFamily: StitchTypography.sans,
    fontSize: 12,
    color: StitchColors.onSurfaceVariant,
  },
  itemRight: {
    alignItems: 'flex-end',
    flex: 1,
    paddingLeft: 16,
  },
  itemMainText: {
    fontFamily: StitchTypography.serif,
    fontSize: 13,
    color: StitchColors.onSurface,
    fontWeight: '600',
    textAlign: 'right',
  },
  itemSubText: {
    fontFamily: StitchTypography.sans,
    fontSize: 11,
    color: StitchColors.outline,
    marginTop: 2,
  },
  itemGoldText: {
    fontFamily: StitchTypography.sans,
    fontSize: 12,
    fontWeight: '600',
    color: StitchColors.primary,
    marginTop: 2,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: StitchColors.surfaceContainerHigh,
    padding: 12,
    borderRadius: 6,
    marginTop: 4,
  },
  paymentMethodLabel: {
    fontFamily: StitchTypography.sans,
    fontSize: 11,
    color: StitchColors.onSurfaceVariant,
    marginTop: 2,
  },
  totalPrice: {
    fontFamily: StitchTypography.sans,
    fontSize: 18,
    fontWeight: '700',
    color: StitchColors.primary,
  },
  primaryButton: {
    width: '100%',
    height: 52,
    borderRadius: 8,
    backgroundColor: StitchColors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  primaryButtonText: {
    fontFamily: StitchTypography.sans,
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0.5,
    color: StitchColors.onPrimary,
  },
  ghostButton: {
    paddingVertical: 10,
  },
  ghostButtonText: {
    fontFamily: StitchTypography.sans,
    fontSize: 13,
    color: StitchColors.onSurfaceVariant,
    textDecorationLine: 'underline',
  },
});
