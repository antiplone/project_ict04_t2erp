import React from 'react'
import MessageBox from "#components/common/MessageBox";
import AppConfig from "#config/AppConfig.json";

export function meta() {
  return [
    { title: `${AppConfig.meta.title} : 출퇴근` },
    { name: "description", content: "출퇴근 기록할 수 있습니다" },
  ];
};

export const Att_commuteRecords = () => {
  return(
    <div>
      <MessageBox text="출퇴근 기록" />
    </div>
   )
}
