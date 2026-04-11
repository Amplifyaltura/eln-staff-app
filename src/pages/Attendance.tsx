import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, LogOut, MapPin, CheckCircle, ChevronDown, Briefcase, ShoppingBag, X, AlertCircle } from 'lucide-react';
import { useAttendance } from '../hooks/useAttendance';
import { useStaff } from '../hooks/useStaff';
import type { ErrandType } from '../types';
import AppShell from '../components/AppShell';

const OFFICIAL_REASONS = [
  'Client Visit',
  'Site Inspection',
  'Supplier Meeting',
  'Bank / Finance',
  'Delivery Run',
  'Government Office',
  'Other Official',
];

const PERSONAL_REASONS = [
  'Doctor / Medical',
  'Personal Errand',
  'Family Matter',
  'Other Personal',
];

export default function Attendance() {
  const { session, clockIn, clockOut, startErrand, endErrand } = useAttendance();
  const { staff, verifyPin } = useStaff();

  const [step, setStep] = useState<'select-staff' | 'enter-pin' | 'dashboard'>(
    session ? 'dashboard' : 'select-staff'
  );
  const [selectedStaff, setSelectedStaff] = useState<string>('');
  const [pin, setPin] = useState('');
  const [pinError, setPinError] = useState(false);
  const [showErrandModal, setShowErrandModal] = useState(false);
  const [errandType, setErrandType] = useState<ErrandType>('official');
  const [errandReason, setErrandReason] = useState('');
  const [showClockOutConfirm, setShowClockOutConfirm] = useState(false);
  const [now, setNow] = useState(new Date());

  // Live clock
  useState(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  });

  const handleStaffSelect = (id: string) => {
    setSelectedStaff(id);
    setPin('');
    setPinError(false);
    setStep('enter-pin');
  };

  const handlePinDigit = (digit: string) => {
    if (pin.length >= 4) return;
    const newPin = pin + digit;
    setPin(newPin);
    setPinError(false);
    if (newPin.length === 4) {
      setTimeout(() => {
        if (verifyPin(selectedStaff, newPin)) {
          const member = staff.find(s => s.id === selectedStaff)!;
          clockIn(member.id, member.name);
          setStep('dashboard');
        } else {
          setPinError(true);
          setPin('');
        }
      }, 300);
    }
  };

  const handleClockOut = () => {
    clockOut();
    setStep('select-staff');
    setShowClockOutConfirm(false);
  };

  const handleStartErrand = () => {
    if (!errandReason) return;
    startErrand(errandType, errandReason);
    setShowErrandModal(false);
    setErrandReason('');
  };

  const handleEndErrand = () => {
    endErrand();
  };

  const statusColor = session?.status === 'clocked-in'
    ? 'rgba(100,255,150,0.8)'
    : session?.status === 'on-errand'
    ? 'rgba(255,200,80,0.8)'
    : 'rgba(255,100,100,0.8)';

  const statusBg = session?.status === 'clocked-in'
    ? 'rgba(100,255,150,0.08)'
    : session?.status === 'on-errand'
    ? 'rgba(255,200,80,0.08)'
    : 'rgba(255,100,100,0.08)';

  const statusLabel = session?.status === 'clocked-in'
    ? 'Clocked In'
    : session?.status === 'on-errand'
    ? 'On Errand'
    : 'Clocked Out';

  return (
    <AppShell>
      <div className="max-w-lg mx-auto px-4 py-8">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center" style={{ background: 'rgba(212,175,55,0.1)', border: '2px solid rgba(212,175,55,0.25)' }}>
            <Clock className="w-8 h-8" style={{ color: 'var(--color-gold)' }} />
          </div>
          <h1 className="text-2xl font-black" style={{ color: 'white' }}>Staff <span style={{ color: 'var(--color-gold)' }}>Attendance</span></h1>
          <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.4)' }}>
            {now.toLocaleDateString('en-ZA', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
          <p className="text-3xl font-black mt-1 tabular-nums" style={{ color: 'var(--color-gold)' }}>
            {now.toLocaleTimeString('en-ZA', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })}
          </p>
        </div>

        <AnimatePresence mode="wait">

          {/* STEP 1: Select Staff */}
          {step === 'select-staff' && (
            <motion.div key="select" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <div className="rounded-2xl overflow-hidden" style={{ background: 'var(--color-card)', border: '1px solid rgba(212,175,55,0.15)' }}>
                <div className="px-5 py-4" style={{ borderBottom: '1px solid rgba(212,175,55,0.1)' }}>
                  <h2 className="font-bold text-white">Select Your Name</h2>
                  <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.4)' }}>Tap your name to clock in</p>
                </div>
                {staff.map((member, i) => (
                  <motion.button
                    key={member.id}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleStaffSelect(member.id)}
                    className="w-full flex items-center gap-4 px-5 py-4 text-left transition-all hover:opacity-80"
                    style={{ borderTop: i > 0 ? '1px solid rgba(255,255,255,0.05)' : 'none', background: 'transparent' }}
                  >
                    <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 font-bold text-sm" style={{ background: 'rgba(212,175,55,0.15)', color: 'var(--color-gold)' }}>
                      {member.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-white">{member.name}</div>
                      {member.role && <div className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>{member.role}</div>}
                    </div>
                    <ChevronDown className="w-4 h-4 -rotate-90" style={{ color: 'rgba(212,175,55,0.4)' }} />
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {/* STEP 2: Enter PIN */}
          {step === 'enter-pin' && (
            <motion.div key="pin" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <div className="rounded-2xl p-6 text-center" style={{ background: 'var(--color-card)', border: '1px solid rgba(212,175,55,0.15)' }}>
                <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 font-bold" style={{ background: 'rgba(212,175,55,0.15)', color: 'var(--color-gold)', fontSize: '1.1rem' }}>
                  {staff.find(s => s.id === selectedStaff)?.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </div>
                <h2 className="font-bold text-white mb-1">{staff.find(s => s.id === selectedStaff)?.name}</h2>
                <p className="text-xs mb-6" style={{ color: 'rgba(255,255,255,0.4)' }}>Enter your 4-digit PIN</p>

                {/* PIN dots */}
                <div className="flex items-center justify-center gap-4 mb-6">
                  {[0, 1, 2, 3].map(i => (
                    <motion.div
                      key={i}
                      animate={{ scale: pin.length > i ? 1.2 : 1 }}
                      className="w-4 h-4 rounded-full"
                      style={{ background: pinError ? 'rgba(255,100,100,0.8)' : pin.length > i ? 'var(--color-gold)' : 'rgba(255,255,255,0.15)' }}
                    />
                  ))}
                </div>

                {pinError && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-4 flex items-center justify-center gap-2 text-xs" style={{ color: 'rgba(255,100,100,0.9)' }}>
                    <AlertCircle className="w-4 h-4" /> Incorrect PIN. Try again.
                  </motion.div>
                )}

                {/* Number pad */}
                <div className="grid grid-cols-3 gap-3 max-w-xs mx-auto">
                  {['1','2','3','4','5','6','7','8','9','','0','⌫'].map((d, i) => (
                    <button
                      key={i}
                      onClick={() => d === '⌫' ? setPin(p => p.slice(0, -1)) : d ? handlePinDigit(d) : null}
                      disabled={!d}
                      className="h-14 rounded-xl font-bold text-lg transition-all hover:opacity-80 active:scale-95 disabled:opacity-0"
                      style={{ background: d === '⌫' ? 'rgba(255,100,100,0.1)' : 'rgba(255,255,255,0.06)', color: d === '⌫' ? 'rgba(255,120,120,0.8)' : 'white', border: '1px solid rgba(255,255,255,0.08)' }}
                    >
                      {d}
                    </button>
                  ))}
                </div>

                <button onClick={() => setStep('select-staff')} className="mt-6 text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>
                  ← Back to staff list
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 3: Staff Dashboard */}
          {step === 'dashboard' && session && (
            <motion.div key="dashboard" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-4">

              {/* Status Card */}
              <div className="rounded-2xl p-5" style={{ background: 'var(--color-card)', border: '1px solid rgba(212,175,55,0.15)' }}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center font-bold" style={{ background: 'rgba(212,175,55,0.15)', color: 'var(--color-gold)' }}>
                      {session.staffName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </div>
                    <div>
                      <div className="font-bold text-white">{session.staffName}</div>
                      <div className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>Clocked in at {session.clockIn}</div>
                    </div>
                  </div>
                  <div className="px-3 py-1.5 rounded-full text-xs font-bold" style={{ background: statusBg, color: statusColor, border: `1px solid ${statusColor}` }}>
                    {statusLabel}
                  </div>
                </div>

                {/* Current errand info */}
                {session.status === 'on-errand' && session.currentErrand && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-xl p-3 mb-4" style={{ background: 'rgba(255,200,80,0.06)', border: '1px solid rgba(255,200,80,0.2)' }}>
                    <div className="flex items-center gap-2 mb-1">
                      <MapPin className="w-3.5 h-3.5" style={{ color: 'rgba(255,200,80,0.8)' }} />
                      <span className="text-xs font-bold" style={{ color: 'rgba(255,200,80,0.8)' }}>
                        {session.currentErrand.type === 'official' ? 'Official' : 'Personal'} Errand
                      </span>
                    </div>
                    <p className="text-sm text-white">{session.currentErrand.reason}</p>
                    <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.4)' }}>Started at {session.currentErrand.startTime}</p>
                  </motion.div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 gap-3">

                {/* Errand / Return buttons */}
                {session.status === 'on-errand' ? (
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={handleEndErrand}
                    className="w-full py-4 rounded-2xl font-bold text-base flex items-center justify-center gap-3"
                    style={{ background: 'rgba(100,255,150,0.1)', border: '2px solid rgba(100,255,150,0.3)', color: 'rgba(100,255,150,0.9)' }}
                  >
                    <CheckCircle className="w-5 h-5" />
                    I'm Back — End Errand
                  </motion.button>
                ) : (
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setShowErrandModal(true)}
                    className="w-full py-4 rounded-2xl font-bold text-base flex items-center justify-center gap-3"
                    style={{ background: 'rgba(212,175,55,0.08)', border: '2px solid rgba(212,175,55,0.25)', color: 'var(--color-gold)' }}
                  >
                    <MapPin className="w-5 h-5" />
                    Going on Errand
                  </motion.button>
                )}

                {/* Clock Out */}
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setShowClockOutConfirm(true)}
                  className="w-full py-4 rounded-2xl font-bold text-base flex items-center justify-center gap-3"
                  style={{ background: 'rgba(255,80,80,0.08)', border: '2px solid rgba(255,80,80,0.25)', color: 'rgba(255,120,120,0.9)' }}
                >
                  <LogOut className="w-5 h-5" />
                  Clock Out — End of Day
                </motion.button>
              </div>

            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* Errand Modal */}
      <AnimatePresence>
        {showErrandModal && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
            style={{ background: 'rgba(5,12,25,0.92)', backdropFilter: 'blur(8px)' }}
            onClick={() => setShowErrandModal(false)}
          >
            <motion.div
              initial={{ y: 60, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 60, opacity: 0 }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="w-full max-w-md rounded-2xl p-6"
              style={{ background: 'var(--color-card)', border: '1px solid rgba(212,175,55,0.2)' }}
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-bold text-white text-lg">Going on Errand</h2>
                <button onClick={() => setShowErrandModal(false)} className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.06)' }}>
                  <X className="w-4 h-4 text-white" />
                </button>
              </div>

              {/* Errand Type */}
              <div className="grid grid-cols-2 gap-3 mb-5">
                <button
                  onClick={() => { setErrandType('official'); setErrandReason(''); }}
                  className="py-4 rounded-xl flex flex-col items-center gap-2 font-semibold text-sm transition-all"
                  style={{
                    background: errandType === 'official' ? 'rgba(212,175,55,0.15)' : 'rgba(255,255,255,0.04)',
                    border: errandType === 'official' ? '2px solid var(--color-gold)' : '2px solid rgba(255,255,255,0.08)',
                    color: errandType === 'official' ? 'var(--color-gold)' : 'rgba(255,255,255,0.5)',
                  }}
                >
                  <Briefcase className="w-6 h-6" />
                  Official
                </button>
                <button
                  onClick={() => { setErrandType('personal'); setErrandReason(''); }}
                  className="py-4 rounded-xl flex flex-col items-center gap-2 font-semibold text-sm transition-all"
                  style={{
                    background: errandType === 'personal' ? 'rgba(212,175,55,0.15)' : 'rgba(255,255,255,0.04)',
                    border: errandType === 'personal' ? '2px solid var(--color-gold)' : '2px solid rgba(255,255,255,0.08)',
                    color: errandType === 'personal' ? 'var(--color-gold)' : 'rgba(255,255,255,0.5)',
                  }}
                >
                  <ShoppingBag className="w-6 h-6" />
                  Personal
                </button>
              </div>

              {/* Reason */}
              <div className="mb-5">
                <label className="block text-xs font-semibold mb-2" style={{ color: 'rgba(212,175,55,0.8)' }}>Select Reason</label>
                <div className="grid grid-cols-1 gap-2">
                  {(errandType === 'official' ? OFFICIAL_REASONS : PERSONAL_REASONS).map(reason => (
                    <button
                      key={reason}
                      onClick={() => setErrandReason(reason)}
                      className="py-2.5 px-4 rounded-lg text-sm text-left transition-all"
                      style={{
                        background: errandReason === reason ? 'rgba(212,175,55,0.12)' : 'rgba(255,255,255,0.04)',
                        border: errandReason === reason ? '1px solid rgba(212,175,55,0.4)' : '1px solid rgba(255,255,255,0.07)',
                        color: errandReason === reason ? 'var(--color-gold)' : 'rgba(255,255,255,0.6)',
                      }}
                    >
                      {reason}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleStartErrand}
                disabled={!errandReason}
                className="w-full py-3.5 rounded-xl font-bold text-sm transition-all disabled:opacity-40"
                style={{ background: 'var(--color-gold)', color: '#0a1628' }}
              >
                Confirm — I'm Leaving
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Clock Out Confirm */}
      <AnimatePresence>
        {showClockOutConfirm && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(5,12,25,0.92)', backdropFilter: 'blur(8px)' }}
          >
            <motion.div
              initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
              className="w-full max-w-sm rounded-2xl p-6 text-center"
              style={{ background: 'var(--color-card)', border: '1px solid rgba(255,80,80,0.3)' }}
            >
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: 'rgba(255,80,80,0.1)' }}>
                <LogOut className="w-7 h-7" style={{ color: 'rgba(255,120,120,0.9)' }} />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Clock Out?</h3>
              <p className="text-sm mb-2" style={{ color: 'rgba(255,255,255,0.5)' }}>Are you sure you want to end your shift?</p>
              <p className="text-xs mb-6" style={{ color: 'rgba(255,255,255,0.3)' }}>Clocked in at {session?.clockIn}</p>
              <div className="flex gap-3">
                <button onClick={() => setShowClockOutConfirm(false)} className="flex-1 py-3 rounded-xl text-sm font-semibold" style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.6)' }}>Cancel</button>
                <button onClick={handleClockOut} className="flex-1 py-3 rounded-xl text-sm font-semibold" style={{ background: 'rgba(255,80,80,0.8)', color: 'white' }}>Clock Out</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AppShell>
  );
}
