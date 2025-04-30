package com.spring.erp_ordit.controller.buy;

import java.io.IOException;
import java.util.List;
import java.util.Map;

import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletResponse;

import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.DataFormat;
import org.apache.poi.ss.usermodel.FillPatternType;
import org.apache.poi.ss.usermodel.Font;
import org.apache.poi.ss.usermodel.HorizontalAlignment;
import org.apache.poi.ss.usermodel.IndexedColors;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
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

import com.spring.erp_ordit.dto.buy.BuyOrderRequest;
import com.spring.erp_ordit.dto.buy.BuyStatusDTO;
import com.spring.erp_ordit.dto.buy.BuyStockStatusDTO;
import com.spring.erp_ordit.service.buy.BuyOrderServiceImpl;

@RestController // RestController는 리턴타입이 JSON
@RequestMapping("/buy")
@CrossOrigin	// 추가  
public class BuyOrderController { // 작성자 - hjy 주문관련 controller => 구매조회(전체,결재중,미확인,확인), 구매수정, 구매 입력, 구매현황 조회, 구매내역 삭제, 입고현황, 엑셀변환 API
	
	@Autowired
	private BuyOrderServiceImpl buyOrderService;
	
	// -------------  구매조회 페이지 --------------------------------------------------------------------------------------
	// 구매조회 탭 <전체> 목록 GetMapping => http://localhost:8081/buy/buyOrderAllList
	@GetMapping("/buyOrderAllList")
	public ResponseEntity<?> buyOrderAllList() {	// ?를 주면 자동으로 적용된다. T 와 같은 의미, 데이터가 아직 결정되지 않았다는 뜻 => Integer 또는 ? 를 주면 된다. 
		
		return new ResponseEntity<>(buyOrderService.getBuyOrderAllList(), HttpStatus.OK); //200
	}
	
	// 구매조회 탭 <결재중> 목록 GetMapping => http://localhost:8081/buy/buyOrderPayingList
	@GetMapping("/buyOrderPayingList")
	public ResponseEntity<?> buyOrderPayingList() {	
		
		return new ResponseEntity<>(buyOrderService.getBuyOrderPayingList(), HttpStatus.OK); //200
	}
	
	// 구매조회 탭 진행상태별 "건수" 조회 GetMapping => http://localhost:8081/buy/buyOrderStatusCounts
	@GetMapping("/buyOrderStatusCounts")
	public ResponseEntity<Map<String, Long>> buyOrderStatusCount() {	
		
		return new ResponseEntity<>(buyOrderService.getBuyOrderStatusCount(), HttpStatus.OK); //200
	}

// 판매팀 구매요청 프로세스 보류로 인해 주석처리	
//	// 구매조회 탭 <미확인> 목록 GetMapping => http://localhost:8081/buy/buyOrderUnchkList
//	@GetMapping("/buyOrderUnchkList")
//	public ResponseEntity<?> buyOrderUnchkList() {	
//		
//		return new ResponseEntity<>(buyOrderService.getBuyOrderUnchkList(), HttpStatus.OK); //200
//	}
	
//	// 구매조회 탭 <미확인> "건수" 조회 GetMapping => http://localhost:8081/buy/buyOrderUnchkCount
//	@GetMapping("/buyOrderUnchkCount")
//	public ResponseEntity<?> buyOrderUnchkCount() {	
//		
//		return new ResponseEntity<>(buyOrderService.getBuyOrderUnchkCount(), HttpStatus.OK); //200
//	}
	
	// 구매조회 탭 <확인> 목록 GetMapping => http://localhost:8081/buy/buyOrderCheckList
	@GetMapping("/buyOrderCheckList")
	public ResponseEntity<?> buyOrderCheckList() {	
		
		return new ResponseEntity<>(buyOrderService.getBuyOrderCheckList(), HttpStatus.OK); //200
	}
	
	// -------------  구매 상세 페이지 --------------------------------------------------------------------------------------
	// 구매 내역 1건 <상세> 조회 GetMapping => http://localhost:8081/buy/buyOrderDetail/{order_id}
	@GetMapping("/buyOrderDetail/{order_id}")
	public ResponseEntity<?> buyOrderDetail(@PathVariable Long order_id) {	
		
		return new ResponseEntity<>(buyOrderService.getBuyOrderDetail(order_id), HttpStatus.OK); //200
	}
	
	// -------------  구매 수정 페이지 --------------------------------------------------------------------------------------
	// 구매내역 수정 PutMapping => http://localhost:8081/buy/buyOrderUpdate/{order_id}
	@PutMapping("/buyOrderUpdate/{order_id}")
	public ResponseEntity<?> buyOrderUpdate(@PathVariable int order_id, @RequestBody BuyOrderRequest request){
		
		return new ResponseEntity<>(buyOrderService.buyOrderUpdate(order_id, request), HttpStatus.OK);	// 200
	}

