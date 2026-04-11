import { useState, useCallback } from 'react';
import type { StaffMember } from '../types';

const STAFF_KEY = 'eln_staff_members';

const DEFAULT_STAFF: StaffMember[] = [
  { id: '1', name: 'John Smith', pin: '1234', role: 'Warehouse' },
  { id: '2', name: 'Sarah Johnson', pin: '2345', role: 'Sales' },
  { id: '3', name: 'Mike Williams', pin: '3456', role: 'Delivery' },
];

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

export function useStaff() {
  const [staff, setStaff] = useState<StaffMember[]>(() => {
    const s = localStorage.getItem(STAFF_KEY);
    return s ? JSON.parse(s) : DEFAULT_STAFF;
  });

  const saveStaff = (updated: StaffMember[]) => {
    setStaff(updated);
    localStorage.setItem(STAFF_KEY, JSON.stringify(updated));
  };

  const addStaff = useCallback((name: string, pin: string, role: string) => {
    const member: StaffMember = { id: generateId(), name, pin, role };
    saveStaff([...staff, member]);
  }, [staff]);

  const updateStaff = useCallback((id: string, updates: Partial<StaffMember>) => {
    saveStaff(staff.map(s => s.id === id ? { ...s, ...updates } : s));
  }, [staff]);

  const deleteStaff = useCallback((id: string) => {
    saveStaff(staff.filter(s => s.id !== id));
  }, [staff]);

  const verifyPin = useCallback((staffId: string, pin: string): boolean => {
    const member = staff.find(s => s.id === staffId);
    return member?.pin === pin;
  }, [staff]);

  return { staff, addStaff, updateStaff, deleteStaff, verifyPin };
}
