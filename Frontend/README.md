
# Beyond Flavours Feedback Agent — Frontend

This is the frontend for the Beyond Flavours Feedback Agent, built with React and Vite.

## Features


## Setup

1. Install dependencies:
	```sh
	npm install
	```
2. Start the development server:
	```sh
	npm run dev
	```
3. Open [http://localhost:5173](http://localhost:5173) in your browser.

# SteamNoodles Automated Restaurant Feedback Agent — Frontend

## Project Overview
This frontend is part of the SteamNoodles Automated Restaurant Feedback Agent project. It provides a user interface for interacting with two AI agents:

- **Feedback Response Agent**: Automatically responds to customer reviews using sentiment analysis and LLMs.
- **Sentiment Visualization Agent**: Generates dynamic sentiment plots for reviews over a selected date range.

## Features Completed
- Home page with navigation
- Respond to Review: Submit review and rating, receive AI-generated response
- Sentiment Visualization: Enter date range, view sentiment analysis chart
- Sample Reviews: View sample reviews from backend
- All pages connect to backend endpoints
- Modern UI/UX with error/loading states
- All Vite/React demo content removed; custom branding added

## Setup Instructions
1. Install dependencies:
	```sh
	npm install
	```
2. Start the development server:
	```sh
	npm run dev
	```
3. Open [http://localhost:5173](http://localhost:5173) in your browser.

## How to Test Each Agent
- **Feedback Response Agent**: Go to "Respond to Review" page, enter a review and rating, and submit. The agent will generate a response.
- **Sentiment Visualization Agent**: Go to "Sentiment Visualization" page, enter a date range, and submit. The agent will generate a sentiment chart.
- **Sample Reviews**: Go to "Sample Reviews" page to view random reviews from the dataset.

## Sample Prompts & Expected Outputs
- **Feedback Response**: Enter a review like "The noodles were delicious but service was slow." and select a rating. Expect a polite, context-aware reply.
- **Sentiment Visualization**: Enter "last 7 days" or a custom date range. Expect a bar chart showing positive, neutral, and negative review counts.

## Technologies Used
- React, Vite (Frontend)
- FastAPI (Backend)
- LLM Services: OpenAI GPT, HuggingFace Transformers (Backend)
- Python Libraries: pandas, matplotlib, seaborn, plotly (Backend)

## Dataset
- Kaggle restaurant review dataset (with text, sentiment, and timestamp)

## Deliverables
- Working source code for both agents
- README with setup and testing instructions
- Sample outputs (auto-response and sentiment plot)

## Evaluation Criteria
- Functionality of both agents (40%)
- Use of LLMs + Sentiment logic (25%)
- Code quality & documentation (20%)
- Innovation & improvements (15%)

## License
MIT
