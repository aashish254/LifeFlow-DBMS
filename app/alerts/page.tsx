'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, AlertCircle, Droplet, TrendingDown } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface LowStockAlert {
  blood_group: string;
  units_available: number;
  minimum_threshold: number;
  shortage: number;
  alert_level: string;
}

export default function Alerts() {
  const [alerts, setAlerts] = useState<LowStockAlert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAlerts();
    // Refresh alerts every 30 seconds
    const interval = setInterval(fetchAlerts, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchAlerts = async () => {
    try {
      const { data, error } = await supabase.rpc('sp_get_low_stock_alerts');

      if (error) throw error;
      setAlerts(data || []);
    } catch (error) {
      console.error('Error fetching alerts:', error);
    } finally {
      setLoading(false);
    }
  };

  const getAlertColor = (level: string) => {
    switch (level) {
      case 'CRITICAL':
        return {
          bg: 'bg-red-50',
          border: 'border-red-300',
          text: 'text-red-900',
          badge: 'bg-red-600 text-white',
          icon: 'text-red-600'
        };
      case 'URGENT':
        return {
          bg: 'bg-orange-50',
          border: 'border-orange-300',
          text: 'text-orange-900',
          badge: 'bg-orange-600 text-white',
          icon: 'text-orange-600'
        };
      default:
        return {
          bg: 'bg-yellow-50',
          border: 'border-yellow-300',
          text: 'text-yellow-900',
          badge: 'bg-yellow-600 text-white',
          icon: 'text-yellow-600'
        };
    }
  };

  const criticalCount = alerts.filter(a => a.alert_level === 'CRITICAL').length;
  const urgentCount = alerts.filter(a => a.alert_level === 'URGENT').length;
  const warningCount = alerts.filter(a => a.alert_level === 'WARNING').length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-600 animate-pulse mx-auto mb-4" />
          <p className="text-gray-600">Loading alerts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-4">
            <Link href="/dashboard" className="text-gray-600 hover:text-gray-900">
              <ArrowLeft className="h-6 w-6" />
            </Link>
            <div className="flex items-center space-x-3">
              <div className="bg-yellow-600 p-2 rounded-lg">
                <AlertCircle className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Low Stock Alerts</h1>
                <p className="text-sm text-gray-600">Using Stored Procedure: sp_get_low_stock_alerts</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Summary Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border-2 border-red-200">
            <div className="flex items-center justify-between mb-2">
              <AlertCircle className="h-8 w-8 text-red-600" />
              <span className="text-3xl font-bold text-red-600">{criticalCount}</span>
            </div>
            <p className="text-sm text-gray-600">Critical Alerts</p>
            <p className="text-xs text-gray-500 mt-1">0 units available</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border-2 border-orange-200">
            <div className="flex items-center justify-between mb-2">
              <TrendingDown className="h-8 w-8 text-orange-600" />
              <span className="text-3xl font-bold text-orange-600">{urgentCount}</span>
            </div>
            <p className="text-sm text-gray-600">Urgent Alerts</p>
            <p className="text-xs text-gray-500 mt-1">Below 50% threshold</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border-2 border-yellow-200">
            <div className="flex items-center justify-between mb-2">
              <Droplet className="h-8 w-8 text-yellow-600" />
              <span className="text-3xl font-bold text-yellow-600">{warningCount}</span>
            </div>
            <p className="text-sm text-gray-600">Warning Alerts</p>
            <p className="text-xs text-gray-500 mt-1">Below minimum threshold</p>
          </div>
        </div>

        {/* Alerts List */}
        {alerts.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="h-10 w-10 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">All Stock Levels Normal</h3>
            <p className="text-gray-600">No low stock alerts at this time. All blood groups are adequately stocked.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {alerts.map((alert) => {
              const colors = getAlertColor(alert.alert_level);
              return (
                <div
                  key={alert.blood_group}
                  className={`${colors.bg} border-2 ${colors.border} rounded-xl p-6 shadow-sm`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className={`p-3 bg-white rounded-lg border-2 ${colors.border}`}>
                        <Droplet className={`h-8 w-8 ${colors.icon}`} />
                      </div>
                      <div>
                        <h3 className={`text-2xl font-bold ${colors.text}`}>
                          Blood Group {alert.blood_group}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">Immediate action required</p>
                      </div>
                    </div>
                    <span className={`px-4 py-2 rounded-lg text-sm font-bold ${colors.badge}`}>
                      {alert.alert_level}
                    </span>
                  </div>

                  <div className="grid md:grid-cols-4 gap-4">
                    <div className="bg-white p-4 rounded-lg border border-gray-200">
                      <p className="text-xs text-gray-600 mb-1">Current Stock</p>
                      <p className={`text-2xl font-bold ${colors.text}`}>
                        {alert.units_available} units
                      </p>
                    </div>

                    <div className="bg-white p-4 rounded-lg border border-gray-200">
                      <p className="text-xs text-gray-600 mb-1">Required Stock</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {alert.minimum_threshold} units
                      </p>
                    </div>

                    <div className="bg-white p-4 rounded-lg border border-gray-200">
                      <p className="text-xs text-gray-600 mb-1">Shortage</p>
                      <p className={`text-2xl font-bold ${colors.text}`}>
                        {alert.shortage} units
                      </p>
                    </div>

                    <div className="bg-white p-4 rounded-lg border border-gray-200">
                      <p className="text-xs text-gray-600 mb-1">Quantity Needed</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {alert.shortage * 450} ml
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 flex gap-3">
                    <Link
                      href={`/donors?blood_group=${alert.blood_group}`}
                      className="flex-1 bg-white text-gray-900 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors font-medium text-center border border-gray-300"
                    >
                      Find {alert.blood_group} Donors
                    </Link>
                    <Link
                      href="/donations/new"
                      className={`flex-1 ${colors.badge} py-2 px-4 rounded-lg hover:opacity-90 transition-opacity font-medium text-center`}
                    >
                      Record Donation
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Info Box */}
        <div className="mt-8 p-6 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="font-semibold text-blue-900 mb-3">Alert System Information</h3>
          <div className="space-y-2 text-sm text-blue-800">
            <p>
              <strong>Stored Procedure:</strong> <code className="bg-blue-100 px-2 py-1 rounded">sp_get_low_stock_alerts</code> 
              automatically calculates stock shortages and alert levels.
            </p>
            <p><strong>Alert Levels:</strong></p>
            <ul className="list-disc list-inside ml-4">
              <li><strong>CRITICAL:</strong> 0 units available (immediate action required)</li>
              <li><strong>URGENT:</strong> Below 50% of minimum threshold</li>
              <li><strong>WARNING:</strong> Below minimum threshold but above 50%</li>
            </ul>
            <p className="mt-2">
              <strong>Auto-refresh:</strong> This page automatically refreshes every 30 seconds to show real-time alerts.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
