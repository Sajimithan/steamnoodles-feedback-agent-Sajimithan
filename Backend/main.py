from agents.feedback_response import FeedbackResponseAgent
from agents.sentiment_visualiztion import SentimentVisualizationAgent
from utils.data_loader import load_review_data
from utils.data_preprocessor import preprocess_data
import pandas as pd
import os
from dotenv import load_dotenv

load_dotenv()

def main():
    print("Beyond Flavours Feedback Agent System")
    
    # Preprocess data
    raw_data_path = "data/raw_reviews.csv"
    processed_data_path = "data/processed_reviews.csv"
    
    if not os.path.exists(processed_data_path):
        try:
            if not os.path.exists(raw_data_path):
                raise FileNotFoundError(f"Raw data file not found at {raw_data_path}")
                
            print("Preprocessing data...")
            preprocess_data(raw_data_path, processed_data_path)
        except Exception as e:
            print(f"Error during preprocessing: {e}")
            return
    
    # Load data
    try:
        df = load_review_data(processed_data_path)
        if len(df) == 0:
            raise ValueError("No reviews found in processed data")
        print("\nAvailable date range in dataset:")
        print(f"From: {df['date'].min().strftime('%Y-%m-%d')}")
        print(f"To: {df['date'].max().strftime('%Y-%m-%d')}")
    except Exception as e:
        print(f"Error loading data: {e}")
        return
    
    # Initialize agents
    feedback_agent = FeedbackResponseAgent()
    viz_agent = SentimentVisualizationAgent()
    
    while True:
        print("\nOptions:")
        print("1. Respond to a customer review")
        print("2. Generate sentiment visualization")
        print("3. Show sample reviews")
        print("4. Exit")
        
        choice = input("Enter your choice (1-4): ")
        
        if choice == "1":
            df = load_review_data(processed_data_path)
            print(f"Loaded {len(df)} reviews.")
            sample = df.sample(1).iloc[0]
            print(f"\nSample Review (Rating: {sample['rating']}/5):")
            print(sample['review_text'])
            
            response = feedback_agent.generate_response(sample['review_text'], sample['rating'])
            print("\nGenerated Response:")
            print(response)
            
        elif choice == "2":
            date_range = input("Enter date range (e.g., 'last 7 days' or 'May 22 to May 25'): ")
            fig = viz_agent.generate_visualization(date_range)
            if fig is not None:
                fig.show()
            else:
                print("No visualization generated - check date range and try again")
            
        elif choice == "3":
            df = load_review_data(processed_data_path)
            print("\nSample Reviews:")
            for _, row in df.sample(3).iterrows():
                print(f"\nRating: {row['rating']}/5")
                print(row['review_text'])
                print("-"*50)
                
        elif choice == "4":
            print("Exiting...")
            break
            
        else:
            print("Invalid choice. Please try again.")

if __name__ == "__main__":
    main()
