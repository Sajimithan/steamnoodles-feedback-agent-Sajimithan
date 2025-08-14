import os
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

class FeedbackResponseAgent:
    def __init__(self):
        self.client = Groq(api_key=os.getenv("GROQ_API_KEY"))
        self.model = "llama3-8b-8192"  

    def generate_response(self, review_text, rating):
        try:
            chat_completion = self.client.chat.completions.create(
                messages=[
                    {
                        "role": "system",
                        "content": "You are a restaurant manager responding to customer reviews. Be polite and concise."
                    },
                    {
                        "role": "user",
                        "content": f"Review: {review_text}\nRating: {rating}/5\nGenerate a professional response under 100 words."
                    }
                ],
                model=self.model,
                temperature=0.7,
                max_tokens=150,
            )
            return chat_completion.choices[0].message.content
        except Exception as e:
            return f"Error generating response: {str(e)}"