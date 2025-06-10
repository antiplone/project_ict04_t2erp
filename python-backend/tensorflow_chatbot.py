import tensorflow as tf
import gc
gc.collect()
from tensorflow.keras.utils import to_categorical
from transformers import TFAutoModelForSequenceClassification, AutoTokenizer
import numpy as np
import json
import os
from data_manager import DataManager

class TensorFlowChatbot:
    def __init__(self):
        # data_manager 초기화
        self.data_manager = DataManager()
        
        # model_name과 tokenizer 초기화
        self.model_name = "distilbert-base-uncased"
        self.tokenizer = AutoTokenizer.from_pretrained(self.model_name)
        
        # knowledge base 불러오기 또는 생성
        self.knowledge_base = self._load_knowledge_base()

        # knowledge base 기반으로 클래스 수 설정
        num_classes = len(self.knowledge_base)
        
        # 올바른 라벨 수로 model 초기화
        self.model = TFAutoModelForSequenceClassification.from_pretrained(self.model_name, num_labels=num_classes)
        
        # 신뢰도 임계값 설정
        self.confidence_threshold = 0.5
        
        # 기존 모델 가중치 불러오기(가능할 경우)
        self.data_manager.load_model_weights(self.model)
        
        # 가중치가 없으면 모델 학습 수행
        if not os.path.exists(self.data_manager.model_weights_path):
            self._train_model()

    def _load_knowledge_base(self):
        # 기존 knowledge base 불러오기 시도
        existing_kb = self.data_manager.load_knowledge_base()
        if existing_kb:
            return existing_kb
            
        # knowledge base가 없으면 기본 knowledge base 생성
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
            # 다른 카테고리들..
        }
        
        # default knowledge base  저장
        self.data_manager.save_knowledge_base(default_kb)
        return default_kb

    def _train_model(self):
        # 학습 데이터 준비
        all_texts = []
        all_labels = []

        # 지식 베이스의 고유 카테고리 수 가져오기
        num_classes = len(self.knowledge_base)

        for idx, (category, data) in enumerate(self.knowledge_base.items()):
            for pattern in data["patterns"]:
                all_texts.append(pattern)
                all_labels.append(idx)

        # 학습 데이터 저장
        self.data_manager.save_training_data(all_texts, all_labels)

        # 학습 데이터 토크나이즈
        encoded_inputs = self.tokenizer(all_texts, padding=True, truncation=True, return_tensors="tf")

        # 레이블을 원-핫 인코딩으로 변환
        labels = to_categorical(all_labels, num_classes=num_classes)

        # 모델 컴파일 및 학습
        self.model.compile(
            optimizer=tf.keras.optimizers.Adam(learning_rate=2e-5),
            loss=tf.keras.losses.CategoricalCrossentropy(),
            metrics=['accuracy']
        )

        # 모델 학습 수행
        self.model.fit(
            dict(encoded_inputs),
            labels,
            epochs=3,
            batch_size=8
        )

        # 모델 가중치 저장
        self.data_manager.save_model_weights(self.model)

    def get_response(self, message):
        try:
            # 입력 메시지 토크나이즈
            encoded_input = self.tokenizer(message, padding=True, truncation=True, return_tensors="tf")
            
            # model 예측 수행
            predictions = self.model.predict(dict(encoded_input))
            probabilities = tf.nn.softmax(predictions.logits).numpy()[0]
            
            # predicted_class와 confidence 가져오기
            predicted_class = np.argmax(probabilities)
            confidence = probabilities[predicted_class]
            
            # category_names 가져오기
            category_names = list(self.knowledge_base.keys())
            predicted_category = category_names[predicted_class]
            
            # 예측 정보 출력
            print(f"Message: {message}")
            print(f"Predicted category: {predicted_category}")
            print(f"Confidence: {confidence:.2f}")
            
            # confidence가 confidence_threshold보다 낮으면 기본 응답 반환
            if confidence < self.confidence_threshold:
                print("신뢰도 임계값 미만, 기본 응답 반환")
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
                
                # 매칭되는 패턴이 없으면 기본 응답 반환
                response = "죄송합니다. 정확히 이해하지 못했어요. 다시 말씀해 주시겠어요?", "원하시는 업무가 무엇인지 조금 더 자세히 알려주세요."
            else:
                # 예측된 카테고리에서 랜덤 응답 선택
                responses = self.knowledge_base[predicted_category]["responses"]
                response = np.random.choice(responses)
            
            # confidence 점수와 함께 interaction 저장
            self.data_manager.save_interaction(
                message, 
                response,
                {"confidence": float(confidence), "category": predicted_category}
            )
            
            return response
            
        except Exception as e:
            print(f"get_response 에러 발생: {str(e)}")
            self.data_manager.log_error("get_response", str(e), {"message": message})
            return "요청을 처리하는 데 문제가 발생했습니다. 잠시 후 다시 시도해 주세요."

    def learn_from_interaction(self, question, response, feedback):
        """챗봇이 새로운 interactions으로부터 학습할 수 있도록 하는 메서드"""
        try:
            # 피드백과 함께 interaction 저장
            self.data_manager.save_interaction(question, response, feedback)
            
            # 피드백이 긍정적일 경우 질문을 학습 데이터에 추가
            if feedback == "positive":
                # responses가 속한 category 찾기
                for category, data in self.knowledge_base.items():
                    if response in data["responses"]:
                        # 질문을 새로운 패턴으로 추가
                        data["patterns"].append(question)
                        # 업데이트된 knowledge base 저장
                        self.data_manager.save_knowledge_base(self.knowledge_base)
                        # R새로운 데이터로 모델 재학습
                        self._train_model()
                        break
        except Exception as e:
            print(f"Error in learn_from_interaction: {str(e)}")

    def export_training_data(self, format="json"):
        """json 형식으로 training_data를 export함"""
        return self.data_manager.export_training_data(format)

    def get_interaction_history(self, limit=None):
        """interaction_history의 데이터를 지정한 개수(limit)만큼 가져옵니다"""
        return self.data_manager.get_interaction_history(limit)
