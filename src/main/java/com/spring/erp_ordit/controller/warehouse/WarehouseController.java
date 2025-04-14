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
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.spring.erp_ordit.dto.warehouse.LogisWarehouseDTO;
import com.spring.erp_ordit.service.warehouse.WarehouseServiceImpl;

@RestController
@RequestMapping("/warehouse")
@CrossOrigin(origins = "*", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE})
public class WarehouseController {
	
	@Autowired
	private WarehouseServiceImpl wservice;
	
	// 창고 목록 GetMapping = > http://localhost:8081/main/warehouse/WarehouseList
	@GetMapping("/warehouseList") // 조회는 GetMapping
	public ResponseEntity<List<LogisWarehouseDTO>> findWarehouse() {
		System.out.println("<<< WarehouseList >>>");
		return new ResponseEntity<>(wservice.warehouseList(), HttpStatus.OK);
	}

	// 창고 등록 PostMapping => http://localhost:8081/main/warehouse/warehouseInsert
	@PostMapping("/warehouseInsert")
	public ResponseEntity<?> saveWarehouse(@RequestBody LogisWarehouseDTO warehouse) {
	    System.out.println("<<< save >>>");
	    return new ResponseEntity<>( wservice.saveWarehouse(warehouse), HttpStatus.CREATED); // 201 Created 응답
	}
	
	// 창고 상세 GetMapping = > http://localhost:8081/main/warehouse/findByStoragecode/{storage_code}
	@GetMapping("/findByStoragecode/{storage_code}") // 조회는 GetMapping
	public ResponseEntity<?> findByStoragecode(@PathVariable int storage_code) {
		System.out.println("<<< /detail/{storage_code} - findByStoragecode >>>");
		return new ResponseEntity<>(wservice.findByStoragecode(storage_code), HttpStatus.OK); // 200을 리턴해라
	}
	
	// 창고 삭제 DeleteMapping = > http://localhost:8081/main/warehouse/findByStoragecode/{storage_code}
	@DeleteMapping("/deletebyStorageCode/{storage_code}")
	public ResponseEntity<String> deleteWarehouse(@PathVariable int storage_code){ //@PathVariable => 매개변수 가져올 때 사용
		System.out.println("<<< @DeleteMapping - findById >>>");
		return new ResponseEntity<String>(wservice.deleteWarehouse(storage_code), HttpStatus.OK); // 200
	}
	
	// 창고 정보 수정 PutMapping => http://localhost:8081/warehouse/updateWarehouse
	@PutMapping("/warehouseUpdate")
	public ResponseEntity<?> updateWarehouse(@RequestBody LogisWarehouseDTO dto) {
	    System.out.println("<<< updateStock >>>");
	    System.out.println("warehouseUpdate : " + dto);
	    return new ResponseEntity<>(wservice.updateWarehouse(dto.getStorage_code(), dto), HttpStatus.OK);
	}
}
