import joblib
from fastapi import FastAPI, HTTPException, Query
from typing import Optional
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from transformers import pipeline
from tensorflow_chatbot import TensorFlowChatbot

from db_connector import get_order_count
from db_connector import get_order_items
from db_connector import get_sales_count
from db_connector import get_sales_items

import logging
import traceback
from datetime import datetime, timedelta  # datetime과 timedelta를 정확히 import

app = FastAPI()

# CORS 설정
origins = [
    "http://localhost:5173",  # Vite dev server
]
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
        
@app.get("/api/order/count")
async def fetch_order_count(
    start_date: Optional[str] = Query(None),
    end_date: Optional[str] = Query(None)
):
    try:
        data = get_order_count(start_date=start_date, end_date=end_date) # db_connector.py에서 데이터를 가져온다.
        if not data:
            raise HTTPException(status_code=404, detail="No data found")
        return {"status": "success", "data": data}
    except Exception as e:
        logging.error("Error fetching order count: " + traceback.format_exc())  # 오류 로그 추가
        raise HTTPException(status_code=500, detail="DB 조회 중 오류 발생: " + str(e))
        
@app.get("/api/order/items")
async def fetch_order_items():
    try:
        data = get_order_items()
        if not data:
            raise HTTPException(status_code=404, detail="No data found")
        return {"status": "success", "data": data}
    except Exception as e:
        raise HTTPException(status_code=500, detail="DB 조회 중 오류 발생: " + str(e))
        
@app.get("/api/sales/count")
async def fetch_sales_count(
    start_date: Optional[str] = Query(None),
    end_date: Optional[str] = Query(None)
):
    try:
        data = get_sales_count(start_date=start_date, end_date=end_date)  # db_connector.py에서 데이터를 가져온다.
        if not data:
            raise HTTPException(status_code=404, detail="No data found")
        return {"status": "success", "data": data}
    except Exception as e:
        logging.error(f"Error fetching sales count: {traceback.format_exc()}")  # 오류 로그 추가
        raise HTTPException(status_code=500, detail="DB 조회 중 오류 발생: " + str(e))
        
@app.get("/api/sales/items")
async def fetch_sales_items():
    try:
        data = get_sales_items()
        if not data:
            raise HTTPException(status_code=404, detail="No data found")
        return {"status": "success", "data": data}
    except Exception as e:
        raise HTTPException(status_code=500, detail="DB 조회 중 오류 발생: " + str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 