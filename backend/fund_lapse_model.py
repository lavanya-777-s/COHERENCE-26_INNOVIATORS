import pandas as pd
import numpy as np
from sklearn.linear_model import LogisticRegression

def predict_fund_lapse(df):
    """
    Predict the probability that funds will remain unused (lapse) by end of year.
    """
    # For a prototype, we'll use a rule-based probability simulation 
    # that mimics what a Logistic Regression would learn from features.
    
    # Calculate current usage efficiency
    df['usage_efficiency'] = df['spending_ratio'] / df['month_idx'].replace(0, 1)
    
    # Probability of lapse increases if usage efficiency is low
    # e.g., if we are halfway through and only used 10%, lapse is almost certain.
    
    def calculate_lapse_prob(row):
        efficiency = row['usage_efficiency']
        # Sigmoid-like function for probability
        # If efficiency is 0.08 (target is ~0.08 per month for 12 months), prob is ~0.5
        # If efficiency is < 0.04, prob is high.
        
        prob = 1 / (1 + np.exp(20 * (efficiency - 0.04)))
        return round(prob, 2)

    df['fund_lapse_probability'] = df.apply(calculate_lapse_prob, axis=1)
    
    # Risk level based on probability
    def get_risk_level(prob):
        if prob > 0.7: return "High"
        if prob > 0.4: return "Medium"
        return "Low"

    df['lapse_risk_level'] = df['fund_lapse_probability'].apply(get_risk_level)
    
    return df
