"use client";
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function OrgAdminApp() {
  const [token, setToken] = useState(null);
  const [flags, setFlags] = useState([]);
  const [newFlagKey, setNewFlagKey] = useState('');
  const [isLoginMode, setIsLoginMode] = useState(true);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [orgId, setOrgId] = useState('');

  useEffect(() => {
    const savedToken = localStorage.getItem('adminToken');
    if (savedToken) {
      setToken(savedToken);
      fetchFlags(savedToken);
    }
  }, []);

  const handleAuth = async (e) => {
    e.preventDefault();
    try {
      const endpoint = isLoginMode ? '/api/admin/login' : '/api/admin/signup';
      const payload = isLoginMode 
        ? { email, password } 
        : { email, password, organizationId: orgId }; 

      const { data } = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}${endpoint}`, payload);
      
      setToken(data.token);
      fetchFlags(data.token);
    } catch (err) {
      alert('Authentication failed. Check your credentials.');
    }
  };

  const fetchFlags = async (authToken) => {
    try {
      const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin/flags`, {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      setFlags(data);
    } catch (error) {
      if (error.response?.status === 401) logout();
    }
  };

  const createFlag = async (e) => {
    e.preventDefault();
    await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin/flags`, 
      { key: newFlagKey, isEnabled: false },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setNewFlagKey('');
    fetchFlags(token);
  };

  const toggleFlag = async (flagId, currentState) => {
    await axios.put(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin/flags/${flagId}`, 
      { isEnabled: !currentState },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    fetchFlags(token);
  };

  const deleteFlag = async (flagId) => {
    if (window.confirm('Are you sure you want to delete this flag?')) {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin/flags/${flagId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchFlags(token);
    }
  };

  const isFeatureEnabled = (keyName) => {
    return flags.some(flag => flag.key === keyName && flag.isEnabled);
  };

  if (!token) {
    return (
      <form onSubmit={handleAuth} className="flex flex-col gap-4 max-w-sm mx-auto mt-10">
        <h2 className="text-2xl font-bold mb-2 text-slate-800">{isLoginMode ? 'Admin Login' : 'Admin Signup'}</h2>
        <input 
          className="border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none p-2 rounded-md transition-all" 
          placeholder="Email" 
          value={email} 
          onChange={e => setEmail(e.target.value)} 
          required 
        />
        <input 
          className="border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none p-2 rounded-md transition-all" 
          placeholder="Password" 
          value={password} 
          type="password" 
          onChange={e => setPassword(e.target.value)} 
          required 
        />
        {!isLoginMode && (
           <input 
             className="border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none p-2 rounded-md font-mono text-sm transition-all" 
             placeholder="Organization ID" 
             value={orgId} 
             onChange={e => setOrgId(e.target.value)} 
             required 
           />
        )}
        <button type="submit" className="bg-blue-600 font-medium text-white p-2 rounded-md shadow-sm hover:bg-blue-700 transition-colors">
          {isLoginMode ? 'Login' : 'Signup'}
        </button>
        <button type="button" onClick={() => setIsLoginMode(!isLoginMode)} className="text-blue-600 text-sm font-medium hover:text-blue-800 hover:underline">
          Switch to {isLoginMode ? 'Signup' : 'Login'}
        </button>
      </form>
    );
  }

  return (
    <div className="max-w-4xl mx-auto mt-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-slate-800">Organization Feature Flags</h2>
      </div>

      {isFeatureEnabled('beta_dashboard') && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-md text-green-800 shadow-sm">
          <strong>Beta Dashboard is Active:</strong> This module renders because the "beta_dashboard" key is enabled.
        </div>
      )}
      
      <form onSubmit={createFlag} className="mb-8 flex gap-3">
        <input 
          placeholder="e.g. beta_feature" 
          value={newFlagKey} 
          onChange={(e) => setNewFlagKey(e.target.value)} 
          required 
          className="border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none p-2 rounded-md flex-grow max-w-sm font-mono text-sm text-slate-800 transition-all"
        />
        <button type="submit" className="bg-blue-600 text-white font-medium px-5 py-2 rounded-md shadow-sm hover:bg-blue-700 transition-colors">
          Add Flag
        </button>
      </form>

      <ul className="space-y-3">
        {flags.map(flag => (
          <li key={flag._id} className="flex justify-between items-center p-4 bg-slate-50 rounded-md border border-slate-200 shadow-sm">
            <span className="font-mono text-slate-800 flex items-center gap-3">
              <strong className="text-base">{flag.key}</strong>
              <span className="text-slate-300">|</span>
              <span className={flag.isEnabled ? "text-green-600 font-bold text-sm" : "text-slate-500 text-sm font-semibold"}>
                {flag.isEnabled ? 'ON' : 'OFF'}
              </span>
            </span>
            <div className="flex gap-2">
              <button onClick={() => toggleFlag(flag._id, flag.isEnabled)} className="bg-white border border-slate-300 text-slate-700 font-medium px-4 py-1.5 rounded-md text-sm hover:bg-slate-100 transition-colors">
                Toggle
              </button>
              <button onClick={() => deleteFlag(flag._id)} className="bg-red-600 text-white font-medium px-4 py-1.5 rounded-md text-sm hover:bg-red-700 transition-colors">
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}