/*package com.spring.erp_ordit.service.warehouse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.spring.erp_ordit.dao.warehouse.LogisMapper;

@Service
public class StorageServiceImpl {

	@Autowired
	private LogisMapper logisMapper;
	
	// 창고 목록	
//	@Transactional(readOnly=true)
//	public List<LogisWarehouseDTO> storageList(){
//		System.out.println("StorageServiceImpl - storageList");
//		List<LogisWarehouseDTO> a = logisMapper.storageList();
//		System.out.println("a : " + a);
//		return a;
//	}
//	
	// 창고 등록
//	@Transactional  // 서비스 함수가 종료될 때 commit할지 rollback할지 트랜잭션 관리하겠다.
//	public int storageInsert(LogisWarehouseDTO dto){
//		System.out.println("StorageServiceImpl - insertStorage");
//		return logisMapper.storageInsert(dto);
//	}
	
//	// 창고 등록
//	@Transactional  // 서비스 함수가 종료될 때 commit할지 rollback할지 트랜잭션 관리하겠다.
//	public List<WarehouseDTO> saveList(HashMap<String, List<WarehouseDTO> >){
//		System.out.println("StorageServiceImpl - saveWarehouse");
//		Map< String, Object > multiMap = new HashMap<>();
//		return repository.saveAll(multiMap<String, List<WarehouseDTO> >);
//	}
	
	// 창고 상세
//	@Transactional(readOnly = true)
//	public LogisWarehouseDTO findByStoragecode(int storage_code) {
//		return logisMapper.findByStoragecode(storage_code);
//	}
	
	// 창고 수정
//	@Transactional  // 
//	public int updateStorage(int storage_code, LogisWarehouseDTO dto){ // BoardDTO return : 상세페이지로 리턴하기 위해 
//		System.out.println("StorageServiceImpl - updateStorage");
//		 dto.setStorage_code(storage_code);
//		return logisMapper.updateStorage(dto);
//	}
	
	// 창고 삭제
//	@Transactional  // 서비스 함수가 종료될 때 commit할지 rollback할지 트랜잭션 관리하겠다.
//	public Integer deleteStorage(int storage_code){
//		System.out.println("StorageServiceImpl - deleteStorage");
//		int result = logisMapper.deleteStoragecode(storage_code);
//		System.out.println(" result : " + result);
//		return result;
//	}
	
}
*/