
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import RecordsPage from './pages/RecordsPage';
import { User, CrimeRecord, CaseStatus } from './types';

// Mock initial data
const INITIAL_RECORDS: CrimeRecord[] = [
  {
    id: '1',
    criminalName: 'Victor "The Viper" Rossi',
    crimeSceneArea: 'Downtown Financial District',
    investigationProcess: 'Surveillance footage identified the suspect at 2:00 AM. Fingerprints matched database records from 2018. Apprehended in a safehouse on the outskirts.',
    status: CaseStatus.CLOSED,
    dateCreated: '2023-11-12',
    category: 'Theft'
  },
  {
    id: '2',
    criminalName: 'Unknown Subject (Phantom)',
    crimeSceneArea: 'Eastside Industrial Park',
    investigationProcess: 'Multiple break-ins with zero forensic evidence left behind. High-tech equipment used to bypass security. No leads for 6 months.',
    status: CaseStatus.COLD_CASE,
    dateCreated: '2023-05-20',
    category: 'Espionage'
  }
];

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [records, setRecords] = useState<CrimeRecord[]>(() => {
    const saved = localStorage.getItem('crime_records');
    return saved ? JSON.parse(saved) : INITIAL_RECORDS;
  });

  useEffect(() => {
    localStorage.setItem('crime_records', JSON.stringify(records));
  }, [records]);

  const handleLogin = (userData: User) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
  };

  const addRecord = (newRecord: Omit<CrimeRecord, 'id' | 'dateCreated'>) => {
    const record: CrimeRecord = {
      ...newRecord,
      id: Math.random().toString(36).substr(2, 9),
      dateCreated: new Date().toISOString().split('T')[0]
    };
    setRecords(prev => [record, ...prev]);
  };

  return (
    <Router>
      <div className="min-h-screen bg-slate-50 font-sans">
        <Routes>
          <Route 
            path="/login" 
            element={user ? <Navigate to="/dashboard" /> : <LoginPage onLogin={handleLogin} />} 
          />
          <Route 
            path="/dashboard" 
            element={
              user ? (
                <DashboardPage user={user} records={records} onLogout={handleLogout} />
              ) : (
                <Navigate to="/login" />
              )
            } 
          />
          <Route 
            path="/records" 
            element={
              user ? (
                <RecordsPage 
                  user={user} 
                  records={records} 
                  onLogout={handleLogout} 
                  onAddRecord={addRecord} 
                />
              ) : (
                <Navigate to="/login" />
              )
            } 
          />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
