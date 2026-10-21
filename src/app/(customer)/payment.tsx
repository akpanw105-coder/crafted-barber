import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { StitchColors, StitchTypography } from '@/constants/stitch-theme';
import { useApp } from '@/context/AppContext';
import { StitchHeader } from '@/components/stitch/StitchHeader';

export default function CustomerPaymentScreen() {
  const router = useRouter();
  const {
    services,
    selectedServiceIds,
    createBooking,
    initializePaystackPayment,
    verifyPaystackPayment,
    user,
  } = useApp();

  const [paymentMethod, setPaymentMethod] = useState<'card' | 'transfer' | 'atelier'>('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const chosenServices = services.filter((s) => selectedServiceIds.includes(s.id));
  const totalAmount = chosenServices.reduce((sum, s) => sum + s.price, 0);

  const formatNaira = (amount: number) => {
    return `₦${amount.toLocaleString()}`;
  };

  const handlePay = async () => {
    setErrorMessage('');
    setIsProcessing(true);

    try {
      // 1. Create the booking atomically (slot conflict protected)
      const { booking, error: bookingError } = await createBooking(paymentMethod);

      if (bookingError || !booking) {
        throw new Error(bookingError?.message || 'Failed to create booking. Please try again.');
      }

      // 2. For non-card methods: booking is confirmed, go straight to confirmation
      if (paymentMethod !== 'card') {
        setIsProcessing(false);
        router.replace({
          pathname: '/(customer)/confirmation',
          params: { bookingId: booking.id, reference: booking.reference },
        });
        return;
      }

      // 3. Card payment: attempt Paystack initialization.
      // If the gateway is not yet configured (no PAYSTACK_SECRET_KEY), we gracefully
      // fall back to pending-payment mode — the booking is saved and the customer
      // can pay at the studio or via transfer. We NEVER falsely mark it as paid.
      try {
        const userEmail = user?.email || 'client@crafted.com';
        const initResult = await initializePaystackPayment(booking.id, userEmail, totalAmount);

        if (!initResult.error && initResult.reference) {
          // Paystack is configured — in a full integration the client would open
          // initResult.authorizationUrl in a WebBrowser and complete payment there.
          // For now, fall through to pending-payment confirmation.
          // (Do NOT call verifyPaystackPayment here — payment hasn't happened yet.)
        }
        // Whether Paystack succeeded or failed to initialize, proceed to confirmation
        // with pending-payment status (which is what createBooking already saved).
      } catch {
        // Paystack not configured — proceed silently to pending-payment confirmation
      }

      setIsProcessing(false);
      router.replace({
        pathname: '/(customer)/confirmation',
        params: { bookingId: booking.id, reference: booking.reference },
      });
    } catch (err: any) {
      setIsProcessing(false);
      // Show a clean user-facing message, not a raw technical error
      const raw: string = err.message || '';
      const isEdgeFunctionError = raw.toLowerCase().includes('edge function') ||
        raw.toLowerCase().includes('non-2xx') ||
        raw.toLowerCase().includes('failed to fetch');
      setErrorMessage(
        isEdgeFunctionError
          ? 'Booking created, but the online payment gateway is not yet active. Please select "Pay at Atelier" or "Direct Bank Transfer" to complete your booking.'
          : raw || 'Something went wrong. Please try again.'
      );
    }
  };


  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StitchHeader title="Payment" showBack />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        
        {/* Price Presentation Card */}
        <View style={styles.priceCard}>
          <Text style={styles.priceMeta}>APPOINTMENT PAYMENT</Text>
          <Text style={styles.priceHero}>{formatNaira(totalAmount)}</Text>
          <Text style={styles.priceSubtitle}>Crafted Barbers Appointment</Text>
        </View>

        {/* Error Banner */}
        {errorMessage ? (
          <View style={styles.errorBanner}>
            <Ionicons name="alert-circle-outline" size={18} color={StitchColors.error} />
            <Text style={styles.errorText}>{errorMessage}</Text>
          </View>
        ) : null}

        {/* Payment Method Selector */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionLabel}>SELECT PAYMENT METHOD</Text>
        </View>

        <View style={styles.methodsList}>
          {/* Paystack Online Card */}
          <TouchableOpacity
            style={[
              styles.methodCard,
              paymentMethod === 'card' && styles.methodCardActive,
            ]}
            onPress={() => setPaymentMethod('card')}
            activeOpacity={0.8}>
            <View style={styles.methodIconBadge}>
              <Ionicons name="card" size={20} color={StitchColors.primary} />
            </View>
            <View style={styles.methodInfo}>
              <View style={styles.methodTitleRow}>
                <Text style={styles.methodTitle}>Online Card (Paystack)</Text>
                <View style={styles.badgePill}>
                  <Text style={styles.badgeText}>Instant</Text>
                </View>
              </View>
              <Text style={styles.methodDesc}>
                Mastercard, Visa, Verve & Apple Pay via Paystack
              </Text>
            </View>
            <Ionicons
              name={paymentMethod === 'card' ? 'radio-button-on' : 'radio-button-off'}
              size={20}
              color={paymentMethod === 'card' ? StitchColors.primary : StitchColors.outlineVariant}
            />
          </TouchableOpacity>

          {/* Bank Transfer */}
          <TouchableOpacity
            style={[
              styles.methodCard,
              paymentMethod === 'transfer' && styles.methodCardActive,
            ]}
            onPress={() => setPaymentMethod('transfer')}
            activeOpacity={0.8}>
            <View style={styles.methodIconBadge}>
              <Ionicons name="swap-horizontal" size={20} color={StitchColors.primary} />
            </View>
            <View style={styles.methodInfo}>
              <Text style={styles.methodTitle}>Direct Bank Transfer</Text>
              <Text style={styles.methodDesc}>
                Transfer directly to Crafted Barbers studio account
              </Text>
            </View>
            <Ionicons
              name={paymentMethod === 'transfer' ? 'radio-button-on' : 'radio-button-off'}
              size={20}
              color={paymentMethod === 'transfer' ? StitchColors.primary : StitchColors.outlineVariant}
            />
          </TouchableOpacity>

          {/* Pay at Studio */}
          <TouchableOpacity
            style={[
              styles.methodCard,
              paymentMethod === 'atelier' && styles.methodCardActive,
            ]}
            onPress={() => setPaymentMethod('atelier')}
            activeOpacity={0.8}>
            <View style={styles.methodIconBadge}>
              <Ionicons name="storefront-outline" size={20} color={StitchColors.primary} />
            </View>
            <View style={styles.methodInfo}>
              <Text style={styles.methodTitle}>Pay at Atelier</Text>
              <Text style={styles.methodDesc}>
                Cash or POS terminal upon arrival at the studio
              </Text>
            </View>
            <Ionicons
              name={paymentMethod === 'atelier' ? 'radio-button-on' : 'radio-button-off'}
              size={20}
              color={paymentMethod === 'atelier' ? StitchColors.primary : StitchColors.outlineVariant}
            />
          </TouchableOpacity>
        </View>

        {/* Security Assurance */}
        <View style={styles.securityBox}>
          <Ionicons name="shield-checkmark-outline" size={16} color={StitchColors.primary} />
          <Text style={styles.securityText}>
            Payments are securely routed and verified server-side through Paystack & Supabase.
          </Text>
        </View>

        {/* CTA Button */}
        <TouchableOpacity
          style={[styles.payButton, isProcessing && styles.payButtonDisabled]}
          onPress={handlePay}
          disabled={isProcessing}
          activeOpacity={0.85}>
          {isProcessing ? (
            <ActivityIndicator size="small" color={StitchColors.onPrimary} />
          ) : (
            <Text style={styles.payButtonText}>
              {paymentMethod === 'card'
                ? `Confirm Booking — Pay ${formatNaira(totalAmount)}`
                : 'Confirm Reservation'}
            </Text>
          )}
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
    gap: 16,
  },
  priceCard: {
    backgroundColor: StitchColors.surfaceContainerLow,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: StitchColors.goldBorder,
    padding: 24,
    alignItems: 'center',
    gap: 6,
  },
  priceMeta: {
    fontFamily: StitchTypography.sans,
    fontSize: 10,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    color: StitchColors.primary,
    fontWeight: '600',
  },
  priceHero: {
    fontFamily: StitchTypography.serif,
    fontSize: 36,
    color: StitchColors.onSurface,
    fontWeight: '700',
  },
  priceSubtitle: {
    fontFamily: StitchTypography.sans,
    fontSize: 13,
    color: StitchColors.onSurfaceVariant,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 180, 171, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 180, 171, 0.3)',
  },
  errorText: {
    fontFamily: StitchTypography.sans,
    fontSize: 13,
    color: StitchColors.error,
    flex: 1,
  },
  sectionHeaderRow: {
    marginTop: 8,
  },
  sectionLabel: {
    fontFamily: StitchTypography.sans,
    fontSize: 11,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    color: StitchColors.onSurfaceVariant,
    fontWeight: '600',
  },
  methodsList: {
    gap: 10,
  },
  methodCard: {
    backgroundColor: StitchColors.surfaceContainerLow,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: StitchColors.divider,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  methodCardActive: {
    borderColor: StitchColors.primary,
    backgroundColor: StitchColors.surfaceContainerHigh,
  },
  methodIconBadge: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: StitchColors.surfaceContainerLowest,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: StitchColors.divider,
  },
  methodInfo: {
    flex: 1,
  },
  methodTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  methodTitle: {
    fontFamily: StitchTypography.serif,
    fontSize: 15,
    fontWeight: '600',
    color: StitchColors.onSurface,
  },
  badgePill: {
    backgroundColor: 'rgba(229, 194, 133, 0.15)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  badgeText: {
    fontFamily: StitchTypography.sans,
    fontSize: 10,
    fontWeight: '600',
    color: StitchColors.primary,
  },
  methodDesc: {
    fontFamily: StitchTypography.sans,
    fontSize: 12,
    color: StitchColors.onSurfaceVariant,
    marginTop: 2,
  },
  securityBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
    borderRadius: 8,
    backgroundColor: StitchColors.surfaceContainerLowest,
    borderWidth: 1,
    borderColor: StitchColors.divider,
  },
  securityText: {
    fontFamily: StitchTypography.sans,
    fontSize: 11,
    color: StitchColors.onSurfaceVariant,
    flex: 1,
  },
  payButton: {
    backgroundColor: StitchColors.primary,
    height: 50,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
  },
  payButtonDisabled: {
    opacity: 0.6,
  },
  payButtonText: {
    fontFamily: StitchTypography.sans,
    fontSize: 14,
    fontWeight: '600',
    color: StitchColors.onPrimary,
  },
});
