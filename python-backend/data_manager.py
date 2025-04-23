import json
import os
import numpy as np
import tensorflow as tf
from datetime import datetime

class DataManager:
    def __init__(self, data_dir="chatbot_data"):
        self.data_dir = data_dir
        self._ensure_data_directory()

        # File paths
        self.knowledge_base_path = os.path.join(data_dir, "knowledge_base.json")
        self.model_weights_path = os.path.join(data_dir, "model_weights.h5")
        self.training_data_path = os.path.join(data_dir, "training_data.json")
        self.interaction_history_path = os.path.join(data_dir, "interaction_history.json")
        self.error_log_path = os.path.join(data_dir, "error_log.json")

        # Initialize data structures
        self.interaction_history = self._load_interaction_history()
        self.training_data = self._load_training_data()
        self.error_log = self._load_error_log()

    def _ensure_data_directory(self):
        """Create data directory if it doesn't exist"""
        if not os.path.exists(self.data_dir):
            os.makedirs(self.data_dir)

    def _load_error_log(self):
        """Load error log from file"""
        if os.path.exists(self.error_log_path):
            with open(self.error_log_path, 'r', encoding='utf-8') as f:
                return json.load(f)
        return []

    def log_error(self, error_type, message, details):
        """Log an error to the error log"""
        error_entry = {
            "timestamp": datetime.now().isoformat(),
            "type": error_type,
            "message": message,
            "details": details
        }
        self.error_log.append(error_entry)

        # Save to file
        with open(self.error_log_path, 'w', encoding='utf-8') as f:
            json.dump(self.error_log, f, ensure_ascii=False, indent=2)

    def save_knowledge_base(self, knowledge_base):
        """Save the knowledge base to a JSON file"""
        try:
            with open(self.knowledge_base_path, 'w', encoding='utf-8') as f:
                json.dump(knowledge_base, f, ensure_ascii=False, indent=2)
        except Exception as e:
            self.log_error("save_knowledge_base", str(e), {"knowledge_base": knowledge_base})

    def load_knowledge_base(self):
        """Load the knowledge base from a JSON file"""
        try:
            if os.path.exists(self.knowledge_base_path):
                with open(self.knowledge_base_path, 'r', encoding='utf-8') as f:
                    return json.load(f)
            return None
        except Exception as e:
            self.log_error("load_knowledge_base", str(e), {})
            return None

    def save_model_weights(self, model):
        """Save the model weights"""
        try:
            model.save_weights(self.model_weights_path)
        except Exception as e:
            self.log_error("save_model_weights", str(e), {})

    def load_model_weights(self, model):
        """Load the model weights"""
        try:
            if os.path.exists(self.model_weights_path):
                model.load_weights(self.model_weights_path)
        except Exception as e:
            self.log_error("load_model_weights", str(e), {})

    def _load_training_data(self):
        """Load training data from file"""
        try:
            if os.path.exists(self.training_data_path):
                with open(self.training_data_path, 'r', encoding='utf-8') as f:
                    return json.load(f)
            return {"texts": [], "labels": []}
        except Exception as e:
            self.log_error("load_training_data", str(e), {})
            return {"texts": [], "labels": []}

    def save_training_data(self, texts, labels):
        """Save training data to file"""
        try:
            self.training_data["texts"].extend(texts)
            self.training_data["labels"].extend(labels)

            with open(self.training_data_path, 'w', encoding='utf-8') as f:
                json.dump(self.training_data, f, ensure_ascii=False, indent=2)
        except Exception as e:
            self.log_error("save_training_data", str(e), {"texts": texts, "labels": labels})

    def _load_interaction_history(self):
        """Load interaction history from file"""
        try:
            if os.path.exists(self.interaction_history_path):
                with open(self.interaction_history_path, 'r', encoding='utf-8') as f:
                    return json.load(f)
            return []
        except Exception as e:
            self.log_error("load_interaction_history", str(e), {})
            return []

    def save_interaction(self, question, response, metadata=None):
        """Save a new interaction to history"""
        try:
            interaction = {
                "timestamp": datetime.now().isoformat(),
                "question": question,
                "response": response,
                "metadata": metadata
            }
            
            self.interaction_history.append(interaction)
            
            # Save to file
            with open(self.interaction_history_path, 'w', encoding='utf-8') as f:
                json.dump(self.interaction_history, f, ensure_ascii=False, indent=2)
        except Exception as e:
            self.log_error("save_interaction", str(e), {
                "question": question,
                "response": response,
                "metadata": metadata
            })

    def get_interaction_history(self, limit=None):
        """Get interaction history with optional limit"""
        try:
            if limit:
                return self.interaction_history[-limit:]
            return self.interaction_history
        except Exception as e:
            self.log_error("get_interaction_history", str(e), {"limit": limit})
            return []

    def export_training_data(self, format="json"):
        """Export training data in specified format"""
        try:
            if format == "json":
                return json.dumps(self.training_data, ensure_ascii=False, indent=2)
            elif format == "csv":
                import csv
                output = []
                for text, label in zip(self.training_data["texts"], self.training_data["labels"]):
                    output.append([text, label])
                return output
            else:
                raise ValueError(f"Unsupported format: {format}")
        except Exception as e:
            self.log_error("export_training_data", str(e), {"format": format})
            return None 
