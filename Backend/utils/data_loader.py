import pandas as pd

def load_review_data(file_path="data/processed_reviews.csv"):
    """Load and preprocess review data"""
    df = pd.read_csv(file_path)
    df['date'] = pd.to_datetime(df['date'])
    return df