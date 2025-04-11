package com.spring.erp_ordit.dto.basic;

import java.sql.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Data
@AllArgsConstructor		
@NoArgsConstructor		
@ToString
@Builder				
public class BaiscItemDTO {
	
	private int item_id;			// 물품 번호
	private int item_code;			// 물품 코드
    private String item_name;		// 물품명
    private String item_status;		// 사용 상태
    private String item_standard;	// 물품 규격
    private Date item_reg_date;		// 등록일
}
