import pandas as pd
import numpy as np

def process_budget_data(df):
    """
    Preprocess budget data and add engineered features.
    """
    # Ensure numeric columns
    df['allocated_budget'] = pd.to_numeric(df['allocated_budget'], errors='coerce').fillna(0)
    df['spent_budget'] = pd.to_numeric(df['spent_budget'], errors='coerce').fillna(0)
    
    # Ensure 'scheme' exists
    if 'scheme' not in df.columns:
        df['scheme'] = 'General Scheme'
    
    # Calculate spending ratio
    df['spending_ratio'] = df['spent_budget'] / df['allocated_budget'].replace(0, 1)
    
    # Simulate monthly spending trend (if not provided, create a dummy one for the model)
    # In a real scenario, this would be historical data
    if 'month' in df.columns:
        # Simple trend: current spent / month_number
        month_map = {
            'april': 1, 'may': 2, 'june': 3, 'july': 4, 'august': 5, 'september': 6,
            'october': 7, 'november': 8, 'december': 9, 'january': 10, 'february': 11, 'march': 12
        }
        # Normalize and map
        df['month_idx'] = df['month'].astype(str).str.strip().str.lower().map(month_map)
        # If mapping failed, try converting directly to numeric (1-12)
        df['month_idx'] = df['month_idx'].fillna(pd.to_numeric(df['month'], errors='coerce'))
        df['month_idx'] = df['month_idx'].fillna(1)
        df['monthly_spending_trend'] = df['spent_budget'] / df['month_idx']
    else:
        df['monthly_spending_trend'] = df['spent_budget'] # Fallback
        
    print(f"DEBUG: Processed data sample: {df.head(2).to_dict()}")
    return df

def validate_format(df):
    """
    Validate that all required columns are present in the dataframe.
    """
    # Normalize column names for validation (strip spaces and lowercase)
    df_cols = [str(col).strip().lower() for col in df.columns]
    
    # Scheme is highly recommended but we can default it to "General" if missing
    required_columns = ['district', 'department', 'allocated_budget', 'spent_budget', 'month']
    missing = [col for col in required_columns if col.lower() not in df_cols]
    
    # If scheme is missing, we'll add a dummy one later in processing
    return len(missing) == 0, missing
