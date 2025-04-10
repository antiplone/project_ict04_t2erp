package com.spring.erp_ordit.controller.buy;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.spring.erp_ordit.dto.buy.BuyOrderDTO;
import com.spring.erp_ordit.dto.buy.BuyOrderItemDTO;
import com.spring.erp_ordit.dto.buy.BuyOrderRequest;
import com.spring.erp_ordit.dto.buy.BuyStatusDTO;
import com.spring.erp_ordit.service.buy.BuyOrderServiceImpl;

@RestController // RestController는 리턴타입이 JSON
@RequestMapping("/buy")
@CrossOrigin	// 추가  
public class BuyOrderController { // 작성자 - hjy 구매 조회 페이지
	
	@Autowired
	private BuyOrderServiceImpl buyOrderService;
	
	// 구매조회 탭 전체 목록 GetMapping => http://localhost:8081/buy/buyOrderAllList
	@GetMapping("/buyOrderAllList")
	public ResponseEntity<?> buyOrderAllList() {	// ?를 주면 자동으로 적용된다. T 와 같은 의미, 데이터가 아직 결정되지 않았다는 뜻 => Integer 또는 ? 를 주면 된다. 
		System.out.println("<<< buyOrderAllList >>>");
		
		return new ResponseEntity<>(buyOrderService.getBuyOrderAllList(), HttpStatus.OK); //200
	}
	
	// 구매조회 탭 미확인 목록 GetMapping => http://localhost:8081/buy/buyOrderUnchkList
	@GetMapping("/buyOrderUnchkList")
	public ResponseEntity<?> buyOrderUnchkList() {	// ?를 주면 자동으로 적용된다. T 와 같은 의미, 데이터가 아직 결정되지 않았다는 뜻 => Integer 또는 ? 를 주면 된다. 
		System.out.println("<<< buyOrderUnchkList >>>");
		
		return new ResponseEntity<>(buyOrderService.getBuyOrderUnchkList(), HttpStatus.OK); //200
	}
	
	// 구매조회 탭 미확인 "건수" 조회 GetMapping => http://localhost:8081/buy/buyOrderUnchkCount
	@GetMapping("/buyOrderUnchkCount")
	public ResponseEntity<?> buyOrderUnchkCount() {	// ?를 주면 자동으로 적용된다. T 와 같은 의미, 데이터가 아직 결정되지 않았다는 뜻 => Integer 또는 ? 를 주면 된다. 
		System.out.println("<<< buyOrderUnchkCount >>>");
		
		return new ResponseEntity<>(buyOrderService.getBuyOrderUnchkCount(), HttpStatus.OK); //200
	}
	
	// 구매조회 탭 확인 목록 GetMapping => http://localhost:8081/buy/buyOrderCheckList
	@GetMapping("/buyOrderCheckList")
	public ResponseEntity<?> buyOrderCheckList() {	// ?를 주면 자동으로 적용된다. T 와 같은 의미, 데이터가 아직 결정되지 않았다는 뜻 => Integer 또는 ? 를 주면 된다. 
		System.out.println("<<< buyOrderCheckList >>>");
		
		return new ResponseEntity<>(buyOrderService.getBuyOrderCheckList(), HttpStatus.OK); //200
	}
	
	// 구매 입력 (물품코드, 물품명, 수량, 가격, 공급가, 부가세, 총액) PostMapping => http://localhost:8081/buy/buyInsertAll
	@PostMapping("/buyInsertAll")
    public ResponseEntity<?> buyInsertAll(@RequestBody BuyOrderRequest request) {
		System.out.println("<<< buyInsertAll >>>");
		
		BuyOrderDTO order = request.getOrder();
	    List<BuyOrderItemDTO> items = request.getItems();
		
		buyOrderService.setBuyInsertAll(order, items);
		
		return new ResponseEntity<>("구매 입력 성공!", HttpStatus.CREATED);
    }
	
	// 구매현황 조회 GetMapping => http://localhost:8081/buy/buyStatusSearch
	@GetMapping("/buyStatusSearch")
	public ResponseEntity<List<BuyStatusDTO>> buyStatusSearch(	// ?를 주면 자동으로 적용된다. T 와 같은 의미, 데이터가 아직 결정되지 않았다는 뜻 => Integer 또는 ? 를 주면 된다. 
		// @RequestParam은 GET 요청의 쿼리 파라미터를 바인딩할 때 사용 => ex)clientCode=1001&buyType=부과세율 적용
		@RequestParam(required = false) String order_date,
	    @RequestParam(required = false) String client_code,
	    @RequestParam(required = false) String e_id,
	    @RequestParam(required = false) String storage_code,
	    @RequestParam(required = false) String item_code,
	    @RequestParam(required = false) String transaction_type
	) {
	    System.out.println("<<< buyStatusSearch >>>");

	    // 서비스 메서드 호출 (파라미터 전달)
	    List<BuyStatusDTO> result = buyOrderService.getBuyStatusSearch(
	    		order_date, client_code, e_id, storage_code, item_code, transaction_type
	    );

	    return new ResponseEntity<>(result, HttpStatus.OK); // 200 OK
	}
	
}
