
import React, { useState, useRef, useEffect } from 'react';
import { InspectionRecord, ExtinguisherType } from '../types';
import { Save, Eraser, CheckCircle } from 'lucide-react';

interface InspectionFormProps {
  onSave: (record: InspectionRecord) => void;
}

export const InspectionForm: React.FC<InspectionFormProps> = ({ onSave }) => {
  const [formData, setFormData] = useState<Partial<InspectionRecord>>({
    extinguisherType: 'ABC',
    month: new Date().toLocaleString('default', { month: 'long' }),
    seal: 'Good',
    pressure: 'OK',
    hosePipe: 'Good',
    safetyPin: 'Present',
    supplyDate: new Date().toISOString().split('T')[0],
    expiryDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0]
  });

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  // Initialize Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
      }
    }
  }, []);

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDrawing(true);
    draw(e);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) ctx.beginPath();
    }
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = ('touches' in e) ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = ('touches' in e) ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.moveTo(x, y);
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const signatureData = canvasRef.current?.toDataURL();

    const finalRecord: InspectionRecord = {
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      extinguisherType: formData.extinguisherType as ExtinguisherType,
      pointNumber: formData.pointNumber || '',
      month: formData.month || '',
      seal: formData.seal as any,
      pressure: formData.pressure as any,
      hosePipe: formData.hosePipe as any,
      safetyPin: formData.safetyPin as any,
      overallCondition: formData.overallCondition || '',
      supplyDate: formData.supplyDate || '',
      expiryDate: formData.expiryDate || '',
      fireMarshalName: formData.fireMarshalName || '',
      staffId: formData.staffId || '',
      section: formData.section || '',
      signatureData
    };

    onSave(finalRecord);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="bg-slate-800 p-4 text-white">
        <h3 className="font-bold flex items-center gap-2">
          <CheckCircle className="text-green-400" size={18} />
          Inspection Details
        </h3>
      </div>
      
      <div className="p-6 space-y-8">
        {/* Section 1: Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase">Type of Extinguisher</label>
            <select 
              name="extinguisherType"
              value={formData.extinguisherType}
              onChange={handleChange}
              className="w-full p-2 border border-slate-300 rounded-lg bg-slate-50 focus:ring-2 focus:ring-red-500"
            >
              <option value="ABC">ABC Powder</option>
              <option value="CO2">CO2</option>
              <option value="Foam">Foam</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase">Point Number</label>
            <input 
              name="pointNumber"
              type="text"
              placeholder="e.g. FE-101"
              onChange={handleChange}
              required
              className="w-full p-2 border border-slate-300 rounded-lg bg-slate-50 focus:ring-2 focus:ring-red-500"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase">Month</label>
            <select 
              name="month"
              value={formData.month}
              onChange={handleChange}
              className="w-full p-2 border border-slate-300 rounded-lg bg-slate-50 focus:ring-2 focus:ring-red-500"
            >
              {['January','February','March','April','May','June','July','August','September','October','November','December'].map(m => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Section 2: Technical Checks */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase">Seal</label>
            <select name="seal" value={formData.seal} onChange={handleChange} className="w-full p-2 border border-slate-300 rounded-lg text-sm">
              <option value="Good">Good</option>
              <option value="Broken">Broken</option>
              <option value="Missing">Missing</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase">Pressure</label>
            <select name="pressure" value={formData.pressure} onChange={handleChange} className="w-full p-2 border border-slate-300 rounded-lg text-sm">
              <option value="OK">OK</option>
              <option value="Low">Low</option>
              <option value="High">High</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase">Hose Pipe</label>
            <select name="hosePipe" value={formData.hosePipe} onChange={handleChange} className="w-full p-2 border border-slate-300 rounded-lg text-sm">
              <option value="Good">Good</option>
              <option value="Damaged">Damaged</option>
              <option value="Missing">Missing</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase">Safety Pin</label>
            <select name="safetyPin" value={formData.safetyPin} onChange={handleChange} className="w-full p-2 border border-slate-300 rounded-lg text-sm">
              <option value="Present">Present</option>
              <option value="Missing">Missing</option>
            </select>
          </div>
        </div>

        {/* Section 3: Condition & Dates */}
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase">Overall Condition</label>
            <textarea 
              name="overallCondition"
              placeholder="Notes on visual appearance, mounting, etc."
              rows={2}
              onChange={handleChange}
              className="w-full p-3 border border-slate-300 rounded-lg bg-slate-50 focus:ring-2 focus:ring-red-500"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase">Supply Date</label>
              <input type="date" name="supplyDate" value={formData.supplyDate} onChange={handleChange} className="w-full p-2 border border-slate-300 rounded-lg" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase">Expiry Date</label>
              <input type="date" name="expiryDate" value={formData.expiryDate} onChange={handleChange} className="w-full p-2 border border-slate-300 rounded-lg" />
            </div>
          </div>
        </div>

        {/* Section 4: Personnel */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase">Fire Marshal Name</label>
            <input name="fireMarshalName" type="text" placeholder="Full Name" onChange={handleChange} required className="w-full p-2 border border-slate-300 rounded-lg" />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase">Staff ID</label>
            <input name="staffId" type="text" placeholder="ID Number" onChange={handleChange} required className="w-full p-2 border border-slate-300 rounded-lg" />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase">Section</label>
            <input name="section" type="text" placeholder="Dept / Floor / Section" onChange={handleChange} required className="w-full p-2 border border-slate-300 rounded-lg" />
          </div>
        </div>

        {/* Section 5: Signature */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-xs font-bold text-slate-500 uppercase">Signature</label>
            <button 
              type="button" 
              onClick={clearSignature}
              className="text-xs text-red-500 flex items-center gap-1 font-bold"
            >
              <Eraser size={12} /> Clear
            </button>
          </div>
          <div className="border-2 border-dashed border-slate-300 rounded-xl bg-slate-50 h-40 touch-none">
            <canvas 
              ref={canvasRef}
              width={600}
              height={160}
              className="w-full h-full cursor-crosshair"
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={stopDrawing}
            />
          </div>
        </div>
      </div>

      <div className="bg-slate-50 p-6 flex justify-end">
        <button 
          type="submit"
          className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg transition-all active:scale-95"
        >
          <Save size={20} />
          Complete Inspection
        </button>
      </div>
    </form>
  );
};
