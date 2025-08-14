# steamnoodles-feedback-agent-Sajimithan

# 🍜 SteamNoodles Automated Restaurant Feedback Agent  
*(Beyond Flavours Feedback Agent — Full Stack)*

**University:** University of Moratuwa  
**Year:** 3rd Year  

---

##  Project Overview
The **SteamNoodles Automated Restaurant Feedback Agent** is a full-stack AI-driven system designed to automate and personalize customer feedback analysis for restaurants.  
It features **two intelligent agents**:

1. **Feedback Response Agent** — Accepts customer feedback, determines sentiment (positive/neutral/negative) using LLMs, and generates polite, context-aware replies.
2. **Sentiment Visualization Agent** — Generates bar/line plots showing sentiment trends over time for a given date range.

The system consists of:
- **Backend** — Built with FastAPI + Python for sentiment analysis, AI responses, and data visualization.
- **Frontend** — Built with React + Vite to provide an interactive UI for users.

---

##  Key Features

### Backend
- FastAPI endpoints for both agents
- Sentiment classification based on ratings
- AI-powered feedback response generation (OpenAI GPT / HuggingFace)
- Dynamic sentiment visualization using pandas, matplotlib, seaborn, plotly
- Sample review retrieval
- CORS enabled for frontend integration

### Frontend
- Home page with navigation
- **Respond to Review** — Submit review & rating, receive AI-generated response
- **Sentiment Visualization** — Select date range, view sentiment trend chart
- **Sample Reviews** — Fetch random reviews from backend
- Modern UI/UX with loading & error handling
- Custom branding, no default Vite template content

---

## 🗄 Dataset
- **Source:** Kaggle restaurant review dataset  
- Contains: review text, rating, sentiment, and timestamp

---

##  Setup Instructions

### 1️ Clone the Repository
```bash
git clone clone https://github.com/Sajimithan/steamnoodles-feedback-agent-Sajimithan.git

cd Steamnoodles-feedback-agent-Sajimithan
```

---

### 2️ Backend Setup

1. **Create and activate virtual environment**

   ```bash
   python -m venv venv
   source venv/bin/activate   # Linux/macOS
   venv\Scripts\activate      # Windows
   ```

2. **Install dependencies**

   ```bash
   pip install -r requirements.txt
   ```

3. **Add your API key**
   Create a `.env` file in the root folder:

   ```bash
   GROQ_API_KEY=your_groq_api_key_here
   ```

4. **Place dataset**
   Download the dataset and place it in the `data/` folder.

5. **Run the backend**

   ```bash
   uvicorn app:app --reload
   ```

   Backend will run at `http://127.0.0.1:8000`.

---

### 3️ Frontend Setup

1. Navigate to frontend folder:

   ```bash
   cd frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

4. Open the app in browser:
   [http://localhost:5173](http://localhost:5173)

---

##  How to Test the Agents

### **Feedback Response Agent**

- **Frontend**: Go to "Respond to Review" page → enter review + rating → submit.
- **Backend API**:

  ```http
  POST /respond_review
  {
    "review_text": "Great food, slow service.",
    "rating": 3
  }
  ```

  Returns: Polite, AI-generated response.

### **Sentiment Visualization Agent**

- **Frontend**: Go to "Sentiment Visualization" → enter date range → submit.
- **Backend API**:

  ```http
  POST /visualize_sentiment
  {
    "date_range": "last 7 days"
  }
  ```

  Returns: Sentiment bar/line plot.

### **Sample Reviews**

- **Frontend**: Go to "Sample Reviews" page.
- **Backend API**:

  ```http
  GET /sample_reviews?count=3
  ```

---

##  Sample Prompts & Expected Outputs

| Input Example                                                  | Expected Output                                                 |
| -------------------------------------------------------------- | --------------------------------------------------------------- |
| `"The noodles were delicious but service was slow.", rating=3` | Polite AI response acknowledging praise & addressing delay      |
| `"last 7 days"`                                                | Sentiment chart showing positive/neutral/negative review counts |

---

##  Technologies Used

- **Frontend**: React, Vite
- **Backend**: FastAPI, pandas, matplotlib, seaborn, plotly
- **AI/LLM**: OpenAI GPT, HuggingFace Transformers, Groq API
- **Other**: python-dotenv, CORS

---

##  Project Structure

```
Steamnoodles-feedback-agent-Piranavan/
├── README.md
├── requirements.txt
├── .env
├── app.py                 # FastAPI backend
├── data/
│   └── restaurant_reviews.csv
├── demo_images/
│   ├── start.png
│   ├── Respond_to_a_review.png
│   └── Sentiment_plot.png
└── frontend/
    ├── package.json
    ├── vite.config.js
    ├── index.html
    ├── src/
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── components/
    └── node_modules/
```

##  License

MIT