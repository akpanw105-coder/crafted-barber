import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Session, User } from '@supabase/supabase-js';

export interface ServiceItem {
  id: string;
  name: string;
  durationMinutes: number;
  price: number;
  description: string;
}

export interface Booking {
  id: string;
  reference: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  services: ServiceItem[];
  date: string; // YYYY-MM-DD
  dateLabel: string;
  time: string;
  totalPrice: number;
  status: 'confirmed' | 'pending' | 'completed' | 'cancelled';
  paymentMethod: 'card' | 'transfer' | 'atelier';
  paymentStatus: 'paid' | 'pending' | 'refunded' | 'failed';
  createdAt: string;
}

export interface AvailabilityConfig {
  operatingDays: string[];
  doorsOpen: string;
  doorsClose: string;
  cadenceMinutes: number;
  blackoutSlots: {
    id: string;
    date: string;
    time: string;
    reason: string;
  }[];
}

interface AppContextType {
  // Auth state
  session: Session | null;
  user: User | null;
  userRole: 'customer' | 'admin' | 'member' | null;
  isAdmin: boolean;
  isLoadingAuth: boolean;
  
  signInWithEmail: (email: string, password: string) => Promise<{ error: Error | null; role?: string }>;
  signUpWithEmail: (email: string, password: string, fullName: string, phone?: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;

  // Services Catalog
  services: ServiceItem[];
  isLoadingServices: boolean;
  addService: (service: Omit<ServiceItem, 'id'>) => Promise<{ error: Error | null }>;
  updateService: (id: string, service: Partial<ServiceItem>) => Promise<{ error: Error | null }>;
  deleteService: (id: string) => Promise<{ error: Error | null }>;

  // Current Booking Flow (Customer)
  selectedServiceIds: string[];
  toggleSelectService: (id: string) => void;
  clearSelectedServices: () => void;
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  selectedTime: string;
  setSelectedTime: (time: string) => void;
  createBooking: (paymentMethod: 'card' | 'transfer' | 'atelier') => Promise<{ booking: Booking | null; error: Error | null }>;

  // Bookings list
  bookings: Booking[];
  isLoadingBookings: boolean;
  loadBookings: () => Promise<void>;
  updateBookingStatus: (id: string, status: Booking['status']) => Promise<{ error: Error | null }>;
  cancelBooking: (id: string) => Promise<{ error: Error | null }>;

  // Availability & Business Settings
  availability: AvailabilityConfig;
  isLoadingAvailability: boolean;
  updateOperatingDays: (days: string[]) => Promise<{ error: Error | null }>;
  updateCadence: (cadenceMinutes: number) => Promise<{ error: Error | null }>;
  addBlackoutSlot: (slot: { date: string; time: string; reason: string }) => Promise<{ error: Error | null }>;
  removeBlackoutSlot: (id: string) => Promise<{ error: Error | null }>;
  
  // Paystack Integration
  initializePaystackPayment: (bookingId: string, email: string, amount: number) => Promise<{ authorizationUrl?: string; accessCode?: string; reference?: string; error?: string }>;
  verifyPaystackPayment: (bookingId: string, reference: string) => Promise<{ verified: boolean; error?: string }>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  // Auth state
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<'customer' | 'admin' | 'member' | null>(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);

  // Data states
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [isLoadingServices, setIsLoadingServices] = useState(true);

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoadingBookings, setIsLoadingBookings] = useState(false);

  const [availability, setAvailability] = useState<AvailabilityConfig>({
    operatingDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    doorsOpen: '09:00 AM',
    doorsClose: '07:00 PM',
    cadenceMinutes: 45,
    blackoutSlots: [],
  });
  const [isLoadingAvailability, setIsLoadingAvailability] = useState(true);

  // In-progress customer booking
  const [selectedServiceIds, setSelectedServiceIds] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>('2024-10-27');
  const [selectedTime, setSelectedTime] = useState<string>('02:30 PM');

