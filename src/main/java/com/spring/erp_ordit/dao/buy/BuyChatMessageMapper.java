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
	
	public List<ChatEmployeeDTO> chatEmployeeList();

	public boolean existsByRoomId(@Param("room_id") String room_id);

	// Map을 받아서 room_id, user1_id, user2_id 값을 다 넣음
	public void insertRoom(Map<String, Object> paramMap);

	public void insertMessage(BuyChatMessageDTO message); // 메시지 입력

	public List<BuyChatMessageDTO> selectMessagesByRoomId(String room_id); // 채팅 내역 조회

}
