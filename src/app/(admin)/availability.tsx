import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Modal,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { StitchColors, StitchTypography } from '@/constants/stitch-theme';
import { useApp } from '@/context/AppContext';
import { StitchHeader } from '@/components/stitch/StitchHeader';

const ALL_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default function AdminAvailabilityManagementScreen() {
  const router = useRouter();
  const {
    availability,
    isLoadingAvailability,
    updateOperatingDays,
    updateCadence,
    addBlackoutSlot,
    removeBlackoutSlot,
    signOut,
  } = useApp();

  const [showBlockForm, setShowBlockForm] = useState(true);
  const [blockDate, setBlockDate] = useState('2024-10-29');
  const [blockTime, setBlockTime] = useState('11:15 AM');
  const [blockReason, setBlockReason] = useState('');
  const [toastMsg, setToastMsg] = useState('');
  const [deleteSlotId, setDeleteSlotId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 2500);
  };

  const toggleDay = async (day: string) => {
    const isActive = availability.operatingDays.includes(day);
    if (isActive && availability.operatingDays.length === 1) return;
    const updated = isActive
      ? availability.operatingDays.filter((d) => d !== day)
      : [...availability.operatingDays, day];

    const { error } = await updateOperatingDays(updated);
    if (error) {
      showToast(error.message);
    } else {
      showToast('Operating schedule updated');
    }
  };

  const handleCadenceChange = async (cadence: number) => {
    const { error } = await updateCadence(cadence);
    if (error) {
      showToast(error.message);
    } else {
      showToast(`Cadence set to ${cadence} minutes`);
    }
  };

  const handleAddBlackout = async () => {
    if (!blockDate.trim() || !blockTime.trim()) return;
    setIsSubmitting(true);
    const { error } = await addBlackoutSlot({
      date: blockDate.trim(),
      time: blockTime.trim(),
      reason: blockReason.trim(),
    });
    setIsSubmitting(false);

    if (error) {
      showToast(error.message);
    } else {
      setBlockReason('');
      showToast('Blackout slot recorded in database');
    }
  };

  const handleRemoveBlackout = async () => {
    if (!deleteSlotId) return;
    setIsSubmitting(true);
    const { error } = await removeBlackoutSlot(deleteSlotId);
    setIsSubmitting(false);

    if (error) {
      showToast(error.message);
    } else {
      showToast('Blackout slot removed');
      setDeleteSlotId(null);
    }
  };

  const handleLogout = async () => {
    await signOut();
    router.replace('/(customer)');
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StitchHeader
        title="Admin Portal"
        subtitle="Availability Management"
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

      {/* Toast */}
      {toastMsg ? (
        <View style={styles.toast}>
          <Ionicons name="checkmark-circle" size={16} color={StitchColors.primary} />
          <Text style={styles.toastText}>{toastMsg}</Text>
        </View>
      ) : null}

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>

        {/* Admin Nav */}
        <View style={styles.adminNavContainer}>
          <TouchableOpacity
            style={styles.adminNavPill}
            onPress={() => router.push('/(admin)/bookings')}
            activeOpacity={0.8}>
            <Text style={styles.adminNavText}>Bookings</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.adminNavPill}
            onPress={() => router.push('/(admin)/services')}
            activeOpacity={0.8}>
            <Text style={styles.adminNavText}>Services</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.adminNavPill, styles.adminNavPillActive]}
            activeOpacity={0.8}>
            <Text style={styles.adminNavTextActive}>Availability</Text>
          </TouchableOpacity>
        </View>

        {isLoadingAvailability ? (
          <View style={styles.centerContainer}>
            <ActivityIndicator size="small" color={StitchColors.primary} />
            <Text style={styles.loadingText}>Fetching studio schedule from database...</Text>
          </View>
        ) : (
          <>
            {/* Business Hours Section */}
            <View style={styles.card}>
              <View style={styles.cardHeaderRow}>
                <Ionicons name="time-outline" size={18} color={StitchColors.primary} />
                <Text style={styles.cardTitle}>BUSINESS HOURS</Text>
              </View>

              {/* Operating Days */}
              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>OPERATING DAYS</Text>
                <View style={styles.dayTogglesGrid}>
                  {ALL_DAYS.map((day) => {
                    const isActive = availability.operatingDays.includes(day);
                    return (
                      <TouchableOpacity
                        key={day}
                        style={[
                          styles.dayToggle,
                          isActive ? styles.dayToggleActive : styles.dayToggleInactive,
                        ]}
                        onPress={() => toggleDay(day)}
                        activeOpacity={0.8}>
                        <Text
                          style={[
                            styles.dayToggleLabel,
                            isActive && styles.dayToggleLabelActive,
                          ]}>
                          {day.charAt(0)}
                        </Text>
                        <View
                          style={[
                            styles.dayDot,
                            isActive ? styles.dayDotActive : styles.dayDotInactive,
                          ]}
                        />
                      </TouchableOpacity>
                    );
                  })}
                </View>
                <Text style={styles.daysSummaryText}>
                  Active: {availability.operatingDays.join(', ')}
                </Text>
              </View>

              {/* Studio Hours */}
              <View style={styles.hoursRow}>
                <View style={styles.hourBox}>
                  <Text style={styles.fieldLabel}>DOORS OPEN</Text>
                  <View style={styles.hourBadge}>
                    <Text style={styles.hourValue}>{availability.doorsOpen}</Text>
                    <Ionicons name="alarm-outline" size={16} color={StitchColors.primary} />
                  </View>
                </View>
                <View style={styles.hourBox}>
                  <Text style={styles.fieldLabel}>DOORS CLOSE</Text>
                  <View style={styles.hourBadge}>
                    <Text style={styles.hourValue}>{availability.doorsClose}</Text>
                    <Ionicons name="alarm-outline" size={16} color={StitchColors.primary} />
                  </View>
                </View>
              </View>

              {/* Appointment Cadence */}
              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>APPOINTMENT CADENCE</Text>
                <View style={styles.cadenceRow}>
                  {[45, 60].map((mins) => {
                    const isActive = availability.cadenceMinutes === mins;
                    return (
                      <TouchableOpacity
                        key={mins}
                        style={[styles.cadenceButton, isActive && styles.cadenceButtonActive]}
                        onPress={() => handleCadenceChange(mins)}
                        activeOpacity={0.8}>
                        <Text style={[styles.cadenceText, isActive && styles.cadenceTextActive]}>
                          {mins} Minutes
                        </Text>
                        <Ionicons
                          name={isActive ? 'checkmark-circle' : 'ellipse-outline'}
                          size={16}
                          color={isActive ? StitchColors.primary : StitchColors.outlineVariant}
                        />
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            </View>

            {/* Blackout Controls */}
            <View style={styles.card}>
              <View style={styles.cardHeaderRow}>
                <Ionicons name="ban-outline" size={18} color={StitchColors.primary} />
                <Text style={styles.cardTitle}>BLACKOUT CONTROLS</Text>
                <TouchableOpacity
                  style={styles.toggleFormBtn}
                  onPress={() => setShowBlockForm(!showBlockForm)}
                  activeOpacity={0.7}>
                  <Text style={styles.toggleFormBtnText}>
                    {showBlockForm ? '− Hide Form' : '+ Block Slot'}
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Block Slot Form */}
              {showBlockForm && (
                <View style={styles.blockForm}>
                  <View style={styles.splitRow}>
                    <View style={[styles.formFieldGroup, { flex: 1 }]}>
                      <Text style={styles.fieldLabel}>TARGET DATE</Text>
                      <View style={styles.inputWrapper}>
                        <TextInput
                          style={styles.textInput}
                          value={blockDate}
                          onChangeText={setBlockDate}
                          placeholder="2024-10-29"
                          placeholderTextColor={StitchColors.outline}
                        />
                        <Ionicons name="calendar-outline" size={16} color={StitchColors.primary} />
                      </View>
                    </View>
                    <View style={[styles.formFieldGroup, { flex: 1 }]}>
                      <Text style={styles.fieldLabel}>TIME SLOT</Text>
                      <View style={styles.inputWrapper}>
                        <TextInput
                          style={styles.textInput}
                          value={blockTime}
                          onChangeText={setBlockTime}
                          placeholder="11:15 AM"
                          placeholderTextColor={StitchColors.outline}
                        />
                        <Ionicons name="time-outline" size={16} color={StitchColors.primary} />
                      </View>
                    </View>
                  </View>

                  <View style={styles.formFieldGroup}>
                    <Text style={styles.fieldLabel}>REASON (OPTIONAL)</Text>
                    <View style={styles.inputWrapper}>
                      <TextInput
                        style={styles.textInput}
                        value={blockReason}
                        onChangeText={setBlockReason}
                        placeholder="e.g. Private VIP Session"
                        placeholderTextColor={StitchColors.outline}
                      />
                    </View>
                  </View>

                  <TouchableOpacity
                    style={[styles.addBlackoutBtn, isSubmitting && styles.btnDisabled]}
                    onPress={handleAddBlackout}
                    disabled={isSubmitting}
                    activeOpacity={0.85}>
                    {isSubmitting ? (
                      <ActivityIndicator size="small" color={StitchColors.onPrimary} />
                    ) : (
                      <>
                        <Ionicons name="add-circle-outline" size={16} color={StitchColors.onPrimary} />
                        <Text style={styles.addBlackoutBtnText}>Block This Slot</Text>
                      </>
                    )}
                  </TouchableOpacity>
                </View>
              )}

              {/* Blocked Slots List */}
              {availability.blackoutSlots.length > 0 ? (
                <View style={styles.blackoutList}>
                  <Text style={styles.fieldLabel}>CURRENTLY BLOCKED IN DATABASE</Text>
                  {availability.blackoutSlots.map((slot) => (
                    <View key={slot.id} style={styles.blockedSlotRow}>
                      <View style={styles.slotInfo}>
                        <Text style={styles.slotDateTime}>
                          {slot.date} · {slot.time}
                        </Text>
                        {slot.reason ? (
                          <Text style={styles.slotReason} numberOfLines={1}>
                            {slot.reason}
                          </Text>
                        ) : null}
                      </View>
                      <TouchableOpacity
                        style={styles.removeSlotBtn}
                        onPress={() => setDeleteSlotId(slot.id)}
                        activeOpacity={0.8}>
                        <Ionicons name="close-circle-outline" size={18} color={StitchColors.error} />
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              ) : (
                <Text style={styles.noBlackoutsText}>No blackout slots currently set.</Text>
              )}
            </View>
          </>
        )}
      </ScrollView>

      {/* Remove blackout confirm modal */}
      <Modal
        visible={deleteSlotId !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setDeleteSlotId(null)}>
        <View style={styles.modalOverlay}>
          <View style={styles.confirmBox}>
            <Ionicons name="alert-circle-outline" size={28} color={StitchColors.primary} />
            <Text style={styles.confirmTitle}>Remove Blackout</Text>
            <Text style={styles.confirmDesc}>
              This slot will immediately become available in the database for customer bookings.
            </Text>
            <View style={styles.confirmBtnRow}>
              <TouchableOpacity
                style={styles.dismissBtn}
                onPress={() => setDeleteSlotId(null)}
                activeOpacity={0.7}>
                <Text style={styles.dismissBtnText}>Keep</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.confirmRemoveBtn}
                onPress={handleRemoveBlackout}
                disabled={isSubmitting}
                activeOpacity={0.85}>
                {isSubmitting ? (
                  <ActivityIndicator size="small" color={StitchColors.onPrimary} />
                ) : (
                  <Text style={styles.confirmRemoveText}>Unblock Slot</Text>
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
    gap: 14,
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
  toast: {
    position: 'absolute',
    top: 100,
    left: 20,
    right: 20,
    zIndex: 100,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: StitchColors.surfaceContainerHighest,
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: StitchColors.divider,
  },
  toastText: {
    fontFamily: StitchTypography.sans,
    fontSize: 13,
    color: StitchColors.onSurface,
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
  card: {
    backgroundColor: StitchColors.surfaceContainerLow,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: StitchColors.divider,
    padding: 16,
    gap: 16,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cardTitle: {
    fontFamily: StitchTypography.sans,
    fontSize: 12,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    color: StitchColors.onSurface,
    fontWeight: '600',
    flex: 1,
  },
  toggleFormBtn: {},
  toggleFormBtnText: {
    fontFamily: StitchTypography.sans,
    fontSize: 12,
    color: StitchColors.primary,
  },
  fieldGroup: {
    gap: 8,
  },
  fieldLabel: {
    fontFamily: StitchTypography.sans,
    fontSize: 10,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    color: StitchColors.onSurfaceVariant,
    fontWeight: '500',
  },
  dayTogglesGrid: {
    flexDirection: 'row',
    gap: 4,
  },
  dayToggle: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  dayToggleActive: {
    backgroundColor: StitchColors.secondaryContainer,
  },
  dayToggleInactive: {
    backgroundColor: StitchColors.surfaceContainerHigh,
    opacity: 0.5,
  },
  dayToggleLabel: {
    fontFamily: StitchTypography.sans,
    fontSize: 13,
    fontWeight: '600',
    color: StitchColors.onSurfaceVariant,
  },
  dayToggleLabelActive: {
    color: StitchColors.primary,
  },
  dayDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    marginTop: 4,
  },
  dayDotActive: {
    backgroundColor: StitchColors.primary,
  },
  dayDotInactive: {
    backgroundColor: 'transparent',
  },
  daysSummaryText: {
    fontFamily: StitchTypography.sans,
    fontSize: 11,
    color: StitchColors.onSurfaceVariant,
  },
  hoursRow: {
    flexDirection: 'row',
    gap: 12,
  },
  hourBox: {
    flex: 1,
    gap: 5,
  },
  hourBadge: {
    backgroundColor: StitchColors.surfaceContainerHigh,
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  hourValue: {
    fontFamily: StitchTypography.sans,
    fontSize: 14,
    fontWeight: '600',
    color: StitchColors.onSurface,
  },
  cadenceRow: {
    flexDirection: 'row',
    gap: 10,
  },
  cadenceButton: {
    flex: 1,
    backgroundColor: StitchColors.surfaceContainerHigh,
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cadenceButtonActive: {
    backgroundColor: StitchColors.secondaryContainer,
  },
  cadenceText: {
    fontFamily: StitchTypography.sans,
    fontSize: 13,
    color: StitchColors.onSurfaceVariant,
    fontWeight: '500',
  },
  cadenceTextActive: {
    color: StitchColors.primary,
    fontWeight: '600',
  },
  blockForm: {
    gap: 12,
    backgroundColor: StitchColors.surfaceContainer,
    borderRadius: 8,
    padding: 14,
    borderWidth: 1,
    borderColor: StitchColors.divider,
  },
  splitRow: {
    flexDirection: 'row',
    gap: 12,
  },
  formFieldGroup: {
    gap: 4,
  },
  inputWrapper: {
    backgroundColor: StitchColors.surfaceContainerHigh,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: StitchColors.divider,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    height: 40,
  },
  textInput: {
    flex: 1,
    color: StitchColors.onSurface,
    fontFamily: StitchTypography.sans,
    fontSize: 13,
  },
  addBlackoutBtn: {
    backgroundColor: StitchColors.primary,
    height: 40,
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  btnDisabled: {
    opacity: 0.6,
  },
  addBlackoutBtnText: {
    fontFamily: StitchTypography.sans,
    fontSize: 13,
    fontWeight: '600',
    color: StitchColors.onPrimary,
  },
  blackoutList: {
    gap: 8,
  },
  noBlackoutsText: {
    fontFamily: StitchTypography.sans,
    fontSize: 12,
    color: StitchColors.outline,
  },
  blockedSlotRow: {
    backgroundColor: StitchColors.surfaceContainer,
    borderRadius: 6,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: StitchColors.divider,
  },
  slotInfo: {
    flex: 1,
  },
  slotDateTime: {
    fontFamily: StitchTypography.sans,
    fontSize: 13,
    fontWeight: '600',
    color: StitchColors.onSurface,
  },
  slotReason: {
    fontFamily: StitchTypography.sans,
    fontSize: 11,
    color: StitchColors.onSurfaceVariant,
    marginTop: 2,
  },
  removeSlotBtn: {
    padding: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.75)',
    justifyContent: 'flex-end',
  },
  confirmBox: {
    backgroundColor: StitchColors.surfaceContainerHigh,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 24,
    paddingBottom: 36,
    alignItems: 'center',
    gap: 10,
  },
  confirmTitle: {
    fontFamily: StitchTypography.serif,
    fontSize: 18,
    fontWeight: '600',
    color: StitchColors.onSurface,
  },
  confirmDesc: {
    fontFamily: StitchTypography.sans,
    fontSize: 13,
    color: StitchColors.onSurfaceVariant,
    textAlign: 'center',
    marginBottom: 6,
  },
  confirmBtnRow: {
    flexDirection: 'row',
    gap: 10,
    width: '100%',
  },
  dismissBtn: {
    flex: 1,
    height: 44,
    borderRadius: 6,
    backgroundColor: StitchColors.surfaceContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dismissBtnText: {
    fontFamily: StitchTypography.sans,
    fontSize: 13,
    color: StitchColors.onSurface,
  },
  confirmRemoveBtn: {
    flex: 1,
    height: 44,
    borderRadius: 6,
    backgroundColor: StitchColors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmRemoveText: {
    fontFamily: StitchTypography.sans,
    fontSize: 13,
    fontWeight: '600',
    color: StitchColors.onPrimary,
  },
});
