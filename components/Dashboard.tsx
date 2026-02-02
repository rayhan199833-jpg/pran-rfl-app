
import React, { useState } from 'react';
import { LogOut, Phone, Plus, FileText, ChevronLeft, User as UserIcon } from 'lucide-react';
import { InspectionForm } from './InspectionForm';
import { ReportList } from './ReportList';
import { User, InspectionRecord } from '../types';

interface DashboardProps {
  user: User;
  onLogout: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ user, onLogout }) => {
  const [view, setView] = useState<'home' | 'form'>('home');
  const [records, setRecords] = useState<InspectionRecord[]>(() => {
    const saved = localStorage.getItem('pran_rfl_records');
    return saved ? JSON.parse(saved) : [];
  });

  const handleSaveRecord = (record: InspectionRecord) => {
    const updated = [record, ...records];
    setRecords(updated);
    localStorage.setItem('pran_rfl_records', JSON.stringify(updated));
    setView('home');
  };

  const handleCallOfficer = () => {
    window.location.href = 'tel:+8801844200050';
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {/* Logo Left */}
            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center overflow-hidden border border-slate-200">
               <img src="https://i.ibb.co/LnxY5t9/rfl-logo.png" alt="RFL" className="w-full h-auto" onError={(e) => { (e.target as any).src = 'https://picsum.photos/50/50?text=RFL'; }} />
            </div>
            
            <div className="text-center hidden sm:block">
              <h1 className="text-xl font-black text-red-600 tracking-tighter uppercase">PRAN RFL Group</h1>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Safety Division</p>
            </div>

            <div className="block sm:hidden">
              <h1 className="text-lg font-black text-red-600">PRAN RFL</h1>
            </div>

            {/* Logo Right */}
             <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center overflow-hidden border border-slate-200">
               <img src="https://i.ibb.co/P44vWjB/fire-marshal.png" alt="Fire Marshal" className="w-full h-auto" onError={(e) => { (e.target as any).src = 'https://picsum.photos/50/50?text=FM'; }} />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="hidden md:flex flex-col items-end">
              <span className="text-sm font-bold text-slate-700">{user.username}</span>
              <span className="text-[10px] text-slate-400 font-medium">Logged In</span>
            </div>
            <button 
              onClick={onLogout}
              className="p-2 text-slate-400 hover:text-red-600 transition-colors"
              title="Logout"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow max-w-6xl w-full mx-auto p-4 md:p-6 pb-32">
        {view === 'home' ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                <FileText className="text-red-600" />
                Recent Inspections
              </h2>
              <button 
                onClick={() => setView('form')}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 shadow-lg transition-transform active:scale-95"
              >
                <Plus size={18} />
                New Inspection
              </button>
            </div>

            {records.length === 0 ? (
              <div className="bg-white rounded-2xl border-2 border-dashed border-slate-200 p-12 text-center">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="text-slate-300" size={32} />
                </div>
                <h3 className="text-lg font-bold text-slate-700">No inspections yet</h3>
                <p className="text-slate-500 mt-1">Start by adding a new fire extinguisher inspection record.</p>
              </div>
            ) : (
              <ReportList records={records} />
            )}
          </div>
        ) : (
          <div className="space-y-6">
            <button 
              onClick={() => setView('home')}
              className="flex items-center gap-1 text-slate-600 hover:text-slate-900 font-semibold mb-4"
            >
              <ChevronLeft size={20} />
              Back to List
            </button>
            <InspectionForm onSave={handleSaveRecord} />
          </div>
        )}
      </main>

      {/* Footer / Officer Contact */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-md border-t border-slate-200 z-40">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center text-red-600">
               <UserIcon size={20} />
             </div>
             <div className="text-sm">
               <p className="font-bold text-slate-800">Md. Habibur Rahman Habi</p>
               <p className="text-xs text-slate-500">Fire Safety Officer</p>
             </div>
          </div>
          <button 
            onClick={handleCallOfficer}
            className="w-full md:w-auto bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95 group"
          >
            <Phone size={18} className="group-hover:animate-bounce" />
            +8801844200050
          </button>
        </div>
      </div>
    </div>
  );
};