	// -------------  구매입력 페이지 --------------------------------------------------------------------------------------
	// 구매 입력 <한건의 주문정보 + 다건의 물품정보> PostMapping => http://localhost:8081/buy/buyInsertAll
	@PostMapping("/buyInsertAll")
    public ResponseEntity<?> buyInsertAll(@RequestBody BuyOrderRequest request) {	// @RequestBody BuyOrderRequest request => 화면에서 입력받은 JSON 데이터를 BuyOrderRequest 객체로 변환해서 받음
		
		buyOrderService.setBuyInsertAll(request);
		
		return new ResponseEntity<>("구매 입력 성공!", HttpStatus.CREATED);
    }
	
	// -------------  구매삭제 --------------------------------------------------------------------------------------
	// 구매내역 삭제 DeleteMapping => http://localhost:8081/buy/buyOrder/{order_id}
	@DeleteMapping("/buyOrder/{order_id}")
	public ResponseEntity<?> buyOrderDelete(@PathVariable int order_id){
		
		return new ResponseEntity<String>(buyOrderService.buyOrderDelete(order_id), HttpStatus.OK);	// 200
	}
	
	// -------------  구매현황 페이지 --------------------------------------------------------------------------------------
	// 구매 현황 <전체> 조회 GetMapping => http://localhost:8081/buy/buyStatusAllList
	@GetMapping("/buyStatusAllList")
	public ResponseEntity<?> buyStatusAllList() {	// ?를 주면 자동으로 적용된다. T 와 같은 의미, 데이터가 아직 결정되지 않았다는 뜻 => Integer 또는 ? 를 주면 된다. 
		
		return new ResponseEntity<>(buyOrderService.getBuyStatusAllList(), HttpStatus.OK); //200
	}
	
	// 구매 현황 <검색> 조회 GetMapping => http://localhost:8081/buy/buyStatusSearch
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

	    // 서비스 메서드 호출 (파라미터 전달)
	    List<BuyStatusDTO> result = buyOrderService.getBuyStatusSearch(
	    		start_date, end_date, client_code, e_id, storage_code, item_code, transaction_type
	    );
	    
