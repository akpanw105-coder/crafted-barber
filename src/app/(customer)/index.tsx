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

export default function CustomerWelcomeSignInScreen() {
  const router = useRouter();
  const { signInWithEmail, signUpWithEmail } = useApp();

  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!email.trim() || !password) {
      setErrorMsg('Please provide your email and password');
      return;
    }
    setErrorMsg('');
    setIsSubmitting(true);

    try {
      if (isSignUp) {
        if (!name.trim()) {
          setErrorMsg('Please provide your full name');
          setIsSubmitting(false);
          return;
        }
        const { error } = await signUpWithEmail(email.trim(), password, name.trim(), phone.trim());
        if (error) {
          setErrorMsg(error.message);
        } else {
          router.replace('/(customer)/services');
        }
      } else {
        const { error, role } = await signInWithEmail(email.trim(), password);
        if (error) {
          setErrorMsg(error.message);
        } else {
          if (role === 'admin') {
            router.replace('/(admin)/bookings');
          } else {
            router.replace('/(customer)/services');
          }
        }
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Authentication failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoToAdmin = () => {
    router.push('/(admin)/login');
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
          
          {/* Admin Quick Switch Pill */}
          <View style={styles.topBar}>
            <TouchableOpacity
              style={styles.adminSwitchButton}
              onPress={handleGoToAdmin}
              activeOpacity={0.8}>
              <Ionicons name="shield-checkmark-outline" size={14} color={StitchColors.primary} />
              <Text style={styles.adminSwitchText}>Staff & Admin Portal</Text>
            </TouchableOpacity>
          </View>

          {/* Brand Emblem */}
          <View style={styles.brandContainer}>
            <View style={styles.logoBadge}>
              <Ionicons name="cut" size={32} color={StitchColors.primary} />
            </View>
            <Text style={styles.brandTitle}>CRAFTED BARBERS</Text>
            <Text style={styles.headline}>
              {isSignUp ? 'Create Membership' : 'Welcome'}
            </Text>
            <Text style={styles.tagline}>
              Bespoke grooming sanctuary and atelier
            </Text>
          </View>

          {/* Form */}
          <View style={styles.formContainer}>
            {errorMsg ? (
              <View style={styles.errorBanner}>
                <Ionicons name="alert-circle-outline" size={16} color={StitchColors.error} />
                <Text style={styles.errorText}>{errorMsg}</Text>
              </View>
            ) : null}

            {isSignUp && (
              <>
                <View style={styles.fieldGroup}>
                  <Text style={styles.label}>Full Name</Text>
                  <View style={styles.inputContainer}>
                    <Ionicons name="person-outline" size={18} color={StitchColors.outline} style={styles.inputIcon} />
                    <TextInput
                      style={styles.input}
                      placeholder="e.g. Chukwudi Eze"
                      placeholderTextColor={StitchColors.outlineVariant}
                      value={name}
                      onChangeText={setName}
                      autoCapitalize="words"
                    />
                  </View>
                </View>

                <View style={styles.fieldGroup}>
                  <Text style={styles.label}>Phone Number (Optional)</Text>
                  <View style={styles.inputContainer}>
                    <Ionicons name="call-outline" size={18} color={StitchColors.outline} style={styles.inputIcon} />
                    <TextInput
                      style={styles.input}
                      placeholder="+234 801 234 5678"
                      placeholderTextColor={StitchColors.outlineVariant}
                      value={phone}
                      onChangeText={setPhone}
                      keyboardType="phone-pad"
                    />
                  </View>
                </View>
              </>
            )}

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Email Address</Text>
              <View style={styles.inputContainer}>
                <Ionicons name="mail-outline" size={18} color={StitchColors.outline} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="membership@crafted.com"
                  placeholderTextColor={StitchColors.outlineVariant}
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                />
              </View>
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Password</Text>
              <View style={styles.inputContainer}>
                <Ionicons name="key-outline" size={18} color={StitchColors.outline} style={styles.inputIcon} />
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

            {/* Action Button */}
            <TouchableOpacity
              style={[styles.primaryButton, isSubmitting && styles.buttonDisabled]}
              onPress={handleSubmit}
              disabled={isSubmitting}
              activeOpacity={0.85}>
              {isSubmitting ? (
                <ActivityIndicator size="small" color={StitchColors.onPrimary} />
              ) : (
                <Text style={styles.primaryButtonText}>
                  {isSignUp ? 'Join Crafted Barbers' : 'Sign In to Atelier'}
                </Text>
              )}
            </TouchableOpacity>

            {/* Mode Switcher */}
            <View style={styles.switchRow}>
              <Text style={styles.switchPrompt}>
                {isSignUp ? 'Already a member?' : 'First time at the atelier?'}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  setIsSignUp(!isSignUp);
                  setErrorMsg('');
                }}
                activeOpacity={0.7}>
                <Text style={styles.switchAction}>
                  {isSignUp ? 'Sign In' : 'Create Membership'}
                </Text>
              </TouchableOpacity>
            </View>
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
    paddingTop: 12,
    paddingBottom: 40,
  },
  topBar: {
    alignItems: 'flex-end',
    marginBottom: 20,
  },
  adminSwitchButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 20,
    backgroundColor: StitchColors.surfaceContainerHigh,
    borderWidth: 1,
    borderColor: StitchColors.divider,
  },
  adminSwitchText: {
    fontFamily: StitchTypography.sans,
    fontSize: 11,
    color: StitchColors.primary,
    fontWeight: '500',
  },
  brandContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logoBadge: {
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
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  forgotText: {
    fontFamily: StitchTypography.sans,
    fontSize: 11,
    color: StitchColors.primary,
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
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    marginTop: 12,
  },
  switchPrompt: {
    fontFamily: StitchTypography.sans,
    fontSize: 13,
    color: StitchColors.onSurfaceVariant,
  },
  switchAction: {
    fontFamily: StitchTypography.sans,
    fontSize: 13,
    color: StitchColors.primary,
    fontWeight: '600',
  },
});
