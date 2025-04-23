import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import '#styles/chatbot.css';

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { text: "안녕하세요! 무엇을 도와드릴까요?", sender: "bot" }
    ]);
    const [inputMessage, setInputMessage] = useState("");
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!inputMessage.trim()) return;

        const userMessage = { text: inputMessage, sender: "user" };
        setMessages(prev => [...prev, userMessage]);
        setInputMessage("");

        try {
            const response = await axios.post(`http://localhost:8000/api/chatbot/message`, {
                message: inputMessage
            });

            const botMessage = { text: response.data.response, sender: "bot" };
            setMessages(prev => [...prev, botMessage]);
        } catch (error) {
            console.error('Error sending message:', error);
            const errorMessage = {
                text: "죄송합니다. 잠시 후 다시 시도해주세요.",
                sender: "bot"
            };
            setMessages(prev => [...prev, errorMessage]);
        }
    };

    return (
        <div className="chatbot-container">
            {!isOpen ? (
                <button className="chatbot-open-button" onClick={() => setIsOpen(true)}>챗봇</button>
            ) : (
                <div className="chatbot-box">
                    <div className="chatbot-header">
                        <span className="chatbot-title">고객 상담봇</span>
                        <button className="chatbot-close-button" onClick={() => setIsOpen(false)}>×</button>
                    </div>

                    <div className="chatbot-messages">
                        {messages.map((message, index) => (
                            <div
                                key={index}
                                className={`chatbot-message ${message.sender === 'user' ? 'user' : 'bot'}`}
                            >
                                <div className="message-bubble">{message.text}</div>
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>

                    <form className="chatbot-input-form" onSubmit={handleSubmit}>
                        <input
                            type="text"
                            value={inputMessage}
                            onChange={(e) => setInputMessage(e.target.value)}
                            placeholder="키워드로 질문을 입력하세요..."
                            className="chatbot-input"
                        />
                        <button type="submit" className="chatbot-send-button">전송</button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default Chatbot;
