import json
import os        # 운영 체제와 상호작용할 수 있는 모듈입니다. 경로 설정, 디렉토리 존재 확인, 파일 목록 가져오기 등에 활용됩니다.
import numpy as np
import tensorflow as tf
from datetime import datetime

class DataManager:
    def __init__(self, data_dir="chatbot_data"):
        self.data_dir = data_dir
        self._ensure_data_directory()

        # 파일 경로 설정
        self.knowledge_base_path = os.path.join(data_dir, "knowledge_base.json")
        self.model_weights_path = os.path.join(data_dir, "model_weights.h5")
        self.training_data_path = os.path.join(data_dir, "training_data.json")
        self.interaction_history_path = os.path.join(data_dir, "interaction_history.json")
        self.error_log_path = os.path.join(data_dir, "error_log.json")

        # 데이터 구조 초기화
        self.interaction_history = self._load_interaction_history()
        self.training_data = self._load_training_data()
        self.error_log = self._load_error_log()

    def _ensure_data_directory(self):
        """데이터 저장용 디렉토리를 생성합니다 (없으면 생성)."""
        if not os.path.exists(self.data_dir):
            os.makedirs(self.data_dir)

    def _load_error_log(self):
        """오류 로그 파일을 불러옵니다."""
        if os.path.exists(self.error_log_path):
            with open(self.error_log_path, 'r', encoding='utf-8') as f:
                return json.load(f)
        return []

    def log_error(self, error_type, message, details):
        """오류 정보를 로그에 기록합니다."""
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
        """knowledge base를  JSON file로 저장합니다."""
        try:
            with open(self.knowledge_base_path, 'w', encoding='utf-8') as f:
                json.dump(knowledge_base, f, ensure_ascii=False, indent=2)
        except Exception as e:
            self.log_error("save_knowledge_base", str(e), {"knowledge_base": knowledge_base})

    def load_knowledge_base(self):
        """JSON 파일에서 knowledge base를 불러옵니다."""
        try:
            if os.path.exists(self.knowledge_base_path):
                with open(self.knowledge_base_path, 'r', encoding='utf-8') as f:
                    return json.load(f)
            return None
        except Exception as e:
            self.log_error("load_knowledge_base", str(e), {})
            return None

    def save_model_weights(self, model):
        """모델 가중치를 파일로 저장합니다."""
        try:
            model.save_weights(self.model_weights_path)
        except Exception as e:
            self.log_error("save_model_weights", str(e), {})

    def load_model_weights(self, model):
        """저장된 모델 가중치를 불러옵니다."""
        try:
            if os.path.exists(self.model_weights_path):
                model.load_weights(self.model_weights_path)
        except Exception as e:
            self.log_error("load_model_weights", str(e), {})

    def _load_training_data(self):
        """학습 데이터를 파일에서 불러옵니다."""
        try:
            if os.path.exists(self.training_data_path):
                with open(self.training_data_path, 'r', encoding='utf-8') as f:
                    return json.load(f)
            return {"texts": [], "labels": []}
        except Exception as e:
            self.log_error("load_training_data", str(e), {})
            return {"texts": [], "labels": []}

    def save_training_data(self, texts, labels):
        """학습 데이터를 파일에 저장합니다."""
        try:
            self.training_data["texts"].extend(texts)
            self.training_data["labels"].extend(labels)

            with open(self.training_data_path, 'w', encoding='utf-8') as f:
                json.dump(self.training_data, f, ensure_ascii=False, indent=2)
        except Exception as e:
            self.log_error("save_training_data", str(e), {"texts": texts, "labels": labels})

    def _load_interaction_history(self):
        """대화 기록을 파일에서 불러옵니다."""
        try:
            if os.path.exists(self.interaction_history_path):
                with open(self.interaction_history_path, 'r', encoding='utf-8') as f:
                    return json.load(f)
            return []
        except Exception as e:
            self.log_error("load_interaction_history", str(e), {})
            return []

    def save_interaction(self, question, response, metadata=None):
        """대화(질문/응답/부가정보)를 기록에 저장합니다."""
        try:
            interaction = {
                "timestamp": datetime.now().isoformat(),
                "question": question,
                "response": response,
                "metadata": metadata
            }
            
            self.interaction_history.append(interaction)
            
            # 파일로 저장
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
        """json tyoe으로 학습 데이터를 내보냅니다."""
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
                raise ValueError(f"지원하지 않는 형식입니다:  {format}")
        except Exception as e:
            self.log_error("export_training_data", str(e), {"format": format})
            return None 
