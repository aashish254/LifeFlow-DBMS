'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, FileText, Download, Calendar } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface MonthlyReport {
  blood_group: string;
  total_donations: number;
  total_quantity_ml: number;
  total_units: number;
  unique_donors: number;
}

export default function Reports() {
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState<MonthlyReport[]>([]);
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());

  const generateReport = async () => {
    setLoading(true);
    try {
      // Call the stored procedure sp_generate_monthly_donation_report
      const { data, error } = await supabase.rpc('sp_generate_monthly_donation_report', {
        p_month: month,
        p_year: year,
      });

      if (error) throw error;
      setReportData(data || []);
    } catch (error: any) {
      console.error('Error generating report:', error);
      alert('Failed to generate report: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const downloadCSV = () => {
    if (reportData.length === 0) return;

    const headers = ['Blood Group', 'Total Donations', 'Total Quantity (ml)', 'Total Units', 'Unique Donors'];
    const csvContent = [
      headers.join(','),
      ...reportData.map(row => 
        `${row.blood_group},${row.total_donations},${row.total_quantity_ml},${row.total_units},${row.unique_donors}`
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `donation_report_${year}_${month}.csv`;
    a.click();
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const totalDonations = reportData.reduce((sum, row) => sum + Number(row.total_donations), 0);
  const totalQuantity = reportData.reduce((sum, row) => sum + Number(row.total_quantity_ml), 0);
  const totalUnits = reportData.reduce((sum, row) => sum + Number(row.total_units), 0);

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
              <div className="bg-indigo-600 p-2 rounded-lg">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Monthly Donation Reports</h1>
                <p className="text-sm text-gray-600">Using Stored Procedure: sp_generate_monthly_donation_report</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Report Parameters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            <Calendar className="inline h-5 w-5 mr-1" />
            Select Report Period
          </h2>
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Month
              </label>
              <select
                value={month}
                onChange={(e) => setMonth(parseInt(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                {monthNames.map((name, idx) => (
                  <option key={idx} value={idx + 1}>{name}</option>
                ))}
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Year
              </label>
              <select
                value={year}
                onChange={(e) => setYear(parseInt(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                {[2025, 2024, 2023, 2022, 2021, 2020].map(y => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>
            <button
              onClick={generateReport}
              disabled={loading}
              className="px-8 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium disabled:bg-gray-400"
            >
              {loading ? 'Generating...' : 'Generate Report'}
            </button>
          </div>
        </div>

        {/* Report Results */}
        {reportData.length > 0 && (
          <>
            {/* Summary Cards */}
            <div className="grid md:grid-cols-3 gap-6 mb-6">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <p className="text-sm text-gray-600 mb-1">Total Donations</p>
                <p className="text-3xl font-bold text-gray-900">{totalDonations}</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <p className="text-sm text-gray-600 mb-1">Total Quantity</p>
                <p className="text-3xl font-bold text-gray-900">{totalQuantity.toLocaleString()} ml</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <p className="text-sm text-gray-600 mb-1">Total Units</p>
                <p className="text-3xl font-bold text-gray-900">{totalUnits.toFixed(2)}</p>
              </div>
            </div>

            {/* Report Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-900">
                  Donation Report - {monthNames[month - 1]} {year}
                </h2>
                <button
                  onClick={downloadCSV}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Download className="h-4 w-4" />
                  Download CSV
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Blood Group
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total Donations
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total Quantity (ml)
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total Units
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Unique Donors
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {reportData.map((row) => (
                      <tr key={row.blood_group} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="font-semibold text-gray-900">{row.blood_group}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                          {row.total_donations}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                          {Number(row.total_quantity_ml).toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                          {Number(row.total_units).toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                          {row.unique_donors}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-gray-50 font-semibold">
                    <tr>
                      <td className="px-6 py-4 text-gray-900">TOTAL</td>
                      <td className="px-6 py-4 text-gray-900">{totalDonations}</td>
                      <td className="px-6 py-4 text-gray-900">{totalQuantity.toLocaleString()}</td>
                      <td className="px-6 py-4 text-gray-900">{totalUnits.toFixed(2)}</td>
                      <td className="px-6 py-4 text-gray-900">-</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            {/* Info Box */}
            <div className="mt-6 p-4 bg-indigo-50 border border-indigo-200 rounded-lg">
              <p className="text-sm text-indigo-800">
                <strong>Note:</strong> This report uses the stored procedure <code className="bg-indigo-100 px-2 py-1 rounded">sp_generate_monthly_donation_report</code> 
                which uses cursors to efficiently process and aggregate donation data by blood group for the selected month.
              </p>
            </div>
          </>
        )}

        {/* Empty State */}
        {!loading && reportData.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Data Available</h3>
            <p className="text-gray-600">
              Select a month and year, then click "Generate Report" to view donation statistics.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
