package com.spring.erp_ordit.dao.warehouse;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.springframework.stereotype.Repository;

import com.spring.erp_ordit.dto.warehouse.*;

@Mapper
@Repository
public interface LogisMapper {

		// 창고 목록
		public List<LogisWarehouseDTO> warehouseList();

//		// 창고 등록
//		public int insertBoard(WarehouseDTO dto);
//		
//		// 창고 수정
//		public int updateBoard(WarehouseDTO dto);
//		
//		// 창고 삭제
//		public int deleteBoard(int item_code);
//		
//		// 창고 상세
//		public WarehouseDTO findByNum(int item_code);
		
		// 주문관련
		// 입고 목록
		public List<LogisOrderDTO> logisOrderList();
		
		public List<LogisOrderDTO> findByLogisOrderId(int order_id);
		
		public LogisOrderItemDTO findByOrderItem(int order_id, int item_code, int order_type);
		
//		public int updateStock(int item_code, int stock_amount);
		
		// 출고 목록
		public List<LogisSalesDTO> logisSalesList();
		
		public List<LogisSalesDTO> findByLogisSalesId(int order_id);
		
		public LogisSalesItemDTO findBySalesItem(int order_id, int item_code, int order_type);
		
		public int updateStock(int item_code, int quantity);
		
		
		// 창고관련
		// 재고 목록
		public List<LogisStockDTO> logisStockList();
		
		// 창고 목록
//		public List<LogisWarehouseDTO> storageList();
		
		// 창고 등록
//		public int storageInsert(LogisWarehouseDTO dto);
		
		// 창고 상세
//		public LogisWarehouseDTO findByStoragecode(int storage_code);
		
		// 창고 삭제
//		public Integer deleteStoragecode(int storage_code);
		
		// 창고 수정
//		public int updateStorage(LogisWarehouseDTO dto);
		
}
