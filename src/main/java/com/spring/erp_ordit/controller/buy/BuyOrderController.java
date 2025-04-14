package com.spring.erp_ordit.controller.buy;

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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.spring.erp_ordit.dto.buy.BuyOrderDTO;
import com.spring.erp_ordit.dto.buy.BuyOrderDetailDTO;
import com.spring.erp_ordit.dto.buy.BuyOrderItemDTO;
import com.spring.erp_ordit.dto.buy.BuyOrderRequest;
import com.spring.erp_ordit.dto.buy.BuyStatusDTO;
import com.spring.erp_ordit.service.buy.BuyOrderServiceImpl;

@RestController // RestController는 리턴타입이 JSON
@RequestMapping("/buy")
@CrossOrigin	// 추가  
public class BuyOrderController { // 작성자 - hjy 주문관련 controller => 구매조회(전체,결재중,미확인,확인), 구매 입력, 구매현황 조회, 구매내역 삭제
	
	@Autowired
	private BuyOrderServiceImpl buyOrderService;
	
	// 구매조회 탭 <전체> 목록 GetMapping => http://localhost:8081/buy/buyOrderAllList
	@GetMapping("/buyOrderAllList")
	public ResponseEntity<?> buyOrderAllList() {	// ?를 주면 자동으로 적용된다. T 와 같은 의미, 데이터가 아직 결정되지 않았다는 뜻 => Integer 또는 ? 를 주면 된다. 
		System.out.println("<<< buyOrderAllList >>>");
		
		return new ResponseEntity<>(buyOrderService.getBuyOrderAllList(), HttpStatus.OK); //200
	}
	
	// 구매조회 탭 <결재중> 목록 GetMapping => http://localhost:8081/buy/buyOrderPayingList
	@GetMapping("/buyOrderPayingList")
	public ResponseEntity<?> buyOrderPayingList() {	// ?를 주면 자동으로 적용된다. T 와 같은 의미, 데이터가 아직 결정되지 않았다는 뜻 => Integer 또는 ? 를 주면 된다. 
		System.out.println("<<< buyOrderPayingList >>>");
		
		return new ResponseEntity<>(buyOrderService.getBuyOrderPayingList(), HttpStatus.OK); //200
	}
	
	// 구매조회 탭 <미확인> 목록 GetMapping => http://localhost:8081/buy/buyOrderUnchkList
	@GetMapping("/buyOrderUnchkList")
	public ResponseEntity<?> buyOrderUnchkList() {	// ?를 주면 자동으로 적용된다. T 와 같은 의미, 데이터가 아직 결정되지 않았다는 뜻 => Integer 또는 ? 를 주면 된다. 
		System.out.println("<<< buyOrderUnchkList >>>");
		
		return new ResponseEntity<>(buyOrderService.getBuyOrderUnchkList(), HttpStatus.OK); //200
	}
	
	// 구매조회 탭 <미확인> "건수" 조회 GetMapping => http://localhost:8081/buy/buyOrderUnchkCount
	@GetMapping("/buyOrderUnchkCount")
	public ResponseEntity<?> buyOrderUnchkCount() {	// ?를 주면 자동으로 적용된다. T 와 같은 의미, 데이터가 아직 결정되지 않았다는 뜻 => Integer 또는 ? 를 주면 된다. 
		System.out.println("<<< buyOrderUnchkCount >>>");
		
		return new ResponseEntity<>(buyOrderService.getBuyOrderUnchkCount(), HttpStatus.OK); //200
	}
	
	// 구매조회 탭 <확인> 목록 GetMapping => http://localhost:8081/buy/buyOrderCheckList
	@GetMapping("/buyOrderCheckList")
	public ResponseEntity<?> buyOrderCheckList() {	// ?를 주면 자동으로 적용된다. T 와 같은 의미, 데이터가 아직 결정되지 않았다는 뜻 => Integer 또는 ? 를 주면 된다. 
		System.out.println("<<< buyOrderCheckList >>>");
		
		return new ResponseEntity<>(buyOrderService.getBuyOrderCheckList(), HttpStatus.OK); //200
	}
	
	// 구매 내역 1건 <상세> 조회 GetMapping => http://localhost:8081/buy/buyOrderDetail/{order_id}
	@GetMapping("/buyOrderDetail/{order_id}")
	public ResponseEntity<?> buyOrderDetail(@PathVariable Long order_id) {	// ?를 주면 자동으로 적용된다. T 와 같은 의미, 데이터가 아직 결정되지 않았다는 뜻 => Integer 또는 ? 를 주면 된다. 
		List<BuyOrderDetailDTO> orderList = buyOrderService.getBuyOrderDetail(order_id);
		
		System.out.println("<<< buyOrderDetail >>>");
		System.out.println("orderList:" + orderList);
		
		return new ResponseEntity<>(buyOrderService.getBuyOrderDetail(order_id), HttpStatus.OK); //200
	}
	
