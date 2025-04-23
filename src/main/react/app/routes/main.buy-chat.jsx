import AppConfig from "#config/AppConfig.json";
import React, { useEffect, useState } from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import { SelectPicker, Button, Input } from "rsuite";
import "../styles/chat.css";

const ChatRoom = () => {

  // 선택한 채팅 상대
  const [selectedPartner, setSelectedPartner] = useState(null);

  // STOMP 클라이언트
  const [stompClient, setStompClient] = useState(null);

  // 채팅 메시지 목록
  const [messages, setMessages] = useState([]);

  // 입력 중인 채팅
  const [input, setInput] = useState("");

  // 연결 상태
  const [isConnected, setIsConnected] = useState(false);

  // 입장 메시지 여부
  const [hasJoined, setHasJoined] = useState(false);

  // 채팅 상대 선택시 - 직원 목록 
  const [partners, setPartners] = useState([]);

  // 기존 유저 정보 (보내는 사람)
  const senderId = localStorage.getItem("e_auth_id");
  const senderName = localStorage.getItem("e_name") || "익명";
  // 기존 유저 정보 (받는 사람)
  const receiverId = selectedPartner?.e_auth_id;
  const receiverName = selectedPartner?.username;

  const fetchURL = AppConfig.fetch["mytest"];

  // 채팅방 ID 생성 => user1 + user2의 e_auth_id를 조합하여 생성
  const generateRoomId = (id1, id2) => [id1, id2].sort().join("_");
  const room_id = generateRoomId(senderId, receiverId);

  // mysql이 한국시간 기준이 아니라서 한국 시간 기준으로 포맷
  const formatTime = (datetimeStr) => {
    if (!datetimeStr) return "";

    try {
      const utc = new Date(datetimeStr.endsWith("Z") ? datetimeStr : datetimeStr + "Z");
      if (isNaN(utc.getTime())) return "";

      const kr = new Date(utc.getTime() + 7 * 60 * 60 * 1000);
      const h = kr.getHours();
      const m = kr.getMinutes().toString().padStart(2, "0");
      const ampm = h >= 12 ? "오후" : "오전";
      const hour = h % 12 === 0 ? 12 : h % 12;
      return `${ampm} ${hour}:${m}`;
    } catch {
      return "";
    }
  };

  // 채팅 상대 선택시 지원 목록 불러오기
  useEffect(() => {
    const fetchPartners = async () => {
      try {
        const res = await fetch(`${fetchURL.protocol}${fetchURL.url}/buy/chatEmployeeList`);
        const data = await res.json();
        setPartners(data.map(emp => ({
          e_auth_id: emp.e_auth_id,
          username: emp.e_name
        })));
      } catch (err) {
        console.error("직원 목록 불러오기 실패:", err);
      }
    };
    fetchPartners();
  }, []);

  // webSocket 연결 및 채팅 수신
  useEffect(() => {
    if (!selectedPartner || !senderId || !receiverId) return;  // 채팅 상대 선택 안하면 종료

    const socket = new SockJS(`${fetchURL.protocol}${fetchURL.url}/ws`);
    const client = new Client({
      webSocketFactory: () => socket,
      onConnect: async () => {
        setIsConnected(true);
        setStompClient(client);

        try {
          const res = await fetch(`${fetchURL.protocol}${fetchURL.url}/buy/chat/history/${room_id}`);
          const data = await res.json();
          const mapped = data.map(msg => ({
            ...msg,
            sender: msg.sender === senderId ? senderName : receiverName
          }));
          setMessages(mapped);

          if (!hasJoined && data.length === 0) {
            client.publish({
              destination: `/app/chat/${room_id}`,
              body: JSON.stringify({
                sender: senderId,
                content: `${senderName}님이 입장하셨습니다.`,
                type: "JOIN",
                room_id,
              }),
            });
            setHasJoined(true);
          }

          client.subscribe(`/topic/chat/${room_id}`, (message) => {
            const msg = JSON.parse(message.body);

            // created_at이 없으면 지금 시간으로 대체
            const rawTime = msg.created_at || new Date().toISOString();

            // UTC → 한국 시간으로 변환
            const utcDate = new Date(rawTime.endsWith("Z") ? rawTime : rawTime + "Z");
            const krDate = new Date(utcDate.getTime() + 7 * 60 * 60 * 1000);

            setMessages(prev => [
              ...prev,
              {
                ...msg,
                sender: msg.sender === senderId ? senderName : msg.sender,
                created_at: krDate.toISOString(), // 변환된 값 저장
              }
            ]);
          });

        } catch (err) {
          console.error("채팅 내역 불러오기 실패:", err);
        }
      },
    });

    client.activate();
    return () => client.deactivate();
  }, [room_id]);

  // 메시지 보내기
  const sendMessage = () => {
    if (!input || !stompClient || !isConnected) return;

    const msg = {
      sender: senderId,
      receiver: receiverId,
      content: input,
      type: "CHAT",
      room_id,
    };

    // 전송
    stompClient.publish({
      destination: `/app/chat/${room_id}`,
      body: JSON.stringify(msg),
    });
    setInput("");
  };

  return (
    <div className="chatContainer">
      <h3>1:1 채팅</h3>

      <div className="partnerSelectBox">
        <label className="partnerSelectLable">상대방 선택</label>
        <SelectPicker
          data={partners.map(p => ({ label: p.username, value: p.e_auth_id }))}
          placeholder="상대방을 선택하세요"
          block
          searchable={false}
          onChange={(value) => {
            const selected = partners.find(p => p.e_auth_id === value);
            setSelectedPartner(selected);
          }}
        />
      </div>

      {selectedPartner && (
        <>
          <div className="chatBox">
            {(() => {
              let lastDate = "";

              return messages.map((msg, idx) => {
                const isMe = msg.sender === senderName;

                // 날짜 유효성 검사
                if (!msg.created_at || isNaN(new Date(msg.created_at))) {
                  return null;
                }

                // 날짜 처리 안전하게
                let krDate;
                try {
                  const utcDate = new Date(msg.created_at.endsWith("Z") ? msg.created_at : msg.created_at + "Z");
                  krDate = new Date(utcDate.getTime() + 7 * 60 * 60 * 1000);
                } catch (e) {
                  return null; // 에러 나면 해당 메시지는 렌더링 X
                }
                const dateOnly = krDate.toISOString().split("T")[0];

                const displayDate = krDate.toLocaleDateString("ko-KR", {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                  weekday: "short",
                });

                const showDateLine = lastDate !== dateOnly;
                lastDate = dateOnly;

                return (
                  <React.Fragment key={idx}>
                    {showDateLine && (
                      <div className="dateLine"> {displayDate}</div>
                    )}

                    <div className={`chat-row ${isMe ? "right" : "left"}`}>
                      <div className={`chat-bubble ${isMe ? "mine" : "partner"}`}>
                        {msg.type !== "JOIN" ? (
                          <>
                            <div className="chatSender">{msg.sender}</div>
                            <div>{msg.content}</div>
                            <div className="createAT">
                              {formatTime(msg.created_at)}
                            </div>
                          </>
                        ) : (
                          <div className="content">💡 {msg.content}</div>
                        )}
                      </div>
                    </div>
                  </React.Fragment>
                );
              });
            })()}
          </div>

          <div className="inputBox">
            <Input
              value={input}
              onChange={setInput}
              className="input"
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
