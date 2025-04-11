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
	
	// 게시글 목록	
	@Transactional(readOnly=true)
	public List<LogisWarehouseDTO> warehouseList(){
		System.out.println("WarehouseServiceImpl - warehouseList");
		List<LogisWarehouseDTO> a = logisMapper.warehouseList();
		System.out.println("a : " + a);
		return a;
	}
	
	// 게시글 등록
//	@Transactional  // 서비스 함수가 종료될 때 commit할지 rollback할지 트랜잭션 관리하겠다.
//	public WarehouseDTO saveWarehouse(WarehouseDTO dto){
//		System.out.println("WarehouseServiceImpl - saveWarehouse");
//		return logisMapper.save(dto);
//	}
	
//	// 게시글 등록
//	@Transactional  // 서비스 함수가 종료될 때 commit할지 rollback할지 트랜잭션 관리하겠다.
//	public List<WarehouseDTO> saveList(HashMap<String, List<WarehouseDTO> >){
//		System.out.println("WarehouseServiceImpl - saveWarehouse");
//		Map< String, Object > multiMap = new HashMap<>();
//		return repository.saveAll(multiMap<String, List<WarehouseDTO> >);
//	}
	
	// 게시글 상세
//	@Transactional(readOnly = true)
//	public WarehouseDTO findByNum(int item_code) {
//		return logisMapper.findByNum(item_code);
//	}
	
	// 게시글 등록
//	@Transactional  // 서비스 함수가 종료될 때 commit할지 rollback할지 트랜잭션 관리하겠다.
//	public String deleteWarehouse(int item_code){
//		System.out.println("WarehouseServiceImpl - deleteWarehouse");
//		logisMapper.deleteById(item_code);
//		return "삭제완료";
//	}
	
}
