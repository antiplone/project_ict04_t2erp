package com.spring.erp_ordit.service.buy;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.spring.erp_ordit.dao.buy.BuyChatMessageMapper;
import com.spring.erp_ordit.dto.buy.BuyChatMessageDTO;

@Service
@Transactional  // 트랜잭션 적용
public class BuyChatMessageServiceImpl {	// 작성자 - hjy, 1:1 채팅
	
	@Autowired
    private BuyChatMessageMapper buyChatMessageMapper;
	
	// 메시지 저장
    public void saveMessage(BuyChatMessageDTO message) {   
    	buyChatMessageMapper.insertMessage(message);
    }

    // 메시지 조회
    public List<BuyChatMessageDTO> getMessages(String room_id) {
        return buyChatMessageMapper.selectMessagesByRoomId(room_id);
    }
	
}