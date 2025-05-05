package com.spring.erp_ordit.controller.hr;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

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
import org.springframework.web.multipart.MultipartFile;

import com.spring.erp_ordit.dto.hr.HrEmpCardDTO;
import com.spring.erp_ordit.service.hr.HrEmpCardService;

@RestController // RestController는 리턴타입이 JSON
@RequestMapping("/hrCard")
@CrossOrigin
public class HrEmpCardController {

	@Autowired
	private HrEmpCardService service;
	
	// 인사카드 목록 GetMapping -> http://localhost:8081/hrCard/hrCardList
		@GetMapping("/hrCardList")
		public ResponseEntity<?> hrEmpCardList(){
			// System.out.println("<< HrController - hrEmployeeCardList >>");
		
			return new ResponseEntity<>(service.hrEmpCardList(), HttpStatus.OK);
		}
		
	// 인사카드 등록 PostMapping => http://localhost:8081/hrCard/hrCardInsert
	@PostMapping("/hrCardInsert")
	public ResponseEntity<?> hrEmpCardInsert(@RequestBody HrEmpCardDTO empCard) { 
		// System.out.println("<<< HrController- hrEmpCardInsert >>>");
		
		return new ResponseEntity<>(service.hrEmpCardInsert(empCard), HttpStatus.CREATED);
	}
	
	// 인사카드 상세 GetMapping -> http://localhost:8081/hrCard/hrCardDetail/{e_id}
	@GetMapping("/hrCardDetail/{e_id}")
	public ResponseEntity<?> hrEmpCardDetail(@PathVariable int e_id){
		// System.out.println("<< HrController - basicItemDetail >>");
	
		return new ResponseEntity<>(service.hrEmpCardDetail(e_id), HttpStatus.OK);
	}
	
	// 인사카드 수정 @PutMapping -> http://localhost:8081/hrCard/hrCardUpdate/{e_id}
	@PutMapping("/hrCardUpdate/{e_id}")
	public ResponseEntity<?> hrEmpCardUpdate(@PathVariable int e_id, @RequestBody HrEmpCardDTO empCard) {
		// System.out.println("<< HrController - hrEmpCardUpdate >>");
		
		return new ResponseEntity<>(service.hrEmpCardUpdate(e_id, empCard), HttpStatus.OK);
	}
	
	// 인사카드 사진 등록 @PutMapping -> http://localhost:8081/hrCard/hrCardPhoto/{e_id}
	@PostMapping("/hrCardPhoto")
	public ResponseEntity<String> hrCardPhoto(@RequestParam("file") MultipartFile file) {		// @RequestParam("file") 프론트가 보낸 데이터 중 file에 해당하는 것을 받아옴, MultipartFile - 업로드된 파일을 담는 자료형
		String uploadDir = System.getProperty("user.dir") + "/src/upload/hr_photo/";			// 파일 저장할 서버 폴더 상대 경로, 현재 실행 중인 자바 애플리케이션의 루트 경로를 가져오는 것(즉, 자바 프로그램을 실행한 프로젝트 폴더가 잡히는 것)
	    String fileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();		// 파일 이름 겹치치 않게 랜덤한 이름 만들고 그 뒤에 원래 파일 이름 붙인다(UUID - 자동으로 고유한 ID 만들어주는 자바 기본 라이브러리) 

	    try {
	        Path filePath = Paths.get(uploadDir, fileName);		// 사진을 어디에 어떤 이름으로 저장할지 경로 만드는 것
	        Files.copy(file.getInputStream(), filePath);		// 사용자가 올린 파일을 방금 만든 경로에 복사해서 저장, 이떄 컴퓨터에 파일이 생긴다

	        // 클라이언트가 사용할 수 있는 경로 전달
	        String fileUrl = "http://localhost:8081/upload/hr_photo/" + fileName;	// 저장된 파일을 나중에 브라우저에서 접근할 수 있게 경로 만들어주는 것

	        return new ResponseEntity<>(fileUrl, HttpStatus.OK); // 파일 업로드 성공하면 클라이언트(프론트)한테 저장된 경로를 알려준다

	    } catch (IOException e) {		// 파일 저장 실패했을 경우
	        return new ResponseEntity<>("파일 업로드 실패", HttpStatus.INTERNAL_SERVER_ERROR);
	    }
	}
	
	// 인사카드 삭제 @DeleteMapping -> http://localhost:8081/hrCard/hrCardDelete/{e_id}
	@DeleteMapping("/hrCardDelete/{e_id}")
	public ResponseEntity<?> hrEmpCardDelete(@PathVariable int e_id) {
		System.out.println("<< HrController - hrEmpCardDelete >>");
		
		return new ResponseEntity<>(service.hrEmpCardDelete(e_id), HttpStatus.OK);
	}

}
