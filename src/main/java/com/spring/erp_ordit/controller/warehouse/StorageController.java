package com.spring.erp_ordit.controller.warehouse;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.spring.erp_ordit.dto.warehouse.LogisWarehouseDTO;
import com.spring.erp_ordit.service.warehouse.StorageServiceImpl;

@RestController
@RequestMapping("/main")
@CrossOrigin
public class StorageController {
	
	@Autowired
	private StorageServiceImpl service;
	
	// 창고 목록 GetMapping = > http://localhost:8081/main/storageList
//	@GetMapping("/storageList") // 조회는 GetMapping
//	public ResponseEntity<List<LogisWarehouseDTO>> findAll() {
//		System.out.println("<<< storageList >>>");
//		return new ResponseEntity<>(service.storageList(), HttpStatus.OK);
//	}
//	
//	@GetMapping("/storageManagement") // 조회는 GetMapping
//	public ResponseEntity<List<LogisWarehouseDTO>> findAll2() {
//		System.out.println("<<< storageList2 >>>");
//		return new ResponseEntity<>(service.storageList(), HttpStatus.OK);
//	}
//	
	// 창고 등록 PostMapping => http://localhost:8081/apil/saveStorage
//	@PostMapping("/storageInsert")
//	public ResponseEntity<Integer> storageInsert(@RequestBody LogisWarehouseDTO dto){
//		System.out.println("<<< storageInsert >>>");
//		
//		return new ResponseEntity<>(service.storageInsert(dto), HttpStatus.CREATED); // 201을 리턴해라
//	}
	
	// 창고 상세 GetMapping = > http://localhost:8081/apil/storage/{num}
//	@GetMapping("/storageDetail/{storage_code}") // 조회는 GetMapping
//	public ResponseEntity<LogisWarehouseDTO> findByStoragecode(@PathVariable int storage_code) {
//		System.out.println("<<< /detail/{storage_code} - findByStoragecode >>>");
//		return new ResponseEntity<>(service.findByStoragecode(storage_code), HttpStatus.OK); // 200을 리턴해라
//	}
	
	// 창고 삭제
//	@DeleteMapping("/storageDelete/{storage_code}")
//	public ResponseEntity<?> deleteStorage(@PathVariable int storage_code){ //@PathVariable => 매개변수 가져올 때 사용
//		System.out.println("<<< @DeleteMapping - deleteStorage >>>");
//		
//		return new ResponseEntity<>(service.deleteStorage(storage_code), HttpStatus.OK); // 200
//	}
//	
//	// 창고 상세 GetMapping = > http://localhost:8081/apil/storage/{num}
//	@GetMapping("/storage/{item_code}") // 조회는 GetMapping
//	public ResponseEntity<LogisWarehouseDTO> findByStorageCode(@PathVariable int item_code) {
//		System.out.println("<<< /storage/{item_code} - findByStorageCode >>>");
//		return new ResponseEntity<>(service.findByStorageCode(item_code), HttpStatus.OK); // 200을 리턴해라
//	}
	
//	@PutMapping("/storageUpdate/{storage_code}")
//	public ResponseEntity<?/*LogisWarehouseDTO*/> updateBoard(@PathVariable int storage_code, @RequestBody LogisWarehouseDTO dto){
//		System.out.println("<<< storageUpdate >>>");
//		
//		return new ResponseEntity<>(service.updateStorage(storage_code, dto), HttpStatus.OK); // 200
//	}
	
}
	