  // Fetch user profile role from Supabase
  const fetchUserRole = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        console.warn('Error fetching user role:', error.message);
        setUserRole('customer');
        return 'customer';
      }
      const role = (data?.role === 'admin' ? 'admin' : data?.role === 'member' ? 'member' : 'customer') as 'customer' | 'admin' | 'member';
      setUserRole(role);
      return role;
    } catch {
      setUserRole('customer');
      return 'customer';
    }
  };

  // Auth state listener
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchUserRole(session.user.id).finally(() => setIsLoadingAuth(false));
      } else {
        setIsLoadingAuth(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchUserRole(session.user.id);
      } else {
        setUserRole(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Fetch Services from database
  const loadServices = async () => {
    setIsLoadingServices(true);
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .order('price', { ascending: true });

      if (error) throw error;
      if (data) {
        const formatted: ServiceItem[] = data.map((item: any) => ({
          id: item.id,
          name: item.name,
          durationMinutes: item.duration_minutes,
          price: Number(item.price),
          description: item.description || '',
        }));
        setServices(formatted);
        if (selectedServiceIds.length === 0 && formatted.length > 0) {
          setSelectedServiceIds([formatted[0].id]);
        }
      }
    } catch (err) {
      console.warn('Failed to load services:', err);
    } finally {
      setIsLoadingServices(false);
    }
  };

  // Fetch Business Settings & Blackout Slots
  const loadAvailability = async () => {
    setIsLoadingAvailability(true);
    try {
      // 1. Settings
      const { data: settingsData } = await supabase
        .from('business_settings')
        .select('*')
        .eq('id', 'crafted_barbers_config')
        .maybeSingle();

      // 2. Blackouts
      const { data: blackoutData } = await supabase
        .from('blackout_slots')
        .select('*')
        .order('booking_date', { ascending: true });

      const blackouts = (blackoutData || []).map((b: any) => ({
        id: b.id,
        date: b.booking_date,
        time: b.booking_time,
        reason: b.reason || '',
      }));

      setAvailability({
        operatingDays: settingsData?.operating_days || ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
        doorsOpen: settingsData?.doors_open || '09:00 AM',
        doorsClose: settingsData?.doors_close || '07:00 PM',
        cadenceMinutes: settingsData?.cadence_minutes || 45,
        blackoutSlots: blackouts,
      });
    } catch (err) {
      console.warn('Failed to load availability:', err);
    } finally {
      setIsLoadingAvailability(false);
    }
  };

  // Fetch Bookings (Customer gets own bookings, Admin gets all)
  const loadBookings = async () => {
    setIsLoadingBookings(true);
    try {
      let query = supabase
        .from('bookings')
        .select(`
          id,
          reference,
          customer_name,
          customer_email,
          customer_phone,
          booking_date,
          booking_date_label,
          booking_time,
          total_price,
          status,
          payment_method,
          payment_status,
          created_at,
          booking_items (
            id,
            service_id,
            service_name,
            duration_minutes,
            price
          )
        `)
        .order('created_at', { ascending: false });

      const { data, error } = await query;
      if (error) throw error;

      if (data) {
        const formatted: Booking[] = data.map((b: any) => ({
          id: b.id,
          reference: b.reference,
          customerName: b.customer_name,
          customerEmail: b.customer_email,
          customerPhone: b.customer_phone,
          date: b.booking_date,
          dateLabel: b.booking_date_label || b.booking_date,
          time: b.booking_time,
          totalPrice: Number(b.total_price),
          status: b.status,
          paymentMethod: b.payment_method,
          paymentStatus: b.payment_status,
          createdAt: b.created_at,
          services: (b.booking_items || []).map((bi: any) => ({
            id: bi.service_id || bi.id,
            name: bi.service_name,
            durationMinutes: bi.duration_minutes,
            price: Number(bi.price),
            description: '',
          })),
        }));
        setBookings(formatted);
      }
    } catch (err) {
      console.warn('Failed to load bookings:', err);
    } finally {
      setIsLoadingBookings(false);
    }
  };

  useEffect(() => {
    loadServices();
    loadAvailability();
    if (session?.user) {
      loadBookings();
    }
  }, [session?.user?.id]);

  // Auth functions
  const signInWithEmail = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) return { error };

    let role = 'customer';
    if (data.user) {
      role = await fetchUserRole(data.user.id);
    }
    await loadBookings();
    return { error: null, role };
  };

  const signUpWithEmail = async (email: string, password: string, fullName: string, phone?: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          phone: phone || '',
          role: 'customer',
        },
      },
    });
    if (error) return { error };
    if (data.user) {
      await fetchUserRole(data.user.id);
    }
    return { error: null };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setUser(null);
    setUserRole(null);
    setBookings([]);
  };

  // Service Management
  const addService = async (service: Omit<ServiceItem, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('services')
        .insert({
          name: service.name,
          duration_minutes: service.durationMinutes,
          price: service.price,
          description: service.description,
        })
        .select()
        .single();

      if (error) throw error;
      await loadServices();
      return { error: null };
    } catch (err: any) {
      return { error: err };
    }
  };

  const updateService = async (id: string, service: Partial<ServiceItem>) => {
    try {
      const updatePayload: any = {};
      if (service.name !== undefined) updatePayload.name = service.name;
      if (service.durationMinutes !== undefined) updatePayload.duration_minutes = service.durationMinutes;
      if (service.price !== undefined) updatePayload.price = service.price;
      if (service.description !== undefined) updatePayload.description = service.description;

      const { error } = await supabase
        .from('services')
        .update(updatePayload)
        .eq('id', id);

      if (error) throw error;
      await loadServices();
      return { error: null };
    } catch (err: any) {
      return { error: err };
    }
  };

  const deleteService = async (id: string) => {
    try {
      const { error } = await supabase.from('services').delete().eq('id', id);
      if (error) throw error;
      await loadServices();
      return { error: null };
    } catch (err: any) {
      return { error: err };
    }
  };

  // In-progress Customer booking selection
  const toggleSelectService = (id: string) => {
    setSelectedServiceIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const clearSelectedServices = () => {
    setSelectedServiceIds([]);
  };

  // Atomic conflict-free booking creation
  const createBooking = async (
    paymentMethod: 'card' | 'transfer' | 'atelier'
  ): Promise<{ booking: Booking | null; error: Error | null }> => {
    try {
      const chosenServices = services.filter((s) => selectedServiceIds.includes(s.id));
      const totalPrice = chosenServices.reduce((sum, s) => sum + s.price, 0);

      const customerName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Valued Client';
      const customerEmail = user?.email || 'client@crafted.com';
      const customerPhone = user?.user_metadata?.phone || '';

      // Generate a human-readable date label from the selected date
      const dateLabel = selectedDate
        ? new Date(selectedDate + 'T12:00:00').toLocaleDateString('en-GB', {
            weekday: 'long',
            day: 'numeric',
            month: 'short',
            year: 'numeric',
          })
        : selectedDate;

      const { data, error } = await supabase.rpc('create_booking_atomic', {
        p_customer_name: customerName,
        p_customer_email: customerEmail,
        p_customer_phone: customerPhone,
        p_booking_date: selectedDate,
        p_booking_date_label: dateLabel,
        p_booking_time: selectedTime,
        p_total_price: totalPrice,
        p_payment_method: paymentMethod,
        p_service_ids: chosenServices.map((s) => s.id),
      });

      if (error) throw error;

      const newBooking: Booking = {
        id: data.id,
        reference: data.reference,
        customerName,
        customerEmail,
        customerPhone,
        date: selectedDate,
        dateLabel,
        time: selectedTime,
        totalPrice,
        status: data.status,
        paymentMethod,
        paymentStatus: data.payment_status,
        createdAt: new Date().toISOString(),
        services: chosenServices,
      };

      await loadBookings();
      return { booking: newBooking, error: null };
    } catch (err: any) {
      return { booking: null, error: err };
    }
  };


  // Booking status changes
  const updateBookingStatus = async (id: string, status: Booking['status']) => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;
      await loadBookings();
      return { error: null };
    } catch (err: any) {
      return { error: err };
    }
  };

  const cancelBooking = async (id: string) => {
    return updateBookingStatus(id, 'cancelled');
  };

  // Availability Management
  const updateOperatingDays = async (days: string[]) => {
    try {
      const { error } = await supabase
        .from('business_settings')
        .update({ operating_days: days, updated_at: new Date().toISOString() })
        .eq('id', 'crafted_barbers_config');

      if (error) throw error;
      await loadAvailability();
      return { error: null };
    } catch (err: any) {
      return { error: err };
    }
  };

  const updateCadence = async (cadenceMinutes: number) => {
    try {
      const { error } = await supabase
        .from('business_settings')
        .update({ cadence_minutes: cadenceMinutes, updated_at: new Date().toISOString() })
        .eq('id', 'crafted_barbers_config');

      if (error) throw error;
      await loadAvailability();
      return { error: null };
    } catch (err: any) {
      return { error: err };
    }
  };

  const addBlackoutSlot = async (slot: { date: string; time: string; reason: string }) => {
    try {
      const { error } = await supabase
        .from('blackout_slots')
        .insert({
          booking_date: slot.date,
          booking_time: slot.time,
          reason: slot.reason,
        });

      if (error) throw error;
      await loadAvailability();
      return { error: null };
    } catch (err: any) {
      return { error: err };
    }
  };

  const removeBlackoutSlot = async (id: string) => {
    try {
      const { error } = await supabase
        .from('blackout_slots')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await loadAvailability();
      return { error: null };
    } catch (err: any) {
      return { error: err };
    }
  };

  // Paystack Integration via Edge Functions
  const initializePaystackPayment = async (bookingId: string, email: string, amount: number) => {
    try {
      const { data, error } = await supabase.functions.invoke('paystack-initialize', {
        body: { booking_id: bookingId, email, amount },
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      return {
        authorizationUrl: data?.authorization_url,
        accessCode: data?.access_code,
        reference: data?.reference,
      };
    } catch (err: any) {
      return { error: err.message || 'Payment initialization failed' };
    }
  };

  const verifyPaystackPayment = async (bookingId: string, reference: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('paystack-verify', {
        body: { booking_id: bookingId, reference },
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      await loadBookings();
      return { verified: data?.verified === true };
    } catch (err: any) {
      return { verified: false, error: err.message || 'Payment verification failed' };
    }
  };

  return (
    <AppContext.Provider
      value={{
        session,
        user,
        userRole,
        isAdmin: userRole === 'admin',
        isLoadingAuth,
        signInWithEmail,
        signUpWithEmail,
        signOut,
        services,
        isLoadingServices,
        addService,
        updateService,
        deleteService,
        selectedServiceIds,
        toggleSelectService,
        clearSelectedServices,
        selectedDate,
        setSelectedDate,
        selectedTime,
        setSelectedTime,
        createBooking,
        bookings,
        isLoadingBookings,
        loadBookings,
        updateBookingStatus,
        cancelBooking,
        availability,
        isLoadingAvailability,
        updateOperatingDays,
        updateCadence,
        addBlackoutSlot,
        removeBlackoutSlot,
        initializePaystackPayment,
        verifyPaystackPayment,
      }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
