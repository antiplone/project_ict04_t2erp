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

import com.spring.erp_ordit.dto.warehouse.LogisStatusDTO;
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
		System.out.println("<<< stockList - Controller >>>");
		return new ResponseEntity<>(logisstockService.logisstockList(), HttpStatus.OK);
	}

	// 입고 확정
	@PutMapping("/stockUpdate")
	public ResponseEntity<?> updateStock(@RequestParam(required = false) Integer stock_amount, @RequestParam(required =false) Integer item_code, @RequestParam(required = false) Integer storage_code, @RequestParam(required = false) Integer order_id){
		System.out.println("<<< stockUpdate - Controller >>>");
		System.out.println("item_code : " + item_code + ", stock_amount : " + stock_amount + ", order_id : " + order_id + ", storage_code : " + storage_code);

		return new ResponseEntity<>(logisstockService.updateOrderStock(stock_amount, item_code, storage_code, order_id), HttpStatus.OK); // 200
	}
	
	// 입고 확정
	@PutMapping("/sellStockUpdate")
	public ResponseEntity<?> sellStockUpdate(@RequestParam(required = false) Integer stock_amount, @RequestParam(required =false) Integer item_code, @RequestParam(required = false) Integer storage_code, @RequestParam(required = false) Integer order_id){
		System.out.println("<<< stockUpdate - Controller >>>");
		System.out.println("item_code : " + item_code + ", stock_amount : " + stock_amount + ", order_id : " + order_id + ", storage_code : " + storage_code);

		return new ResponseEntity<>(logisstockService.updateSellStock(stock_amount, item_code, storage_code, order_id), HttpStatus.OK); // 200
	}

	@GetMapping("/logisStockSearch")
	public ResponseEntity<List<LogisStockDTO>> logisStockSearch(	// ?를 주면 자동으로 적용된다. T 와 같은 의미, 데이터가 아직 결정되지 않았다는 뜻 => Integer 또는 ? 를 주면 된다. 
		// required = false: 선택적인 파라미터 → 안 보내도 null로 들어가게 하려고 씀.
		@RequestParam(required = false) String start_date, 
		@RequestParam(required = false) String end_date, 
	    @RequestParam(required = false) Integer item_code,
	    @RequestParam(required = false) Integer storage_code
	) {
	    System.out.println("<<< logisStockSearch - Controller >>>");

	    System.out.println("start_date: " + start_date);
	    System.out.println("end_date: " + end_date);
	    System.out.println("item_code: " + item_code);
	    System.out.println("storage_code: " + storage_code);
	    
	    // 서비스 메서드 호출 (파라미터 전달)
	    List<LogisStockDTO> result = logisstockService.logisStockSearch(
	    		start_date, end_date, item_code, storage_code
	    );
	    
	    
	    return new ResponseEntity<>(result, HttpStatus.OK); // 200 OK
	}
	
	@GetMapping("/exportStockExcel")
	public ResponseEntity<List<LogisStockDTO>> logisExcelPrint(	// ?를 주면 자동으로 적용된다. T 와 같은 의미, 데이터가 아직 결정되지 않았다는 뜻 => Integer 또는 ? 를 주면 된다. 
		// required = false: 선택적인 파라미터 → 안 보내도 null로 들어가게 하려고 씀.
		@RequestParam(required = false) String start_date, 
		@RequestParam(required = false) String end_date, 
	    @RequestParam(required = false) Integer item_code,
	    @RequestParam(required = false) Integer storage_code
	) {
	    System.out.println("<<< logisStockSearch - Controller >>>");

	    System.out.println("start_date: " + start_date);
	    System.out.println("end_date: " + end_date);
	    System.out.println("item_code: " + item_code);
	    System.out.println("storage_code: " + storage_code);
	    
	    // 서비스 메서드 호출 (파라미터 전달)
	    List<LogisStockDTO> result = logisstockService.logisStockSearch(
	    		start_date, end_date, item_code, storage_code
	    );
	    
	    
	    return new ResponseEntity<>(result, HttpStatus.OK); // 200 OK
	}
}
