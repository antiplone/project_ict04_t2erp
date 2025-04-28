import AppConfig from "#config/AppConfig.json";
import React, { useEffect, useState } from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import { SelectPicker, Button, Input } from "rsuite";
import "../styles/chat.css";

const ChatRoom = () => {

  // 선택한 채팅 상대
  const [selectedPartner, setSelectedPartner] = useState(null);

  // STOMP 클라이언트 => WebSocket을 통해 메시지를 주고받는 전체 과정(WebSocket 연결 생성, 연결 성공/실패 감지, 메시지 수신 구독, 메시지 전송, 연결끊기)
  const [stompClient, setStompClient] = useState(null);

  // 채팅 메시지 목록
  const [messages, setMessages] = useState([]);

  // 입력 중인 채팅
  const [input, setInput] = useState("");

  // 연결 상태
  const [isConnected, setIsConnected] = useState(false);

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
  const generateRoomId = (id1, id2) => [id1, id2].sort().join("_");  // sort()를 사용해서 두 사용자의 순서 상관없이 동일한 room_id 생성되도록 함.
  const room_id = generateRoomId(senderId, receiverId);

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

  // 채팅방에 입장하면 webSocket 연결 및 채팅 수신
  useEffect(() => {
    if (!selectedPartner || !senderId || !receiverId) return;  // 채팅 상대 선택 안하거나 로그인된 사용자 정보 없으면 종료

    const socket = new SockJS(`${fetchURL.protocol}${fetchURL.url}/ws`); // SockJS 브라우저가 WebSocket을 지원하지 않을 때 대체 프로토콜로 fallback 지원
    const client = new Client({  // STOMP 클라이언트 => WebSocket을 이용해 메시지를 송수신할 수 있도록 도와주는 객체
      webSocketFactory: () => socket,
      // 연결 성공하면
      onConnect: async () => {
        setIsConnected(true); // 연결상태 true 설정
        setStompClient(client); // 전역에서 사용할 수 있도록 stompClient를 상태에 저장

        try {
          // 과거 채팅 내역 조회
          const res = await fetch(`${fetchURL.protocol}${fetchURL.url}/buy/chat/history/${room_id}`);
          const data = await res.json();
          const mapped = data.map(msg => ({
            ...msg,
            sender: msg.sender === senderId ? senderName : receiverName // 현재 로그인한 유저가 보낸 메시지면 senderName, 아니면 상대방 이름으로 표시
          }));
          setMessages(mapped);

          // 실시간 메시지 수신 설정(구독)
          client.subscribe(`/topic/chat/${room_id}`, (message) => {
            const msg = JSON.parse(message.body);

            setMessages(prev => [ // 새로 받은 메시지를 기존 메시지 리스트에 추가
              ...prev,
              {
                ...msg,
                sender: msg.sender === senderId ? senderName : msg.sender,
                created_at: msg.created_at, 
              }
            ]);
          });

        } catch (err) {
          console.error("채팅 내역 불러오기 실패:", err);
        }
      },
    });

    // WebSocket 연결 활성화 및 정리
    client.activate();  // activate() -> WebSocket 연결 시작
    return () => client.deactivate(); // deactivate() -> WebSocket 연결 정리
  }, [room_id]);

  // 메시지 보내기
  const sendMessage = () => {
    if (!input || !stompClient || !isConnected) return;
    
    const createdAt = new Date().toLocaleString("sv-SE", { timeZone: "Asia/Seoul" }).replace(" ", "T");

    const msg = {
      sender: senderId,
      receiver: receiverId,
      content: input,
      type: "CHAT",
      created_at: createdAt,  // 변수 사용 시에는 명시적으로 할당
      room_id,
    };

    // 서버로 메시지 전송
    stompClient.publish({
      destination: `/app/chat/${room_id}`, // destination: STOMP 서버에서 처리할 경로
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

      {/* 상대방이 선택된 경우에만 채팅창과 입력창을 보여줌 */}
      {selectedPartner && (
        <>
          <div className="chatBox">
            {(() => {
              let lastDate = "";

              return messages.map((msg, idx) => {
                const isMe = msg.sender === senderName; // 보낸 사람 기준으로 메시지 스타일 다르게 설정

                // 날짜 유효성 검사
                if (!msg.created_at || isNaN(new Date(msg.created_at))) {
                  return null;
                }

                // 기존 msg.created_at은 이미 'KST 기준'이므로 추가 보정 없이 바로 Date로 사용
                const krDate = new Date(msg.created_at);

                const dateOnly = krDate.toLocaleDateString("sv-SE", {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                }); // ex) "2025-04-25"

                const displayDate = krDate.toLocaleDateString("ko-KR", {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                  weekday: "short",
                }); // ex) "2025. 04. 25. (금)"

                // 날짜 구분선 (이전 메시지와 날짜가 다르면 날짜 표시)
                const showDateLine = lastDate !== dateOnly;
                lastDate = dateOnly;

                return (
                  <React.Fragment key={idx}>
                    {showDateLine && (
                      <div className="dateLine"> {displayDate}</div>
                    )}

                    <div className={`chat-row ${isMe ? "right" : "left"}`}>  {/* 내 메시지는 오른쪽 정렬 */}
                      <div className={`chat-bubble ${isMe ? "mine" : "partner"}`}> {/* 상대 메시지는 왼쪽 정렬 */}
                        
                          <>
                            <div className="chatSender">{msg.sender}</div>
                            <div>{msg.content}</div>
                            <div className="createAT">
                              {new Date(msg.created_at).toLocaleTimeString("ko-KR", {
                                hour: "numeric",
                                minute: "2-digit", 
                                hour12: true,
                              })}
                            </div>
                          </>
                      </div>
                    </div>
                  </React.Fragment>
                );
              });
            })()}
          </div>
          
          {/* 메시지 입력창 */}
          <div className="inputChatBox">
            <Input
              value={input}
              onChange={setInput}
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
