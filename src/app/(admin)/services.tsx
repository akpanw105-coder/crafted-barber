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
import { useApp, ServiceItem } from '@/context/AppContext';
import { StitchHeader } from '@/components/stitch/StitchHeader';

type ModalMode = 'add' | 'edit';

export default function AdminServiceManagementScreen() {
  const router = useRouter();
  const {
    services,
    isLoadingServices,
    addService,
    updateService,
    deleteService,
    signOut,
  } = useApp();

  const [modalVisible, setModalVisible] = useState(false);
  const [modalMode, setModalMode] = useState<ModalMode>('add');
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formName, setFormName] = useState('');
  const [formDuration, setFormDuration] = useState('');
  const [formPrice, setFormPrice] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [toastMsg, setToastMsg] = useState('');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 2500);
  };

  const openAddModal = () => {
    setModalMode('add');
    setEditingId(null);
    setFormName('');
    setFormDuration('45');
    setFormPrice('5000');
    setFormDesc('');
    setModalVisible(true);
  };

  const openEditModal = (service: ServiceItem) => {
    setModalMode('edit');
    setEditingId(service.id);
    setFormName(service.name);
    setFormDuration(String(service.durationMinutes));
    setFormPrice(String(service.price));
    setFormDesc(service.description);
    setModalVisible(true);
  };

  const handleSave = async () => {
    if (!formName.trim() || !formDuration || !formPrice) return;
    setIsSubmitting(true);

    try {
      if (modalMode === 'add') {
        const { error } = await addService({
          name: formName.trim(),
          durationMinutes: parseInt(formDuration, 10),
          price: parseInt(formPrice, 10),
          description: formDesc.trim(),
        });
        if (error) throw error;
        showToast('Service added to database');
      } else if (editingId) {
        const { error } = await updateService(editingId, {
          name: formName.trim(),
          durationMinutes: parseInt(formDuration, 10),
          price: parseInt(formPrice, 10),
          description: formDesc.trim(),
        });
        if (error) throw error;
        showToast('Service updated in database');
      }
      setModalVisible(false);
    } catch (err: any) {
      showToast(err.message || 'Operation failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = (id: string) => {
    setDeleteConfirmId(id);
  };

  const confirmDelete = async () => {
    if (deleteConfirmId) {
      setIsSubmitting(true);
      await deleteService(deleteConfirmId);
      setIsSubmitting(false);
      showToast('Service removed');
      setDeleteConfirmId(null);
    }
  };

  const handleLogout = async () => {
    await signOut();
    router.replace('/(customer)');
  };

  const formatNaira = (amount: number) => `₦${amount.toLocaleString()}`;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StitchHeader
        title="Admin Portal"
        subtitle="Service Management"
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
            style={[styles.adminNavPill, styles.adminNavPillActive]}
            activeOpacity={0.8}>
            <Text style={styles.adminNavTextActive}>Services</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.adminNavPill}
            onPress={() => router.push('/(admin)/availability')}
            activeOpacity={0.8}>
            <Text style={styles.adminNavText}>Availability</Text>
          </TouchableOpacity>
        </View>

        {/* Header row with Add button */}
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.sectionLabel}>PORTAL CONTROL</Text>
            <Text style={styles.sectionTitle}>Services</Text>
          </View>
          <TouchableOpacity
            style={styles.addButton}
            onPress={openAddModal}
            activeOpacity={0.85}>
            <Ionicons name="add" size={18} color={StitchColors.onPrimary} />
            <Text style={styles.addButtonText}>Add Service</Text>
          </TouchableOpacity>
        </View>

        {/* Services List */}
        {isLoadingServices ? (
          <View style={styles.centerContainer}>
            <ActivityIndicator size="small" color={StitchColors.primary} />
            <Text style={styles.loadingText}>Fetching services from database...</Text>
          </View>
        ) : services.length === 0 ? (
          <View style={styles.centerContainer}>
            <Ionicons name="cut-outline" size={32} color={StitchColors.outline} />
            <Text style={styles.emptyText}>No services configured in atelier database.</Text>
          </View>
        ) : (
          <View style={styles.servicesList}>
            {services.map((service) => (
              <View key={service.id} style={styles.serviceRow}>
                <View style={styles.serviceInfo}>
                  <Text style={styles.serviceNameText}>{service.name}</Text>
                  <View style={styles.serviceMeta}>
                    <Text style={styles.priceText}>{formatNaira(service.price)}</Text>
                    <View style={styles.dot} />
                    <Text style={styles.durationText}>{service.durationMinutes} mins</Text>
                  </View>
                </View>
                <View style={styles.actionBtns}>
                  <TouchableOpacity
                    style={styles.editBtn}
                    onPress={() => openEditModal(service)}
                    activeOpacity={0.8}>
                    <Ionicons name="pencil-outline" size={16} color={StitchColors.onSurface} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.deleteBtn}
                    onPress={() => handleDelete(service.id)}
                    activeOpacity={0.8}>
                    <Ionicons name="trash-outline" size={16} color={StitchColors.error} />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Add / Edit Modal */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {modalMode === 'add' ? 'Add New Service' : 'Edit Service'}
              </Text>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={styles.closeModalBtn}
                activeOpacity={0.7}>
                <Ionicons name="close" size={20} color={StitchColors.onSurface} />
              </TouchableOpacity>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.inputLabel}>SERVICE NAME</Text>
              <TextInput
                style={styles.textInput}
                value={formName}
                onChangeText={setFormName}
                placeholder="e.g. Scissor Cut"
                placeholderTextColor={StitchColors.outline}
              />
            </View>

            <View style={styles.splitRow}>
              <View style={[styles.formGroup, { flex: 1 }]}>
                <Text style={styles.inputLabel}>DURATION (MINS)</Text>
                <TextInput
                  style={styles.textInput}
                  value={formDuration}
                  onChangeText={setFormDuration}
                  placeholder="45"
                  placeholderTextColor={StitchColors.outline}
                  keyboardType="numeric"
                />
              </View>
              <View style={[styles.formGroup, { flex: 1 }]}>
                <Text style={styles.inputLabel}>PRICE (₦)</Text>
                <TextInput
                  style={styles.textInput}
                  value={formPrice}
                  onChangeText={setFormPrice}
                  placeholder="5000"
                  placeholderTextColor={StitchColors.outline}
                  keyboardType="numeric"
                />
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.inputLabel}>SHORT DESCRIPTION</Text>
              <TextInput
                style={[styles.textInput, styles.textAreaInput]}
                value={formDesc}
                onChangeText={setFormDesc}
                placeholder="Brief description of the service ritual"
                placeholderTextColor={StitchColors.outline}
                multiline
                numberOfLines={2}
              />
            </View>

            <TouchableOpacity
              style={[
                styles.saveButton,
                (!formName.trim() || !formDuration || !formPrice || isSubmitting) && styles.saveButtonDisabled,
              ]}
              onPress={handleSave}
              disabled={!formName.trim() || !formDuration || !formPrice || isSubmitting}
              activeOpacity={0.85}>
              {isSubmitting ? (
                <ActivityIndicator size="small" color={StitchColors.onPrimary} />
              ) : (
                <Text style={styles.saveButtonText}>
                  {modalMode === 'add' ? 'Save Service to Database' : 'Update Database'}
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Delete Confirm Modal */}
      <Modal
        visible={deleteConfirmId !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setDeleteConfirmId(null)}>
        <View style={styles.modalOverlay}>
          <View style={styles.confirmBox}>
            <Ionicons name="trash-outline" size={28} color={StitchColors.error} />
            <Text style={styles.confirmTitle}>Remove Service</Text>
            <Text style={styles.confirmDesc}>
              This service will be permanently deleted from the database.
            </Text>
            <View style={styles.confirmBtnRow}>
              <TouchableOpacity
                style={styles.dismissBtn}
                onPress={() => setDeleteConfirmId(null)}
                activeOpacity={0.7}>
                <Text style={styles.dismissBtnText}>Keep</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.confirmDeleteBtn}
                onPress={confirmDelete}
                disabled={isSubmitting}
                activeOpacity={0.85}>
                {isSubmitting ? (
                  <ActivityIndicator size="small" color={StitchColors.error} />
                ) : (
                  <Text style={styles.confirmDeleteText}>Delete</Text>
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
    marginBottom: 20,
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
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 16,
  },
  sectionLabel: {
    fontFamily: StitchTypography.sans,
    fontSize: 10,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    color: StitchColors.primary,
    fontWeight: '600',
  },
  sectionTitle: {
    fontFamily: StitchTypography.serif,
    fontSize: 22,
    color: StitchColors.onSurface,
    fontWeight: '600',
    marginTop: 2,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: StitchColors.primary,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 6,
  },
  addButtonText: {
    fontFamily: StitchTypography.sans,
    fontSize: 13,
    fontWeight: '600',
    color: StitchColors.onPrimary,
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
  servicesList: {
    gap: 10,
  },
  serviceRow: {
    backgroundColor: StitchColors.surfaceContainer,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: StitchColors.divider,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  serviceInfo: {
    flex: 1,
    paddingRight: 10,
  },
  serviceNameText: {
    fontFamily: StitchTypography.serif,
    fontSize: 15,
    fontWeight: '600',
    color: StitchColors.onSurface,
  },
  serviceMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 8,
  },
  priceText: {
    fontFamily: StitchTypography.sans,
    fontSize: 13,
    fontWeight: '600',
    color: StitchColors.primary,
  },
  dot: {
    width: 3,
    height: 3,
    borderRadius: 2,
    backgroundColor: StitchColors.outline,
  },
  durationText: {
    fontFamily: StitchTypography.sans,
    fontSize: 12,
    color: StitchColors.onSurfaceVariant,
  },
  actionBtns: {
    flexDirection: 'row',
    gap: 6,
  },
  editBtn: {
    width: 34,
    height: 34,
    borderRadius: 6,
    backgroundColor: StitchColors.surfaceContainerHighest,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteBtn: {
    width: 34,
    height: 34,
    borderRadius: 6,
    backgroundColor: StitchColors.surfaceContainerHighest,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.75)',
    justifyContent: 'flex-end',
  },
  modalBox: {
    backgroundColor: StitchColors.surfaceContainerHigh,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 20,
    paddingBottom: 36,
    borderWidth: 1,
    borderColor: StitchColors.divider,
    gap: 14,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  modalTitle: {
    fontFamily: StitchTypography.serif,
    fontSize: 18,
    fontWeight: '600',
    color: StitchColors.onSurface,
  },
  closeModalBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: StitchColors.surfaceContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },
  formGroup: {
    gap: 5,
  },
  inputLabel: {
    fontFamily: StitchTypography.sans,
    fontSize: 10,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    color: StitchColors.onSurfaceVariant,
    fontWeight: '500',
  },
  textInput: {
    backgroundColor: StitchColors.surfaceContainerLowest,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: StitchColors.divider,
    paddingHorizontal: 12,
    height: 44,
    color: StitchColors.onSurface,
    fontFamily: StitchTypography.sans,
    fontSize: 14,
  },
  textAreaInput: {
    height: 64,
    paddingTop: 10,
    textAlignVertical: 'top',
  },
  splitRow: {
    flexDirection: 'row',
    gap: 12,
  },
  saveButton: {
    backgroundColor: StitchColors.primary,
    height: 48,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  saveButtonDisabled: {
    opacity: 0.4,
  },
  saveButtonText: {
    fontFamily: StitchTypography.sans,
    fontSize: 14,
    fontWeight: '600',
    color: StitchColors.onPrimary,
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
  confirmDeleteBtn: {
    flex: 1,
    height: 44,
    borderRadius: 6,
    backgroundColor: StitchColors.errorContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmDeleteText: {
    fontFamily: StitchTypography.sans,
    fontSize: 13,
    fontWeight: '600',
    color: StitchColors.error,
  },
});
