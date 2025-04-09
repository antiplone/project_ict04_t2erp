package com.spring.erp_ordit.dto.warehouse;

import java.sql.Date;	

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.ToString;

@Data
@AllArgsConstructor
@ToString
@Builder
public class WarehouseDTO {

	private int item_code;			// 품목코드
	private String item_name;		// 품목명
	private String item_standard;	// 규격
	private int stock_amount;		// 재고
	private int safe_stock;			// 안전재고
	private Date last_date;			// 입고일
	private String client_name;		// 거래처
//	private int client_code;		// 거래처 코드
	private String storage_name;			// 창고명
//	private int storage_code;		// 창고 코드
	
//	public WarehouseDTO() {
//		super();
//	}
//
//	public int getItem_code() {
//		return item_code;
//	}
//
//	public void setItem_code(int item_code) {
//		this.item_code = item_code;
//	}
//
//	public String getItem_name() {
//		return item_name;
//	}
//
//	public void setItem_name(String item_name) {
//		this.item_name = item_name;
//	}
//
//	public String getItem_standard() {
//		return item_standard;
//	}
//
//	public void setItem_standard(String item_standard) {
//		this.item_standard = item_standard;
//	}
//
//	public int getStock_amount() {
//		return stock_amount;
//	}
//
//	public void setStock_amount(int stock_amount) {
//		this.stock_amount = stock_amount;
//	}
//
//	public int getSafe_stock() {
//		return safe_stock;
//	}
//
//	public void setSafe_stock(int safe_stock) {
//		this.safe_stock = safe_stock;
//	}
//
//	public Date getLast_date() {
//		return last_date;
//	}
//
//	public void setLast_date(Date last_date) {
//		this.last_date = last_date;
//	}
//
//	public String getClient_name() {
//		return client_name;
//	}
//
//	public void setClient_name(String client_name) {
//		this.client_name = client_name;
//	}
//
////	public int getClient_code() {
////		return client_code;
////	}
////
////	public void setClient_code(int client_code) {
////		this.client_code = client_code;
////	}
//
//	public String getStorage() {
//		return storage;
//	}
//
//	public void setStorage(String storage) {
//		this.storage = storage;
//	}
//
////	public int getStorage_code() {
////		return storage_code;
////	}
////
////	public void setStorage_code(int storage_code) {
////		this.storage_code = storage_code;
////	}
//
//	@Override
//	public String toString() {
//		return "WarehouseDTO [item_code=" + item_code + ", item_name=" + item_name + ", item_standard=" + item_standard
//				+ ", stock_amount=" + stock_amount + ", safe_stock=" + safe_stock + ", last_date=" + last_date
//				+ ", client_name=" + client_name + /*", client_code=" + client_code + */", storage=" + storage
//				/*+ ", storage_code=" + storage_code + "]"*/;
//	}
	
}

//CREATE TABLE mvc_board_tbl(  
//	    b_num         NUMBER(7)  PRIMARY KEY,		-- 글번호
//		b_title       VARCHAR2(50)  NOT NULL,		-- 글제목
//		b_content     CLOB  NOT NULL,		        -- 글내용
//		b_writer      VARCHAR2(30)  NOT NULL,	    -- 작성자
//		b_password    VARCHAR2(30)  NOT NULL,       -- 수정, 삭제용 비밀번호
//		b_readCnt     NUMBER(6)   DEFAULT 0,		-- 조회수
//		b_regDate     DATE  DEFAULT sysdate,	    -- 작성일
//		b_comment_count  NUMBER(6)   DEFAULT 0	    --  댓글갯수
//	);

//-- 시퀀스 생성(리액트 + 부트에서 게시글 insert 시 게시글번호 자동 증가)
//CREATE SEQUENCE BOARD_NUM_SEQ
//START WITH 1 NOCACHE ORDER;
