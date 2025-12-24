
import React, { useMemo } from 'react';
import Layout from '../components/Layout';
import { User, CrimeRecord, CaseStatus } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface DashboardPageProps {
  user: User;
  records: CrimeRecord[];
  onLogout: () => void;
}

const DashboardPage: React.FC<DashboardPageProps> = ({ user, records, onLogout }) => {
  const stats = useMemo(() => {
    const closed = records.filter(r => r.status === CaseStatus.CLOSED).length;
    const cold = records.filter(r => r.status === CaseStatus.COLD_CASE).length;
    const active = records.filter(r => r.status === CaseStatus.ACTIVE).length;
    return { closed, cold, active, total: records.length };
  }, [records]);

  const chartData = [
    { name: 'Closed', value: stats.closed, color: '#10b981' },
    { name: 'Cold', value: stats.cold, color: '#6366f1' },
    { name: 'Active', value: stats.active, color: '#f59e0b' },
  ];

  const recentRecords = records.slice(0, 5);

  return (
    <Layout user={user} onLogout={onLogout}>
      <div className="space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl bg-white p-6 shadow-sm border border-slate-200">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-indigo-50 p-3 text-indigo-600">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Total Records</p>
                <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
              </div>
            </div>
          </div>
          <div className="rounded-xl bg-white p-6 shadow-sm border border-slate-200">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-emerald-50 p-3 text-emerald-600">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Solved Cases</p>
                <p className="text-2xl font-bold text-slate-900">{stats.closed}</p>
              </div>
            </div>
          </div>
          <div className="rounded-xl bg-white p-6 shadow-sm border border-slate-200">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-blue-50 p-3 text-blue-600">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Cold Cases</p>
                <p className="text-2xl font-bold text-slate-900">{stats.cold}</p>
              </div>
            </div>
          </div>
          <div className="rounded-xl bg-white p-6 shadow-sm border border-slate-200">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-amber-50 p-3 text-amber-600">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Active</p>
                <p className="text-2xl font-bold text-slate-900">{stats.active}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Chart */}
          <div className="rounded-xl bg-white p-6 shadow-sm border border-slate-200">
            <h3 className="mb-6 text-base font-semibold text-slate-900">Case Distribution</h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Recent Records */}
          <div className="rounded-xl bg-white p-6 shadow-sm border border-slate-200">
            <h3 className="mb-4 text-base font-semibold text-slate-900">Recent Activity</h3>
            <div className="space-y-4">
              {recentRecords.map((record) => (
                <div key={record.id} className="flex items-center justify-between border-b border-slate-50 pb-3 last:border-0 last:pb-0">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 truncate">{record.criminalName}</p>
                    <p className="text-xs text-slate-500">{record.crimeSceneArea}</p>
                  </div>
                  <div className="ml-4">
                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                      record.status === CaseStatus.CLOSED 
                        ? 'bg-emerald-100 text-emerald-800' 
                        : record.status === CaseStatus.COLD_CASE
                        ? 'bg-indigo-100 text-indigo-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {record.status}
                    </span>
                  </div>
                </div>
              ))}
              {recentRecords.length === 0 && (
                <div className="py-8 text-center text-slate-500">
                  No records found.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default DashboardPage;
