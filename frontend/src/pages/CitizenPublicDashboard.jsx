import { useState } from 'react';
import { STATIC_DATA, analyzeAnomalies } from '../data/budgetStaticData';

export default function CitizenPublicDashboard() {
  const [selectedState, setSelectedState] = useState(STATIC_DATA.states[0].id);
  const [selectedDistrict, setSelectedDistrict] = useState(null);

  const currentState = STATIC_DATA.states.find(s => s.id === selectedState);
  const currentDistrict = selectedDistrict
    ? currentState?.districts.find(d => d.id === selectedDistrict)
    : currentState?.districts[0];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-blue-50 to-white">
      {/* Hero */}
      <section className="py-12 px-4 bg-gradient-to-r from-blue-600 to-green-600 text-white">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4">💰 Where Did My Taxes Go?</h1>
          <p className="text-lg text-blue-100">
            Real Budget Data • Full Transparency • Government Accountability
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-12">
        
        {/* Selectors */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Select State</label>
            <select
              value={selectedState}
              onChange={(e) => {
                setSelectedState(e.target.value);
                setSelectedDistrict(null);
              }}
              className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 font-medium"
            >
              {STATIC_DATA.states.map(state => (
                <option key={state.id} value={state.id}>{state.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Select District</label>
            <select
              value={selectedDistrict || ''}
              onChange={(e) => setSelectedDistrict(e.target.value || null)}
              className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 font-medium"
            >
              <option value="">-- All Districts --</option>
              {currentState?.districts.map(district => (
                <option key={district.id} value={district.id}>{district.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <p className="text-gray-600 text-sm font-semibold mb-2">Total Budget Allocated</p>
            <p className="text-3xl font-bold text-blue-900">₹{(currentDistrict.allocation/10000000).toFixed(1)}Cr</p>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <p className="text-gray-600 text-sm font-semibold mb-2">Amount Actually Spent</p>
            <p className="text-3xl font-bold text-green-900">₹{(currentDistrict.spent/10000000).toFixed(1)}Cr</p>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <p className="text-gray-600 text-sm font-semibold mb-2">Utilization Rate</p>
            <p className="text-3xl font-bold text-purple-900">{Math.round((currentDistrict.spent/currentDistrict.allocation)*100)}%</p>
          </div>
        </div>

        {/* Department Breakdown */}
        <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Department Spending Breakdown</h2>

          <div className="space-y-4">
            {currentDistrict.departments.map((dept, idx) => {
              const analysis = analyzeAnomalies(dept);
              
              return (
                <div key={idx} className={`border rounded-lg p-6 ${
                  analysis.type === 'overestimate' ? 'bg-red-50 border-red-200' :
                  analysis.type === 'underestimate' ? 'bg-yellow-50 border-yellow-200' :
                  'bg-green-50 border-green-200'
                }`}>
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{dept.name}</h3>
                      {analysis.alert && (
                        <p className="text-sm font-semibold mt-1">{analysis.alert}</p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold">₹{(dept.allocated/10000000).toFixed(1)}Cr</p>
                      <p className="text-sm text-gray-600">Allocated</p>
                    </div>
                  </div>

                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-medium">Spent: ₹{(dept.spent/10000000).toFixed(1)}Cr</span>
                    <span className="font-bold">{Math.round((dept.spent/dept.allocated)*100)}%</span>
                  </div>

                  <div className="w-full bg-gray-300 rounded-full h-3">
                    <div
                      className={`h-3 rounded-full ${
                        analysis.type === 'overestimate' ? 'bg-red-600' :
                        analysis.type === 'underestimate' ? 'bg-yellow-600' :
                        'bg-green-600'
                      }`}
                      style={{ width: `${Math.min((dept.spent/dept.allocated)*100, 100)}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Anomalies */}
        {currentDistrict.departments.some(d => analyzeAnomalies(d).alert) && (
          <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">🚨 Budget Irregularities</h2>

            <div className="space-y-4">
              {currentDistrict.departments
                .filter(d => analyzeAnomalies(d).alert)
                .map((dept, idx) => {
                  const analysis = analyzeAnomalies(dept);
                  
                  return (
                    <div key={idx} className="bg-red-50 border-l-4 border-red-600 p-4 rounded-r-lg">
                      <p className="font-bold text-gray-900">{dept.name}</p>
                      <p className="text-sm text-gray-700 mt-1">{analysis.alert}</p>
                      <button className="mt-3 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-sm font-semibold">
                        Report to Authorities
                      </button>
                    </div>
                  );
                })}
            </div>
          </div>
        )}

        {/* Feedback */}
        <div className="bg-gradient-to-r from-blue-50 to-green-50 border border-gray-200 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Share Your Feedback</h2>
          
          <form className="space-y-4">
            <textarea
              placeholder="Tell us about government spending in your area..."
              rows="4"
              className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500"
            ></textarea>
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white font-semibold py-3 rounded-lg"
            >
              Submit Feedback
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}