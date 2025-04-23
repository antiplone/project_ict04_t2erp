import AppConfig from "#config/AppConfig.json";
import React, { useEffect, useState } from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import { SelectPicker, Button, Input } from "rsuite";

const ChatRoom = () => {
  const [selectedPartner, setSelectedPartner] = useState(null);
  const [stompClient, setStompClient] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [hasJoined, setHasJoined] = useState(false);

  const senderId = localStorage.getItem("e_auth_id");
  const senderName = localStorage.getItem("e_name") || "익명";
  const receiverId = selectedPartner?.e_auth_id;
  const fetchURL = AppConfig.fetch["mytest"];

  const generateRoomId = (id1, id2) => [id1, id2].sort().join("_");
  const room_id = generateRoomId(senderId, receiverId);

  const formatTime = (datetime) => {
    if (!datetime) return "";
    const date = new Date(datetime.replace(" ", "T"));
    if (isNaN(date.getTime())) return "";
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? "오후" : "오전";
    const displayHour = hours % 12 === 0 ? 12 : hours % 12;
    const displayMinute = minutes.toString().padStart(2, "0");
    return `${ampm} ${displayHour}:${displayMinute}`;
  };

  useEffect(() => {
    if (!selectedPartner || !senderId) return;

    const room_id_local = generateRoomId(senderId, selectedPartner.e_auth_id);
    const socket = new SockJS(`${fetchURL.protocol}${fetchURL.url}/ws`);
    const client = new Client({
      webSocketFactory: () => socket,
      onConnect: async () => {
        setIsConnected(true);
        setStompClient(client);

        try {
          const res = await fetch(`${fetchURL.protocol}${fetchURL.url}/buy/chat/history/${room_id_local}`);
          const data = await res.json();
          setMessages(data);

          if (!hasJoined && data.length === 0) {
            client.publish({
              destination: `/app/chat/${room_id_local}`,
              body: JSON.stringify({
                sender: senderId,
                content: `${senderName}님이 입장하셨습니다.`,
                type: "JOIN",
                room_id: room_id_local,
              }),
            });
            setHasJoined(true);
          }

          client.subscribe(`/topic/chat/${room_id_local}`, (message) => {
            const msg = JSON.parse(message.body);
            const senderLabel = msg.sender === selectedPartner?.e_auth_id ? selectedPartner.username : senderName;
            setMessages((prev) => [...prev, { ...msg, sender: senderLabel }]);
          });
        } catch (err) {
          console.error("채팅 내역 불러오기 실패:", err);
        }
      },
    });

    client.activate();
    return () => client.deactivate();
  }, [room_id]);

  const sendMessage = () => {
    if (!input || !stompClient || !isConnected) return;

    const msg = {
      sender: senderId,
      receiver: receiverId,
      content: input,
      type: "CHAT",
      room_id,
    };

    stompClient.publish({
      destination: `/app/chat/${room_id}`,
      body: JSON.stringify(msg),
    });

    setInput("");
  };

  const partners = [
    { e_auth_id: "D0050001-25", username: "송재훈" },
    { e_auth_id: "D0030002-25", username: "최강현" },
  ];

  return (
    <div style={{ maxWidth: 600, margin: "0 auto" }}>
      <h3>채팅</h3>

      <div style={{ background: "#f9f9f9", borderRadius: 10, padding: 20 }}>
        <label style={{ display: "block", marginBottom: 8 }}>상대방 선택</label>
        <SelectPicker
          data={partners.map((p) => ({ label: p.username, value: p.e_auth_id }))}
          placeholder="상대방을 선택하세요"
          block
          searchable={false}
          onChange={(value) => {
            const selected = partners.find((p) => p.e_auth_id === value);
            setSelectedPartner(selected);
          }}
        />
      </div>

      {selectedPartner && (
        <>
          <div
            style={{
              height: "calc(100vh - 320px)",
              overflowY: "auto",
              backgroundColor: "#f7f8fa",
              padding: "10px 16px",
              margin: "20px 0",
              borderRadius: 10,
              boxShadow: "inset 0 0 6px rgba(0,0,0,0.05)",
            }}
          >
            {messages.map((msg, idx) => {
              const isMe = msg.sender === senderName || msg.sender === senderId;
              return (
                <div
                  key={idx}
                  style={{
                    display: "flex",
                    justifyContent: isMe ? "flex-end" : "flex-start",
                    marginBottom: 10,
                  }}
                >
                  <div
                    style={{
                      backgroundColor: isMe ? "#4a90e2" : "#e0e0e0",
                      color: isMe ? "#fff" : "#333",
                      padding: "10px 14px",
                      borderRadius: 16,
                      maxWidth: "70%",
                      wordBreak: "break-word",
                      boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                    }}
                  >
                    {msg.type !== "JOIN" ? (
                      <>
                        <div style={{ fontWeight: 500, marginBottom: 6 }}>{msg.sender}</div>
                        <div>{msg.content}</div>
                        <div style={{ fontSize: 12, marginTop: 6, textAlign: "right", opacity: 0.6 }}>
                          {formatTime(msg.created_at)}
                        </div>
                      </>
                    ) : (
                      <div style={{ fontStyle: "italic", opacity: 0.6 }}>
                        💡 {msg.content}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ display: "flex" }}>
            <Input
              placeholder=""
              value={input}
              onChange={(value) => setInput(value)}
              style={{ width: "80%", marginRight: 8 }}
            />
            <Button appearance="ghost" onClick={sendMessage} disabled={!isConnected}>
              보내기
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default ChatRoom;
