import numpy as np
import json
import os

class MLChatbot:
    def __init__(self):
        self.vectorizer = TfidfVectorizer()
        self.knowledge_base = self._load_knowledge_base()
        self._train_model()

    def _load_knowledge_base(self):
        # Load knowledge base from JSON file
        knowledge_base_path = os.path.join(os.path.dirname(__file__), 'knowledge_base.json')
        if os.path.exists(knowledge_base_path):
            with open(knowledge_base_path, 'r', encoding='utf-8') as f:
                return json.load(f)
        else:
            # Default knowledge base
            return {
                "greetings": {
                    "patterns": ["hello", "hi", "hey", "good morning", "good afternoon"],
                    "responses": ["Hello! How can I help you today?", "Hi there! What can I do for you?"]
                },
                "farewell": {
                    "patterns": ["bye", "goodbye", "see you", "see ya"],
                    "responses": ["Goodbye! Have a great day!", "See you later!"]
                },
                "help": {
                    "patterns": ["help", "support", "assistance", "need help"],
                    "responses": ["I can help you with various tasks. What do you need assistance with?"]
                },
                "thanks": {
                    "patterns": ["thank", "thanks", "thank you"],
                    "responses": ["You're welcome!", "Glad I could help!"]
                },
                "erp": {
                    "patterns": ["erp", "system", "software", "enterprise"],
                    "responses": ["Our ERP system helps manage business processes. What specific aspect would you like to know about?"]
                },
                "inventory": {
                    "patterns": ["inventory", "stock", "products", "items"],
                    "responses": ["The inventory management module helps track products, stock levels, and movements."]
                },
                "sales": {
                    "patterns": ["sales", "orders", "customers", "transactions"],
                    "responses": ["The sales module manages customer orders, transactions, and customer relationships."]
                },
                "인사": {
                    "patterns": [,"안녕", "안녕하세요", "안뇽", "안냥", "안냐세요", "하이", "헬로", "하이룽", "헬룽"],
                    "responses": ["안녕하세요? 무엇을 도와드릴까요?", "뭐래?"]
                },
            }

    def _train_model(self):
        # Prepare training data
        all_patterns = []
        for category in self.knowledge_base.values():
            all_patterns.extend(category["patterns"])
        
        # Fit the vectorizer
        self.vectorizer.fit(all_patterns)

    def get_response(self, message):
        # Vectorize the input message
        message_vec = self.vectorizer.transform([message.lower()])
        
        # Calculate similarity with all patterns
        best_similarity = -1
        best_category = None
        
        for category, data in self.knowledge_base.items():
            patterns_vec = self.vectorizer.transform(data["patterns"])
            similarities = cosine_similarity(message_vec, patterns_vec)
            max_similarity = np.max(similarities)
            
            if max_similarity > best_similarity:
                best_similarity = max_similarity
                best_category = category

        # If similarity is too low, return a default response
        if best_similarity < 0.3:
            return "I'm not sure I understand. Could you please rephrase your question?"

        # Return a random response from the best matching category
        responses = self.knowledge_base[best_category]["responses"]
        return np.random.choice(responses)

    def learn_from_interaction(self, question, response):
        """Method to allow the chatbot to learn from new interactions"""
        # This is a simple implementation - in a real system, you'd want to
        # store these interactions and retrain the model periodically
        pass 