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

export default function AdminBookingManagementScreen() {
  const router = useRouter();
  const { bookings, isLoadingBookings, updateBookingStatus, signOut } = useApp();

  const [activeFilter, setActiveFilter] = useState<'all' | 'today' | 'pending'>('all');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const filteredBookings = bookings.filter((b) => {
    if (activeFilter === 'today') {
      return b.date === '2024-10-27';
    }
    if (activeFilter === 'pending') {
      return b.status === 'pending';
    }
    return true;
  });

  const formatNaira = (amount: number) => {
    return `₦${amount.toLocaleString()}`;
  };

  const handleUpdateStatus = async (id: string, status: 'confirmed' | 'completed' | 'cancelled') => {
    setUpdatingId(id);
    await updateBookingStatus(id, status);
    setUpdatingId(null);
  };

  const handleLogout = async () => {
    await signOut();
    router.replace('/(customer)');
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StitchHeader
        title="Admin Portal"
        subtitle="Booking Management"
        rightAction={
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={handleLogout}
            activeOpacity={0.7}>
            <Ionicons name="log-out-outline" size={16} color={StitchColors.outline} />
            <Text style={styles.logoutText}>Exit</Text>
          </TouchableOpacity>
        }
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        
        {/* Navigation Tabs between Admin sections */}
        <View style={styles.adminNavContainer}>
          <TouchableOpacity
            style={[styles.adminNavPill, styles.adminNavPillActive]}
            activeOpacity={0.8}>
            <Text style={styles.adminNavTextActive}>Bookings</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.adminNavPill}
            onPress={() => router.push('/(admin)/services')}
            activeOpacity={0.8}>
            <Text style={styles.adminNavText}>Services</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.adminNavPill}
            onPress={() => router.push('/(admin)/availability')}
            activeOpacity={0.8}>
            <Text style={styles.adminNavText}>Availability</Text>
          </TouchableOpacity>
        </View>

        {/* Status Filters */}
        <View style={styles.filterRow}>
          <TouchableOpacity
            style={[styles.filterButton, activeFilter === 'all' && styles.filterButtonActive]}
            onPress={() => setActiveFilter('all')}
            activeOpacity={0.8}>
            <Text style={[styles.filterText, activeFilter === 'all' && styles.filterTextActive]}>
              All ({bookings.length})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterButton, activeFilter === 'today' && styles.filterButtonActive]}
            onPress={() => setActiveFilter('today')}
            activeOpacity={0.8}>
            <Text style={[styles.filterText, activeFilter === 'today' && styles.filterTextActive]}>
              Today
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterButton, activeFilter === 'pending' && styles.filterButtonActive]}
            onPress={() => setActiveFilter('pending')}
            activeOpacity={0.8}>
            <Text style={[styles.filterText, activeFilter === 'pending' && styles.filterTextActive]}>
              Pending ({bookings.filter((b) => b.status === 'pending').length})
            </Text>
          </TouchableOpacity>
        </View>

        {/* Content list */}
        {isLoadingBookings ? (
          <View style={styles.centerContainer}>
            <ActivityIndicator size="small" color={StitchColors.primary} />
            <Text style={styles.loadingText}>Fetching reservations from database...</Text>
          </View>
        ) : filteredBookings.length === 0 ? (
          <View style={styles.centerContainer}>
            <Ionicons name="calendar-outline" size={36} color={StitchColors.outline} />
            <Text style={styles.emptyText}>No reservations found under this filter.</Text>
          </View>
        ) : (
          <View style={styles.cardsList}>
            {filteredBookings.map((booking) => {
              const isUpdating = updatingId === booking.id;
              return (
                <View key={booking.id} style={styles.bookingCard}>
                  <View style={styles.cardTop}>
                    <View>
                      <Text style={styles.clientName}>{booking.customerName}</Text>
                      <Text style={styles.clientMeta}>
                        {booking.customerEmail} {booking.customerPhone ? `· ${booking.customerPhone}` : ''}
                      </Text>
                    </View>
                    <View
                      style={[
                        styles.statusPill,
                        booking.status === 'confirmed' && styles.statusConfirmed,
                        booking.status === 'pending' && styles.statusPending,
                        booking.status === 'completed' && styles.statusCompleted,
                        booking.status === 'cancelled' && styles.statusCancelled,
                      ]}>
                      <Text style={styles.statusPillText}>{booking.status}</Text>
                    </View>
                  </View>

                  <View style={styles.cardMiddle}>
                    <View style={styles.timeTag}>
                      <Ionicons name="time-outline" size={14} color={StitchColors.primary} />
                      <Text style={styles.timeTagText}>
                        {booking.dateLabel} at {booking.time}
                      </Text>
                    </View>
                    <Text style={styles.priceTag}>{formatNaira(booking.totalPrice)}</Text>
                  </View>

                  <View style={styles.servicesBox}>
                    <Text style={styles.servicesHeading}>RESERVED RITUALS</Text>
                    {booking.services.map((svc) => (
                      <Text key={svc.id} style={styles.serviceItemText}>
                        • {svc.name} ({svc.durationMinutes} mins)
                      </Text>
                    ))}
                  </View>

                  {/* Actions for Admin */}
                  <View style={styles.actionRow}>
                    {isUpdating ? (
                      <ActivityIndicator size="small" color={StitchColors.primary} />
                    ) : (
                      <>
                        {booking.status === 'pending' && (
                          <>
                            <TouchableOpacity
                              style={styles.confirmBtn}
                              onPress={() => handleUpdateStatus(booking.id, 'confirmed')}
                              activeOpacity={0.8}>
                              <Text style={styles.confirmBtnText}>Approve</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                              style={styles.cancelBtn}
                              onPress={() => handleUpdateStatus(booking.id, 'cancelled')}
                              activeOpacity={0.8}>
                              <Text style={styles.cancelBtnText}>Reject</Text>
                            </TouchableOpacity>
                          </>
                        )}
                        {booking.status === 'confirmed' && (
                          <>
                            <TouchableOpacity
                              style={styles.completeBtn}
                              onPress={() => handleUpdateStatus(booking.id, 'completed')}
                              activeOpacity={0.8}>
                              <Text style={styles.completeBtnText}>Mark Completed</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                              style={styles.cancelBtn}
                              onPress={() => handleUpdateStatus(booking.id, 'cancelled')}
                              activeOpacity={0.8}>
                              <Text style={styles.cancelBtnText}>Cancel</Text>
                            </TouchableOpacity>
                          </>
                        )}
                      </>
                    )}
                  </View>
                </View>
              );
            })}
          </View>
        )}
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
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 5,
    paddingHorizontal: 8,
    borderRadius: 6,
    backgroundColor: StitchColors.surfaceContainerHigh,
  },
  logoutText: {
    fontFamily: StitchTypography.sans,
    fontSize: 12,
    color: StitchColors.outline,
  },
  adminNavContainer: {
    flexDirection: 'row',
    backgroundColor: StitchColors.surfaceContainerLow,
    borderRadius: 8,
    padding: 3,
    borderWidth: 1,
    borderColor: StitchColors.divider,
  },
  adminNavPill: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 6,
  },
  adminNavPillActive: {
    backgroundColor: StitchColors.secondaryContainer,
  },
  adminNavText: {
    fontFamily: StitchTypography.sans,
    fontSize: 12,
    color: StitchColors.onSurfaceVariant,
    fontWeight: '500',
  },
  adminNavTextActive: {
    fontFamily: StitchTypography.sans,
    fontSize: 12,
    color: StitchColors.primary,
    fontWeight: '600',
  },
  filterRow: {
    flexDirection: 'row',
    gap: 8,
  },
  filterButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    backgroundColor: StitchColors.surfaceContainerLow,
    borderWidth: 1,
    borderColor: StitchColors.divider,
  },
  filterButtonActive: {
    borderColor: StitchColors.primary,
    backgroundColor: StitchColors.surfaceContainerHigh,
  },
  filterText: {
    fontFamily: StitchTypography.sans,
    fontSize: 12,
    color: StitchColors.onSurfaceVariant,
  },
  filterTextActive: {
    color: StitchColors.primary,
    fontWeight: '600',
  },
  centerContainer: {
    paddingVertical: 60,
    alignItems: 'center',
    gap: 10,
  },
  loadingText: {
    fontFamily: StitchTypography.sans,
    fontSize: 13,
    color: StitchColors.onSurfaceVariant,
  },
  emptyText: {
    fontFamily: StitchTypography.sans,
    fontSize: 13,
    color: StitchColors.outline,
  },
  cardsList: {
    gap: 12,
  },
  bookingCard: {
    backgroundColor: StitchColors.surfaceContainerLow,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: StitchColors.divider,
    padding: 16,
    gap: 12,
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  clientName: {
    fontFamily: StitchTypography.serif,
    fontSize: 16,
    fontWeight: '600',
    color: StitchColors.onSurface,
  },
  clientMeta: {
    fontFamily: StitchTypography.sans,
    fontSize: 12,
    color: StitchColors.onSurfaceVariant,
    marginTop: 2,
  },
  statusPill: {
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
  statusCompleted: {
    backgroundColor: 'rgba(153, 143, 129, 0.15)',
  },
  statusCancelled: {
    backgroundColor: 'rgba(255, 180, 171, 0.15)',
  },
  statusPillText: {
    fontFamily: StitchTypography.sans,
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
    color: StitchColors.onSurface,
  },
  cardMiddle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timeTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  timeTagText: {
    fontFamily: StitchTypography.sans,
    fontSize: 13,
    color: StitchColors.onSurface,
    fontWeight: '500',
  },
  priceTag: {
    fontFamily: StitchTypography.serif,
    fontSize: 15,
    fontWeight: '600',
    color: StitchColors.primary,
  },
  servicesBox: {
    backgroundColor: StitchColors.surfaceContainerLowest,
    borderRadius: 6,
    padding: 10,
    gap: 4,
  },
  servicesHeading: {
    fontFamily: StitchTypography.sans,
    fontSize: 9,
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: StitchColors.outline,
    fontWeight: '600',
  },
  serviceItemText: {
    fontFamily: StitchTypography.sans,
    fontSize: 12,
    color: StitchColors.onSurfaceVariant,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: StitchColors.divider,
  },
  confirmBtn: {
    backgroundColor: StitchColors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  confirmBtnText: {
    fontFamily: StitchTypography.sans,
    fontSize: 12,
    fontWeight: '600',
    color: StitchColors.onPrimary,
  },
  completeBtn: {
    backgroundColor: StitchColors.surfaceContainerHigh,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: StitchColors.divider,
  },
  completeBtnText: {
    fontFamily: StitchTypography.sans,
    fontSize: 12,
    color: StitchColors.onSurface,
  },
  cancelBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  cancelBtnText: {
    fontFamily: StitchTypography.sans,
    fontSize: 12,
    color: StitchColors.error,
  },
});
