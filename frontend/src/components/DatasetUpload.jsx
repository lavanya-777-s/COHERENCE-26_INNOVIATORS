import React, { useState } from 'react';
import axios from 'axios';
import { Upload, FileText, AlertCircle, CheckCircle2, Loader } from 'lucide-react';

export default function DatasetUpload({ onDataReceived }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.name.endsWith('.csv')) {
      setFile(selectedFile);
      setError('');
    } else {
      setError('Please select a valid CSV file');
      setFile(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('No file selected');
      return;
    }

    setLoading(true);
    setError('');
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://localhost:5001/api/analyze', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setSuccess('Analysis complete! Dashboard updated.');
      onDataReceived(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Analysis failed. Please check the file format.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-blue-50 rounded-xl">
          <Upload className="text-blue-600" size={20} />
        </div>
        <h3 className="text-lg font-bold">National Budget Feed</h3>
      </div>

      <div className="border-2 border-dashed border-slate-200 rounded-2xl p-8 text-center space-y-4 hover:border-blue-400 transition-colors">
        <div className="flex flex-col items-center">
          <FileText size={48} className="text-slate-300 mb-2" />
          <p className="text-sm text-slate-500 font-medium">
            {file ? file.name : "Drag and drop your CSV dataset"}
          </p>
        </div>
        <input 
          type="file" 
          accept=".csv" 
          onChange={handleFileChange} 
          className="hidden" 
          id="csv-upload" 
        />
        <label 
          htmlFor="csv-upload" 
          className="inline-block px-6 py-2 bg-slate-100 text-slate-700 rounded-xl text-sm font-bold cursor-pointer hover:bg-slate-200"
        >
          Browse Files
        </label>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-3 bg-rose-50 border border-rose-100 text-rose-600 rounded-xl text-xs font-bold animate-in fade-in zoom-in">
          <AlertCircle size={14} /> {error}
        </div>
      )}

      {success && (
        <div className="flex items-center gap-2 p-3 bg-emerald-50 border border-emerald-100 text-emerald-600 rounded-xl text-xs font-bold animate-in fade-in zoom-in">
          <CheckCircle2 size={14} /> {success}
        </div>
      )}

      <button
        onClick={handleUpload}
        disabled={!file || loading}
        className="w-full flex items-center justify-center gap-2 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl font-bold transition-all shadow-lg shadow-blue-100"
      >
        {loading ? <><Loader size={18} className="animate-spin" /> Analyzing...</> : 'Initialize Intelligence Engine'}
      </button>

      <div className="pt-4 border-t border-slate-50">
        <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest leading-relaxed">
          Required Columns: District, Department, Scheme, Allocated_Budget, Spent_Budget, Month
        </p>
      </div>
    </div>
  );
}
