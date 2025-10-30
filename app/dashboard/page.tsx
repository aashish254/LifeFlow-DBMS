'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Droplet, Users, Building2, Activity, AlertCircle, TrendingUp, ArrowLeft } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface DashboardStats {
  totalDonors: number;
  totalHospitals: number;
  totalDonations: number;
  pendingRequests: number;
  criticalStock: number;
}

interface BloodStockItem {
  blood_group: string;
  units_available: number;
  stock_status: string;
}

interface LowStockAlert {
  blood_group: string;
  units_available: number;
  minimum_threshold: number;
  shortage: number;
  alert_level: string;
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalDonors: 0,
    totalHospitals: 0,
    totalDonations: 0,
    pendingRequests: 0,
    criticalStock: 0,
  });
  const [bloodStock, setBloodStock] = useState<BloodStockItem[]>([]);
  const [lowStockAlerts, setLowStockAlerts] = useState<LowStockAlert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const { count: donorCount } = await supabase
        .from('donors')
        .select('*', { count: 'exact', head: true });

      // Fetch total hospitals
      const { count: hospitalCount } = await supabase
        .from('hospitals')
        .select('*', { count: 'exact', head: true });

      // Fetch total donations
      const { count: donationCount } = await supabase
        .from('donations')
        .select('*', { count: 'exact', head: true })
        .eq('donation_status', 'Completed');

      const { count: requestCount } = await supabase
        .from('requests')
        .select('*', { count: 'exact', head: true })
        .in('request_status', ['Pending', 'Approved', 'Partially Fulfilled']);

      const { data: stockData } = await supabase
        .from('vw_blood_stock_status')
        .select('*')
        .order('blood_group');

      const { data: alertsData } = await supabase
        .rpc('sp_get_low_stock_alerts');

      setStats({
        totalDonors: donorCount || 0,
        totalHospitals: hospitalCount || 0,
        totalDonations: donationCount || 0,
        pendingRequests: requestCount || 0,
        criticalStock: alertsData?.length || 0,
      });

      setBloodStock(stockData || []);
      setLowStockAlerts(alertsData || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setLoading(false);
    }
  };

  const getStockColor = (status: string) => {
    switch (status) {
      case 'OUT OF STOCK':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'CRITICAL':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'LOW':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-green-100 text-green-800 border-green-200';
    }
  };

  const getAlertColor = (level: string) => {
    switch (level) {
      case 'CRITICAL':
        return 'bg-red-50 border-red-200';
      case 'URGENT':
        return 'bg-orange-50 border-orange-200';
      default:
        return 'bg-yellow-50 border-yellow-200';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Droplet className="h-12 w-12 text-red-600 animate-pulse mx-auto mb-4" />
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-gray-600 hover:text-gray-900">
                <ArrowLeft className="h-6 w-6" />
              </Link>
              <div className="flex items-center space-x-3">
                <div className="bg-red-600 p-2 rounded-lg">
                  <Droplet className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
                  <p className="text-sm text-gray-600">Real-time blood bank overview</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <Users className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold text-gray-900">{stats.totalDonors}</span>
            </div>
            <p className="text-sm text-gray-600">Total Donors</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <Building2 className="h-8 w-8 text-green-600" />
              <span className="text-2xl font-bold text-gray-900">{stats.totalHospitals}</span>
            </div>
            <p className="text-sm text-gray-600">Hospitals</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <Activity className="h-8 w-8 text-purple-600" />
              <span className="text-2xl font-bold text-gray-900">{stats.totalDonations}</span>
            </div>
            <p className="text-sm text-gray-600">Total Donations</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="h-8 w-8 text-orange-600" />
              <span className="text-2xl font-bold text-gray-900">{stats.pendingRequests}</span>
            </div>
            <p className="text-sm text-gray-600">Pending Requests</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <AlertCircle className="h-8 w-8 text-red-600" />
              <span className="text-2xl font-bold text-gray-900">{stats.criticalStock}</span>
            </div>
            <p className="text-sm text-gray-600">Low Stock Alerts</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Blood Stock Status</h2>
            <div className="space-y-3">
              {bloodStock.map((stock) => (
                <div key={stock.blood_group} className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="flex items-center space-x-3">
                    <div className="bg-red-100 p-2 rounded-lg">
                      <Droplet className="h-5 w-5 text-red-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{stock.blood_group}</p>
                      <p className="text-sm text-gray-600">{stock.units_available} units</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStockColor(stock.stock_status)}`}>
                    {stock.stock_status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Low Stock Alerts</h2>
            {lowStockAlerts.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <AlertCircle className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                <p>No low stock alerts</p>
              </div>
            ) : (
              <div className="space-y-3">
                {lowStockAlerts.map((alert) => (
                  <div key={alert.blood_group} className={`p-4 rounded-lg border-2 ${getAlertColor(alert.alert_level)}`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-gray-900">{alert.blood_group}</span>
                      <span className={`px-2 py-1 rounded text-xs font-bold ${
                        alert.alert_level === 'CRITICAL' ? 'bg-red-200 text-red-900' :
                        alert.alert_level === 'URGENT' ? 'bg-orange-200 text-orange-900' :
                        'bg-yellow-200 text-yellow-900'
                      }`}>
                        {alert.alert_level}
                      </span>
                    </div>
                    <div className="text-sm text-gray-700">
                      <p>Available: {alert.units_available} units</p>
                      <p>Required: {alert.minimum_threshold} units</p>
                      <p className="font-semibold text-red-700">Shortage: {alert.shortage} units</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link href="/donors/register" className="bg-blue-600 text-white p-4 rounded-lg hover:bg-blue-700 transition-colors text-center">
            <Users className="h-6 w-6 mx-auto mb-2" />
            <span className="font-medium">Register Donor</span>
          </Link>
          <Link href="/donations/new" className="bg-purple-600 text-white p-4 rounded-lg hover:bg-purple-700 transition-colors text-center">
            <Activity className="h-6 w-6 mx-auto mb-2" />
            <span className="font-medium">Record Donation</span>
          </Link>
          <Link href="/requests" className="bg-green-600 text-white p-4 rounded-lg hover:bg-green-700 transition-colors text-center">
            <Building2 className="h-6 w-6 mx-auto mb-2" />
            <span className="font-medium">View Requests</span>
          </Link>
          <Link href="/reports" className="bg-indigo-600 text-white p-4 rounded-lg hover:bg-indigo-700 transition-colors text-center">
            <TrendingUp className="h-6 w-6 mx-auto mb-2" />
            <span className="font-medium">Generate Reports</span>
          </Link>
        </div>
      </main>
    </div>
  );
}
