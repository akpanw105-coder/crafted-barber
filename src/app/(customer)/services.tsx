import React from 'react';
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

export default function CustomerServiceSelectionScreen() {
  const router = useRouter();
  const { services, isLoadingServices, selectedServiceIds, toggleSelectService } = useApp();

  const selectedServices = services.filter((s) => selectedServiceIds.includes(s.id));
  const totalAmount = selectedServices.reduce((sum, s) => sum + s.price, 0);
  const totalDuration = selectedServices.reduce((sum, s) => sum + s.durationMinutes, 0);

  const handleProceed = () => {
    if (selectedServiceIds.length === 0) return;
    router.push('/(customer)/choose-time');
  };

  const formatNaira = (amount: number) => {
    return `₦${amount.toLocaleString()}`;
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StitchHeader
        title="Services"
        rightAction={
          <TouchableOpacity
            style={styles.myBookingsPill}
            onPress={() => router.push('/(customer)/my-bookings')}
            activeOpacity={0.8}>
            <Ionicons name="calendar-outline" size={14} color={StitchColors.primary} />
            <Text style={styles.myBookingsPillText}>My Bookings</Text>
          </TouchableOpacity>
        }
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        
        {/* Intro */}
        <View style={styles.introSection}>
          <Text style={styles.headline}>Bespoke Grooming</Text>
          <Text style={styles.subtitle}>Select the services you would like to book</Text>
        </View>

        {/* Counter Header */}
        <View style={styles.counterRow}>
          <Text style={styles.sectionHeader}>AVAILABLE SERVICES</Text>
          <Text style={styles.counterText}>
            {selectedServiceIds.length} Selected
          </Text>
        </View>

        {/* Loading State */}
        {isLoadingServices ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color={StitchColors.primary} />
            <Text style={styles.loadingText}>Loading curated services...</Text>
          </View>
        ) : services.length === 0 ? (
          /* Empty State */
          <View style={styles.emptyContainer}>
            <Ionicons name="cut-outline" size={32} color={StitchColors.outline} />
            <Text style={styles.emptyText}>No services currently available.</Text>
          </View>
        ) : (
          /* Services List */
          <View style={styles.servicesList}>
            {services.map((service) => {
              const isSelected = selectedServiceIds.includes(service.id);
              return (
                <TouchableOpacity
                  key={service.id}
                  style={[
                    styles.serviceCard,
                    isSelected && styles.serviceCardSelected,
                  ]}
                  onPress={() => toggleSelectService(service.id)}
                  activeOpacity={0.85}>
                  
                  <View style={styles.cardHeader}>
                    <View style={styles.cardHeaderLeft}>
                      <Text style={styles.serviceName}>{service.name}</Text>
                      <View style={styles.durationRow}>
                        <Ionicons name="time-outline" size={12} color={StitchColors.outline} />
                        <Text style={styles.durationText}>{service.durationMinutes} mins</Text>
                      </View>
                    </View>
                    <Text style={styles.priceText}>{formatNaira(service.price)}</Text>
                  </View>

                  <Text style={styles.description}>{service.description}</Text>

                  <View style={styles.cardFooter}>
                    <View style={[styles.selectRadio, isSelected && styles.selectRadioActive]}>
                      {isSelected ? (
                        <Ionicons name="checkmark" size={12} color={StitchColors.onPrimary} />
                      ) : null}
                    </View>
                    <Text style={[styles.selectStatusText, isSelected && styles.selectStatusTextActive]}>
                      {isSelected ? 'Selected' : 'Tap to select'}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        )}
      </ScrollView>

      {/* Sticky Bottom Bar */}
      {selectedServiceIds.length > 0 && (
        <View style={styles.bottomBar}>
          <View style={styles.bottomSummary}>
            <Text style={styles.bottomSummaryLabel}>Total ({totalDuration} mins)</Text>
            <Text style={styles.bottomSummaryPrice}>{formatNaira(totalAmount)}</Text>
          </View>
          <TouchableOpacity
            style={styles.continueButton}
            onPress={handleProceed}
            activeOpacity={0.85}>
            <Text style={styles.continueButtonText}>Choose Date & Time</Text>
            <Ionicons name="arrow-forward" size={16} color={StitchColors.onPrimary} />
          </TouchableOpacity>
        </View>
      )}
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
    paddingBottom: 100,
  },
  myBookingsPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 6,
    backgroundColor: StitchColors.surfaceContainerHigh,
    borderWidth: 1,
    borderColor: StitchColors.divider,
  },
  myBookingsPillText: {
    fontFamily: StitchTypography.sans,
    fontSize: 11,
    color: StitchColors.primary,
    fontWeight: '500',
  },
  introSection: {
    marginBottom: 20,
  },
  headline: {
    fontFamily: StitchTypography.serif,
    fontSize: 26,
    color: StitchColors.onSurface,
    fontWeight: '600',
  },
  subtitle: {
    fontFamily: StitchTypography.sans,
    fontSize: 13,
    color: StitchColors.onSurfaceVariant,
    marginTop: 4,
  },
  counterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionHeader: {
    fontFamily: StitchTypography.sans,
    fontSize: 11,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    color: StitchColors.primary,
    fontWeight: '600',
  },
  counterText: {
    fontFamily: StitchTypography.sans,
    fontSize: 11,
    color: StitchColors.onSurfaceVariant,
  },
  loadingContainer: {
    paddingVertical: 40,
    alignItems: 'center',
    gap: 12,
  },
  loadingText: {
    fontFamily: StitchTypography.sans,
    fontSize: 13,
    color: StitchColors.onSurfaceVariant,
  },
  emptyContainer: {
    paddingVertical: 60,
    alignItems: 'center',
    gap: 8,
  },
  emptyText: {
    fontFamily: StitchTypography.sans,
    fontSize: 13,
    color: StitchColors.outline,
  },
  servicesList: {
    gap: 12,
  },
  serviceCard: {
    backgroundColor: StitchColors.surfaceContainerLow,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: StitchColors.divider,
    padding: 16,
    gap: 8,
  },
  serviceCardSelected: {
    borderColor: StitchColors.primary,
    backgroundColor: StitchColors.surfaceContainerHigh,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  cardHeaderLeft: {
    gap: 4,
  },
  serviceName: {
    fontFamily: StitchTypography.serif,
    fontSize: 16,
    color: StitchColors.onSurface,
    fontWeight: '600',
  },
  durationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  durationText: {
    fontFamily: StitchTypography.sans,
    fontSize: 12,
    color: StitchColors.outline,
  },
  priceText: {
    fontFamily: StitchTypography.serif,
    fontSize: 16,
    color: StitchColors.primary,
    fontWeight: '600',
  },
  description: {
    fontFamily: StitchTypography.sans,
    fontSize: 12,
    color: StitchColors.onSurfaceVariant,
    lineHeight: 18,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: StitchColors.divider,
    marginTop: 4,
  },
  selectRadio: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: StitchColors.outline,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectRadioActive: {
    backgroundColor: StitchColors.primary,
    borderColor: StitchColors.primary,
  },
  selectStatusText: {
    fontFamily: StitchTypography.sans,
    fontSize: 11,
    color: StitchColors.outline,
  },
  selectStatusTextActive: {
    color: StitchColors.primary,
    fontWeight: '500',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(19, 19, 19, 0.96)',
    borderTopWidth: 1,
    borderTopColor: StitchColors.divider,
    paddingHorizontal: 20,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  bottomSummary: {
    gap: 2,
  },
  bottomSummaryLabel: {
    fontFamily: StitchTypography.sans,
    fontSize: 11,
    color: StitchColors.onSurfaceVariant,
  },
  bottomSummaryPrice: {
    fontFamily: StitchTypography.serif,
    fontSize: 18,
    color: StitchColors.primary,
    fontWeight: '600',
  },
  continueButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: StitchColors.primary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  continueButtonText: {
    fontFamily: StitchTypography.sans,
    fontSize: 13,
    fontWeight: '600',
    color: StitchColors.onPrimary,
  },
});
