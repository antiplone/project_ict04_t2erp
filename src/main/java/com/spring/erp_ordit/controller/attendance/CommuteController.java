package com.spring.erp_ordit.controller.attendance;

import java.util.List;

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
@CrossOrigin
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
	@GetMapping("/myAttList/{e_id}")
	public ResponseEntity<List<CommuteDTO>> myAttList(@PathVariable int e_id) {
	    log.info("▶ e_id 직접 전달: {}", e_id);
		return new ResponseEntity<>(service.myAttendanceList(e_id), HttpStatus.OK);
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

	// 오늘자 출퇴근 1건만 조회 ⇒ http://localhost:8081/attendance/todayRecord?e_id=7
	@GetMapping("/todayRecord/{e_id}/{date}")
	public ResponseEntity<?> getTodayRecord(@PathVariable Integer e_id, @PathVariable String date) {
		System.out.println("▶ CommuteController - 오늘 출퇴근 1건 조회- 날짜: " + date);
	    return new ResponseEntity<>(service.getRecordByDate(e_id, date), HttpStatus.OK);
	}
	// 서버에서 CURRENT_DATE를 쓰면 서버 시간 기준인 UTC 기준를 사용함 → 어제일 수도 있음
	// 하지만 프론트엔드는 클라이언트 시간을 기준으로 오늘 날짜를 판단하기 때문에, 서버-클라이언트의 시간이 달라짐.
	// 따라서, 프론트엔드에서 '오늘 날짜'를 직접 문자열로 넘기는 방식을 사용함.

	
	// 출퇴근 수정(Put) ⇒ http://localhost:8081/attendance/commUpdate/e_id
	@PutMapping("/commUpdate/{e_id}")
	public ResponseEntity<?> commUpdate(@PathVariable Integer e_id, @RequestBody CommuteDTO dto) {
		System.out.println("▶ CommuteController - 출퇴근 수정: " + e_id);
		return new ResponseEntity<>(service.commUpdate(e_id, dto), HttpStatus.OK);
	}
}
