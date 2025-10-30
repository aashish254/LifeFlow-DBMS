'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Droplet, AlertTriangle, TrendingUp } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface BloodStock {
  blood_group: string;
  units_available: number;
  quantity_ml: number;
  minimum_threshold: number;
  stock_status: string;
  last_updated: string;
}

export default function BloodStock() {
  const [bloodStock, setBloodStock] = useState<BloodStock[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBloodStock();
  }, []);

  const fetchBloodStock = async () => {
    try {
      const { data, error } = await supabase
        .from('vw_blood_stock_status')
        .select('*')
        .order('blood_group');

      if (error) throw error;
      setBloodStock(data || []);
    } catch (error) {
      console.error('Error fetching blood stock:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStockColor = (status: string) => {
    switch (status) {
      case 'OUT OF STOCK':
        return 'bg-red-500';
      case 'CRITICAL':
        return 'bg-orange-500';
      case 'LOW':
        return 'bg-yellow-500';
      default:
        return 'bg-green-500';
    }
  };

  const getStockBgColor = (status: string) => {
    switch (status) {
      case 'OUT OF STOCK':
        return 'bg-red-50 border-red-200';
      case 'CRITICAL':
        return 'bg-orange-50 border-orange-200';
      case 'LOW':
        return 'bg-yellow-50 border-yellow-200';
      default:
        return 'bg-green-50 border-green-200';
    }
  };

  const totalUnits = bloodStock.reduce((sum, stock) => sum + stock.units_available, 0);
  const totalQuantity = bloodStock.reduce((sum, stock) => sum + stock.quantity_ml, 0);
  const lowStockCount = bloodStock.filter(s => s.stock_status !== 'ADEQUATE').length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Droplet className="h-12 w-12 text-red-600 animate-pulse mx-auto mb-4" />
          <p className="text-gray-600">Loading blood stock...</p>
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
              <div className="bg-red-600 p-2 rounded-lg">
                <Droplet className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Blood Stock Inventory</h1>
                <p className="text-sm text-gray-600">Real-time stock levels by blood group</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Summary Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <Droplet className="h-8 w-8 text-red-600" />
              <span className="text-3xl font-bold text-gray-900">{totalUnits}</span>
            </div>
            <p className="text-sm text-gray-600">Total Units Available</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="h-8 w-8 text-blue-600" />
              <span className="text-3xl font-bold text-gray-900">{totalQuantity.toLocaleString()}</span>
            </div>
            <p className="text-sm text-gray-600">Total Quantity (ml)</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <AlertTriangle className="h-8 w-8 text-orange-600" />
              <span className="text-3xl font-bold text-gray-900">{lowStockCount}</span>
            </div>
            <p className="text-sm text-gray-600">Low Stock Alerts</p>
          </div>
        </div>

        {/* Blood Stock Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {bloodStock.map((stock) => (
            <div
              key={stock.blood_group}
              className={`rounded-xl shadow-sm border-2 p-6 ${getStockBgColor(stock.stock_status)}`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`p-3 rounded-lg ${getStockColor(stock.stock_status)}`}>
                    <Droplet className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">{stock.blood_group}</h3>
                    <p className="text-xs text-gray-600">Blood Group</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Units Available</span>
                  <span className="text-lg font-bold text-gray-900">{stock.units_available}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Quantity</span>
                  <span className="text-sm font-semibold text-gray-900">{stock.quantity_ml.toLocaleString()} ml</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Min. Threshold</span>
                  <span className="text-sm font-semibold text-gray-900">{stock.minimum_threshold}</span>
                </div>

                <div className="pt-3 border-t border-gray-300">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-600">Status</span>
                    <span className={`text-xs font-bold ${
                      stock.stock_status === 'OUT OF STOCK' ? 'text-red-700' :
                      stock.stock_status === 'CRITICAL' ? 'text-orange-700' :
                      stock.stock_status === 'LOW' ? 'text-yellow-700' : 'text-green-700'
                    }`}>
                      {stock.stock_status}
                    </span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="pt-2">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${getStockColor(stock.stock_status)}`}
                      style={{
                        width: `${Math.min((stock.units_available / stock.minimum_threshold) * 100, 100)}%`
                      }}
                    />
                  </div>
                </div>

                <div className="text-xs text-gray-500 text-center pt-2">
                  Last updated: {new Date(stock.last_updated).toLocaleString()}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Info Box */}
        <div className="mt-8 p-6 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="font-semibold text-blue-900 mb-3">Stock Management Features</h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm text-blue-800">
            <div>
              <strong>Automatic Updates:</strong> Stock levels are automatically updated when:
              <ul className="list-disc list-inside ml-4 mt-1">
                <li>New donations are recorded (via trigger)</li>
                <li>Blood is allocated to hospitals (via trigger)</li>
              </ul>
            </div>
            <div>
              <strong>Status Indicators:</strong>
              <ul className="list-disc list-inside ml-4">
                <li><strong>ADEQUATE:</strong> Stock above minimum threshold</li>
                <li><strong>LOW:</strong> Stock below threshold</li>
                <li><strong>CRITICAL:</strong> Stock below 50% of threshold</li>
                <li><strong>OUT OF STOCK:</strong> No units available</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Triggers Info */}
        <div className="mt-6 p-6 bg-purple-50 border border-purple-200 rounded-lg">
          <h3 className="font-semibold text-purple-900 mb-3">Database Triggers (Lab Assessment 4 - Question 2)</h3>
          <div className="space-y-2 text-sm text-purple-800">
            <div>
              <strong>1. trigger_update_stock_after_donation:</strong> Automatically increases stock when a donation is completed
            </div>
            <div>
              <strong>2. trigger_update_stock_after_transfusion:</strong> Automatically decreases stock when blood is allocated to hospitals
            </div>
            <div>
              <strong>3. trigger_validate_stock_before_transfusion:</strong> Prevents allocation if insufficient stock is available
            </div>
            <div>
              <strong>4. trigger_prevent_hospital_deletion:</strong> Prevents deletion of hospitals with pending requests
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
