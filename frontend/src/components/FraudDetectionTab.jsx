import { AlertTriangle, CheckCircle2, FileSearch, ShieldAlert, UploadCloud, FileText, Check, AlertCircle } from 'lucide-react';
import { useState } from 'react';

export default function FraudDetectionTab() {
  const [file, setFile] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);

  const handleFileUpload = (e) => {
    const uploadedFile = e.target.files[0];
    if (uploadedFile) {
      setFile(uploadedFile);
      setScanResult(null); // Reset previous results
    }
  };

  const startScan = () => {
    if (!file) return;
    setIsScanning(true);
    
    // Simulate AI scanning process
    setTimeout(() => {
      setIsScanning(false);
      // Mock result - alternating between clean and fraudulent for demo purposes based on file name length
      const isFraud = file.name.length % 2 === 0; 
      
      if (isFraud) {
        setScanResult({
          status: 'flagged',
          confidence: 94,
          vendor: 'Global Buildcon Private Ltd',
          invoiceNo: 'INV-2025-084B',
          amount: '₹4,50,00,000',
          issues: [
            { type: 'Price Inflation', desc: 'Item "Grade A Cement" quoted at ₹540/bag. Market avg is ₹380/bag.' },
            { type: 'Duplicate Entry', desc: 'Transportation charges billed twice under different overhead codes.' },
            { type: 'Vendor History', desc: 'Vendor has 3 prior flags for delayed execution in adjacent districts.' }
          ]
        });
      } else {
        setScanResult({
          status: 'clean',
          confidence: 98,
          vendor: 'Apex Infrastructure',
          invoiceNo: 'INV-2025-102A',
          amount: '₹1,20,00,000',
          issues: []
        });
      }
    }, 2500);
  };

  const clearFile = () => {
    setFile(null);
    setScanResult(null);
    setIsScanning(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in zoom-in-95 duration-500">
      
      {/* Header */}
      <div className="bg-white rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
              <ShieldAlert className="text-rose-600" size={28} /> AI Fraud Radar
            </h2>
            <p className="text-slate-500 font-medium mt-1">Upload contractor invoices, bills, or DPRs for automated forensic analysis.</p>
          </div>
          <div className="hidden md:flex items-center gap-2 bg-indigo-50 px-4 py-2 rounded-xl border border-indigo-100">
             <span className="relative flex h-3 w-3">
               <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
               <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-500"></span>
             </span>
             <span className="text-indigo-800 font-bold text-sm">Predictor Engine Active</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Upload Zone */}
        <div className="lg:col-span-1 bg-white rounded-3xl p-6 shadow-sm border border-slate-200 flex flex-col">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Document Intake</h3>
          
          {!file ? (
            <label className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-slate-300 rounded-2xl bg-slate-50 hover:bg-slate-100 hover:border-indigo-400 transition-all cursor-pointer p-8 group">
              <div className="bg-indigo-100 p-4 rounded-full mb-4 group-hover:scale-110 transition-transform">
                <UploadCloud className="text-indigo-600" size={32} />
              </div>
              <p className="text-slate-700 font-bold text-center">Click to upload or drag & drop</p>
              <p className="text-slate-400 text-xs mt-2 text-center">PDF, JPG, PNG up to 10MB</p>
              <input type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png" onChange={handleFileUpload} />
            </label>
          ) : (
            <div className="flex-1 flex flex-col border-2 border-slate-200 rounded-2xl bg-slate-50 p-6 relative">
              <button onClick={clearFile} className="absolute top-4 right-4 text-slate-400 hover:text-rose-500 font-bold text-lg">&times;</button>
              <div className="flex items-center gap-4 mb-6">
                <div className="bg-blue-100 p-3 rounded-xl">
                  <FileText className="text-blue-600" size={24} />
                </div>
                <div className="overflow-hidden">
                  <p className="text-slate-800 font-bold truncate">{file.name}</p>
                  <p className="text-slate-500 text-xs">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
              </div>
              
              <button 
                onClick={startScan}
                disabled={isScanning || scanResult}
                className={`w-full py-3 rounded-xl font-bold text-white transition-all shadow-md flex items-center justify-center gap-2 ${
                  isScanning ? 'bg-indigo-400 cursor-wait' : 
                  scanResult ? 'bg-slate-400 cursor-not-allowed' : 
                  'bg-indigo-600 hover:bg-indigo-700 hover:-translate-y-0.5 shadow-indigo-200'
                }`}
              >
                {isScanning ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Running Forensic Scan...
                  </>
                ) : scanResult ? (
                  <>Scan Complete</>
                ) : (
                  <><FileSearch size={18} /> Initialize Audit</>
                )}
              </button>
            </div>
          )}
        </div>

        {/* Analysis Results Area */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 shadow-sm border border-slate-200 min-h-[400px]">
          <h3 className="text-lg font-bold text-slate-800 mb-6 border-b border-slate-100 pb-4">Audit Findings</h3>
          
          {!file && !isScanning && !scanResult && (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 min-h-[250px]">
              <FileSearch size={48} className="mb-4 opacity-50" />
              <p className="font-medium">Upload a document to view forensic analysis.</p>
            </div>
          )}

          {isScanning && (
            <div className="h-full flex flex-col items-center justify-center min-h-[250px] space-y-6">
              <div className="relative">
                <div className="w-24 h-24 border-4 border-indigo-100 rounded-full"></div>
                <div className="w-24 h-24 border-4 border-indigo-600 rounded-full border-t-transparent animate-spin absolute top-0 left-0"></div>
                <FileSearch className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-indigo-600" size={32} />
              </div>
              <div className="text-center">
                <p className="text-indigo-800 font-bold text-lg animate-pulse">Analyzing Line Items...</p>
                <p className="text-slate-500 text-sm mt-1">Cross-referencing with market rates and vendor history.</p>
              </div>
            </div>
          )}

          {scanResult && scanResult.status === 'flagged' && (
            <div className="animate-in fade-in slide-in-from-bottom-4">
              <div className="bg-rose-50 border border-rose-200 rounded-2xl p-5 mb-6 flex items-start gap-4">
                <div className="bg-rose-100 p-2 rounded-full mt-1 shrink-0">
                  <AlertTriangle className="text-rose-600" size={24} />
                </div>
                <div>
                  <h4 className="text-xl font-extrabold text-rose-800 tracking-tight">Anomalies Detected</h4>
                  <p className="text-rose-700 mt-1 font-medium">Predictor AI has identified severe discrepancies in this invoice. Processing blocked.</p>
                </div>
                <div className="ml-auto text-right">
                  <span className="text-3xl font-black text-rose-600">{scanResult.confidence}%</span>
                  <p className="text-[10px] font-bold text-rose-400 uppercase tracking-widest mt-1">Confidence</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                 <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                   <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Vendor Name</p>
                   <p className="text-slate-800 font-bold">{scanResult.vendor}</p>
                 </div>
                 <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                   <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Total Billed Amount</p>
                   <p className="text-slate-800 font-bold">{scanResult.amount}</p>
                 </div>
              </div>

              <h5 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
                <AlertCircle size={16} className="text-slate-400"/> Critical Flags ({scanResult.issues.length})
              </h5>
              <div className="space-y-3">
                {scanResult.issues.map((issue, idx) => (
                  <div key={idx} className="bg-white border-l-4 border-rose-500 rounded-r-xl p-4 shadow-sm">
                    <p className="font-bold text-slate-800 text-sm">{issue.type}</p>
                    <p className="text-slate-600 text-sm mt-1">{issue.desc}</p>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex gap-3">
                <button className="flex-1 bg-rose-600 hover:bg-rose-700 text-white font-bold py-3 rounded-xl shadow-md transition-all">
                   Hold Payment & Escalate
                </button>
                <button className="px-6 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold rounded-xl transition-all">
                   View Full Report
                </button>
              </div>
            </div>
          )}

          {scanResult && scanResult.status === 'clean' && (
             <div className="animate-in fade-in slide-in-from-bottom-4 h-full flex flex-col justify-center">
               <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-8 text-center">
                 <div className="inline-flex bg-emerald-100 p-4 rounded-full mb-4">
                   <CheckCircle2 className="text-emerald-600" size={48} />
                 </div>
                 <h4 className="text-2xl font-extrabold text-emerald-800 tracking-tight">Verified & Clear</h4>
                 <p className="text-emerald-700 mt-2 font-medium max-w-md mx-auto">No price inflation or duplicate entries detected. Rates align with current market index.</p>
                 
                 <div className="grid grid-cols-2 gap-4 mt-8 text-left">
                   <div className="bg-white p-4 rounded-xl border border-emerald-100">
                     <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Vendor</p>
                     <p className="text-slate-800 font-bold truncate">{scanResult.vendor}</p>
                   </div>
                   <div className="bg-white p-4 rounded-xl border border-emerald-100">
                     <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Amount Validated</p>
                     <p className="text-slate-800 font-bold">{scanResult.amount}</p>
                   </div>
                 </div>

                 <button className="mt-8 w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl shadow-md transition-all flex items-center justify-center gap-2">
                   <Check size={18} /> Proceed to Disbursal
                 </button>
               </div>
             </div>
          )}
        </div>

      </div>
    </div>
  );
}
