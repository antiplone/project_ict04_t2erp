package com.spring.erp_ordit.dao.buy;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Repository;

import com.spring.erp_ordit.dto.buy.BuyChatMessageDTO;
import com.spring.erp_ordit.dto.buy.ChatEmployeeDTO;

@Mapper // DAOImpl 만들지 않고 mapper랑 연결할때 쓴다.
@Repository
public interface BuyChatMessageMapper { // 작성자 - hjy 물품정보 찾는 Mapper => item_code로 item_id를 찾는
	
	// 채팅 상대 선택시 직원 목록 조회
	public List<ChatEmployeeDTO> chatEmployeeList();
	
	// 채팅 room_id가 있는지 확인
	public boolean existsByRoomId(@Param("room_id") String room_id);

	// 채팅 room_id 입력
	public void insertRoom(Map<String, Object> paramMap); // Map을 받아서 room_id, user1_id, user2_id 값을 다 넣음

	// 메시지 입력
	public void insertMessage(BuyChatMessageDTO message); 
	
	// room_id에 대한 마지막 메시지 조회
	public BuyChatMessageDTO selectLastInsertedMessageByRoom(String room_id);
	
	// 선택한 채팅방 내역 조회
	public List<BuyChatMessageDTO> selectMessagesByRoomId(String room_id); 

}
