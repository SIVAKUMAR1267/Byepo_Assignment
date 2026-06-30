"use client";
import { useState } from 'react';
import axios from 'axios';

export default function SuperAdminApp() {
  const [token, setToken] = useState(null);
  const [orgName, setOrgName] = useState('');
  const [orgs, setOrgs] = useState([]);

  const login = async () => {
    try {
      const { data } = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/super/login`, {
        email: process.env.NEXT_PUBLIC_SUPER_ADMIN_EMAIL,
        password: process.env.NEXT_PUBLIC_SUPER_ADMIN_PASSWORD
      });
      setToken(data.token);
      fetchOrgs(data.token);
    } catch (err) {
      alert('Login failed. Check your config credentials.');
    }
  };

  const logout = () => {
    setToken(null);
    setOrgs([]);
  };

  const fetchOrgs = async (authToken) => {
    const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/super/organizations`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    setOrgs(data);
  };

  const createOrg = async (e) => {
    e.preventDefault();
    await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/super/organizations`, 
      { name: orgName },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setOrgName('');
    fetchOrgs(token);
  };

  if (!token) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-6 text-slate-800">Super Admin Login</h2>
        <button onClick={login} className="bg-blue-600 text-white font-medium px-6 py-2 rounded-md shadow-sm hover:bg-blue-700 transition-colors">
          Log in with Config Credentials
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-slate-800">Super Admin Dashboard</h2>
        <button onClick={logout} className="text-sm font-medium text-red-600 bg-transparent hover:bg-transparent hover:text-red-800 hover:underline p-0 transition-colors">
          Logout
        </button>
      </div>

      <form onSubmit={createOrg} className="mb-8 flex gap-3">
        <input 
          placeholder="New Organization Name" 
          value={orgName} 
          onChange={(e) => setOrgName(e.target.value)} 
          required 
          className="border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none p-2 rounded-md flex-grow max-w-sm transition-all"
        />
        <button type="submit" className="bg-blue-600 text-white font-medium px-5 py-2 rounded-md shadow-sm hover:bg-blue-700 transition-colors">
          Create Organization
        </button>
      </form>
      
      <h3 className="text-lg font-semibold mb-4 text-slate-800">Existing Organizations</h3>
      <ul className="space-y-3">
        {orgs.map(org => (
          <li key={org._id} className="p-4 bg-slate-50 rounded-md border border-slate-200 shadow-sm flex justify-between items-center">
            <strong className="text-slate-800">{org.name}</strong>
            <span className="text-sm text-slate-500 font-mono bg-white px-2 py-1 rounded border border-slate-200">
              ID: {org._id}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}