from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import io
import os

from data_processor import process_budget_data, validate_format
from anomaly_model import detect_anomalies
from underutilization_model import forecast_utilization
from fund_lapse_model import predict_fund_lapse

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = 'uploads'
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

@app.route('/api/analyze', methods=['POST'])
def analyze_data():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400
    
    if file and file.filename.endswith('.csv'):
        # Use utf-8-sig to handle byte order marks (BOM) from Excel
        content = file.stream.read().decode("utf-8-sig")
        df = pd.read_csv(io.StringIO(content))
        
        # Normalize column names (strip whitespace and lowercase)
        raw_cols = [str(col).strip().lower() for col in df.columns]
        print(f"DEBUG: Raw columns: {raw_cols}")
        
        # Robust Mapping
        mapping = {}
        for col in df.columns:
            c = str(col).strip().lower()
            if 'district' in c: mapping[col] = 'district'
            elif 'department' in c or 'dept' in c: mapping[col] = 'department'
            elif 'scheme' in c or 'project' in c or 'description' in c or 'activity' in c: mapping[col] = 'scheme'
            elif 'allocated' in c or 'allotted' in c or ('budget' in c and 'spent' not in c): mapping[col] = 'allocated_budget'
            elif 'spent' in c or 'spend' in c or 'actual' in c: mapping[col] = 'spent_budget'
            elif 'month' in c: mapping[col] = 'month'
        
        df = df.rename(columns=mapping)
        print(f"DEBUG: Mapped columns: {df.columns.tolist()}")
        
        # Validate format
        is_valid, missing_cols = validate_format(df)
        if not is_valid:
            print(f"DEBUG: Validation failed. Missing: {missing_cols}")
            return jsonify({"error": f"Invalid format. Missing columns: {', '.join(missing_cols)}"}), 400
        
        # Run ML Pipeline
        df = process_budget_data(df)
        df = detect_anomalies(df)
        df = forecast_utilization(df)
        df = predict_fund_lapse(df)
        
        # Save results for potential inspection
        df.to_json('outputs/anomaly_results.json', orient='records')
        
        # Return results to frontend
        results = df.to_dict(orient='records')
        return jsonify(results)

    return jsonify({"error": "Invalid file type. Only CSV allowed."}), 400

@app.route('/api/health', methods=['GET'])
def health():
    return jsonify({"status": "healthy", "service": "ML Intelligence Engine"})

if __name__ == '__main__':
    # Using a different port (5001) to avoid conflict with the Node.js server (5000)
    app.run(port=5001, debug=True)