	    return new ResponseEntity<>(result, HttpStatus.OK); // 200 OK
	}
	
	// -------------  구매 현황 엑셀 전환 --------------------------------------------------------------------------------------
	// 구매 현황 엑셀 전환 Aapache POI API GetMapping => http://localhost:8081/buy/exportOrderStatusExcel
	@GetMapping("/exportOrderStatusExcel")
	public void exportOrderStatusExcel(
			// 화면에서 입력받은 검색 조건들을 URL 쿼리 스트링으로 받음
		    @RequestParam(required = false) String start_date,
		    @RequestParam(required = false) String end_date,
		    @RequestParam(required = false) String client_code,
		    @RequestParam(required = false) String e_id,
		    @RequestParam(required = false) String storage_code,
		    @RequestParam(required = false) String item_code,
		    @RequestParam(required = false) String transaction_type,
		    HttpServletResponse response) throws IOException {

		    List<BuyStatusDTO> OrderStatus = buyOrderService.getBuyStatusSearch(
		        start_date, end_date, client_code, e_id, storage_code, item_code, transaction_type
		    );
		    
		    // 응답 설정
		    response.setContentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"); // 브라우저가 엑셀파일을 인식하게 함.
		    response.setHeader("Content-Disposition", "attachment; filename=buy_orderStatus_result.xlsx"); // 다운로드 받는 이름 설정
		    
		    // try - catch를 써서 자동으로 닫히게 처리
		    try (Workbook workbook = new XSSFWorkbook(); // 새 엑셀 파일 만듦
	    	     ServletOutputStream out = response.getOutputStream()) { // 파일을 내려받는 스트림
		    
		    	 Sheet sheet = workbook.createSheet("구매현황"); // 시트 생성

		    // 헤더 style
		    CellStyle headerStyle = workbook.createCellStyle();
		    Font headerFont = workbook.createFont();
		    headerFont.setBold(true);
		    headerStyle.setFont(headerFont);
		    headerStyle.setFillForegroundColor(IndexedColors.GREY_25_PERCENT.getIndex()); // 배경 - 회색  
		    headerStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND); // 굵은 글씨
		    headerStyle.setAlignment(HorizontalAlignment.CENTER); // 가운데 정렬
		    
		    // 숫자 style
		    CellStyle numberStyle = workbook.createCellStyle();	
		    DataFormat format = workbook.createDataFormat();
		    numberStyle.setDataFormat(format.getFormat("#,##0")); // 숫자에 콤마 붙임. ex) 1,000
		    
		    // 날짜 style
		    CellStyle dateStyle = workbook.createCellStyle();
		    dateStyle.setDataFormat(format.getFormat("yyyy-mm-dd")); // 날짜 => ex) 25-04-17 

		    // 엑셀 첫 줄 - 헤더 작성
		    String[] headers = { "발주일자", "발주번호", "거래처명", "품목명", "수량", "단가", "공급가액", "부가세", "금액합계" };
		    // orderStatus 리스트 for문으로 엑셀에 입력
		    Row headerRow = sheet.createRow(0); 
		    
		    for (int i = 0; i < headers.length; i++) {
		        Cell cell = headerRow.createCell(i);
		        cell.setCellValue(headers[i]);
		        cell.setCellStyle(headerStyle);
		    }

		    // 데이터
		    int rowNum = 1;
		    for (BuyStatusDTO dto : OrderStatus) {
		    	// 열 너비 자동 조정
		        Row row = sheet.createRow(rowNum++); // 행 번호 자동증가

		        // 발주일자 
		        Cell cell0 = row.createCell(0);
		        cell0.setCellValue(dto.getOrder_date());
		        cell0.setCellStyle(dateStyle);

		        // 발주번호
		        row.createCell(1).setCellValue(dto.getOrder_id());
		        // 거래처명
		        row.createCell(2).setCellValue(dto.getClient_name());
		        // 물품명
		        row.createCell(3).setCellValue(dto.getItem_name());

		        // 수량
		        Cell cell4 = row.createCell(4);
		        cell4.setCellValue(dto.getQuantity());
		        cell4.setCellStyle(numberStyle);

		        // 단가
		        Cell cell5 = row.createCell(5);
		        cell5.setCellValue(dto.getPrice());
		        cell5.setCellStyle(numberStyle);

		        // 공급가액
		        Cell cell6 = row.createCell(6);
		        cell6.setCellValue(dto.getSupply());
		        cell6.setCellStyle(numberStyle);

		        // 부가세
		        Cell cell7 = row.createCell(7);
		        cell7.setCellValue(dto.getVat());
		        cell7.setCellStyle(numberStyle); 

		        // 총액
		        Cell cell8 = row.createCell(8);
		        cell8.setCellValue(dto.getTotal());
		        cell8.setCellStyle(numberStyle);
		    }

		    // 자동으로 너비조정
		    for (int i = 0; i < headers.length; i++) {
		        sheet.autoSizeColumn(i);
		    }

		    workbook.write(out); // 엑셀 파일을 브라우저로 보냄.
	        out.flush(); // flush()로 응답 밀어주기
	    }
		    
		    catch (IOException e) {
		        e.printStackTrace();
		        throw new RuntimeException("구매현황 엑셀 다운로드 중 오류가 발생하였습니다.", e);
		    }
		}
	
	// -------------  구매관리 - 입고조회 페이지 --------------------------------------------------------------------------------------
	// 구매 입고현황 <전체> 조회 GetMapping => http://localhost:8081/buy/buyStockStatusAllList
	@GetMapping("/stockStatusAllList")
	public ResponseEntity<?> buyStockStatusAllList() {	// ?를 주면 자동으로 적용된다. T 와 같은 의미, 데이터가 아직 결정되지 않았다는 뜻 => Integer 또는 ? 를 주면 된다. 
		
		return new ResponseEntity<>(buyOrderService.getBuyStockStatusAllList(), HttpStatus.OK); //200
	}
	
	// 구매관리 - 입고현황 - 검색한 내역조회 GetMapping => http://localhost:8081/buy/buyStockStatusSearch
	@GetMapping("/stockStatusSearch")
	public ResponseEntity<List<BuyStockStatusDTO>> buyStockStatusSearch(
		// @RequestParam은 GET 요청의 쿼리 파라미터를 바인딩할 때 사용 => ex)clientCode=1001&buyType=부과세율 적용
		// required = false: 선택적인 파라미터 → 안 보내도 null로 들어가게 하려고 씀.
		@RequestParam(required = false) String start_date,  
		@RequestParam(required = false) String end_date, 
		@RequestParam(required = false) String order_id, 
	    @RequestParam(required = false) String client_code,
	    @RequestParam(required = false) String item_code,
	    @RequestParam(required = false) String storage_code,
	    @RequestParam(required = false) String stock_amount,
	    @RequestParam(required = false) String safe_stock,
	    @RequestParam(required = false) String last_date	
				
	) {	
		
		// 서비스 메서드 호출 (파라미터 전달)
	    List<BuyStockStatusDTO> result = buyOrderService.getBuyStockStatusSearch(
	    		start_date, end_date, order_id, client_code, item_code, storage_code, stock_amount, safe_stock, last_date
	    );
		
			
	    return new ResponseEntity<>(result, HttpStatus.OK); // 200 OK
	}
	
	// 입고 현황 엑셀 전환 Aapache POI API GetMapping => http://localhost:8081/buy/exportStockStatusExcel
	@GetMapping("/exportStockStatusExcel")
	public void exportStoreExcel(
		    @RequestParam(required = false) String start_date,
		    @RequestParam(required = false) String end_date,
		    @RequestParam(required = false) String order_id,
		    @RequestParam(required = false) String client_code,
		    @RequestParam(required = false) String item_code,
		    @RequestParam(required = false) String storage_code,
		    @RequestParam(required = false) String stock_amount,
		    @RequestParam(required = false) String safe_stock,
		    @RequestParam(required = false) String last_date,
		    HttpServletResponse response) throws IOException {

			List<BuyStockStatusDTO> StockStatus = buyOrderService.getBuyStockStatusSearch(
		    		start_date, end_date, order_id, client_code, item_code, storage_code, stock_amount, safe_stock, last_date
		    );
			
			// 응답 설정
		    response.setContentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"); // 브라우저가 엑셀파일을 인식하게 함.
		    response.setHeader("Content-Disposition", "attachment; filename=buy_stockStatus_result.xlsx"); // 다운로드 받는 이름 설정
		    
		    // try - catch를 써서 자동으로 닫히게 처리
		    try (Workbook workbook = new XSSFWorkbook(); // 새 엑셀 파일 만듦
	    	     ServletOutputStream out = response.getOutputStream()) { // 파일을 내려받는 스트림
		    
		    	 Sheet sheet = workbook.createSheet("입고현황"); // 시트 생성
			
		    // 헤더 style
		    CellStyle headerStyle = workbook.createCellStyle();
		    Font headerFont = workbook.createFont();
		    headerFont.setBold(true);
		    headerStyle.setFont(headerFont);
		    headerStyle.setFillForegroundColor(IndexedColors.GREY_25_PERCENT.getIndex());
		    headerStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);
		    headerStyle.setAlignment(HorizontalAlignment.CENTER);
		    
		    // 숫자 style
		    CellStyle numberStyle = workbook.createCellStyle();
		    DataFormat format = workbook.createDataFormat();
		    numberStyle.setDataFormat(format.getFormat("#,##0"));
		    
		    // 날짜 style
		    CellStyle dateStyle = workbook.createCellStyle();
		    dateStyle.setDataFormat(format.getFormat("yyyy-mm-dd"));

			// 엑셀 첫 줄 - 헤더 작성
		    String[] headers = { "발주일자", "발주번호", "거래처명", "품목명", "창고명", "창고재고", "안전재고", "최근입고일" };
		    Row headerRow = sheet.createRow(0);
		    for (int i = 0; i < headers.length; i++) {
		        Cell cell = headerRow.createCell(i);
		        cell.setCellValue(headers[i]);
		        cell.setCellStyle(headerStyle);
		    }

		    // 데이터
		    int rowNum = 1;
		    for (BuyStockStatusDTO dto : StockStatus) {
		    	// 열 너비 자동 조정
		        Row row = sheet.createRow(rowNum++);
		        
		        // 발주일자 
		        Cell cell0 = row.createCell(0);
		        cell0.setCellValue(dto.getOrder_date());
		        cell0.setCellStyle(dateStyle);

		        // 발주번호
		        row.createCell(1).setCellValue(dto.getOrder_id());
		        // 거래처명
		        row.createCell(2).setCellValue(dto.getClient_name());
		        // 물품명
		        row.createCell(3).setCellValue(dto.getItem_name());

		        // 창고명
		        Cell cell4 = row.createCell(4);
		        cell4.setCellValue(dto.getStorage_name());

		        // 창고재고
		        Cell cell5 = row.createCell(5);
		        cell5.setCellValue(dto.getStock_amount());
		        cell5.setCellStyle(numberStyle);

		        // 안전재고
		        Cell cell6 = row.createCell(6);
		        cell6.setCellValue(dto.getSafe_stock());
		        cell6.setCellStyle(numberStyle);

		        // 최근입고일
		        Cell cell7 = row.createCell(7);
		        cell7.setCellValue(dto.getLast_date());
		        cell7.setCellStyle(dateStyle); 

		    }

		    // 자동으로 너비조정
		    for (int i = 0; i < headers.length; i++) {
		        sheet.autoSizeColumn(i);
		    }

		    workbook.write(out); // 엑셀 파일을 브라우저로 보냄.
	        out.flush(); // flush()로 응답 밀어주기
	    }
		    
		    catch (IOException e) {
		        e.printStackTrace();
		        throw new RuntimeException("입고현황 엑셀 다운로드 중 오류가 발생하였습니다.", e);
		    }
		}

}