	// 구매내역 수정 PutMapping => http://localhost:8081/buy/buyOrderUpdate/{order_id}
	@PutMapping("/buyOrderUpdate/{order_id}")
	public ResponseEntity<?> buyOrderUpdate(@PathVariable int order_id, @RequestBody BuyOrderRequest request){
		
		System.out.println("<<< boyOrderUpdate >>>");
		System.out.println("order_id = " + order_id);
	    System.out.println("request = " + request);
		
		return new ResponseEntity<>(buyOrderService.buyOrderUpdate(order_id, request), HttpStatus.OK);	// 200
	}

	// 구매 입력 <한건의 주문정보 + 다건의 물품정보> PostMapping => http://localhost:8081/buy/buyInsertAll
	@PostMapping("/buyInsertAll")
    public ResponseEntity<?> buyInsertAll(@RequestBody BuyOrderRequest request) {	// @RequestBody BuyOrderRequest request => 화면에서 입력받은 JSON 데이터를 BuyOrderRequest 객체로 변환해서 받음
		System.out.println("<<< buyInsertAll >>>");
		
		// BuyOrderRequest 클래스에서 주문정보와 물품정보을 get으로 꺼냄.
		BuyOrderDTO order = request.getOrder();
	    List<BuyOrderItemDTO> items = request.getItems();
		
		buyOrderService.setBuyInsertAll(order, items);
		
		return new ResponseEntity<>("구매 입력 성공!", HttpStatus.CREATED);
    }
	
//	// 구매 입력 엑셀 전환 Aapache POI API PostMapping => http://localhost:8081/buy/api/export/excel
//	@GetMapping("/export/excel")
//	public void exportOrderListToExcel(HttpServletResponse response) throws Exception {
//		
//		// response 설정 (엑셀 파일로 다운로드됨)
//	    response.setContentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
//	    response.setHeader("Content-Disposition", "attachment; filename=buy_list.xlsx");
//	    
//	    // Workbook 생성
////	    Workbook workbook = new XSSFWorkbook();
////	    Sheet sheet = workbook.createSheet("구매내역");
//
//		
//	}
	
	// 구매 현황 조회 GetMapping => http://localhost:8081/buy/buyStatusSearch
	@GetMapping("/buyStatusSearch")
	public ResponseEntity<List<BuyStatusDTO>> buyStatusSearch(	// ?를 주면 자동으로 적용된다. T 와 같은 의미, 데이터가 아직 결정되지 않았다는 뜻 => Integer 또는 ? 를 주면 된다. 
		// @RequestParam은 GET 요청의 쿼리 파라미터를 바인딩할 때 사용 => ex)clientCode=1001&buyType=부과세율 적용
		// required = false: 선택적인 파라미터 → 안 보내도 null로 들어가게 하려고 씀.
		@RequestParam(required = false) String start_date, 
		@RequestParam(required = false) String end_date, 
	    @RequestParam(required = false) String client_code,
	    @RequestParam(required = false) String e_id,
	    @RequestParam(required = false) String storage_code,
	    @RequestParam(required = false) String item_code,
	    @RequestParam(required = false) String transaction_type
	) {
	    System.out.println("<<< buyStatusSearch >>>");

	    // 서비스 메서드 호출 (파라미터 전달)
	    List<BuyStatusDTO> result = buyOrderService.getBuyStatusSearch(
	    		start_date, end_date, client_code, e_id, storage_code, item_code, transaction_type
	    );
	    
	    System.out.println("start_date: " + start_date);
	    System.out.println("end_date: " + end_date);
	    
	    return new ResponseEntity<>(result, HttpStatus.OK); // 200 OK
	}
	
	// 구매내역 삭제 DeleteMapping => http://localhost:8081/buy/buyOrder/{order_id}
	@DeleteMapping("/buyOrder/{order_id}")
	public ResponseEntity<?> buyOrderDelete(@PathVariable int order_id){
		System.out.println("<<< buyOrderDelete >>>");
		
		return new ResponseEntity<String>(buyOrderService.buyOrderDelete(order_id), HttpStatus.OK);	// 200
	}

}
