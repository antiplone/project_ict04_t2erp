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
import com.spring.erp_ordit.service.warehouse.WarehouseServiceImpl;

@RestController
@RequestMapping("/warehouse")
@CrossOrigin
public class WarehouseController {
	
	@Autowired
	private WarehouseServiceImpl wservice;
	
	// 게시글 목록 GetMapping = > http://localhost:8081/main/WarehouseList
	@GetMapping("/warehouseList") // 조회는 GetMapping
	public ResponseEntity<List<LogisWarehouseDTO>> findWarehouse() {
		System.out.println("<<< WarehouseList >>>");
		return new ResponseEntity<>(wservice.warehouseList(), HttpStatus.OK);
	}
//	
//	@GetMapping("/warehouseManagement") // 조회는 GetMapping
//	public ResponseEntity<List<WarehouseDTO>> findAll2() {
//		System.out.println("<<< WarehouseList2 >>>");
//		return new ResponseEntity<>(service.warehouseList(), HttpStatus.OK);
//	}
//	
//	// 게시글 등록 PostMapping => http://localhost:8081/main/Warehouse
//	@PostMapping("/warehouse")
//	public ResponseEntity<WarehouseDTO> save(@RequestBody WarehouseDTO Warehouse){
//		System.out.println("<<< save >>>");
//		
//		return new ResponseEntity<>(service.saveWarehouse(Warehouse), HttpStatus.CREATED); // 201을 리턴해라
//	}
//	
	// 판매 목록 등록 PostMapping => http://localhost:8081/main/Warehouse
//	@PostMapping("/saveWarehouse")
//	public ResponseEntity<List<WarehouseDTO dto>> saveList(@RequestBody map){
//		System.out.println("<<< save >>>");
//		
//		return new ResponseEntity<>(service.saveWarehouse(List<WarehouseDTO dto>), HttpStatus.CREATED); // 201을 리턴해라
//	}
	
	// 게시글 상세 GetMapping = > http://localhost:8081/main/Warehouse/{num}
//	@GetMapping("/detail/{item_code}") // 조회는 GetMapping
//	public ResponseEntity<WarehouseDTO> findByNum(@PathVariable int item_code) {
//		System.out.println("<<< /detail/{item_code} - findByNum >>>");
//		return new ResponseEntity<>(service.findByNum(item_code), HttpStatus.OK); // 200을 리턴해라
//	}
	
	// 게시글 삭제
//	@DeleteMapping("/warehouse/{b_num}")
//	public ResponseEntity<String> deleteWarehouse(@PathVariable int b_num){ //@PathVariable => 매개변수 가져올 때 사용
//		System.out.println("<<< @DeleteMapping - findById >>>");
//		
//		return new ResponseEntity<String>(service.deleteWarehouse(b_num), HttpStatus.OK); // 200
//	}
//	
//	// 게시글 상세 GetMapping = > http://localhost:8081/main/Warehouse/{num}
//	@GetMapping("/warehousing/{b_num}") // 조회는 GetMapping
//	public ResponseEntity<WarehouseDTO> findByOrderNo(@PathVariable int b_num) {
//		System.out.println("<<< /warehouse/{b_num} - findById >>>");
//		return new ResponseEntity<>(service.findById(b_num), HttpStatus.OK); // 200을 리턴해라
//	}
	
}
	
