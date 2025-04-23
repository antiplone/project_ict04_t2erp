import tensorflow as tf
from transformers import TFAutoModelForSequenceClassification, AutoTokenizer
import numpy as np
import json
import os
from data_manager import DataManager

class TensorFlowChatbot:
    def __init__(self):
        # Initialize data manager
        self.data_manager = DataManager()
        
        # Initialize the model and tokenizer
        self.model_name = "distilbert-base-uncased"
        self.tokenizer = AutoTokenizer.from_pretrained(self.model_name)
        self.model = TFAutoModelForSequenceClassification.from_pretrained(self.model_name, num_labels=7)
        
        # Set confidence threshold
        self.confidence_threshold = 0.5
        
        # Load or create knowledge base
        self.knowledge_base = self._load_knowledge_base()
        
        # Load existing model weights if available
        self.data_manager.load_model_weights(self.model)
        
        # Train the model if no weights are loaded
        if not os.path.exists(self.data_manager.model_weights_path):
            self._train_model()

    def _load_knowledge_base(self):
        # Try to load existing knowledge base
        existing_kb = self.data_manager.load_knowledge_base()
        if existing_kb:
            return existing_kb
            
        # Create default knowledge base if none exists
        default_kb = {
            "greetings": {
                "patterns": [
                    "hello", "hi", "hey", "good morning", "good afternoon", 
                    "good evening", "how are you", "what's up", "greetings"
                ],
                "responses": [
                    "Hello! How can I help you today?", 
                    "Hi there! What can I do for you?",
                    "Greetings! How may I assist you?"
                ]
            },
            "farewell": {
                "patterns": [
                    "bye", "goodbye", "see you", "see ya", 
                    "farewell", "take care", "have a good day"
                ],
                "responses": [
                    "Goodbye! Have a great day!", 
                    "See you later!",
                    "Take care! Come back if you need anything."
                ]
            },
            "help": {
                "patterns": [
                    "help", "support", "assistance", "need help",
                    "can you help", "how to", "what is", "explain",
                    "tell me about", "show me", "guide me"
                ],
                "responses": [
                    "I can help you with various tasks. What do you need assistance with?",
                    "I'm here to help! What would you like to know?",
                    "How can I assist you today?"
                ]
            },
            "thanks": {
                "patterns": [
                    "thank", "thanks", "thank you", "appreciate it",
                    "much obliged", "grateful", "thanks a lot"
                ],
                "responses": [
                    "You're welcome!", 
                    "Glad I could help!",
                    "My pleasure! Is there anything else you need?"
                ]
            },
            "erp": {
                "patterns": [
                    "erp", "system", "software", "enterprise",
                    "what is erp", "erp system", "erp software",
                    "enterprise resource planning", "erp features"
                ],
                "responses": [
                    "Our ERP system helps manage business processes. What specific aspect would you like to know about?",
                    "The ERP system integrates various business functions. Would you like to know about specific modules?",
                    "Our ERP solution includes modules for inventory, sales, and more. Which area interests you?"
                ]
            },
            "inventory": {
                "patterns": [
                    "inventory", "stock", "products", "items",
                    "warehouse", "stock levels", "inventory management",
                    "product tracking", "stock control"
                ],
                "responses": [
                    "The inventory management module helps track products, stock levels, and movements.",
                    "You can manage your inventory, track stock levels, and monitor product movements.",
                    "The inventory system provides real-time tracking of your products and stock levels."
                ]
            },
            "sales": {
                "patterns": [
                    "sales", "orders", "customers", "transactions",
                    "purchase", "buy", "order management",
                    "customer orders", "sales tracking"
                ],
                "responses": [
                    "The sales module manages customer orders, transactions, and customer relationships.",
                    "You can process orders, track sales, and manage customer information.",
                    "The sales system helps you handle orders and maintain customer records."
                ]
            },
            "error": {
                "patterns": [
                    "error", "problem", "issue", "not working",
                    "broken", "failed", "can't", "unable to",
                    "doesn't work", "trouble"
                ],
                "responses": [
                    "I'm sorry you're experiencing issues. Could you please provide more details?",
                    "Let me help you with that problem. What exactly is not working?",
                    "I'll help you resolve this. Could you describe the issue in more detail?"
                ]
            }
        }
        
        # Save the default knowledge base
        self.data_manager.save_knowledge_base(default_kb)
        return default_kb

    def _train_model(self):
        # Prepare training data
        all_texts = []
        all_labels = []
        
        for idx, (category, data) in enumerate(self.knowledge_base.items()):
            for pattern in data["patterns"]:
                all_texts.append(pattern)
                all_labels.append(idx)
        
        # Save training data
        self.data_manager.save_training_data(all_texts, all_labels)
        
        # Tokenize the training data
        encoded_inputs = self.tokenizer(all_texts, padding=True, truncation=True, return_tensors="tf")
        
        # Convert labels to one-hot encoding
        labels = tf.keras.utils.to_categorical(all_labels, num_classes=len(self.knowledge_base))
        
        # Compile and train the model
        self.model.compile(
            optimizer=tf.keras.optimizers.Adam(learning_rate=2e-5),
            loss=tf.keras.losses.CategoricalCrossentropy(),
            metrics=['accuracy']
        )
        
        # Train the model
        self.model.fit(
            dict(encoded_inputs),
            labels,
            epochs=3,
            batch_size=8
        )
        
        # Save model weights
        self.data_manager.save_model_weights(self.model)

    def get_response(self, message):
        try:
            # Tokenize the input message
            encoded_input = self.tokenizer(message, padding=True, truncation=True, return_tensors="tf")
            
            # Get model prediction
            predictions = self.model.predict(dict(encoded_input))
            probabilities = tf.nn.softmax(predictions.logits).numpy()[0]
            
            # Get the predicted class and its confidence
            predicted_class = np.argmax(probabilities)
            confidence = probabilities[predicted_class]
            
            # Get the category name
            category_names = list(self.knowledge_base.keys())
            predicted_category = category_names[predicted_class]
            
            # Log the prediction details
            print(f"Message: {message}")
            print(f"Predicted category: {predicted_category}")
            print(f"Confidence: {confidence:.2f}")
            
            # If confidence is below threshold, return default response
            if confidence < self.confidence_threshold:
                print("Confidence below threshold, returning default response")
                # Try to find a matching pattern in the knowledge base
                for category, data in self.knowledge_base.items():
                    for pattern in data["patterns"]:
                        if pattern.lower() in message.lower():
                            response = np.random.choice(data["responses"])
                            self.data_manager.save_interaction(
                                message, 
                                response,
                                {"confidence": float(confidence), "category": category, "matched_pattern": pattern}
                            )
                            return response
                
                # If no pattern matches, return default response
                response = "죄송합니다. 정확히 이해하지 못했어요. 다시 말씀해 주시겠어요?", "원하시는 업무가 무엇인지 조금 더 자세히 알려주세요."
            else:
                # Get a random response from the predicted category
                responses = self.knowledge_base[predicted_category]["responses"]
                response = np.random.choice(responses)
            
            # Save the interaction with confidence score
            self.data_manager.save_interaction(
                message, 
                response,
                {"confidence": float(confidence), "category": predicted_category}
            )
            
            return response
            
        except Exception as e:
            print(f"Error in get_response: {str(e)}")
            self.data_manager.log_error("get_response", str(e), {"message": message})
            return "I'm having trouble processing your request. Please try again later."

    def learn_from_interaction(self, question, response, feedback):
        """Method to allow the chatbot to learn from new interactions"""
        try:
            # Save the interaction with feedback
            self.data_manager.save_interaction(question, response, feedback)
            
            # If feedback is positive, we can add the question to the training data
            if feedback == "positive":
                # Find the category of the response
                for category, data in self.knowledge_base.items():
                    if response in data["responses"]:
                        # Add the question as a new pattern
                        data["patterns"].append(question)
                        # Save the updated knowledge base
                        self.data_manager.save_knowledge_base(self.knowledge_base)
                        # Retrain the model with the new data
                        self._train_model()
                        break
        except Exception as e:
            print(f"Error in learn_from_interaction: {str(e)}")

    def export_training_data(self, format="json"):
        """Export the training data in the specified format"""
        return self.data_manager.export_training_data(format)

    def get_interaction_history(self, limit=None):
        """Get the interaction history"""
        return self.data_manager.get_interaction_history(limit) 