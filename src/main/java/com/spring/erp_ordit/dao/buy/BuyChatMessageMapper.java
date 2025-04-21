package com.spring.erp_ordit.dao.buy;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.springframework.stereotype.Repository;

import com.spring.erp_ordit.dto.buy.BuyChatMessageDTO;

@Mapper 	// DAOImpl 만들지 않고 mapper랑 연결할때 쓴다.
@Repository
public interface BuyChatMessageMapper {  // 작성자 - hjy 물품정보 찾는 Mapper => item_code로 item_id를 찾는
	
	public void insertMessage(BuyChatMessageDTO message); // 메시지 입력

	public List<BuyChatMessageDTO> selectMessagesByRoomId(String roomId); // 채팅방 조회
}
