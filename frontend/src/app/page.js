"use client";
import { useState } from 'react';
import axios from 'axios';

export default function EndUserApp() {
  const [orgId, setOrgId] = useState('');
  const [featureKey, setFeatureKey] = useState('');
  const [result, setResult] = useState(null);

  const checkFeature = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/public/evaluate`, {
        organizationId: orgId,
        featureKey: featureKey,
      });
      setResult(data);
    } catch (error) {
      alert('Error evaluating flag. Ensure the Organization ID is correct.');
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-slate-800">End User Portal</h2>
      <form onSubmit={checkFeature} className="flex flex-col gap-4 max-w-sm">
        <div>
          <label className="block text-sm font-medium mb-1 text-slate-700">Organization ID</label>
          <input 
            required 
            className="w-full border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none p-2 rounded-md transition-all" 
            value={orgId} 
            onChange={(e) => setOrgId(e.target.value)} 
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-slate-700">Feature Key</label>
          <input 
            required 
            className="w-full border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none p-2 rounded-md transition-all" 
            value={featureKey} 
            onChange={(e) => setFeatureKey(e.target.value)} 
          />
        </div>
        <button type="submit" className="bg-blue-600 text-white font-medium p-2 rounded-md hover:bg-blue-700 transition-colors shadow-sm">
          Check Feature Status
        </button>
      </form>

      {result && (
        <div className={`mt-8 p-5 border-l-4 rounded-md bg-slate-50 shadow-sm ${result.isEnabled ? 'border-green-500' : 'border-slate-400'}`}>
          <h3 className="font-semibold mb-2 text-slate-800">Result Details</h3>
          <p className="text-slate-700 mb-1">
            Feature Key: <span className="font-mono bg-slate-200 px-2 py-1 rounded text-sm">{result.featureKey}</span>
          </p>
          <p className="text-slate-700">
            Status: <strong className={result.isEnabled ? "text-green-600" : "text-slate-500"}>
              {result.isEnabled ? 'Enabled' : 'Disabled'}
            </strong>
          </p>
        </div>
      )}
    </div>
  );
}