package com.spring.erp_ordit.controller.warehouse;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.spring.erp_ordit.dao.warehouse.LogisMapper;
import com.spring.erp_ordit.dto.warehouse.LogisSalesDTO;
import com.spring.erp_ordit.dto.warehouse.LogisStatusDTO;
import com.spring.erp_ordit.service.warehouse.LogisSalesServiceImpl;

@RestController
@RequestMapping("/logissales")
@CrossOrigin(origins = "*")
public class LogisSaleslController {
	
	@Autowired
	private LogisSalesServiceImpl salesService;
	
	// 주문 목록 GetMapping = > http://localhost:logissales/api/logisSalesList
	@GetMapping("/logisSalesList") // 조회는 GetMapping
	public ResponseEntity<List<LogisSalesDTO>> logisSalesList() {
		System.out.println("<<< logisSalesList >>>");
		return new ResponseEntity<>(salesService.logisSalesList(), HttpStatus.OK);
	}
	
	@GetMapping("/salesDetail/{order_id}") // 조회는 GetMapping
	public ResponseEntity<List<LogisSalesDTO>> findBySalesId(@PathVariable int order_id) {
		System.out.println("<<< /salesDetail/{order_id} - findBySalesId >>>");
		return new ResponseEntity<>(salesService.findByLogisSalesId(order_id), HttpStatus.OK); // 200을 리턴해라
	}

	@GetMapping("/salesItemDetail") // 조회는 GetMapping
	public ResponseEntity<?> findBySalesItem(@RequestParam(required = false) Integer order_id, @RequestParam(required = false) Integer item_code, @RequestParam(required = false) Integer order_type) {
		System.out.println("<<< /salesItemDetail/{order_id} - findBySalesItem >>>");
		System.out.println("item_code : " + item_code + ", order_id : " + order_id + ", order_type : " + order_type);
		
		return new ResponseEntity<>(salesService.findBySalesItem(order_id, item_code, order_type), HttpStatus.OK); // 200을 리턴해라
	}
	
	@GetMapping("/logisSalesSearch")
	public ResponseEntity<List<LogisStatusDTO>> logisSalesSearch(	// ?를 주면 자동으로 적용된다. T 와 같은 의미, 데이터가 아직 결정되지 않았다는 뜻 => Integer 또는 ? 를 주면 된다. 
		// required = false: 선택적인 파라미터 → 안 보내도 null로 들어가게 하려고 씀.
		@RequestParam(required = false) String start_date, 
		@RequestParam(required = false) String end_date, 
	    @RequestParam(required = false) String client_code,
	    @RequestParam(required = false) String e_id,
	    @RequestParam(required = false) Integer storage_code
	) {
	    System.out.println("<<< logisSalesSearch >>>");

	    System.out.println("start_date: " + start_date);
	    System.out.println("end_date: " + end_date);
	    System.out.println("client_code: " + client_code);
	    System.out.println("e_id: " + e_id);
	    System.out.println("storage_code: " + storage_code);
	    
	    // 서비스 메서드 호출 (파라미터 전달)
	    List<LogisStatusDTO> result = salesService.logisSalesSearch(
	    		start_date, end_date, client_code, e_id, storage_code
	    );
	    
	    
	    return new ResponseEntity<>(result, HttpStatus.OK); // 200 OK
	}
	
}
	
