package com.spring.erp_ordit.service.warehouse;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.spring.erp_ordit.dto.warehouse.LogisWarehouseDTO;
import com.spring.erp_ordit.dao.warehouse.LogisMapper;

@Service
public class WarehouseServiceImpl {

	@Autowired
	private LogisMapper logisMapper;
	
	// 창고 목록	
	@Transactional(readOnly=true)
	public List<LogisWarehouseDTO> warehouseList(){
		System.out.println("WarehouseServiceImpl - warehouseList");
		List<LogisWarehouseDTO> a = logisMapper.warehouseList();
		System.out.println("a : " + a);
		return a;
	}
	
	// 창고 등록
	@Transactional  // 서비스 함수가 종료될 때 commit할지 rollback할지 트랜잭션 관리하겠다.
	public int saveWarehouse(LogisWarehouseDTO dto){
		System.out.println("WarehouseServiceImpl - saveWarehouse");
		return logisMapper.warehouseInsert(dto);
	}

	// 창고 상세
	@Transactional(readOnly = true)
	public LogisWarehouseDTO findByStoragecode(int storage_code) {
		return logisMapper.findByStoragecode(storage_code);
	}
	
	// 창고 삭제
	@Transactional  // 서비스 함수가 종료될 때 commit할지 rollback할지 트랜잭션 관리하겠다.
	public String deleteWarehouse(int storage_code){
		System.out.println("WarehouseServiceImpl - deleteWarehouse");
		logisMapper.deleteWarehouse(storage_code);
		return "삭제완료";
	}
	
	// 창고 정보 수정
	@Transactional  // 서비스 함수가 종료될 때 commit할지 rollback할지 트랜잭션 관리하겠다.
	public int updateWarehouse(int storage_code, LogisWarehouseDTO dto){
		System.out.println("WarehouseServiceImpl - updateWarehouse");
		dto.setStorage_code(storage_code);
		return logisMapper.updateWarehouse(dto);
	}
	
}
