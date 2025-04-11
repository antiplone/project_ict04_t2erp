package com.spring.erp_ordit.dao.basic;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.springframework.stereotype.Repository;

import com.spring.erp_ordit.dto.basic.BaiscItemDTO;

@Mapper
@Repository
public interface BasicItemMapper {
	
	public List<BaiscItemDTO> basicItemList();	// 물품 목록
	
	public int basicInsertItem(BaiscItemDTO dto);	// 물품 등록

	public int basicUpdateItem(BaiscItemDTO dto);	// 물품 수정
	
	public int basicDeleteItem(int item_code);	// 물품 삭제
	
//	public BaiscItemDTO basicItemDetail(int item_code);	// 게시글 상세페이지

	
	int getNextItemCode();	// 물품 코드 +1 자동 증가
}
