'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Activity, Droplet, User } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface Donor {
  donor_id: number;
  first_name: string;
  last_name: string;
  blood_group: string;
  is_eligible: boolean;
  last_donation_date: string | null;
}

interface Staff {
  staff_id: number;
  first_name: string;
  last_name: string;
}

export default function NewDonation() {
  const [donors, setDonors] = useState<Donor[]>([]);
  const [staff, setStaff] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  
  const [formData, setFormData] = useState({
    donor_id: '',
    blood_group: '',
    quantity_ml: '450',
    hemoglobin_level: '',
    blood_pressure: '',
    staff_id: '',
  });

  useEffect(() => {
    fetchDonors();
    fetchStaff();
  }, []);

  const fetchDonors = async () => {
    const { data } = await supabase
      .from('donors')
      .select('donor_id, first_name, last_name, blood_group, is_eligible, last_donation_date')
      .order('first_name');
    
    if (data) setDonors(data);
  };

  const fetchStaff = async () => {
    const { data } = await supabase
      .from('staff')
      .select('staff_id, first_name, last_name')
      .eq('is_active', true)
      .in('role', ['Technician', 'Nurse'])
      .order('first_name');
    
    if (data) setStaff(data);
  };

  const handleDonorChange = (donorId: string) => {
    const donor = donors.find(d => d.donor_id.toString() === donorId);
    if (donor) {
      setFormData({
        ...formData,
        donor_id: donorId,
        blood_group: donor.blood_group,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const { data, error } = await supabase.rpc('sp_process_donation', {
        p_donor_id: parseInt(formData.donor_id),
        p_blood_group: formData.blood_group,
        p_quantity_ml: parseInt(formData.quantity_ml),
        p_hemoglobin_level: parseFloat(formData.hemoglobin_level),
        p_blood_pressure: formData.blood_pressure,
        p_staff_id: parseInt(formData.staff_id),
      });

      if (error) throw error;

      if (data && data.length > 0) {
        const result = data[0];
        if (result.success) {
          setMessage({ type: 'success', text: `${result.message}. Donation ID: ${result.donation_id}` });
          setFormData({
            donor_id: '',
            blood_group: '',
            quantity_ml: '450',
            hemoglobin_level: '',
            blood_pressure: '',
            staff_id: '',
          });
          fetchDonors();
        } else {
          setMessage({ type: 'error', text: result.message });
        }
      }
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Failed to process donation' });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const selectedDonor = donors.find(d => d.donor_id.toString() === formData.donor_id);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-4">
            <Link href="/dashboard" className="text-gray-600 hover:text-gray-900">
              <ArrowLeft className="h-6 w-6" />
            </Link>
            <div className="flex items-center space-x-3">
              <div className="bg-purple-600 p-2 rounded-lg">
                <Activity className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Process Blood Donation</h1>
                <p className="text-sm text-gray-600">Using Stored Procedure: sp_process_donation</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {message && (
          <div className={`mb-6 p-4 rounded-lg ${
            message.type === 'success' ? 'bg-green-50 border border-green-200 text-green-800' : 'bg-red-50 border border-red-200 text-red-800'
          }`}>
            {message.text}
          </div>
        )}

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                <User className="inline h-5 w-5 mr-1" />
                Donor Information
              </h2>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Donor *
                </label>
                <select
                  name="donor_id"
                  value={formData.donor_id}
                  onChange={(e) => handleDonorChange(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="">-- Select Donor --</option>
                  {donors.map((donor) => (
                    <option key={donor.donor_id} value={donor.donor_id}>
                      {donor.first_name} {donor.last_name} ({donor.blood_group}) 
                      {!donor.is_eligible && ' - Not Eligible'}
                    </option>
                  ))}
                </select>
              </div>

              {selectedDonor && (
                <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-700">Blood Group:</span>
                      <span className="ml-2 text-gray-900">{selectedDonor.blood_group}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Eligibility:</span>
                      <span className={`ml-2 ${selectedDonor.is_eligible ? 'text-green-600' : 'text-red-600'}`}>
                        {selectedDonor.is_eligible ? 'Eligible' : 'Not Eligible'}
                      </span>
                    </div>
                    {selectedDonor.last_donation_date && (
                      <div className="col-span-2">
                        <span className="font-medium text-gray-700">Last Donation:</span>
                        <span className="ml-2 text-gray-900">
                          {new Date(selectedDonor.last_donation_date).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                <Droplet className="inline h-5 w-5 mr-1" />
                Donation Details
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Blood Group *
                  </label>
                  <input
                    type="text"
                    name="blood_group"
                    value={formData.blood_group}
                    readOnly
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quantity (ml) *
                  </label>
                  <select
                    name="quantity_ml"
                    value={formData.quantity_ml}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="350">350 ml</option>
                    <option value="450">450 ml (Standard)</option>
                    <option value="500">500 ml</option>
                  </select>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Health Parameters</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hemoglobin Level (g/dL) *
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    name="hemoglobin_level"
                    value={formData.hemoglobin_level}
                    onChange={handleChange}
                    required
                    min="0"
                    max="20"
                    placeholder="e.g., 13.5"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                  <p className="mt-1 text-xs text-gray-500">Minimum required: 12.5 g/dL</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Blood Pressure *
                  </label>
                  <input
                    type="text"
                    name="blood_pressure"
                    value={formData.blood_pressure}
                    onChange={handleChange}
                    required
                    placeholder="e.g., 120/80"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Staff Assignment</h2>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Attending Staff *
                </label>
                <select
                  name="staff_id"
                  value={formData.staff_id}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="">-- Select Staff --</option>
                  {staff.map((s) => (
                    <option key={s.staff_id} value={s.staff_id}>
                      {s.first_name} {s.last_name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition-colors font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {loading ? 'Processing...' : 'Process Donation'}
              </button>
              <Link
                href="/dashboard"
                className="px-8 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </Link>
            </div>
          </form>

          <div className="mt-6 p-4 bg-purple-50 border border-purple-200 rounded-lg">
            <p className="text-sm text-purple-800 mb-2">
              <strong>Stored Procedure:</strong> <code className="bg-purple-100 px-2 py-1 rounded">sp_process_donation</code>
            </p>
            <p className="text-sm text-purple-800">
              <strong>Validations:</strong> Checks donor eligibility (90-day gap), validates blood group match, 
              ensures hemoglobin ≥ 12.5 g/dL, and automatically updates blood stock via trigger.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
