import React, { useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const SentimentVisualization = () => {
  const [dateRange, setDateRange] = useState('');
  const [chartData, setChartData] = useState(null);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setChartData(null);
    setSummary(null);
    try {
      const res = await fetch('http://127.0.0.1:8000/visualize_sentiment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date_range: dateRange })
      });
      const data = await res.json();
      if (data.success && data.chart_data) {
        setChartData(data.chart_data);
        setSummary(data.summary);
      } else {
        setError(data.error || 'No data received.');
      }
    } catch (err) {
      setError('Error connecting to backend.');
    }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 600, margin: '2rem auto' }}>
      <h2>Sentiment Visualization</h2>
      <div style={{ marginBottom: '1rem', padding: '1rem', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
        <p style={{ margin: 0, fontSize: '0.9rem' }}>
          <strong>Date Range Examples:</strong><br/>
          • "last 7 days" or "last 30 days"<br/>
          • "Jan 1 2022 to Jan 31 2022"<br/>
          • "2021-01-01 to 2021-12-31"
        </p>
      </div>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <input
          type="text"
          value={dateRange}
          onChange={e => setDateRange(e.target.value)}
          placeholder="Enter date range (e.g., 'last 7 days')"
          required
        />
        <button type="submit" disabled={loading}>Generate Visualization</button>
      </form>
      {loading && <p>Loading visualization...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {chartData && (
        <div style={{ marginTop: '2rem' }}>
            <Bar
              data={chartData}
              options={{
                responsive: true,
                plugins: {
                  legend: { position: 'top' },
                  title: { display: true, text: `Sentiment Analysis for ${dateRange}` },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    ticks: {
                      stepSize: 1
                    }
                  }
                }
              }}
            />
            {summary && (
              <div style={{ marginTop: '1rem', padding: '1rem', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
                <h4>Summary Statistics</h4>
                <p><strong>Total Reviews:</strong> {summary.total_reviews}</p>
                <p><strong>Date Range:</strong> {summary.date_range}</p>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                  {Object.entries(summary.sentiment_counts).map(([sentiment, count]) => (
                    <div key={sentiment} style={{ 
                      padding: '0.5rem', 
                      borderRadius: '4px',
                      backgroundColor: sentiment === 'positive' ? '#E8F5E8' : 
                                     sentiment === 'negative' ? '#FFE8E8' : 
                                     '#E8F0FF',
                      color: sentiment === 'positive' ? '#2E7D32' : 
                             sentiment === 'negative' ? '#C62828' : 
                             '#1565C0'
                    }}>
                      <strong>{sentiment.charAt(0).toUpperCase() + sentiment.slice(1)}:</strong> {count}
                    </div>
                  ))}
                </div>
              </div>
            )}
        </div>
      )}
    </div>
  );
};

export default SentimentVisualization;
