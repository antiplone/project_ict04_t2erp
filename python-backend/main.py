from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from tensorflow_chatbot import TensorFlowChatbot

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize the TensorFlow chatbot
chatbot = TensorFlowChatbot()

class ChatMessage(BaseModel):
    message: str

class FeedbackMessage(BaseModel):
    question: str
    response: str
    feedback: str

@app.post("/api/chatbot/message")
async def get_chatbot_response(chat_message: ChatMessage):
    try:
        response = chatbot.get_response(chat_message.message)
        return {"response": response}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/chatbot/feedback")
async def provide_feedback(feedback: FeedbackMessage):
    try:
        chatbot.learn_from_interaction(
            feedback.question,
            feedback.response,
            feedback.feedback
        )
        return {"status": "success", "message": "Feedback received and processed"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/chatbot/history")
async def get_chat_history(limit: int = 10):
    try:
        history = chatbot.get_interaction_history(limit)
        return {"history": history}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/chatbot/export")
async def export_training_data(format: str = "json"):
    try:
        data = chatbot.export_training_data(format)
        return {"data": data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 