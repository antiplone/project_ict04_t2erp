package com.spring.erp_ordit.service.buy;

import java.util.Arrays;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.spring.erp_ordit.dao.buy.BuyChatMessageMapper;
import com.spring.erp_ordit.dto.buy.BuyChatMessageDTO;
import com.spring.erp_ordit.dto.buy.ChatEmployeeDTO;

@Service
@Transactional // 트랜잭션 적용
public class BuyChatMessageServiceImpl { // 작성자 - hjy, 1:1 채팅

	@Autowired
	private BuyChatMessageMapper buyChatMessageMapper;

	// 직원 목록 조회
	public List<ChatEmployeeDTO> getChatEmployeeList() {
		
		System.out.println("<<< BuyOrderServiceImpl - getChatEmployeeList >>>");
		
		return buyChatMessageMapper.chatEmployeeList();
	}
	
	// 메시지 저장
	public void saveMessage(BuyChatMessageDTO message) {
		// JOIN 메시지는 저장하지 않음
		if ("JOIN".equals(message.getType())) {
			return; // 메시지 저장 없이 그냥 종료
		}

		// 채팅방이 없으면 생성
		if (!buyChatMessageMapper.existsByRoomId(message.getRoom_id())) {
			// null 체크
			if (message.getSender() == null || message.getReceiver() == null) {
				throw new IllegalArgumentException("sender나 receiver가 null입니다!");
			}

			Map<String, Object> paramMap = new HashMap<>();
			paramMap.put("room_id", message.getRoom_id());
			paramMap.put("user1_id", message.getSender());
			paramMap.put("user2_id", message.getReceiver());

			buyChatMessageMapper.insertRoom(paramMap);
		}

		// CHAT 메시지만 저장
		buyChatMessageMapper.insertMessage(message);
	}

	// 사용자의 e_auth_id를 기준으로 room_id 생성
	public String generateRoomId(String eId1, String eId2) {
		List<String> ids = Arrays.asList(eId1, eId2);
		Collections.sort(ids); // 사전 순 정렬
		return ids.get(0) + "_" + ids.get(1); // 예: D0030002-25_D0050001-25
	}

	// 채팅 내역 조회
	public List<BuyChatMessageDTO> getMessagesByRoom(String room_id) {
		return buyChatMessageMapper.selectMessagesByRoomId(room_id);
	}

}