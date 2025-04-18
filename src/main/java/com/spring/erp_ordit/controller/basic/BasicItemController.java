package com.spring.erp_ordit.controller.basic;

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

import com.spring.erp_ordit.dto.basic.BaiscItemDTO;
import com.spring.erp_ordit.service.basic.BasicItemServiceImpl;

@RestController // RestController는 리턴타입이 JSON
@RequestMapping("/basic")
@CrossOrigin	// 추가  
public class BasicItemController {

	@Autowired
	private BasicItemServiceImpl services;
	
	// 기초 상품 목록 GetMapping -> http://localhost:8081/basic/itemList
		@GetMapping("/itemList")
		public ResponseEntity<?> basicItemList(){
			System.out.println("<< ItemController - basicItemList >>");
		
			return new ResponseEntity<>(services.basicItemList(), HttpStatus.OK);	// 200
		}
		
	// 구매물품 등록 PostMapping => http://localhost:8081/api/orderItem
	@PostMapping("/itemInsert")
	public ResponseEntity<?> basicInsertItem(@RequestBody BaiscItemDTO item) {	// ?를 주면 자동으로 적용된다. T 와 같은 의미, 데이터가 아직 결정되지 않았다는 뜻 => int 또는 ? 를 주면 된다. 
		System.out.println("<<< basicInsertItem >>>");
		
		return new ResponseEntity<>(services.basicInsertItem(item), HttpStatus.CREATED); // 201 // <>를 주면 위에 있는 <int>안에 있는게 그대로 적용된다.
	}
	
	// 게시글 상세 GetMapping -> http://localhost:8081/basic/itemList/{item_code}
//	@GetMapping("/itemList/{item_code}")
//	public ResponseEntity<?> basicItemDetail(@PathVariable int item_code){
//		System.out.println("<< ItemController - basicItemDetail >>");
//	
//		return new ResponseEntity<>(services.basicItemDetail(item_code), HttpStatus.OK);	// 200
//	}
	
	// 게시글 수정 @PutMapping -> http://localhost:8081/basic/item/{item_code}
	@PutMapping("/itemUpdate/{item_code}")
	public ResponseEntity<?> basicUpdateItem(@PathVariable int item_code, @RequestBody BaiscItemDTO item) {
		System.out.println("<< basicUpdateItem >>");
		
		return new ResponseEntity<>(services.basicUpdateItem(item_code, item), HttpStatus.OK);	// 200
	}
	
	// 게시글 삭제 @DeleteMapping -> http://localhost:8081/erp/item/{item_code}
	@DeleteMapping("/itemDelete/{item_code}")
	public ResponseEntity<?> basicDeleteItem(@PathVariable int item_code) {
		System.out.println("<< ItemController - basicDeleteItem >>");
		
		return new ResponseEntity<>(services.basicDeleteItem(item_code), HttpStatus.OK);
	}

}
