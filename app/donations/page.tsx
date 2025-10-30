'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Activity, Plus } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface Donation {
  donation_id: number;
  donor_name: string;
  blood_group: string;
  quantity_ml: number;
  donation_date: string;
  hemoglobin_level: number;
  donation_status: string;
  staff_name: string;
}

export default function Donations() {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDonations();
  }, []);

  const fetchDonations = async () => {
    try {
      const { data, error } = await supabase
        .from('vw_recent_donations')
        .select('*')
        .limit(50);

      if (error) throw error;
      setDonations(data || []);
    } catch (error) {
      console.error('Error fetching donations:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-800';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Activity className="h-12 w-12 text-purple-600 animate-pulse mx-auto mb-4" />
          <p className="text-gray-600">Loading donations...</p>
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
                <div className="bg-purple-600 p-2 rounded-lg">
                  <Activity className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Recent Donations</h1>
                  <p className="text-sm text-gray-600">View from: vw_recent_donations</p>
                </div>
              </div>
            </div>
            <Link
              href="/donations/new"
              className="flex items-center gap-2 bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors font-medium"
            >
              <Plus className="h-5 w-5" />
              Record Donation
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Donations Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Recent 50 Donations
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Donor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Blood Group
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quantity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Hemoglobin
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Staff
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {donations.map((donation) => (
                  <tr key={donation.donation_id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      #{donation.donation_id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="font-semibold text-gray-900">{donation.donor_name}</p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-3 py-1 rounded-full text-sm font-semibold bg-red-100 text-red-800">
                        {donation.blood_group}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {donation.quantity_ml} ml
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {donation.hemoglobin_level} g/dL
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {new Date(donation.donation_date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(donation.donation_status)}`}>
                        {donation.donation_status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {donation.staff_name || '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {donations.length === 0 && (
            <div className="text-center py-12">
              <Activity className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Donations Found</h3>
              <p className="text-gray-600 mb-4">Start recording donations to see them here.</p>
              <Link
                href="/donations/new"
                className="inline-flex items-center gap-2 bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors font-medium"
              >
                <Plus className="h-5 w-5" />
                Record First Donation
              </Link>
            </div>
          )}
        </div>

        {/* Info Box */}
        <div className="mt-6 p-4 bg-purple-50 border border-purple-200 rounded-lg">
          <p className="text-sm text-purple-800">
            <strong>Note:</strong> This view uses <code className="bg-purple-100 px-2 py-1 rounded">vw_recent_donations</code> 
            which joins donations with donor and staff information. When a donation is completed, the 
            <code className="bg-purple-100 px-2 py-1 rounded ml-1">trigger_update_stock_after_donation</code> automatically 
            updates blood stock levels.
          </p>
        </div>
      </main>
    </div>
  );
}
