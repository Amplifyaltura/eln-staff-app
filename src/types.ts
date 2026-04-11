export interface Product {
  id: string;
  name: string;
  image: string;
  category?: string;
  tags?: string[];
  description?: string;
}

export type ViewMode = 'grid' | 'list';

export interface StaffMember {
  id: string;
  name: string;
  pin: string;
  role?: string;
}

export type AttendanceStatus = 'clocked-in' | 'clocked-out' | 'on-errand';
export type ErrandType = 'official' | 'personal';

export interface ErrandRecord {
  type: ErrandType;
  reason: string;
  startTime: string;
  endTime?: string;
}

export interface AttendanceRecord {
  id: string;
  staffId: string;
  staffName: string;
  date: string;
  clockIn: string;
  clockOut?: string;
  status: AttendanceStatus;
  errands: ErrandRecord[];
  totalHours?: number;
}

export interface StaffSession {
  staffId: string;
  staffName: string;
  clockIn: string;
  status: AttendanceStatus;
  currentErrand?: ErrandRecord;
  recordId: string;
}
