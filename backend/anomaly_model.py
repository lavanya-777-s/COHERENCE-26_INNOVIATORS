import pandas as pd
from sklearn.ensemble import IsolationForest

def detect_anomalies(df):
    """
    Use Isolation Forest to detect abnormal spending patterns.
    """
    features = ['allocated_budget', 'spent_budget', 'spending_ratio', 'monthly_spending_trend']
    X = df[features]
    
    # Fit the model
    # contamination is the expected proportion of outliers (anomalies)
    model = IsolationForest(contamination=0.1, random_state=42)
    df['anomaly_score'] = model.fit_predict(X)
    
    # -1 is anomaly, 1 is normal in IsolationForest output
    # Convert to 1 for anomaly, 0 for normal for easier frontend handling
    df['is_anomaly'] = df['anomaly_score'].apply(lambda x: 1 if x == -1 else 0)
    
    # Assign anomaly type and severity
    def categorize_anomaly(row):
        if row['is_anomaly'] == 0:
            return "Normal", "Low"
        
        if row['spending_ratio'] > 1.2:
            return "Overspending", "High"
        elif row['spending_ratio'] < 0.3:
            return "Underspending", "Medium"
        else:
            return "Irregular Pattern", "Medium"

    df[['anomaly_type', 'severity_level']] = df.apply(
        lambda row: pd.Series(categorize_anomaly(row)), axis=1
    )
    
    return df
