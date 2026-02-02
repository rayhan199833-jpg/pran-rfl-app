
import React from 'react';
import { InspectionRecord } from '../types';
import { FileDown, Calendar, Hash, MapPin, Search } from 'lucide-react';
import { generatePDF } from '../services/pdfService';

interface ReportListProps {
  records: InspectionRecord[];
}

export const ReportList: React.FC<ReportListProps> = ({ records }) => {
  const [searchTerm, setSearchTerm] = React.useState('');

  const filtered = records.filter(r => 
    r.pointNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.fireMarshalName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.section.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
        <input 
          type="text" 
          placeholder="Search by Point, Name, or Section..."
          className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl shadow-sm outline-none focus:ring-2 focus:ring-red-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((record) => (
          <div key={record.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow group">
            <div className="flex justify-between items-start mb-4">
              <div className="bg-red-50 text-red-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                {record.extinguisherType}
              </div>
              <button 
                onClick={() => generatePDF(record)}
                className="p-2 bg-slate-50 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                title="Download PDF"
              >
                <FileDown size={18} />
              </button>
            </div>
            
            <h4 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <Hash size={16} className="text-slate-400" />
              {record.pointNumber}
            </h4>
            
            <div className="mt-4 space-y-2">
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <Calendar size={14} className="text-slate-400" />
                <span>{new Date(record.timestamp).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <MapPin size={14} className="text-slate-400" />
                <span>{record.section}</span>
              </div>
              <div className="pt-2 flex items-center gap-2 border-t border-slate-50">
                <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-600">
                  {record.fireMarshalName.charAt(0)}
                </div>
                <span className="text-xs font-medium text-slate-500">{record.fireMarshalName}</span>
              </div>
            </div>
            
            <div className="mt-4 flex gap-2">
              <StatusBadge label="Seal" value={record.seal} type={record.seal === 'Good' ? 'success' : 'error'} />
              <StatusBadge label="Pressure" value={record.pressure} type={record.pressure === 'OK' ? 'success' : 'error'} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const StatusBadge: React.FC<{ label: string; value: string; type: 'success' | 'error' }> = ({ label, value, type }) => (
  <div className={`flex-1 text-center py-1 rounded-md text-[10px] font-bold ${
    type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
  }`}>
    {label}: {value}
  </div>
);
