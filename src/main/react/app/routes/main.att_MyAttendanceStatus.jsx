/* eslint-disable react/prop-types */
/* eslint-disable react/react-in-jsx-scope */
import React from 'react';
import AppConfig from "#config/AppConfig.json";
import { Button } from 'rsuite';
import { useEffect, useState } from "react";
import { useNavigate } from '@remix-run/react';

export function meta() {
  return [
      { title: `${AppConfig.meta.title} : 근태관리` },
      { name: "description", content: "근태관리 페이지" },
  ];
};

export default function MyAttendanceStatus() {
  const fetchURL = AppConfig.fetch['mytest'];
  const navigate = useNavigate();
  const [commuteRe, setCommuteRe] = useState(null);   // 근태 상태관리

  const user = JSON.parse(localStorage.getItem("user"));

  // 초기로 한 번 실행
  useEffect(() => {
    if (!user || !user.e_id) {
      alert("로그인 정보가 없습니다.");
      navigate("/main");
      return;  // 🚨 null이면 요청 안보냄
    }
    fetchTodayCommute();
  }, []);

  
  // 출근 버튼
  const startTime = () => {
    fetch(`${fetchURL.protocol}${fetchURL.url}/attendance/startTime`, {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        e_id: user.e_id,
        e_name: user.e_name
      }),
    })
    .then(res => res.text())
    .then(msg => {
      alert(msg);
      fetchTodayCommute(); // ⭐ 다시 조회
    });
  };

  // 퇴근 버튼
  const endTime = () => {
    fetch(`${fetchURL.protocol}${fetchURL.url}/attendance/endTime`, {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        e_id: user.e_id,
        e_name: user.e_name,
        co_work_date: new Date().toISOString().slice(0, 10)
      }),
    })
    .then(res => res.text())
    .then(msg => {
      alert(msg);
      fetchTodayCommute(); // ⭐ 다시 조회
    });
  };

  // 오늘자 출퇴근 기록 조회 함수
  const fetchTodayCommute = () => {
    fetch(`${fetchURL.protocol}${fetchURL.url}/attendance/today?e_id=${user.e_id}`)
      .then(res => res.json())
      .then(data => {
        setCommuteRe(data);
      })
      .catch(err => console.error("오늘 근무 기록 불러오기 실패:", err));
  };
  


  return(
    <>
      <Button onClick={startTime}>출근</Button>
      <Button onClick={endTime}>퇴근</Button>

      {/* 화면에 출력 */}
      <div className="co_area_box1">
        {commuteRe ? (
          <>
            <div>📅 날짜: {commuteRe.co_work_date}</div>
            <div>👤 사원: {commuteRe.e_name}</div>
            <div>🕒 출근시간: {commuteRe.co_start_time || "-"}</div>
            <div>🕔 퇴근시간: {commuteRe.co_end_time || "-"}</div>
            <div>📌 상태: {commuteRe.co_status || "미입력"}</div>
          </>
        ) : (
          <div>로딩 중...</div>
        )}
      </div>

    </>
  );
}
