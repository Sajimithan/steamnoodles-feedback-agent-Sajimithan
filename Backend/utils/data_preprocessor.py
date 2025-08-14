import pandas as pd

def preprocess_data(raw_data_path, output_path):
    
    try:
        df = pd.read_csv(raw_data_path, quotechar='"', escapechar='\\')
    except Exception as e:
        print(f"Failed to read CSV: {e}")
        return pd.DataFrame()

    print("\n=== Initial Data ===")
    print(f"Total rows: {len(df)}")
    print("Columns:", df.columns.tolist())
    print("First row Review Text:", df['Review Text'].iloc[0] if 'Review Text' in df.columns else "No Review Text column")
    print("First row Rating:", df['Rating'].iloc[0] if 'Rating' in df.columns else "No Rating column")

    # Clean Rating column 
    if 'Rating' in df.columns:
        
        df['rating'] = (
            df['Rating']
            .astype(float)
            .clip(1,5)
        )
        df = df.dropna(subset=['rating'])
    else:
        print("Error: No Rating column found")
        return pd.DataFrame()

    print(f"\nRows after rating cleaning: {len(df)}")

    
    if 'Date' in df.columns:
        print("Using 'Date' column for dates")
        df['date'] = pd.to_datetime(df['Date'], format='%m/%d/%Y', errors='coerce')
        df = df.dropna(subset=['date'])
    else:
        print("Warning: No Date column found, using today's date")
        df['date'] = pd.to_datetime('today')

    print(f"Rows after date cleaning: {len(df)}")
    print("\nSample converted dates:", df['date'].head(3).dt.strftime('%Y-%m-%d').tolist())

    
    df['sentiment'] = pd.cut(
        df['rating'],
        bins=[0, 2, 4, 5.1],
        labels=['negative', 'neutral', 'positive'],
        right=False
    )

    
    processed_cols = ['date', 'Review Text', 'sentiment', 'rating']
    processed_df = df[[col for col in processed_cols if col in df.columns]]
    processed_df.columns = ['date', 'review_text', 'sentiment', 'rating']
    
    # Save processed data
    processed_df.to_csv(output_path, index=False)

    print("\n=== Final Data ===")
    print(f"Processed rows: {len(processed_df)}")
    print("Sentiment distribution:")
    print(processed_df['sentiment'].value_counts())

    return processed_df