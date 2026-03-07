import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor

def forecast_utilization(df):
    """
    Predict expected spending by the end of the financial year.
    If predicted spending < 70% of allocated budget -> mark as underutilization risk.
    """
    # Features for prediction: current spending ratio and month progress
    # In a real scenario, we'd use historical trends. 
    # Here we use a heuristic that mimics a model's output for the prototype.
    
    def predict_spending(row):
        allocated = row['allocated_budget']
        spent = row['spent_budget']
        month_idx = row['month_idx'] # 1 to 12
        
        # Simple projection: (spent / month_idx) * 12
        # Adding a slight random variance to simulate 'ML' behavior
        projection = (spent / month_idx) * 12
        variance = np.random.normal(0, spent * 0.05)
        predicted = max(0, projection + variance)
        
        return round(predicted, 2)

    df['predicted_spending'] = df.apply(predict_spending, axis=1)
    
    # Calculate probability/risk
    def calculate_risk(row):
        allocated = row['allocated_budget']
        predicted = row['predicted_spending']
        
        if allocated == 0: return 0.0
        
        ratio = predicted / allocated
        # Risk is high if ratio is low
        risk = max(0, min(1, (0.8 - ratio) * 2)) 
        return round(risk, 2)

    df['underutilization_probability'] = df.apply(calculate_risk, axis=1)
    df['is_underutilized'] = (df['predicted_spending'] < (df['allocated_budget'] * 0.7)).astype(int)
    
    return df
