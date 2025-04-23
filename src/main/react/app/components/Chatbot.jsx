import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { text: "Hello! I'm your AI-powered ERP assistant. How can I help you today?", sender: "bot" }
    ]);
    const [inputMessage, setInputMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!inputMessage.trim() || isLoading) return;

        // Add user message
        const userMessage = { text: inputMessage, sender: "user" };
        setMessages(prev => [...prev, userMessage]);
        setInputMessage("");
        setIsLoading(true);

        try {
            // Send message to ML backend
            const response = await axios.post('http://localhost:8000/api/chatbot/message', {
                message: inputMessage
            });

            // Add bot response
            const botMessage = { text: response.data.response, sender: "bot" };
            setMessages(prev => [...prev, botMessage]);
        } catch (error) {
            console.error('Error sending message:', error);
            let errorMessage = "I'm having trouble processing your request right now. Please try again later.";
            
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                console.error('Error response:', error.response.data);
                errorMessage = `Error: ${error.response.data.detail || 'Server error'}`;
            } else if (error.request) {
                // The request was made but no response was received
                console.error('No response received:', error.request);
                errorMessage = "Could not connect to the chatbot service. Please make sure the backend server is running.";
            }
            
            const errorBotMessage = { 
                text: errorMessage, 
                sender: "bot" 
            };
            setMessages(prev => [...prev, errorBotMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed bottom-4 right-4 z-50">
            {!isOpen ? (
                <button
                    onClick={() => setIsOpen(true)}
                    className="bg-blue-500 hover:bg-blue-600 text-white rounded-full p-4 shadow-lg"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                </button>
            ) : (
                <div className="bg-white rounded-lg shadow-xl w-96 h-[500px] flex flex-col">
                    {/* Header */}
                    <div className="bg-blue-500 text-white p-4 rounded-t-lg flex justify-between items-center">
                        <h3 className="font-semibold">AI ERP Assistant</h3>
                        <button onClick={() => setIsOpen(false)} className="text-white hover:text-gray-200">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4">
                        {messages.map((message, index) => (
                            <div
                                key={index}
                                className={`mb-4 flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`rounded-lg p-3 max-w-[80%] ${
                                        message.sender === 'user'
                                            ? 'bg-blue-500 text-white'
                                            : 'bg-gray-100 text-gray-800'
                                    }`}
                                >
                                    {message.text}
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex justify-start mb-4">
                                <div className="bg-gray-100 text-gray-800 rounded-lg p-3">
                                    <div className="flex space-x-2">
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <form onSubmit={handleSubmit} className="p-4 border-t">
                        <div className="flex space-x-2">
                            <input
                                type="text"
                                value={inputMessage}
                                onChange={(e) => setInputMessage(e.target.value)}
                                placeholder="Type your message..."
                                className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                disabled={isLoading}
                            />
                            <button
                                type="submit"
                                className={`bg-blue-500 text-white px-4 py-2 rounded-lg ${
                                    isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'
                                }`}
                                disabled={isLoading}
                            >
                                Send
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default Chatbot; 