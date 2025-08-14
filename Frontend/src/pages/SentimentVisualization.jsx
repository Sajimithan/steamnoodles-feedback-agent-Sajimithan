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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setChartData(null);
    try {
      const res = await fetch('http://127.0.0.1:8000/visualize_sentiment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date_range: dateRange })
      });
      const data = await res.json();
      if (data.message) {
        // Placeholder: Replace with actual chart data from backend
        setChartData({ labels: ['Positive', 'Neutral', 'Negative'], values: [10, 5, 3] });
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
              data={{
                labels: chartData.labels,
                datasets: [
                  {
                    label: 'Sentiment Count',
                    data: chartData.values,
                    backgroundColor: [
                      'rgba(75, 192, 192, 0.6)',
                      'rgba(255, 206, 86, 0.6)',
                      'rgba(255, 99, 132, 0.6)'
                    ],
                  },
                ],
              }}
              options={{
                responsive: true,
                plugins: {
                  legend: { position: 'top' },
                  title: { display: true, text: 'Sentiment Analysis' },
                },
              }}
            />
        </div>
      )}
    </div>
  );
};

export default SentimentVisualization;
