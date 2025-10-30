'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ArrowLeft, Building2, Droplet, User } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface Request {
  request_id: number;
  hospital_id: number;
  hospital_name: string;
  blood_group: string;
  units_requested: number;
  units_fulfilled: number;
  urgency_level: string;
}

interface Staff {
  staff_id: number;
  first_name: string;
  last_name: string;
}

export default function AllocateBlood() {
  const searchParams = useSearchParams();
  const requestIdParam = searchParams.get('request_id');

  const [requests, setRequests] = useState<Request[]>([]);
  const [staff, setStaff] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  
  const [formData, setFormData] = useState({
    request_id: requestIdParam || '',
    units_to_allocate: '',
    patient_name: '',
    patient_age: '',
    staff_id: '',
  });

  useEffect(() => {
    fetchRequests();
    fetchStaff();
  }, []);

  useEffect(() => {
    if (requestIdParam) {
      setFormData(prev => ({ ...prev, request_id: requestIdParam }));
    }
  }, [requestIdParam]);

  const fetchRequests = async () => {
    const { data } = await supabase
      .from('requests')
      .select(`
        request_id,
        hospital_id,
        blood_group,
        units_requested,
        units_fulfilled,
        urgency_level,
        hospitals (hospital_name)
      `)
      .in('request_status', ['Pending', 'Approved', 'Partially Fulfilled'])
      .order('urgency_level', { ascending: false });
    
    if (data) {
      const formattedData = data.map((req: any) => ({
        request_id: req.request_id,
        hospital_id: req.hospital_id,
        hospital_name: req.hospitals.hospital_name,
        blood_group: req.blood_group,
        units_requested: req.units_requested,
        units_fulfilled: req.units_fulfilled,
        urgency_level: req.urgency_level,
      }));
      setRequests(formattedData);
    }
  };

  const fetchStaff = async () => {
    const { data } = await supabase
      .from('staff')
      .select('staff_id, first_name, last_name')
      .eq('is_active', true)
      .order('first_name');
    
    if (data) setStaff(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const { data, error } = await supabase.rpc('sp_allocate_blood_to_request', {
        p_request_id: parseInt(formData.request_id),
        p_units_to_allocate: parseInt(formData.units_to_allocate),
        p_patient_name: formData.patient_name,
        p_patient_age: parseInt(formData.patient_age),
        p_staff_id: parseInt(formData.staff_id),
      });

      if (error) throw error;

      if (data && data.length > 0) {
        const result = data[0];
        if (result.success) {
          setMessage({ type: 'success', text: `${result.message}. Transfusion ID: ${result.transfusion_id}` });
          setFormData({
            request_id: '',
            units_to_allocate: '',
            patient_name: '',
            patient_age: '',
            staff_id: '',
          });
          fetchRequests();
        } else {
          setMessage({ type: 'error', text: result.message });
        }
      }
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Failed to allocate blood' });
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

  const selectedRequest = requests.find(r => r.request_id.toString() === formData.request_id);
  const pendingUnits = selectedRequest ? selectedRequest.units_requested - selectedRequest.units_fulfilled : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-4">
            <Link href="/requests" className="text-gray-600 hover:text-gray-900">
              <ArrowLeft className="h-6 w-6" />
            </Link>
            <div className="flex items-center space-x-3">
              <div className="bg-green-600 p-2 rounded-lg">
                <Droplet className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Allocate Blood to Request</h1>
                <p className="text-sm text-gray-600">Using Stored Procedure: sp_allocate_blood_to_request</p>
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
                <Building2 className="inline h-5 w-5 mr-1" />
                Hospital Request
              </h2>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Request *
                </label>
                <select
                  name="request_id"
                  value={formData.request_id}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="">-- Select Request --</option>
                  {requests.map((req) => (
                    <option key={req.request_id} value={req.request_id}>
                      #{req.request_id} - {req.hospital_name} - {req.blood_group} 
                      ({req.units_requested - req.units_fulfilled} units pending) - {req.urgency_level}
                    </option>
                  ))}
                </select>
              </div>

              {selectedRequest && (
                <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-700">Hospital:</span>
                      <span className="ml-2 text-gray-900">{selectedRequest.hospital_name}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Blood Group:</span>
                      <span className="ml-2 text-red-600 font-semibold">{selectedRequest.blood_group}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Units Requested:</span>
                      <span className="ml-2 text-gray-900">{selectedRequest.units_requested}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Units Fulfilled:</span>
                      <span className="ml-2 text-green-600">{selectedRequest.units_fulfilled}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Units Pending:</span>
                      <span className="ml-2 text-orange-600 font-semibold">{pendingUnits}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Urgency:</span>
                      <span className={`ml-2 font-semibold ${
                        selectedRequest.urgency_level === 'Critical' ? 'text-red-600' :
                        selectedRequest.urgency_level === 'Urgent' ? 'text-orange-600' : 'text-blue-600'
                      }`}>
                        {selectedRequest.urgency_level}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                <Droplet className="inline h-5 w-5 mr-1" />
                Allocation Details
              </h2>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Units to Allocate *
                </label>
                <input
                  type="number"
                  name="units_to_allocate"
                  value={formData.units_to_allocate}
                  onChange={handleChange}
                  required
                  min="1"
                  max={pendingUnits}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                {selectedRequest && (
                  <p className="mt-1 text-xs text-gray-500">
                    Maximum: {pendingUnits} units (450 ml per unit)
                  </p>
                )}
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                <User className="inline h-5 w-5 mr-1" />
                Patient Information
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Patient Name *
                  </label>
                  <input
                    type="text"
                    name="patient_name"
                    value={formData.patient_name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Patient Age *
                  </label>
                  <input
                    type="number"
                    name="patient_age"
                    value={formData.patient_age}
                    onChange={handleChange}
                    required
                    min="1"
                    max="120"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
                className="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {loading ? 'Allocating...' : 'Allocate Blood'}
              </button>
              <Link
                href="/requests"
                className="px-8 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </Link>
            </div>
          </form>

          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-800 mb-2">
              <strong>Stored Procedure:</strong> <code className="bg-green-100 px-2 py-1 rounded">sp_allocate_blood_to_request</code>
            </p>
            <p className="text-sm text-green-800 mb-2">
              <strong>Trigger:</strong> <code className="bg-green-100 px-2 py-1 rounded">trigger_update_stock_after_transfusion</code> 
              automatically deducts blood from stock and updates request status.
            </p>
            <p className="text-sm text-green-800">
              <strong>Validations:</strong> Checks stock availability, prevents over-allocation, and ensures data integrity.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
