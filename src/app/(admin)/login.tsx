import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { StitchColors, StitchTypography } from '@/constants/stitch-theme';
import { useApp } from '@/context/AppContext';

export default function AdminLoginScreen() {
  const router = useRouter();
  const { signInWithEmail } = useApp();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAdminSignIn = async () => {
    if (!email.trim() || !password) {
      setErrorMsg('Please enter your administrator email and password');
      return;
    }
    setErrorMsg('');
    setIsSubmitting(true);

    try {
      const { error, role } = await signInWithEmail(email.trim(), password);
      if (error) {
        setErrorMsg(error.message);
      } else if (role !== 'admin') {
        setErrorMsg('Access Denied: This account does not possess administrative credentials.');
      } else {
        router.replace('/(admin)/bookings');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Authentication failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBackToCustomer = () => {
    router.replace('/(customer)');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardContainer}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled">
          
          <TouchableOpacity
            style={styles.backButton}
            onPress={handleBackToCustomer}
            activeOpacity={0.7}>
            <Ionicons name="chevron-back" size={18} color={StitchColors.onSurface} />
            <Text style={styles.backButtonText}>Client Experience</Text>
          </TouchableOpacity>

          <View style={styles.brandContainer}>
            <View style={styles.shieldBadge}>
              <Ionicons name="shield-checkmark" size={32} color={StitchColors.primary} />
            </View>
            <Text style={styles.brandTitle}>CRAFTED BARBERS</Text>
            <Text style={styles.headline}>Admin Portal</Text>
            <Text style={styles.tagline}>
              Secure atelier management, services, and appointment schedules
            </Text>
          </View>

          <View style={styles.formContainer}>
            {errorMsg ? (
              <View style={styles.errorBanner}>
                <Ionicons name="alert-circle-outline" size={16} color={StitchColors.error} />
                <Text style={styles.errorText}>{errorMsg}</Text>
              </View>
            ) : null}

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Admin Email</Text>
              <View style={styles.inputContainer}>
                <Ionicons name="mail-outline" size={18} color={StitchColors.outline} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="admin@crafted.com"
                  placeholderTextColor={StitchColors.outlineVariant}
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                />
              </View>
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Admin Password</Text>
              <View style={styles.inputContainer}>
                <Ionicons name="lock-closed-outline" size={18} color={StitchColors.outline} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="••••••••••••"
                  placeholderTextColor={StitchColors.outlineVariant}
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={setPassword}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeButton}
                  activeOpacity={0.7}>
                  <Ionicons
                    name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                    size={18}
                    color={StitchColors.outline}
                  />
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity
              style={[styles.primaryButton, isSubmitting && styles.buttonDisabled]}
              onPress={handleAdminSignIn}
              disabled={isSubmitting}
              activeOpacity={0.85}>
              {isSubmitting ? (
                <ActivityIndicator size="small" color={StitchColors.onPrimary} />
              ) : (
                <Text style={styles.primaryButtonText}>Access Portal</Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: StitchColors.surface,
  },
  keyboardContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 40,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 28,
  },
  backButtonText: {
    fontFamily: StitchTypography.sans,
    fontSize: 13,
    color: StitchColors.onSurface,
  },
  brandContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  shieldBadge: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: StitchColors.surfaceContainerHigh,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: StitchColors.goldBorder,
    marginBottom: 16,
  },
  brandTitle: {
    fontFamily: StitchTypography.sans,
    fontSize: 11,
    letterSpacing: 2,
    textTransform: 'uppercase',
    color: StitchColors.primary,
    fontWeight: '600',
    marginBottom: 6,
  },
  headline: {
    fontFamily: StitchTypography.serif,
    fontSize: 28,
    color: StitchColors.onSurface,
    fontWeight: '600',
    marginBottom: 6,
  },
  tagline: {
    fontFamily: StitchTypography.sans,
    fontSize: 13,
    color: StitchColors.onSurfaceVariant,
    textAlign: 'center',
  },
  formContainer: {
    gap: 16,
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
  fieldGroup: {
    gap: 6,
  },
  label: {
    fontFamily: StitchTypography.sans,
    fontSize: 12,
    color: StitchColors.onSurfaceVariant,
    fontWeight: '500',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: StitchColors.surfaceContainerHigh,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: StitchColors.divider,
    paddingHorizontal: 12,
    height: 48,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    color: StitchColors.onSurface,
    fontFamily: StitchTypography.sans,
    fontSize: 14,
  },
  eyeButton: {
    padding: 4,
  },
  primaryButton: {
    backgroundColor: StitchColors.primary,
    height: 48,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  primaryButtonText: {
    fontFamily: StitchTypography.sans,
    fontSize: 14,
    fontWeight: '600',
    color: StitchColors.onPrimary,
  },
});
