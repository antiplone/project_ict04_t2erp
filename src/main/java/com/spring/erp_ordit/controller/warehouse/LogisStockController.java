package com.spring.erp_ordit.controller.warehouse;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.spring.erp_ordit.dto.warehouse.LogisStockDTO;
import com.spring.erp_ordit.service.warehouse.LogisStockItemsServiceImpl;

@RestController
@RequestMapping("/logisstock")
@CrossOrigin(origins = "*")
public class LogisStockController {

	@Autowired
	private LogisStockItemsServiceImpl logisstockService;

	// 재고 목록 GetMapping = > http://localhost:8081/logisstock/logisStockList
	@GetMapping("/logisStockList") // 조회는 GetMapping
	public ResponseEntity<List<LogisStockDTO>> logisstockList() {
		System.out.println("<<< stockList >>>");
		return new ResponseEntity<>(logisstockService.logisstockList(), HttpStatus.OK);
	}

	// 입고 확정
	@PutMapping("/stockUpdate")
	public ResponseEntity<?> updateStock(@RequestParam(required = false) Integer stock_amount, @RequestParam(required =false) Integer item_code, @RequestParam(required = false) Integer storage_code, @RequestParam(required = false) Integer order_id){
		System.out.println("<<< updateStock >>>");
		System.out.println("item_code : " + item_code + ", stock_amount : " + stock_amount + ", order_id : " + order_id + ", storage_code : " + storage_code);

		return new ResponseEntity<>(logisstockService.updateOrderStock(stock_amount, item_code, storage_code, order_id), HttpStatus.OK); // 200
	}

	// 재고 아이템 상세 GetMapping = > http://localhost:8081/api/Warehouse/{num}
//	@GetMapping("/detail/{l_code}") // 조회는 GetMapping
//	public ResponseEntity<LogisStockDTO> findById(@PathVariable int l_code) {
//		System.out.println("<<< /itemDetail/{l_code} - findById >>>");
//		return new ResponseEntity<>(logisstockService.findById(l_code), HttpStatus.OK); // 200을 리턴해라
//	}

	// 게시글 등록 PostMapping => http://localhost:8081/api/Warehouse
//	@PostMapping("/stockItem")
//	public ResponseEntity<LogisStockDTO> save(@RequestBody LogisStockDTO stock){
//		System.out.println("<<< save >>>");
//		
//		return new ResponseEntity<>(logisstockService.saveStocks(stock), HttpStatus.CREATED); // 201을 리턴해라
//	}

//	// 판매 목록 등록 PostMapping => http://localhost:8081/api/Warehouse
////	@PostMapping("/saveWarehouse")
////	public ResponseEntity<List<WarehouseDTO dto>> saveList(@RequestBody map){
////		System.out.println("<<< save >>>");
////		
////		return new ResponseEntity<>(service.saveWarehouse(List<WarehouseDTO dto>), HttpStatus.CREATED); // 201을 리턴해라
////	}
//	
//	// 게시글 상세 GetMapping = > http://localhost:8081/api/Warehouse/{num}
//	@GetMapping("/detail/{b_num}") // 조회는 GetMapping
//	public ResponseEntity<LogisStockDTO> findById(@PathVariable int b_num) {
//		System.out.println("<<< /warehouse/{b_num} - findById >>>");
//		return new ResponseEntity<>(logisstockService.findById(b_num), HttpStatus.OK); // 200을 리턴해라
//	}
//	
//	// 게시글 삭제
//	@DeleteMapping("/stockItems/{b_num}")
//	public ResponseEntity<String> deleteWarehouse(@PathVariable int l_code){ //@PathVariable => 매개변수 가져올 때 사용
//		System.out.println("<<< @DeleteMapping - findById >>>");
//		
//		return new ResponseEntity<String>(logisstockService.deleteStock(l_code), HttpStatus.OK); // 200
//	}
//	
//	// 게시글 수정 PostMapping => http://localhost:8081/api/updateForm/{b_num}
//	@PutMapping("/updateStock/{l_code}")
//	public ResponseEntity<LogisStockDTO> updateStocks(@PathVariable int l_code, @RequestBody LogisStockDTO stock){
//		System.out.println("<<< updateWarehouse >>>");
//		
//		return new ResponseEntity<>(logisstockService.updateStocks(l_code, stock), HttpStatus.OK); // 200
//	}
//	
//	// 게시글 상세 GetMapping = > http://localhost:8081/api/Warehouse/{num}
//	@GetMapping("/stockItem/{l_code}") // 조회는 GetMapping
//	public ResponseEntity<LogisStockDTO> findByCode(@PathVariable int l_code) {
//		System.out.println("<<< /stockItem/{l_code} - findByCode >>>");
//		return new ResponseEntity<>(logisstockService.findById(l_code), HttpStatus.OK); // 200을 리턴해라
//	}

	// 게시글 상세 GetMapping = > http://localhost:8081/api/Warehouse/{num}
//	@GetMapping("/delivery/{l_code}") // 조회는 GetMapping
//	public ResponseEntity<LogisStockDTO> findBySales(@PathVariable int l_code) {
//		System.out.println("<<< /delivery/{l_code} - findByCode >>>");
//		return new ResponseEntity<>(logisstockService.findById(l_code), HttpStatus.OK); // 200을 리턴해라
//	}
}
