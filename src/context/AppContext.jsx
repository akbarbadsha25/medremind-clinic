import { createContext, useContext, useState, useCallback } from 'react';
import { patients as initialPatients, doctorProfile, seedAppointments, clinicSettings as defaultClinicSettings } from '../data/mockData';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [patients, setPatients] = useState(initialPatients);
  const [reminders, setReminders] = useState([]);
  const [toasts, setToasts] = useState([]);
  const [appointments, setAppointments] = useState(seedAppointments);
  const [clinicConfig, setClinicConfig] = useState(defaultClinicSettings);
  const [doctorData, setDoctorData] = useState(doctorProfile);

  const addPatient = useCallback((patient) => {
    const newPatient = {
      ...patient,
      id: `P${String(patients.length + 1).padStart(3, '0')}`,
      status: 'new',
      visits: [],
    };
    setPatients(prev => [newPatient, ...prev]);
    showToast('Patient added successfully!', 'success');
    return newPatient;
  }, [patients.length]);

  const updatePatient = useCallback((id, data) => {
    setPatients(prev => prev.map(p => p.id === id ? { ...p, ...data } : p));
    showToast('Patient updated successfully!', 'success');
  }, []);

  const deletePatient = useCallback((id) => {
    setPatients(prev => prev.filter(p => p.id !== id));
    showToast('Patient removed.', 'success');
  }, []);

  const sendReminder = useCallback((patient, message, template) => {
    const reminder = {
      id: `R${Date.now()}`,
      patientId: patient.id,
      patientName: patient.name,
      phone: patient.phone,
      message,
      template,
      sentAt: new Date().toISOString(),
      status: 'sent',
    };
    setReminders(prev => [reminder, ...prev]);

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${patient.phone}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');

    showToast(`Reminder sent to ${patient.name} via WhatsApp!`, 'success');
    return reminder;
  }, []);

  // Appointment functions
  const getAppointmentsForDate = useCallback((date) => {
    return appointments.filter(a => a.date === date && a.status !== 'cancelled');
  }, [appointments]);

  const getBookingCountForDate = useCallback((date) => {
    return appointments.filter(a => a.date === date && a.status !== 'cancelled').length;
  }, [appointments]);

  const isDateFull = useCallback((date) => {
    return getBookingCountForDate(date) >= clinicConfig.dailyPatientLimit;
  }, [getBookingCountForDate, clinicConfig.dailyPatientLimit]);

  const isSlotBooked = useCallback((date, time) => {
    return appointments.some(a => a.date === date && a.time === time && a.status !== 'cancelled');
  }, [appointments]);

  const bookAppointment = useCallback((appointmentData) => {
    const { date, time, patientId, patientName, treatment } = appointmentData;

    // Check if daily limit exceeded
    if (isDateFull(date)) {
      showToast(`Daily limit of ${clinicConfig.dailyPatientLimit} patients reached for this date. Please select another date.`, 'error');
      return null;
    }

    // Check if slot is taken
    if (isSlotBooked(date, time)) {
      showToast('This time slot is already booked. Please choose another.', 'error');
      return null;
    }

    const newAppointment = {
      id: `A${Date.now()}`,
      patientId,
      patientName,
      date,
      time,
      treatment: treatment || '',
      status: 'confirmed',
      createdAt: new Date().toISOString(),
    };

    setAppointments(prev => [...prev, newAppointment]);
    showToast(`Appointment booked for ${patientName} on ${new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} at ${time}`, 'success');
    return newAppointment;
  }, [isDateFull, isSlotBooked, clinicConfig.dailyPatientLimit]);

  const cancelAppointment = useCallback((appointmentId) => {
    setAppointments(prev => prev.map(a =>
      a.id === appointmentId ? { ...a, status: 'cancelled' } : a
    ));
    showToast('Appointment cancelled.', 'success');
  }, []);

  const updateClinicConfig = useCallback((newConfig) => {
    setClinicConfig(prev => ({ ...prev, ...newConfig }));
  }, []);

  const updateDoctor = useCallback((newData) => {
    setDoctorData(prev => ({ ...prev, ...newData }));
  }, []);

  const showToast = useCallback((message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  }, []);

  const getPatient = useCallback((id) => {
    return patients.find(p => p.id === id);
  }, [patients]);

  const getStats = useCallback(() => {
    const today = new Date().toISOString().split('T')[0];
    const totalPatients = patients.length;
    const activePatients = patients.filter(p => p.status === 'active').length;
    const newPatients = patients.filter(p => p.status === 'new').length;
    const todayReminders = reminders.filter(r =>
      r.sentAt.split('T')[0] === today
    ).length;
    const in7Days = new Date();
    in7Days.setDate(in7Days.getDate() + 7);
    const in7DaysStr = in7Days.toISOString().split('T')[0];
    const pendingFollowups = appointments.filter(a =>
      a.status !== 'cancelled' && a.date >= today && a.date <= in7DaysStr
    ).length;
    const todayAppointmentCount = getBookingCountForDate(today);

    return {
      totalPatients,
      activePatients,
      newPatients,
      todayReminders,
      pendingFollowups,
      totalReminders: reminders.length,
      todayAppointmentCount,
      dailyLimit: clinicConfig.dailyPatientLimit,
    };
  }, [patients, reminders, appointments, getBookingCountForDate, clinicConfig.dailyPatientLimit]);

  return (
    <AppContext.Provider value={{
      patients,
      reminders,
      toasts,
      appointments,
      clinicConfig,
      doctor: doctorData,
      updateDoctor,
      addPatient,
      updatePatient,
      deletePatient,
      sendReminder,
      showToast,
      getPatient,
      getStats,
      getAppointmentsForDate,
      getBookingCountForDate,
      isDateFull,
      isSlotBooked,
      bookAppointment,
      cancelAppointment,
      updateClinicConfig,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
}
