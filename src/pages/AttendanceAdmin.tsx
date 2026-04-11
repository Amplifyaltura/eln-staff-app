import { useState } from 'react';
import { motion } from 'framer-motion';
import { Trash2, Download, ChevronDown, ChevronUp, MapPin, LogIn, LogOut, Plus, Pencil, X, Save } from 'lucide-react';
import { useAttendance } from '../hooks/useAttendance';
import { useStaff } from '../hooks/useStaff';


export default function AttendanceAdmin() {
  const { records, deleteRecord } = useAttendance();
  const { staff, addStaff, updateStaff, deleteStaff } = useStaff();
  const [activeTab, setActiveTab] = useState<'records' | 'staff'>('records');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [filterDate, setFilterDate] = useState('');
  const [filterStaff, setFilterStaff] = useState('All');
  const [showStaffForm, setShowStaffForm] = useState(false);
  const [editStaffId, setEditStaffId] = useState<string | null>(null);
  const [staffForm, setStaffForm] = useState({ name: '', pin: '', role: '' });

  const filtered = records.filter(r => {
    const dateOk = !filterDate || r.date.includes(filterDate);
    const staffOk = filterStaff === 'All' || r.staffName === filterStaff;
    return dateOk && staffOk;
  });

  const allStaffNames = ['All', ...Array.from(new Set(records.map(r => r.staffName)))];

  const statusColor = (status: string) =>
    status === 'clocked-in' ? 'rgba(100,255,150,0.8)'
    : status === 'on-errand' ? 'rgba(255,200,80,0.8)'
    : 'rgba(180,180,180,0.6)';

  const exportCSV = () => {
    const rows = [
      ['Date', 'Staff Name', 'Clock In', 'Clock Out', 'Total Hours', 'Errands'],
      ...filtered.map(r => [
        r.date, r.staffName, r.clockIn, r.clockOut || '-',
        r.totalHours?.toString() || '-',
        r.errands.map(e => `${e.type}: ${e.reason} (${e.startTime}${e.endTime ? '-' + e.endTime : ''})`).join(' | ')
      ])
    ];
    const csv = rows.map(r => r.map(c => `"${c}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url;
    a.download = `attendance-${new Date().toISOString().slice(0,10)}.csv`;
    a.click(); URL.revokeObjectURL(url);
  };

  const openAddStaff = () => {
    setEditStaffId(null);
    setStaffForm({ name: '', pin: '', role: '' });
    setShowStaffForm(true);
  };

  const openEditStaff = (id: string) => {
    const m = staff.find(s => s.id === id)!;
    setEditStaffId(id);
    setStaffForm({ name: m.name, pin: m.pin, role: m.role || '' });
    setShowStaffForm(true);
  };

  const handleSaveStaff = () => {
    if (!staffForm.name || !staffForm.pin) return;
    if (editStaffId) {
      updateStaff(editStaffId, staffForm);
    } else {
      addStaff(staffForm.name, staffForm.pin, staffForm.role);
    }
    setShowStaffForm(false);
  };

  return (
    <div>
      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {(['records', 'staff'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className="px-5 py-2.5 rounded-xl text-sm font-semibold capitalize transition-all"
            style={{
              background: activeTab === tab ? 'var(--color-gold)' : 'rgba(255,255,255,0.06)',
              color: activeTab === tab ? '#0a1628' : 'rgba(255,255,255,0.5)',
            }}
          >
            {tab === 'records' ? 'Attendance Records' : 'Manage Staff'}
          </button>
        ))}
      </div>

      {/* RECORDS TAB */}
      {activeTab === 'records' && (
        <div>
          {/* Filters + Export */}
          <div className="flex flex-col sm:flex-row gap-3 mb-5">
            <input
              type="date"
              value={filterDate}
              onChange={e => setFilterDate(e.target.value)}
              className="px-4 py-2.5 rounded-lg text-sm outline-none"
              style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(212,175,55,0.2)', color: 'white' }}
            />
            <select
              value={filterStaff}
              onChange={e => setFilterStaff(e.target.value)}
              className="flex-1 px-4 py-2.5 rounded-lg text-sm outline-none"
              style={{ background: '#0f1e35', border: '1px solid rgba(212,175,55,0.2)', color: 'white' }}
            >
              {allStaffNames.map(n => <option key={n} value={n} style={{ background: '#0a1628' }}>{n}</option>)}
            </select>
            <button
              onClick={exportCSV}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold"
              style={{ background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.25)', color: 'var(--color-gold)' }}
            >
              <Download className="w-4 h-4" /> Export CSV
            </button>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-3 mb-5">
            {[
              { label: 'Total Records', value: filtered.length },
              { label: 'Today', value: filtered.filter(r => r.date === new Date().toLocaleDateString('en-ZA', { year: 'numeric', month: '2-digit', day: '2-digit' })).length },
              { label: 'Total Errands', value: filtered.reduce((a, r) => a + r.errands.length, 0) },
            ].map(({ label, value }) => (
              <div key={label} className="rounded-xl p-3 text-center" style={{ background: 'var(--color-card)', border: '1px solid rgba(212,175,55,0.1)' }}>
                <div className="text-xl font-black" style={{ color: 'var(--color-gold)' }}>{value}</div>
                <div className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.4)' }}>{label}</div>
              </div>
            ))}
          </div>

          {/* Records list */}
          {filtered.length === 0 ? (
            <div className="py-16 text-center" style={{ color: 'rgba(255,255,255,0.3)' }}>No attendance records found.</div>
          ) : (
            <div className="space-y-3">
              {filtered.map((record, i) => (
                <motion.div
                  key={record.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="rounded-xl overflow-hidden"
                  style={{ background: 'var(--color-card)', border: '1px solid rgba(212,175,55,0.1)' }}
                >
                  <div
                    className="flex items-center gap-3 px-4 py-3 cursor-pointer"
                    onClick={() => setExpandedId(expandedId === record.id ? null : record.id)}
                  >
                    <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0" style={{ background: 'rgba(212,175,55,0.15)', color: 'var(--color-gold)' }}>
                      {record.staffName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-sm text-white">{record.staffName}</div>
                      <div className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>{record.date}</div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <div className="text-xs px-2 py-1 rounded-full font-semibold" style={{ background: `${statusColor(record.status)}15`, color: statusColor(record.status), border: `1px solid ${statusColor(record.status)}` }}>
                        {record.status === 'clocked-out' ? 'Done' : record.status === 'on-errand' ? 'Errand' : 'Active'}
                      </div>
                      {record.totalHours && (
                        <span className="text-xs" style={{ color: 'rgba(212,175,55,0.7)' }}>{record.totalHours}h</span>
                      )}
                      {expandedId === record.id ? <ChevronUp className="w-4 h-4" style={{ color: 'rgba(255,255,255,0.3)' }} /> : <ChevronDown className="w-4 h-4" style={{ color: 'rgba(255,255,255,0.3)' }} />}
                    </div>
                  </div>

                  {expandedId === record.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                      className="px-4 pb-4"
                      style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}
                    >
                      <div className="pt-3 grid grid-cols-2 gap-3 mb-3">
                        <div className="flex items-center gap-2">
                          <LogIn className="w-3.5 h-3.5" style={{ color: 'rgba(100,255,150,0.7)' }} />
                          <span className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>In: <strong className="text-white">{record.clockIn}</strong></span>
                        </div>
                        <div className="flex items-center gap-2">
                          <LogOut className="w-3.5 h-3.5" style={{ color: 'rgba(255,120,120,0.7)' }} />
                          <span className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>Out: <strong className="text-white">{record.clockOut || 'Still in'}</strong></span>
                        </div>
                      </div>
                      {record.errands.length > 0 && (
                        <div>
                          <p className="text-xs font-semibold mb-2" style={{ color: 'rgba(212,175,55,0.7)' }}>Errands ({record.errands.length})</p>
                          <div className="space-y-2">
                            {record.errands.map((e, ei) => (
                              <div key={ei} className="flex items-start gap-2 p-2 rounded-lg" style={{ background: 'rgba(255,255,255,0.03)' }}>
                                <MapPin className="w-3.5 h-3.5 mt-0.5 shrink-0" style={{ color: e.type === 'official' ? 'rgba(212,175,55,0.7)' : 'rgba(150,180,255,0.7)' }} />
                                <div>
                                  <span className="text-xs font-semibold" style={{ color: e.type === 'official' ? 'rgba(212,175,55,0.8)' : 'rgba(150,180,255,0.8)' }}>{e.type === 'official' ? 'Official' : 'Personal'}: </span>
                                  <span className="text-xs text-white">{e.reason}</span>
                                  <div className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>{e.startTime}{e.endTime ? ` → ${e.endTime}` : ' (ongoing)'}</div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      <div className="flex justify-end mt-3">
                        <button onClick={() => deleteRecord(record.id)} className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg" style={{ background: 'rgba(255,80,80,0.1)', color: 'rgba(255,120,120,0.8)' }}>
                          <Trash2 className="w-3 h-3" /> Delete
                        </button>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* STAFF TAB */}
      {activeTab === 'staff' && (
        <div>
          <div className="flex justify-end mb-4">
            <button onClick={openAddStaff} className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold" style={{ background: 'var(--color-gold)', color: '#0a1628' }}>
              <Plus className="w-4 h-4" /> Add Staff Member
            </button>
          </div>
          <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(212,175,55,0.15)' }}>
            <div className="grid grid-cols-[1fr_auto_auto_auto] gap-0 text-xs font-bold uppercase tracking-widest px-4 py-3" style={{ background: 'rgba(212,175,55,0.08)', color: 'rgba(212,175,55,0.7)' }}>
              <span>Name</span>
              <span className="px-4">Role</span>
              <span className="px-4">PIN</span>
              <span>Actions</span>
            </div>
            {staff.map((member, i) => (
              <div key={member.id} className="grid grid-cols-[1fr_auto_auto_auto] items-center gap-0 px-4 py-3" style={{ borderTop: i > 0 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: 'rgba(212,175,55,0.15)', color: 'var(--color-gold)' }}>
                    {member.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </div>
                  <span className="text-sm font-semibold text-white">{member.name}</span>
                </div>
                <span className="px-4 text-xs" style={{ color: 'rgba(255,255,255,0.45)' }}>{member.role || '—'}</span>
                <span className="px-4 text-sm font-mono" style={{ color: 'rgba(212,175,55,0.6)' }}>{'•'.repeat(member.pin.length)}</span>
                <div className="flex items-center gap-2">
                  <button onClick={() => openEditStaff(member.id)} className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.2)' }}>
                    <Pencil className="w-3.5 h-3.5" style={{ color: 'var(--color-gold)' }} />
                  </button>
                  <button onClick={() => deleteStaff(member.id)} className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(255,80,80,0.1)', border: '1px solid rgba(255,80,80,0.2)' }}>
                    <Trash2 className="w-3.5 h-3.5" style={{ color: 'rgba(255,100,100,0.8)' }} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Staff Form Modal */}
      {showStaffForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(5,12,25,0.9)', backdropFilter: 'blur(6px)' }} onClick={() => setShowStaffForm(false)}>
          <motion.div initial={{ scale: 0.92 }} animate={{ scale: 1 }} className="w-full max-w-sm rounded-2xl p-6" style={{ background: 'var(--color-card)', border: '1px solid rgba(212,175,55,0.25)' }} onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-bold text-white">{editStaffId ? 'Edit Staff' : 'Add Staff Member'}</h2>
              <button onClick={() => setShowStaffForm(false)} className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.06)' }}><X className="w-4 h-4 text-white" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: 'rgba(212,175,55,0.8)' }}>Full Name *</label>
                <input type="text" value={staffForm.name} onChange={e => setStaffForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. John Smith" className="w-full px-4 py-2.5 rounded-lg text-sm outline-none" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(212,175,55,0.2)', color: 'white' }} />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: 'rgba(212,175,55,0.8)' }}>4-Digit PIN *</label>
                <input type="password" maxLength={4} value={staffForm.pin} onChange={e => setStaffForm(f => ({ ...f, pin: e.target.value.replace(/\D/g, '').slice(0, 4) }))} placeholder="e.g. 1234" className="w-full px-4 py-2.5 rounded-lg text-sm outline-none font-mono" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(212,175,55,0.2)', color: 'white' }} />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: 'rgba(212,175,55,0.8)' }}>Role / Department</label>
                <input type="text" value={staffForm.role} onChange={e => setStaffForm(f => ({ ...f, role: e.target.value }))} placeholder="e.g. Warehouse, Sales, Delivery" className="w-full px-4 py-2.5 rounded-lg text-sm outline-none" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(212,175,55,0.2)', color: 'white' }} />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowStaffForm(false)} className="flex-1 py-2.5 rounded-lg text-sm font-semibold" style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.6)' }}>Cancel</button>
              <button onClick={handleSaveStaff} disabled={!staffForm.name || staffForm.pin.length < 4} className="flex-1 py-2.5 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 disabled:opacity-40" style={{ background: 'var(--color-gold)', color: '#0a1628' }}>
                <Save className="w-4 h-4" /> Save
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
