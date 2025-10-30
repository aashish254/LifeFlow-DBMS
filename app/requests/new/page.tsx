'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Building2, PlusCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface HospitalOption {
  hospital_id: number;
  hospital_name: string;
  city: string;
  is_active: boolean;
}

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const URGENCY = ['Normal', 'Urgent', 'Critical'];

export default function NewHospitalRequest() {
  const [hospitals, setHospitals] = useState<HospitalOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [formData, setFormData] = useState({
    hospital_id: '',
    blood_group: '',
    units_requested: '',
    required_by_date: '',
    urgency_level: 'Normal',
    remarks: '',
  });

  useEffect(() => {
    fetchHospitals();
  }, []);

  const fetchHospitals = async () => {
    const { data, error } = await supabase
      .from('hospitals')
      .select('hospital_id, hospital_name, city, is_active')
      .eq('is_active', true)
      .order('hospital_name');
    if (!error && data) setHospitals(data as HospitalOption[]);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setLoading(true);

    try {
      const payload = {
        hospital_id: parseInt(formData.hospital_id),
        blood_group: formData.blood_group,
        units_requested: parseInt(formData.units_requested),
        required_by_date: formData.required_by_date,
        urgency_level: formData.urgency_level,
        remarks: formData.remarks || null,
      };

      // Direct insert into Requests table
      const { error } = await supabase.from('requests').insert(payload as any);
      if (error) throw error;

      setMessage({ type: 'success', text: 'Hospital blood request created successfully.' });
      setFormData({ hospital_id: '', blood_group: '', units_requested: '', required_by_date: '', urgency_level: 'Normal', remarks: '' });
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to create request' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-4">
            <Link href="/requests" className="text-gray-600 hover:text-gray-900">
              <ArrowLeft className="h-6 w-6" />
            </Link>
            <div className="flex items-center space-x-3">
              <div className="bg-green-600 p-2 rounded-lg">
                <PlusCircle className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Create Hospital Blood Request</h1>
                <p className="text-sm text-gray-600">Insert into table: Requests</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {message && (
          <div className={`mb-6 p-4 rounded-lg ${message.type === 'success' ? 'bg-green-50 border border-green-200 text-green-800' : 'bg-red-50 border border-red-200 text-red-800'}`}>
            {message.text}
          </div>
        )}

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Hospital */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Hospital *</label>
              <select
                name="hospital_id"
                value={formData.hospital_id}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="">-- Select Hospital --</option>
                {hospitals.map(h => (
                  <option key={h.hospital_id} value={h.hospital_id}>
                    {h.hospital_name} ({h.city})
                  </option>
                ))}
              </select>
            </div>

            {/* Blood Group and Units */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Blood Group *</label>
                <select
                  name="blood_group"
                  value={formData.blood_group}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="">-- Select Blood Group --</option>
                  {BLOOD_GROUPS.map(bg => (
                    <option key={bg} value={bg}>{bg}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Units Requested *</label>
                <input
                  type="number"
                  name="units_requested"
                  value={formData.units_requested}
                  onChange={handleChange}
                  required
                  min={1}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Required By and Urgency */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Required By Date *</label>
                <input
                  type="date"
                  name="required_by_date"
                  value={formData.required_by_date}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Urgency *</label>
                <select
                  name="urgency_level"
                  value={formData.urgency_level}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  {URGENCY.map(u => (
                    <option key={u} value={u}>{u}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Remarks */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Remarks</label>
              <textarea
                name="remarks"
                value={formData.remarks}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">One unit equals 450 ml.</p>
            </div>

            {/* Submit */}
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {loading ? 'Creating...' : 'Create Request'}
              </button>
              <Link
                href="/requests"
                className="px-8 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </Link>
            </div>
          </form>

          {/* Info */}
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg text-blue-800">
            <p className="text-sm">
              Requests are stored in table <code className="bg-blue-100 px-2 py-0.5 rounded">Requests</code>. You may optionally
              create a stored procedure for validation; SQL provided in README or below in chat.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}


