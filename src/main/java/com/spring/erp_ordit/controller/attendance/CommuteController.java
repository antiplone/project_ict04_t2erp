package com.spring.erp_ordit.controller.attendance;

import java.util.List;

import javax.servlet.http.HttpSession;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.spring.erp_ordit.dto.attendance.CommuteDTO;
import com.spring.erp_ordit.service.attendance.CommuteService;


@RestController		// return 타입이 JSON이다.
@RequestMapping("/attendance")
@CrossOrigin(origins = "*")
public class CommuteController {			// 근태관리-출퇴근 관리
	
	private static final Logger log = LoggerFactory.getLogger(CommuteService.class);
	
	@Autowired
	private CommuteService service;
	
	// 전체 근태 리스트 ⇒ http://localhost:8081/attendance/attList
	@GetMapping("/attList")
	public ResponseEntity<List<CommuteDTO>> attList() {
		log.info("▶ CommuteController - 출퇴근 리스트");
		return new ResponseEntity<>(service.attendanceList(), HttpStatus.OK);		// 200 리턴(select)
	}
	// 내 근태 리스트 ⇒ http://localhost:8081/attendance/myAttList
//	@GetMapping("/myAttList")
//	public ResponseEntity<List<CommuteDTO>> myAttList() {
//		log.info("▶ CommuteController - 내 출퇴근 리스트");
//		return new ResponseEntity<>(service.myAttendanceList(), HttpStatus.OK);		// 200 리턴(select)
//	}
	@GetMapping("/myAttList/{e_id}")
	public List<CommuteDTO> myAttList(HttpSession session) {
		log.info("▶ CommuteController - 내 출퇴근 리스트");
	    Object idObj = session.getAttribute("e_id");

	    if (idObj == null) {
	        throw new IllegalStateException("로그인이 필요한 서비스입니다.");
	    }

	    int e_id = (Integer) idObj;
	    return service.myAttendanceList(e_id);
	}


	// 출근 시간 저장 처리 ⇒ http://localhost:8081/attendance/startTime
	@PostMapping("/startTime")
	public ResponseEntity<String> startCommute(@RequestBody CommuteDTO dto) {
		System.out.println("▶ CommuteController - 출근 시간 저장 처리");
		return new ResponseEntity<>(service.insertStartTime(dto), HttpStatus.CREATED);
	}
	// 퇴근 시간 저장 처리 ⇒ http://localhost:8081/attendance/endTime
	@PostMapping("/endTime")
	public ResponseEntity<String> endCommute(@RequestBody CommuteDTO dto) {
		System.out.println("▶ CommuteController - 퇴근 시간 저장 처리");
		return new ResponseEntity<>(service.updateEndTime(dto), HttpStatus.CREATED);
	}

	// 오늘자 출퇴근 1건만 조회 ⇒ http://localhost:8081/attendance/todayRecord?e_id=27
	@GetMapping("/todayRecord/{e_id}")
	public ResponseEntity<?> getTodayRecord(@PathVariable Integer e_id) {
		System.out.println("▶ CommuteController - 오늘 출퇴근 1건 조회");
	    if (e_id == null) {
	    	System.out.println("❌ e_id 없음, " + e_id);
	        return ResponseEntity.badRequest().body("e_id가 필요합니다.");
	    }

	    // 정상이면 서비스 호출
		return new ResponseEntity<>(service.getTodayRecordByEmp(e_id), HttpStatus.OK);
	}

	// 출퇴근 수정(Put) ⇒ http://localhost:8081/attendance/commUpdate/e_id
	@PutMapping("/commUpdate/{e_id}")
	public ResponseEntity<?> commUpdate(@PathVariable Integer e_id, @RequestBody CommuteDTO dto) {
		System.out.println("▶ CommuteController - 출퇴근 수정: " + e_id);
		return new ResponseEntity<>(service.commUpdate(e_id, dto), HttpStatus.OK);
	}
}
