package com.spring.erp_ordit.service.warehouse;

//	import java.util.HashMap;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.spring.erp_ordit.dao.warehouse.LogisMapper;
import com.spring.erp_ordit.dto.warehouse.LogisStockDTO;

@Service
public class LogisStockItemsServiceImpl {

	@Autowired
	private LogisMapper logisMapper;
	
	// 재고 목록
	@Transactional(readOnly = true)
	public List<LogisStockDTO> logisstockList() {
		System.out.println("LogisStockItemsServiceImpl - stockList");
		List<LogisStockDTO> logisStock= logisMapper.logisStockList();
		System.out.println("logisOrder : " + logisStock);
		return logisStock;
	}
	
	// 입고 확정(stock_table 수정) 
	@Transactional  // 
	public int /*LogisStockDTO*/ updateStock(int item_code, int quantity){ // BoardDTO return : 상세페이지로 리턴하기 위해 
		System.out.println("LogisStockItemsServiceImpl - updateStock");
		return logisMapper.updateStock(item_code, quantity);
	}
	
	// 재고 등록
//		@Transactional  // 서비스 함수가 종료될 때 commit할지 rollback할지 트랜잭션 관리하겠다.
//		public LogisStockDTO saveStocks(LogisStockDTO dto){
//			System.out.println("StockItemsServiceImplRepository - saveStocks");
//			return repository.save(dto);
//		}

//		// 재고 등록
//		@Transactional  // 서비스 함수가 종료될 때 commit할지 rollback할지 트랜잭션 관리하겠다.
//		public List<LogisStockDTO> saveList(HashMap<String, List<WarehouseDTO> >){
//			System.out.println("StockItemsServiceImplRepository - saveList");
//			Map< String, Object > multiMap = new HashMap<>();
//			return repository.saveAll(multiMap<String, List<WarehouseDTO> >);
//		}

	// 재고 아이템 상세
//		@Transactional(readOnly = true)
//		public LogisStockDTO findById(int l_code) {
//			return repository.findById(l_code)
//					.orElseThrow(() -> new IllegalArgumentException("재고 번호를 확인해 주세요.!!"));
//		}

	// 게시글 등록
//		@Transactional  // 서비스 함수가 종료될 때 commit할지 rollback할지 트랜잭션 관리하겠다.
//		public String deleteStock(int l_code){
//			System.out.println("StockItemsServiceImplRepository - deleteStock");
//			repository.deleteById(l_code);
//			return "ok";
//		}

	// 게시글 수정
//		@Transactional  // 
//		public LogisStockDTO updateStocks(int l_code, LogisStockDTO dto){ // BoardDTO return : 상세페이지로 리턴하기 위해 
//			System.out.println("WarehouseServiceImpl - updateWarehouse");
//			LogisStockDTO stock = repository.findById(l_code)
//					.orElseThrow(() -> new IllegalArgumentException("입력 내용을 확인해 주세요!!"));
//			stock.setL_name(dto.getL_name());
//			stock.setL_brand(dto.getL_brand());
//			stock.setL_stock(dto.getL_stock());
//			stock.setL_safe_stock(dto.getL_safe_stock());
//			stock.setL_madein(dto.getL_madein());
//			stock.setL_warehouse(dto.getL_warehouse());
//			stock.setL_lack(dto.getL_lack());
//			stock.setL_floor(dto.getL_floor());
//			stock.setL_sysdate(dto.getL_sysdate());
//
//			return stock;
//		}
}
