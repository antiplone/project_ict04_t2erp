import AppConfig from "#config/AppConfig.json";
import React, { useEffect, useState } from 'react';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

const ChatRoom = () => {
  const [stompClient, setStompClient] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isConnected, setIsConnected] = useState(false);

  const fetchURL = AppConfig.fetch['mytest'];
  const sender = "user"; // 실제 사용자 정보와 연결 가능  

  useEffect(() => {
    const socket = new SockJS(`${fetchURL.protocol}${fetchURL.url}/ws`);
    const client = new Client({
      webSocketFactory: () => socket,
      onConnect: () => {
        setIsConnected(true);  // 연결 완료 표시
        setStompClient(client); // 연결 완료 후에만 STOMP 저장

        // 입장 알림 전송
        client.publish({
          destination: "/app/chat.sendMessage",
          body: JSON.stringify({
            sender: "sender",  // 실제 사용자 이름으로 교체 가능
            type: "JOIN", // JOIN인 메시지를 서버로 먼저 보내서 입장했습니다 알림을 브로드캐스트하고, 다음에 client.subscribe()로 메시지 수신 시작
            content: `${sender}님이 입장하셨습니다.`,
          }),
        });

        // 메시지 수신 구독
        client.subscribe('/topic/public', (message) => {
          const msg = JSON.parse(message.body);
          setMessages((prev) => [...prev, msg]);
        });
      }
    });

    client.activate();

    return () => client.deactivate();
  }, []);

  // 메시지 보내기
  const sendMessage = () => {
    if (!stompClient || !isConnected) {
      alert("채팅 서버에 아직 연결되지 않았습니다!");
      return;
    }
  
    if (input) {
      const msg = { sender: "user", content: input, type: "CHAT" };
      stompClient.publish({
        destination: "/app/chat.sendMessage",
        body: JSON.stringify(msg)
      });
      setInput("");
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: "0 auto" }}>
      <div style={{ height: 300, overflowY: "scroll", border: "1px solid #ccc", padding: 10, marginBottom: 10 }}>
        {messages.map((msg, idx) => (
          <div key={idx}>
            {msg.type === "JOIN" ? (
              <span style={{ color: "gray" }}>{msg.content}</span>
            ) : (
              <span><strong>{msg.sender}</strong>: {msg.content}</span>
            )}
          </div>
        ))}
      </div>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        style={{ width: "80%", marginRight: 8 }}
      />
      <button onClick={sendMessage} disabled={!isConnected}>보내기</button>
    </div>
  );
};

export default ChatRoom;
