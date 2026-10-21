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

const AVAILABLE_DATES = [
  { day: 'Mon', date: '24', fullDate: '2024-10-24' },
  { day: 'Tue', date: '25', fullDate: '2024-10-25' },
  { day: 'Wed', date: '26', fullDate: '2024-10-26' },
  { day: 'Thu', date: '27', fullDate: '2024-10-27' },
  { day: 'Fri', date: '28', fullDate: '2024-10-28' },
  { day: 'Sat', date: '29', fullDate: '2024-10-29' },
];

const MORNING_SLOTS = ['09:00 AM', '10:00 AM', '11:15 AM'];
const AFTERNOON_SLOTS = ['01:00 PM', '02:30 PM', '04:00 PM', '05:30 PM'];

export default function CustomerChooseAppointmentScreen() {
  const router = useRouter();
  const {
    selectedDate,
    setSelectedDate,
    selectedTime,
    setSelectedTime,
    availability,
    bookings,
  } = useApp();

  // Check if a slot is blocked by blackout or booked in active bookings
  const isSlotDisabled = (time: string) => {
    // 1. Blackout check
    const isBlackout = availability.blackoutSlots.some(
      (b) => b.date === selectedDate && b.time === time
    );
    if (isBlackout) return true;

    // 2. Active booking check
    const isBooked = bookings.some(
      (b) => b.date === selectedDate && b.time === time && b.status !== 'cancelled'
    );
    return isBooked;
  };

  const getSlotReason = (time: string) => {
    const blackout = availability.blackoutSlots.find(
      (b) => b.date === selectedDate && b.time === time
    );
    if (blackout) return blackout.reason || 'Blocked';

    const isBooked = bookings.some(
      (b) => b.date === selectedDate && b.time === time && b.status !== 'cancelled'
    );
    if (isBooked) return 'Reserved';

    return null;
  };

  const handleContinue = () => {
    if (!selectedDate || !selectedTime) return;
    router.push('/(customer)/booking-summary');
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StitchHeader title="Choose Time" showBack />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        
        {/* Title */}
        <View style={styles.headerBlock}>
          <Text style={styles.headline}>Select Date & Time</Text>
          <Text style={styles.subtitle}>October 2024</Text>
        </View>

        {/* Date Selector */}
        <View style={styles.datesRow}>
          {AVAILABLE_DATES.map((item) => {
            const isSelected = selectedDate === item.fullDate;
            const isOperating = availability.operatingDays.includes(item.day);
            return (
              <TouchableOpacity
                key={item.fullDate}
                style={[
                  styles.datePill,
                  isSelected && styles.datePillActive,
                  !isOperating && styles.datePillClosed,
                ]}
                onPress={() => isOperating && setSelectedDate(item.fullDate)}
                disabled={!isOperating}
                activeOpacity={0.8}>
                <Text style={[styles.dayLabel, isSelected && styles.dayLabelActive]}>
                  {item.day}
                </Text>
                <Text style={[styles.dateNumber, isSelected && styles.dateNumberActive]}>
                  {item.date}
                </Text>
                {!isOperating && <Text style={styles.closedTag}>Closed</Text>}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Morning Section */}
        <View style={styles.timeSection}>
          <Text style={styles.sectionHeader}>MORNING ATELIER SLOTS</Text>
          <View style={styles.slotsGrid}>
            {MORNING_SLOTS.map((time) => {
              const disabled = isSlotDisabled(time);
              const reason = getSlotReason(time);
              const isSelected = selectedTime === time && !disabled;

              return (
                <TouchableOpacity
                  key={time}
                  style={[
                    styles.slotCard,
                    isSelected && styles.slotCardActive,
                    disabled && styles.slotCardDisabled,
                  ]}
                  onPress={() => !disabled && setSelectedTime(time)}
                  disabled={disabled}
                  activeOpacity={0.8}>
                  <Text
                    style={[
                      styles.slotTime,
                      isSelected && styles.slotTimeActive,
                      disabled && styles.slotTimeDisabled,
                    ]}>
                    {time}
                  </Text>
                  {reason ? (
                    <Text style={styles.slotTagDisabled}>{reason}</Text>
                  ) : (
                    <Text style={[styles.slotTag, isSelected && styles.slotTagActive]}>
                      Available
                    </Text>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Afternoon Section */}
        <View style={styles.timeSection}>
          <Text style={styles.sectionHeader}>AFTERNOON & EVENING SLOTS</Text>
          <View style={styles.slotsGrid}>
            {AFTERNOON_SLOTS.map((time) => {
              const disabled = isSlotDisabled(time);
              const reason = getSlotReason(time);
              const isSelected = selectedTime === time && !disabled;

              return (
                <TouchableOpacity
                  key={time}
                  style={[
                    styles.slotCard,
                    isSelected && styles.slotCardActive,
                    disabled && styles.slotCardDisabled,
                  ]}
                  onPress={() => !disabled && setSelectedTime(time)}
                  disabled={disabled}
                  activeOpacity={0.8}>
                  <Text
                    style={[
                      styles.slotTime,
                      isSelected && styles.slotTimeActive,
                      disabled && styles.slotTimeDisabled,
                    ]}>
                    {time}
                  </Text>
                  {reason ? (
                    <Text style={styles.slotTagDisabled}>{reason}</Text>
                  ) : (
                    <Text style={[styles.slotTag, isSelected && styles.slotTagActive]}>
                      Available
                    </Text>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* CTA */}
        <TouchableOpacity
          style={[styles.continueButton, (!selectedDate || !selectedTime) && styles.continueButtonDisabled]}
          onPress={handleContinue}
          disabled={!selectedDate || !selectedTime}
          activeOpacity={0.85}>
          <Text style={styles.continueButtonText}>Review Reservation</Text>
          <Ionicons name="arrow-forward" size={16} color={StitchColors.onPrimary} />
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
    gap: 20,
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
  datesRow: {
    flexDirection: 'row',
    gap: 8,
  },
  datePill: {
    flex: 1,
    backgroundColor: StitchColors.surfaceContainerLow,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: StitchColors.divider,
    paddingVertical: 12,
    alignItems: 'center',
    gap: 4,
  },
  datePillActive: {
    backgroundColor: StitchColors.primary,
    borderColor: StitchColors.primary,
  },
  datePillClosed: {
    opacity: 0.35,
  },
  dayLabel: {
    fontFamily: StitchTypography.sans,
    fontSize: 11,
    color: StitchColors.onSurfaceVariant,
  },
  dayLabelActive: {
    color: StitchColors.onPrimary,
    fontWeight: '600',
  },
  dateNumber: {
    fontFamily: StitchTypography.sans,
    fontSize: 16,
    fontWeight: '700',
    color: StitchColors.onSurface,
  },
  dateNumberActive: {
    color: StitchColors.onPrimary,
  },
  closedTag: {
    fontFamily: StitchTypography.sans,
    fontSize: 8,
    color: StitchColors.error,
    textTransform: 'uppercase',
  },
  timeSection: {
    gap: 12,
  },
  sectionHeader: {
    fontFamily: StitchTypography.sans,
    fontSize: 11,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    color: StitchColors.primary,
    fontWeight: '600',
  },
  slotsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  slotCard: {
    width: '48%',
    backgroundColor: StitchColors.surfaceContainerLow,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: StitchColors.divider,
    padding: 14,
    gap: 4,
  },
  slotCardActive: {
    borderColor: StitchColors.primary,
    backgroundColor: StitchColors.surfaceContainerHigh,
  },
  slotCardDisabled: {
    opacity: 0.4,
    backgroundColor: StitchColors.surfaceContainerLowest,
  },
  slotTime: {
    fontFamily: StitchTypography.sans,
    fontSize: 14,
    fontWeight: '600',
    color: StitchColors.onSurface,
  },
  slotTimeActive: {
    color: StitchColors.primary,
  },
  slotTimeDisabled: {
    color: StitchColors.outline,
  },
  slotTag: {
    fontFamily: StitchTypography.sans,
    fontSize: 10,
    color: StitchColors.outline,
  },
  slotTagActive: {
    color: StitchColors.primary,
  },
  slotTagDisabled: {
    fontFamily: StitchTypography.sans,
    fontSize: 10,
    color: StitchColors.error,
  },
  continueButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: StitchColors.primary,
    height: 48,
    borderRadius: 8,
    marginTop: 8,
  },
  continueButtonDisabled: {
    opacity: 0.5,
  },
  continueButtonText: {
    fontFamily: StitchTypography.sans,
    fontSize: 14,
    fontWeight: '600',
    color: StitchColors.onPrimary,
  },
});
