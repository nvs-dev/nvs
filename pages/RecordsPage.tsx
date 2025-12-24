
import React, { useState } from 'react';
import Layout from '../components/Layout';
import { User, CrimeRecord, CaseStatus } from '../types';
import { summarizeInvestigation } from '../services/geminiService';

interface RecordsPageProps {
  user: User;
  records: CrimeRecord[];
  onLogout: () => void;
  onAddRecord: (record: Omit<CrimeRecord, 'id' | 'dateCreated'>) => void;
}

const RecordsPage: React.FC<RecordsPageProps> = ({ user, records, onLogout, onAddRecord }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [isSummarizing, setIsSummarizing] = useState<string | null>(null);
  const [aiSummary, setAiSummary] = useState<{ id: string, text: string } | null>(null);

  // Form State
  const [newName, setNewName] = useState('');
  const [newArea, setNewArea] = useState('');
  const [newProcess, setNewProcess] = useState('');
  const [newStatus, setNewStatus] = useState<CaseStatus>(CaseStatus.ACTIVE);
  const [newCategory, setNewCategory] = useState('Theft');

  const filteredRecords = records.filter(r => 
    r.criminalName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.crimeSceneArea.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddRecord({
      criminalName: newName,
      crimeSceneArea: newArea,
      investigationProcess: newProcess,
      status: newStatus,
      category: newCategory
    });
    setShowModal(false);
    // Reset form
    setNewName('');
    setNewArea('');
    setNewProcess('');
    setNewStatus(CaseStatus.ACTIVE);
  };

  const handleSummarize = async (record: CrimeRecord) => {
    setIsSummarizing(record.id);
    const summary = await summarizeInvestigation(record);
    setAiSummary({ id: record.id, text: summary });
    setIsSummarizing(null);
  };

  return (
    <Layout user={user} onLogout={onLogout}>
      <div className="space-y-6">
        {/* Header Actions */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative max-w-sm flex-1">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
              <svg className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
            <input
              type="text"
              placeholder="Search by name or area..."
              className="block w-full rounded-lg border border-slate-200 bg-white py-2 pl-10 pr-3 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 transition-colors"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            Add New Record
          </button>
        </div>

        {/* Records Table */}
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Subject</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Location</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Status</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Details</th>
                <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {filteredRecords.map((record) => (
                <React.Fragment key={record.id}>
                  <tr className="hover:bg-slate-50 transition-colors">
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="flex items-center">
                        <div className="h-8 w-8 flex-shrink-0 rounded bg-slate-100 flex items-center justify-center text-slate-400">
                          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-slate-900">{record.criminalName}</div>
                          <div className="text-xs text-slate-500">{record.category}</div>
                        </div>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-600">{record.crimeSceneArea}</td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                        record.status === CaseStatus.CLOSED ? 'bg-emerald-100 text-emerald-800' :
                        record.status === CaseStatus.COLD_CASE ? 'bg-indigo-100 text-indigo-800' :
                        'bg-amber-100 text-amber-800'
                      }`}>
                        {record.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600 max-w-xs truncate">
                      {record.investigationProcess}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                      <button 
                        onClick={() => handleSummarize(record)}
                        disabled={isSummarizing === record.id}
                        className="text-indigo-600 hover:text-indigo-900 disabled:opacity-50"
                      >
                        {isSummarizing === record.id ? 'Analyzing...' : 'AI Summary'}
                      </button>
                    </td>
                  </tr>
                  {aiSummary && aiSummary.id === record.id && (
                    <tr className="bg-indigo-50">
                      <td colSpan={5} className="px-6 py-4">
                        <div className="flex gap-3">
                          <div className="mt-1 h-6 w-6 text-indigo-600">
                             <svg fill="currentColor" viewBox="0 0 20 20"><path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" /></svg>
                          </div>
                          <div>
                            <p className="text-xs font-bold uppercase tracking-wider text-indigo-600 mb-1">Investigation Intelligence</p>
                            <p className="text-sm text-indigo-900 leading-relaxed italic">"{aiSummary.text}"</p>
                            <button 
                              onClick={() => setAiSummary(null)}
                              className="mt-2 text-xs font-medium text-indigo-600 hover:underline"
                            >
                              Dismiss Analysis
                            </button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
              {filteredRecords.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                    No criminal records match your search criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
            <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
              <div className="mb-6 flex items-center justify-between">
                <h3 className="text-lg font-bold text-slate-900">New Case Entry</h3>
                <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-slate-700">Criminal Name</label>
                    <input
                      type="text"
                      required
                      className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700">Category</label>
                    <select
                      className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                    >
                      <option>Theft</option>
                      <option>Espionage</option>
                      <option>Fraud</option>
                      <option>Cybercrime</option>
                      <option>Homicide</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700">Status</label>
                    <select
                      className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      value={newStatus}
                      onChange={(e) => setNewStatus(e.target.value as CaseStatus)}
                    >
                      <option value={CaseStatus.ACTIVE}>Active</option>
                      <option value={CaseStatus.CLOSED}>Closed</option>
                      <option value={CaseStatus.COLD_CASE}>Cold Case</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700">Crime Scene Area</label>
                  <input
                    type="text"
                    required
                    className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    value={newArea}
                    onChange={(e) => setNewArea(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700">Investigation Process Details</label>
                  <textarea
                    required
                    rows={4}
                    className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    placeholder="Describe the steps taken, evidence found, etc."
                    value={newProcess}
                    onChange={(e) => setNewProcess(e.target.value)}
                  />
                </div>
                <div className="mt-6 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500 transition-colors"
                  >
                    Save Entry
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default RecordsPage;
