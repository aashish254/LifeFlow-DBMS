'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Building2, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface Request {
  request_id: number;
  hospital_name: string;
  city: string;
  blood_group: string;
  units_requested: number;
  units_fulfilled: number;
  units_pending: number;
  urgency_level: string;
  request_status: string;
  request_date: string;
  required_by_date: string;
  deadline_status: string;
}

export default function Requests() {
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'fulfilled'>('all');

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const { data, error } = await supabase
        .from('vw_pending_requests')
        .select('*')
        .order('urgency_level', { ascending: false })
        .order('required_by_date');

      if (error) throw error;
      setRequests(data || []);
    } catch (error) {
      console.error('Error fetching requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const getUrgencyColor = (level: string) => {
    switch (level) {
      case 'Critical':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'Urgent':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Fulfilled':
        return 'bg-green-100 text-green-800';
      case 'Partially Fulfilled':
        return 'bg-yellow-100 text-yellow-800';
      case 'Approved':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getDeadlineColor = (status: string) => {
    switch (status) {
      case 'OVERDUE':
        return 'text-red-600';
      case 'DUE TODAY':
        return 'text-orange-600';
      case 'DUE SOON':
        return 'text-yellow-600';
      default:
        return 'text-green-600';
    }
  };

  const filteredRequests = requests.filter(req => {
    if (filter === 'pending') return req.request_status !== 'Fulfilled';
    if (filter === 'fulfilled') return req.request_status === 'Fulfilled';
    return true;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Building2 className="h-12 w-12 text-green-600 animate-pulse mx-auto mb-4" />
          <p className="text-gray-600">Loading requests...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard" className="text-gray-600 hover:text-gray-900">
                <ArrowLeft className="h-6 w-6" />
              </Link>
              <div className="flex items-center space-x-3">
                <div className="bg-green-600 p-2 rounded-lg">
                  <Building2 className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Hospital Blood Requests</h1>
                  <p className="text-sm text-gray-600">View from: vw_pending_requests</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Link
                href="/requests/new"
                className="border-2 border-green-600 text-green-700 px-4 py-2 rounded-lg hover:bg-green-50 transition-colors font-medium"
              >
                New Request
              </Link>
              <Link
                href="/requests/allocate"
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors font-medium"
              >
                Allocate Blood
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filter Tabs */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-2 mb-6 flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
              filter === 'all' ? 'bg-green-600 text-white' : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            All Requests ({requests.length})
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
              filter === 'pending' ? 'bg-green-600 text-white' : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            Pending ({requests.filter(r => r.request_status !== 'Fulfilled').length})
          </button>
          <button
            onClick={() => setFilter('fulfilled')}
            className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
              filter === 'fulfilled' ? 'bg-green-600 text-white' : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            Fulfilled ({requests.filter(r => r.request_status === 'Fulfilled').length})
          </button>
        </div>

        {/* Requests List */}
        {filteredRequests.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <Building2 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Requests Found</h3>
            <p className="text-gray-600">There are no requests matching your filter criteria.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredRequests.map((request) => (
              <div key={request.request_id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{request.hospital_name}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getUrgencyColor(request.urgency_level)}`}>
                        {request.urgency_level}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(request.request_status)}`}>
                        {request.request_status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{request.city}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Request ID</p>
                    <p className="text-lg font-semibold text-gray-900">#{request.request_id}</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-4 gap-4 mb-4">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-600 mb-1">Blood Group</p>
                    <p className="text-lg font-semibold text-red-600">{request.blood_group}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-600 mb-1">Units Requested</p>
                    <p className="text-lg font-semibold text-gray-900">{request.units_requested}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-600 mb-1">Units Fulfilled</p>
                    <p className="text-lg font-semibold text-green-600">{request.units_fulfilled}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-600 mb-1">Units Pending</p>
                    <p className="text-lg font-semibold text-orange-600">{request.units_pending}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1 text-gray-600">
                      <Clock className="h-4 w-4" />
                      <span>Requested: {new Date(request.request_date).toLocaleDateString()}</span>
                    </div>
                    <div className={`flex items-center gap-1 font-medium ${getDeadlineColor(request.deadline_status)}`}>
                      <AlertCircle className="h-4 w-4" />
                      <span>Due: {new Date(request.required_by_date).toLocaleDateString()} ({request.deadline_status})</span>
                    </div>
                  </div>
                  {request.request_status !== 'Fulfilled' && (
                    <Link
                      href={`/requests/allocate?request_id=${request.request_id}`}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                    >
                      Allocate Blood
                    </Link>
                  )}
                  {request.request_status === 'Fulfilled' && (
                    <div className="flex items-center gap-1 text-green-600">
                      <CheckCircle className="h-5 w-5" />
                      <span className="font-medium">Completed</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
