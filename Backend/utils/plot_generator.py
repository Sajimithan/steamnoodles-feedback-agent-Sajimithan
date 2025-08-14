import pandas as pd
import plotly.express as px

class PlotGenerator:
    @staticmethod
    def generate_sentiment_trend_plot(df, date_range="Last 10 days"):
        """
        Generates a proper line plot showing sentiment trends over time
        """
        
        df['date'] = pd.to_datetime(df['date'])
        
        
        daily_counts = (
            df.groupby([pd.Grouper(key='date', freq='D'), 'sentiment'])
            .size()
            .unstack(fill_value=0)
            .reset_index()
            .melt(id_vars='date', var_name='sentiment', value_name='count')
        )
        
        
        fig = px.line(
            daily_counts,
            x='date',
            y='count',
            color='sentiment',
            title=f"Sentiment Trend: {date_range}",
            labels={'count': 'Number of Reviews', 'date': 'Date'},
            color_discrete_map={
                'positive': '#4CAF50',
                'neutral': '#2196F3',
                'negative': '#F44336'
            }
        )
        
        
        fig.update_layout(
            xaxis_title="Date",
            yaxis_title="Number of Reviews",
            hovermode="x unified",
            plot_bgcolor='rgba(240,240,240,0.8)'
        )
        
        return fig