import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { StitchColors, StitchTypography } from '@/constants/stitch-theme';
import { useApp, Booking } from '@/context/AppContext';
import { StitchHeader } from '@/components/stitch/StitchHeader';

export default function CustomerMyBookingsScreen() {
  const router = useRouter();
  const { bookings, isLoadingBookings, cancelBooking, signOut } = useApp();

  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');
  const [selectedBookingForAction, setSelectedBookingForAction] = useState<Booking | null>(null);
  const [isCancelling, setIsCancelling] = useState(false);

  const upcomingBookings = bookings.filter((b) => b.status === 'confirmed' || b.status === 'pending');
  const pastBookings = bookings.filter((b) => b.status === 'completed' || b.status === 'cancelled');

  const displayedList = activeTab === 'upcoming' ? upcomingBookings : pastBookings;

  const formatNaira = (amount: number) => {
    return `₦${amount.toLocaleString()}`;
  };

  const handleConfirmCancel = async () => {
    if (!selectedBookingForAction) return;
    setIsCancelling(true);
    await cancelBooking(selectedBookingForAction.id);
    setIsCancelling(false);
    setSelectedBookingForAction(null);
  };

  const handleSignOut = async () => {
    await signOut();
    router.replace('/(customer)');
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StitchHeader
        title="My Bookings"
        showBack
        rightAction={
          <TouchableOpacity
            style={styles.signOutButton}
            onPress={handleSignOut}
            activeOpacity={0.7}>
            <Ionicons name="log-out-outline" size={16} color={StitchColors.outline} />
          </TouchableOpacity>
        }
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        
        {/* Header Block */}
        <View style={styles.headerBlock}>
          <Text style={styles.headline}>Reservations</Text>
          <Text style={styles.subtitle}>Track your appointments and bespoke grooming history</Text>
        </View>

        {/* Tab Toggle */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'upcoming' && styles.tabButtonActive]}
            onPress={() => setActiveTab('upcoming')}
            activeOpacity={0.8}>
            <Text style={[styles.tabText, activeTab === 'upcoming' && styles.tabTextActive]}>
              Upcoming ({upcomingBookings.length})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'past' && styles.tabButtonActive]}
            onPress={() => setActiveTab('past')}
            activeOpacity={0.8}>
            <Text style={[styles.tabText, activeTab === 'past' && styles.tabTextActive]}>
              Past History ({pastBookings.length})
            </Text>
          </TouchableOpacity>
        </View>

        {/* Loading State */}
        {isLoadingBookings ? (
          <View style={styles.centerContainer}>
            <ActivityIndicator size="small" color={StitchColors.primary} />
            <Text style={styles.stateText}>Loading reservations from atelier database...</Text>
          </View>
        ) : displayedList.length === 0 ? (
          /* Empty State */
          <View style={styles.centerContainer}>
            <Ionicons name="calendar-outline" size={36} color={StitchColors.outline} />
            <Text style={styles.emptyTitle}>
              {activeTab === 'upcoming' ? 'No Upcoming Reservations' : 'No Past Reservations'}
            </Text>
            <Text style={styles.emptySubtitle}>
              Experience our traditional craftsmanship by booking an appointment.
            </Text>
            <TouchableOpacity
              style={styles.bookNowButton}
              onPress={() => router.push('/(customer)/services')}
              activeOpacity={0.85}>
              <Text style={styles.bookNowText}>Book an Appointment</Text>
            </TouchableOpacity>
          </View>
        ) : (
          /* Bookings List */
          <View style={styles.bookingsList}>
            {displayedList.map((booking) => {
              const isUpcoming = booking.status === 'confirmed' || booking.status === 'pending';
              return (
                <View key={booking.id} style={styles.bookingCard}>
                  <View style={styles.cardHeader}>
                    <View>
                      <Text style={styles.bookingRef}>{booking.reference}</Text>
                      <Text style={styles.bookingDate}>
                        {booking.dateLabel} · {booking.time}
                      </Text>
                    </View>
                    <View
                      style={[
                        styles.statusBadge,
                        booking.status === 'confirmed' && styles.statusConfirmed,
                        booking.status === 'pending' && styles.statusPending,
                        booking.status === 'cancelled' && styles.statusCancelled,
                        booking.status === 'completed' && styles.statusCompleted,
                      ]}>
                      <Text style={styles.statusText}>{booking.status}</Text>
                    </View>
                  </View>

                  <View style={styles.divider} />

                  {/* Services summary */}
                  <View style={styles.servicesBlock}>
                    {booking.services.map((svc) => (
                      <View key={svc.id} style={styles.serviceRow}>
                        <Text style={styles.serviceName}>{svc.name}</Text>
                        <Text style={styles.servicePrice}>{formatNaira(svc.price)}</Text>
                      </View>
                    ))}
                  </View>

                  <View style={styles.divider} />

                  <View style={styles.cardFooter}>
                    <View>
                      <Text style={styles.totalLabel}>TOTAL</Text>
                      <Text style={styles.totalValue}>{formatNaira(booking.totalPrice)}</Text>
                    </View>
                    {isUpcoming && (
                      <TouchableOpacity
                        style={styles.cancelLink}
                        onPress={() => setSelectedBookingForAction(booking)}
                        activeOpacity={0.7}>
                        <Text style={styles.cancelLinkText}>Cancel Booking</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>

      {/* Cancel Confirmation Modal */}
      <Modal
        visible={selectedBookingForAction !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedBookingForAction(null)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Ionicons name="alert-circle-outline" size={32} color={StitchColors.error} />
            <Text style={styles.modalTitle}>Cancel Appointment</Text>
            <Text style={styles.modalBody}>
              Are you sure you wish to cancel booking {selectedBookingForAction?.reference}? The time slot will become available for other clients.
            </Text>
            <View style={styles.modalButtonsRow}>
              <TouchableOpacity
                style={styles.modalDismissBtn}
                onPress={() => setSelectedBookingForAction(null)}
                activeOpacity={0.7}>
                <Text style={styles.modalDismissText}>Keep Appointment</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalConfirmBtn}
                onPress={handleConfirmCancel}
                disabled={isCancelling}
                activeOpacity={0.85}>
                {isCancelling ? (
                  <ActivityIndicator size="small" color={StitchColors.error} />
                ) : (
                  <Text style={styles.modalConfirmText}>Confirm Cancellation</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  signOutButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: StitchColors.surfaceContainerHigh,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerBlock: {
    gap: 4,
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
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: StitchColors.surfaceContainerLow,
    borderRadius: 8,
    padding: 3,
    borderWidth: 1,
    borderColor: StitchColors.divider,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 6,
  },
  tabButtonActive: {
    backgroundColor: StitchColors.secondaryContainer,
  },
  tabText: {
    fontFamily: StitchTypography.sans,
    fontSize: 12,
    color: StitchColors.onSurfaceVariant,
    fontWeight: '500',
  },
  tabTextActive: {
    color: StitchColors.primary,
    fontWeight: '600',
  },
  centerContainer: {
    paddingVertical: 60,
    alignItems: 'center',
    gap: 10,
  },
  stateText: {
    fontFamily: StitchTypography.sans,
    fontSize: 13,
    color: StitchColors.onSurfaceVariant,
  },
  emptyTitle: {
    fontFamily: StitchTypography.serif,
    fontSize: 18,
    color: StitchColors.onSurface,
    fontWeight: '600',
    marginTop: 8,
  },
  emptySubtitle: {
    fontFamily: StitchTypography.sans,
    fontSize: 12,
    color: StitchColors.onSurfaceVariant,
    textAlign: 'center',
    maxWidth: 260,
  },
  bookNowButton: {
    marginTop: 12,
    backgroundColor: StitchColors.primary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  bookNowText: {
    fontFamily: StitchTypography.sans,
    fontSize: 13,
    fontWeight: '600',
    color: StitchColors.onPrimary,
  },
  bookingsList: {
    gap: 12,
  },
  bookingCard: {
    backgroundColor: StitchColors.surfaceContainerLow,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: StitchColors.divider,
    padding: 16,
    gap: 10,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  bookingRef: {
    fontFamily: StitchTypography.sans,
    fontSize: 11,
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: StitchColors.primary,
    fontWeight: '600',
  },
  bookingDate: {
    fontFamily: StitchTypography.serif,
    fontSize: 15,
    fontWeight: '600',
    color: StitchColors.onSurface,
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  statusConfirmed: {
    backgroundColor: 'rgba(229, 194, 133, 0.15)',
  },
  statusPending: {
    backgroundColor: 'rgba(234, 189, 160, 0.15)',
  },
  statusCancelled: {
    backgroundColor: 'rgba(255, 180, 171, 0.15)',
  },
  statusCompleted: {
    backgroundColor: 'rgba(153, 143, 129, 0.15)',
  },
  statusText: {
    fontFamily: StitchTypography.sans,
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
    color: StitchColors.onSurface,
  },
  divider: {
    height: 1,
    backgroundColor: StitchColors.divider,
  },
  servicesBlock: {
    gap: 6,
  },
  serviceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  serviceName: {
    fontFamily: StitchTypography.sans,
    fontSize: 13,
    color: StitchColors.onSurfaceVariant,
  },
  servicePrice: {
    fontFamily: StitchTypography.sans,
    fontSize: 13,
    color: StitchColors.onSurface,
    fontWeight: '500',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  totalLabel: {
    fontFamily: StitchTypography.sans,
    fontSize: 9,
    color: StitchColors.outline,
    letterSpacing: 0.8,
  },
  totalValue: {
    fontFamily: StitchTypography.serif,
    fontSize: 16,
    color: StitchColors.primary,
    fontWeight: '600',
  },
  cancelLink: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  cancelLinkText: {
    fontFamily: StitchTypography.sans,
    fontSize: 12,
    color: StitchColors.error,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalCard: {
    backgroundColor: StitchColors.surfaceContainerHigh,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: StitchColors.divider,
    padding: 24,
    alignItems: 'center',
    gap: 12,
    width: '100%',
  },
  modalTitle: {
    fontFamily: StitchTypography.serif,
    fontSize: 18,
    color: StitchColors.onSurface,
    fontWeight: '600',
  },
  modalBody: {
    fontFamily: StitchTypography.sans,
    fontSize: 13,
    color: StitchColors.onSurfaceVariant,
    textAlign: 'center',
    lineHeight: 18,
  },
  modalButtonsRow: {
    flexDirection: 'row',
    gap: 10,
    width: '100%',
    marginTop: 8,
  },
  modalDismissBtn: {
    flex: 1,
    height: 42,
    borderRadius: 6,
    backgroundColor: StitchColors.surfaceContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalDismissText: {
    fontFamily: StitchTypography.sans,
    fontSize: 12,
    color: StitchColors.onSurface,
  },
  modalConfirmBtn: {
    flex: 1,
    height: 42,
    borderRadius: 6,
    backgroundColor: 'rgba(255, 180, 171, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(255, 180, 171, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalConfirmText: {
    fontFamily: StitchTypography.sans,
    fontSize: 12,
    fontWeight: '600',
    color: StitchColors.error,
  },
});
