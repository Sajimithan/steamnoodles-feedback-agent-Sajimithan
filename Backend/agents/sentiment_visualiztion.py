import pandas as pd
from groq import Groq 
import os
from dotenv import load_dotenv
from utils.data_loader import load_review_data
from utils.plot_generator import PlotGenerator

load_dotenv()


class SentimentVisualizationAgent:
    def __init__(self):
        # Initialize Groq client 
        self.client = Groq(api_key=os.getenv("GROQ_API_KEY"))
        self.model = "llama3-8b-8192"  # or "mixtral-8x7b-32768"

        
        self.insight_prompt = """Analyze this sentiment trend data for {date_range}.
        Focus on patterns in positive, negative, and neutral reviews.
        Provide 2-3 key insights in bullet points:"""

    def _filter_by_date(self, df, date_range):
        # Ensure date column is properly formatted
        df['date'] = pd.to_datetime(df['date'])

        # Get date bounds from dataset
        min_date = df['date'].min()
        max_date = df['date'].max()

        print(f"\nDataset covers from {min_date.date()} to {max_date.date()}")

        # Handle "last X days" format
        if "last" in date_range.lower() and "days" in date_range.lower():
            try:
                days = int(date_range.split()[1])
                end_date = max_date
                start_date = end_date - pd.Timedelta(days=days - 1)  # Inclusive of both start and end

                print(f"Looking for data between {start_date.date()} and {end_date.date()}")

                filtered = df[(df['date'] >= start_date) & (df['date'] <= end_date)]
                if len(filtered) == 0:
                    print("No data found in this range")
                    # Suggest alternative near the end of dataset
                    alt_end = max_date
                    alt_start = alt_end - pd.Timedelta(days=min(10, (max_date - min_date).days))
                    print(f"Try dates like: {alt_start.date()} to {alt_end.date()}")
                return filtered
            except Exception as e:
                print(f"Error parsing 'last X days' format: {e}")

        # Handle "date to date" format
        try:
            if "to" in date_range:
                start_str, end_str = [s.strip() for s in date_range.split("to")]

                
                start_date = pd.to_datetime(start_str + " 2011", errors='coerce') or \
                             pd.to_datetime(start_str, errors='coerce')
                end_date = pd.to_datetime(end_str + " 2022", errors='coerce') or \
                           pd.to_datetime(end_str, errors='coerce')

                if pd.isna(start_date) or pd.isna(end_date):
                    raise ValueError("Couldn't parse dates")

                print(f"Looking for data between {start_date.date()} and {end_date.date()}")

                filtered = df[(df['date'] >= start_date) & (df['date'] <= end_date)]
                if len(filtered) == 0:
                    print("No data found in this range")
                    print(f"Available years: 2016-2019")
                return filtered
        except Exception as e:
            print(f"Error parsing date range: {e}")

        
        print("\nShowing most recent 10 days as fallback")
        end_date = max_date
        start_date = end_date - pd.Timedelta(days=9)  # 10 days inclusive
        return df[(df['date'] >= start_date) & (df['date'] <= end_date)]

    def generate_insights(self, df, date_range):
        """Generate text insights using Groq's API"""
        try:
            # Prepare summary statistics
            sentiment_counts = df['sentiment'].value_counts().to_dict()

            response = self.client.chat.completions.create(
                messages=[
                    {
                        "role": "system",
                        "content": "You are a data analyst providing insights about customer sentiment trends."
                    },
                    {
                        "role": "user",
                        "content": f"{self.insight_prompt.format(date_range=date_range)}\n\n"
                                   f"Sentiment distribution: {sentiment_counts}"
                    }
                ],
                model=self.model,
                temperature=0.3,  # Lower temperature for more factual analysis
                max_tokens=200
            )
            return response.choices[0].message.content
        except Exception as e:
            return f"Could not generate insights: {str(e)}"

    def generate_visualization(self, date_range, data_path="data/processed_reviews.csv"):
        df = load_review_data(data_path)
        df = self._filter_by_date(df, date_range)

        if len(df) == 0:
            print(f"\nNo reviews found for date range: {date_range}")
            print("Available date range in data:")
            print(f"From: {df['date'].min().date()} To: {df['date'].max().date()}")
            return None

        # Generate the plot
        fig = PlotGenerator.generate_sentiment_trend_plot(df, date_range)

        # Generate insights
        insights = self.generate_insights(df, date_range)
        print("\n=== Sentiment Insights ===")
        print(insights)

        return fig
