package com.spring.erp_ordit.dao.warehouse;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Repository;

import com.spring.erp_ordit.dto.warehouse.*;

@Mapper
@Repository
public interface LogisMapper {
		
		// 창고 관련
		// 창고 목록
		public List<LogisWarehouseDTO> warehouseList();
		
		// 창고 등록
		public int warehouseInsert(LogisWarehouseDTO dto);
		
		// 창고 상세
		public LogisWarehouseDTO findByStoragecode(int storage_code);
		
		// 창고 삭제
		public Integer deleteWarehouse(int storage_code);
		
		// 창고 수정
		public int updateWarehouse(LogisWarehouseDTO dto);
		
		
		// 주문관련
		// 입고 목록
		public List<LogisOrderDTO> logisOrderList();
		
		public List<LogisOrderDTO> findByLogisOrderId(int order_id);
		
		public LogisOrderItemDTO findByOrderItem(int order_id, int item_code, int order_type);
		
		// 입고 확정
		public int updateStock(LogisStockDTO stockDTO);
		
		public int updateOrderStock(LogisOrderItemDTO orderDTO);
		
		// 출고 목록
		public List<LogisSalesDTO> logisSalesList();
		
		public List<LogisSalesDTO> findByLogisSalesId(int order_id);
		
		public LogisSalesItemDTO findBySalesItem(int order_id, int item_code, int order_type);
		
		public int updateSales(int item_code, int stock_amount, int order_id);
		
		
		// 창고관련
		// 재고 목록
		public List<LogisStockDTO> logisStockList();
		
//		// 창고 등록
//		public int StockInsert(LogisWarehouseDTO dto);
//		
//		// 창고 상세
//		public LogisWarehouseDTO findByStockcode(int storage_code);
//		
//		// 창고 삭제
//		public Integer deleteStock(int storage_code);
//		
		
}
