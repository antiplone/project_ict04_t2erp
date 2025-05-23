package com.spring.erp_ordit.dao.buy;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;
import org.springframework.stereotype.Repository;

@Mapper 	// DAOImpl 만들지 않고 mapper랑 연결할때 쓴다.
@Repository
public interface BuyItemMapper {  // 작성자 - hjy 물품정보 찾는 Mapper => item_code로 item_id를 찾는
	
	// 이 쿼리문이 item_code를 문자열로 비교해서 dto에 String으로 타입 맞춰줬음.
	// item_code로 item_id를 찾는 쿼리문
	@Select("SELECT item_id FROM item_tbl WHERE item_code = #{item_code}")
    Long findItemIdByCode(String item_code);
	
}
