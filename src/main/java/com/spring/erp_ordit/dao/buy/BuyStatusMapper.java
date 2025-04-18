package com.spring.erp_ordit.dao.buy;

import org.apache.ibatis.annotations.Mapper;
import org.springframework.stereotype.Repository;

import com.spring.erp_ordit.dto.buy.BuyStatusDTO;

@Mapper 	// DAOImpl 만들지 않고 mapper랑 연결할때 쓴다.
@Repository
public interface BuyStatusMapper {	// 작성자 - hjy, 구매팀 - 주문상태 정보 Mapper
	
	// 구매팀 - 구매입력시 주문상태 '진행중'으로 자동입력
	public void insertOrderStatus(BuyStatusDTO status);
	
	// 구매팀 - 주문수정시 주문상태 수정
	// 1. 상태 존재 여부 확인 (기존 order_id가 있는지)
	public int existsStatus(Long order_id);

    // 2. 기존 상태 삭제
	public int deleteOrderStatus(BuyStatusDTO orderStatus);

    // 3. 상태 입력
	public int insertOrderStatus2(BuyStatusDTO orderStatus);
}
