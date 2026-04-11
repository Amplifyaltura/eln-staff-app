import { useState, useCallback } from 'react';
import type { AttendanceRecord, StaffSession, ErrandRecord, ErrandType } from '../types';

const SESSION_KEY = 'eln_staff_session';
const RECORDS_KEY = 'eln_attendance_records';

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

function formatTime(date: Date) {
  return date.toLocaleTimeString('en-ZA', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
}

function formatDate(date: Date) {
  return date.toLocaleDateString('en-ZA', { year: 'numeric', month: '2-digit', day: '2-digit' });
}

function calcHours(clockIn: string, clockOut: string, date: string): number {
  const [inH, inM, inS] = clockIn.split(':').map(Number);
  const [outH, outM, outS] = clockOut.split(':').map(Number);
  const base = new Date(date);
  const inDate = new Date(base); inDate.setHours(inH, inM, inS || 0);
  const outDate = new Date(base); outDate.setHours(outH, outM, outS || 0);
  return Math.round(((outDate.getTime() - inDate.getTime()) / 3600000) * 100) / 100;
}

export function useAttendance() {
  const [session, setSession] = useState<StaffSession | null>(() => {
    const s = localStorage.getItem(SESSION_KEY);
    return s ? JSON.parse(s) : null;
  });

  const [records, setRecords] = useState<AttendanceRecord[]>(() => {
    const r = localStorage.getItem(RECORDS_KEY);
    return r ? JSON.parse(r) : [];
  });

  const saveSession = (s: StaffSession | null) => {
    setSession(s);
    if (s) localStorage.setItem(SESSION_KEY, JSON.stringify(s));
    else localStorage.removeItem(SESSION_KEY);
  };

  const saveRecords = (r: AttendanceRecord[]) => {
    setRecords(r);
    localStorage.setItem(RECORDS_KEY, JSON.stringify(r));
  };

  const clockIn = useCallback((staffId: string, staffName: string) => {
    const now = new Date();
    const recordId = generateId();
    const record: AttendanceRecord = {
      id: recordId,
      staffId,
      staffName,
      date: formatDate(now),
      clockIn: formatTime(now),
      status: 'clocked-in',
      errands: [],
    };
    saveRecords([record, ...records]);
    saveSession({ staffId, staffName, clockIn: formatTime(now), status: 'clocked-in', recordId });
  }, [records]);

  const clockOut = useCallback(() => {
    if (!session) return;
    const now = new Date();
    const timeOut = formatTime(now);
    const updated = records.map(r => {
      if (r.id !== session.recordId) return r;
      const hours = calcHours(r.clockIn, timeOut, r.date);
      return { ...r, clockOut: timeOut, status: 'clocked-out' as const, totalHours: hours };
    });
    saveRecords(updated);
    saveSession(null);
  }, [session, records]);

  const startErrand = useCallback((type: ErrandType, reason: string) => {
    if (!session) return;
    const now = new Date();
    const errand: ErrandRecord = { type, reason, startTime: formatTime(now) };
    const updated = records.map(r => {
      if (r.id !== session.recordId) return r;
      return { ...r, status: 'on-errand' as const, errands: [...r.errands, errand] };
    });
    saveRecords(updated);
    saveSession({ ...session, status: 'on-errand', currentErrand: errand });
  }, [session, records]);

  const endErrand = useCallback(() => {
    if (!session || !session.currentErrand) return;
    const now = new Date();
    const endTime = formatTime(now);
    const updated = records.map(r => {
      if (r.id !== session.recordId) return r;
      const errands = r.errands.map((e, i) =>
        i === r.errands.length - 1 ? { ...e, endTime } : e
      );
      return { ...r, status: 'clocked-in' as const, errands };
    });
    saveRecords(updated);
    saveSession({ ...session, status: 'clocked-in', currentErrand: undefined });
  }, [session, records]);

  const deleteRecord = useCallback((id: string) => {
    saveRecords(records.filter(r => r.id !== id));
  }, [records]);

  return { session, records, clockIn, clockOut, startErrand, endErrand, deleteRecord };
}
