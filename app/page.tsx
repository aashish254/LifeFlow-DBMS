import Link from 'next/link';
import { Droplet, Users, Building2, Activity, AlertCircle, FileText } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-pink-50">
      <header className="bg-white shadow-sm border-b border-red-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-red-600 p-2 rounded-lg">
                <Droplet className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">LifeFlow DBMS</h1>
                <p className="text-sm text-gray-600">Smart Blood Bank Management System</p>
              </div>
            </div>
            <Link 
              href="/dashboard"
              className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors font-medium"
            >
              Go to Dashboard
            </Link>
          </div>
        </div>
      </header>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Saving Lives Through Smart Blood Management
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            A comprehensive database-driven solution for efficient blood bank operations, 
            donor management, and hospital coordination.
          </p>
          <div className="flex justify-center gap-4">
            <Link 
              href="/dashboard"
              className="bg-red-600 text-white px-8 py-3 rounded-lg hover:bg-red-700 transition-colors font-medium text-lg"
            >
              Access Dashboard
            </Link>
            <Link 
              href="/donors/register"
              className="bg-white text-red-600 border-2 border-red-600 px-8 py-3 rounded-lg hover:bg-red-50 transition-colors font-medium text-lg"
            >
              Register as Donor
            </Link>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">Key Features</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link href="/donors" className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-100">
            <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <h4 className="text-lg font-semibold text-gray-900 mb-2">Donor Management</h4>
            <p className="text-gray-600">
              Register donors, track donation history, and manage eligibility with automated validation.
            </p>
          </Link>

          <Link href="/stock" className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-100">
            <div className="bg-red-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <Droplet className="h-6 w-6 text-red-600" />
            </div>
            <h4 className="text-lg font-semibold text-gray-900 mb-2">Blood Stock Tracking</h4>
            <p className="text-gray-600">
              Real-time inventory management with automatic updates and low-stock alerts.
            </p>
          </Link>

          <Link href="/requests" className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-100">
            <div className="bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <Building2 className="h-6 w-6 text-green-600" />
            </div>
            <h4 className="text-lg font-semibold text-gray-900 mb-2">Hospital Requests</h4>
            <p className="text-gray-600">
              Manage blood requests from hospitals with priority-based allocation system.
            </p>
          </Link>

          <Link href="/donations" className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-100">
            <div className="bg-purple-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <Activity className="h-6 w-6 text-purple-600" />
            </div>
            <h4 className="text-lg font-semibold text-gray-900 mb-2">Donation Processing</h4>
            <p className="text-gray-600">
              Record donations with health checks and automatic stock updates via triggers.
            </p>
          </Link>

          <Link href="/alerts" className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-100">
            <div className="bg-yellow-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <AlertCircle className="h-6 w-6 text-yellow-600" />
            </div>
            <h4 className="text-lg font-semibold text-gray-900 mb-2">Smart Alerts</h4>
            <p className="text-gray-600">
              Automated notifications for low stock levels and critical blood group shortages.
            </p>
          </Link>

          <Link href="/reports" className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-100">
            <div className="bg-indigo-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <FileText className="h-6 w-6 text-indigo-600" />
            </div>
            <h4 className="text-lg font-semibold text-gray-900 mb-2">Reports & Analytics</h4>
            <p className="text-gray-600">
              Generate comprehensive reports using stored procedures and advanced queries.
            </p>
          </Link>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Technical Implementation</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Database Features</h4>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start">
                  <span className="text-red-600 mr-2">•</span>
                  7 normalized tables (3NF) with referential integrity
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 mr-2">•</span>
                  4 automated triggers for stock updates and validation
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 mr-2">•</span>
                  5 stored procedures with cursors for complex operations
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 mr-2">•</span>
                  Multiple views for optimized data retrieval
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Technology Stack</h4>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start">
                  <span className="text-red-600 mr-2">•</span>
                  Next.js 15 with App Router and TypeScript
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 mr-2">•</span>
                  Supabase (PostgreSQL) for relational database
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 mr-2">•</span>
                  TailwindCSS for modern, responsive UI
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 mr-2">•</span>
                  Lucide React for beautiful icons
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600">
            <p className="mb-2">LifeFlow DBMS - Smart Blood Bank Management System</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
