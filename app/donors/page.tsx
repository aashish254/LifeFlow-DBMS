'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Users, Search, UserPlus, CheckCircle, XCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface Donor {
  donor_id: number;
  donor_name: string;
  email: string;
  phone: string;
  blood_group: string;
  total_donations: number;
  last_donation_date: string | null;
  is_eligible: boolean;
  eligibility_status: string;
}

export default function Donors() {
  const [donors, setDonors] = useState<Donor[]>([]);
  const [filteredDonors, setFilteredDonors] = useState<Donor[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [bloodGroupFilter, setBloodGroupFilter] = useState('all');

  useEffect(() => {
    fetchDonors();
  }, []);

  useEffect(() => {
    filterDonors();
  }, [searchTerm, bloodGroupFilter, donors]);

  const fetchDonors = async () => {
    try {
      const { data, error } = await supabase
        .from('vw_donor_summary')
        .select('*')
        .order('donor_name');

      if (error) throw error;
      setDonors(data || []);
      setFilteredDonors(data || []);
    } catch (error) {
      console.error('Error fetching donors:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterDonors = () => {
    let filtered = donors;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(donor =>
        donor.donor_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        donor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        donor.phone.includes(searchTerm)
      );
    }

    // Blood group filter
    if (bloodGroupFilter !== 'all') {
      filtered = filtered.filter(donor => donor.blood_group === bloodGroupFilter);
    }

    setFilteredDonors(filtered);
  };

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Users className="h-12 w-12 text-blue-600 animate-pulse mx-auto mb-4" />
          <p className="text-gray-600">Loading donors...</p>
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
                <div className="bg-blue-600 p-2 rounded-lg">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Registered Donors</h1>
                  <p className="text-sm text-gray-600">View from: vw_donor_summary</p>
                </div>
              </div>
            </div>
            <Link
              href="/donors/register"
              className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              <UserPlus className="h-5 w-5" />
              Register Donor
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Search className="inline h-4 w-4 mr-1" />
                Search Donors
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name, email, or phone..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filter by Blood Group
              </label>
              <select
                value={bloodGroupFilter}
                onChange={(e) => setBloodGroupFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Blood Groups</option>
                {bloodGroups.map(bg => (
                  <option key={bg} value={bg}>{bg}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-600">
            Showing {filteredDonors.length} of {donors.length} donors
          </div>
        </div>

        {/* Donors Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Donor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Blood Group
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Donations
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Donation
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Eligibility
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredDonors.map((donor) => (
                  <tr key={donor.donor_id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <p className="font-semibold text-gray-900">{donor.donor_name}</p>
                        <p className="text-sm text-gray-500">ID: {donor.donor_id}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        <p className="text-gray-900">{donor.email}</p>
                        <p className="text-gray-500">{donor.phone}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-3 py-1 rounded-full text-sm font-semibold bg-red-100 text-red-800">
                        {donor.blood_group}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-lg font-semibold text-gray-900">{donor.total_donations}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {donor.last_donation_date 
                        ? new Date(donor.last_donation_date).toLocaleDateString()
                        : 'Never'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        {donor.is_eligible ? (
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-600" />
                        )}
                        <span className={`text-sm font-medium ${
                          donor.is_eligible ? 'text-green-700' : 'text-red-700'
                        }`}>
                          {donor.eligibility_status}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredDonors.length === 0 && (
            <div className="text-center py-12">
              <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Donors Found</h3>
              <p className="text-gray-600">Try adjusting your search or filters.</p>
            </div>
          )}
        </div>

        {/* Info Box */}
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Note:</strong> This view uses <code className="bg-blue-100 px-2 py-1 rounded">vw_donor_summary</code> 
            which automatically calculates eligibility based on the 90-day donation interval rule.
          </p>
        </div>
      </main>
    </div>
  );
}
