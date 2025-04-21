-- [근태항목관리 테이블] ---------------------------------------------------
create table attendance_tbl(   
   a_list_no INT AUTO_INCREMENT primary key,   -- 근태 게시글번호(자동증가), PK
   a_code INT UNIQUE not NULL,               -- 근태번호, UK
   a_name VARCHAR(100) not null,              -- 근태명
   a_type VARCHAR(40) default '기본' not null,   -- 근태유형
   a_use VARCHAR(1) default 'Y',            -- 근태 사용여부(Y/N)
   a_note TEXT,                          -- 비고
   v_name VARCHAR(100),
   foreign key (v_name)
   references vacation_tbl(v_name)
   on delete set null   -- 값 삭제시, 참조하던 값만 null로 설정됨 (컬럼은 남아 있음!)
   on update cascade   -- 참조되는 테이블이 컬럼값이 변경되면 똑같이 값이 변경되도록 설정
);

-- 뷰 생성
CREATE OR REPLACE VIEW attendance_view AS
SELECT *,
       ROW_NUMBER() OVER (ORDER BY a_list_no DESC) AS rn
FROM attendance_tbl;
-- 뷰 조회
SELECT * FROM attendance_view;


-- [근태관리-출퇴근 테이블] ---------------------------------------------------
-- DATETIME 이 아닌 TIME 으로 설정한 이유 : 이미 날짜를 다른 컬럼으로 저장하기도 했고, 근무 시간 비교와 계산이 쉬워짐.
DROP TABLE commute_tbl;
CREATE TABLE commute_tbl(
	co_list_no INT AUTO_INCREMENT PRIMARY KEY,	-- 행 번호
	co_work_date DATE NOT NULL DEFAULT (CURRENT_DATE()),-- 출근 시간을 찍은 날짜. 즉, 오늘 날짜
	co_start_time TIME,				-- 출근시간
	co_end_time TIME,				-- 퇴근시간
	co_total_work_time TIME,		-- 총 근무 시간 (자동 계산)
	co_status VARCHAR(20), 			-- 상태(지각, 정상, 결근)
	co_status_note VARCHAR(100),	-- 상태비고(지각이라면 왜 지각인지 작성하는 부분)
	e_id INT, 						-- 사원번호
	FOREIGN KEY(e_id) REFERENCES employee_tbl(e_id) ON DELETE CASCADE
);


-- [휴가항목관리 테이블] ---------------------------------------------------
drop table vacation_tbl;
create table vacation_tbl(	
	v_list_no INT AUTO_INCREMENT primary key,	-- 휴가 게시글번호(자동증가), PK
	v_code INT UNIQUE,							-- 휴가코드, UK
	v_name VARCHAR(100) UNIQUE NOT NULL,  		-- 휴가명
	v_start Date NOT NULL,						-- 휴가기간 시작날
	v_end Date NOT NULL,						-- 휴가기간 마지막날
-- 	v_period VARCHAR(40) NOT NULL,				-- 휴가 기간
	v_use VARCHAR(1) default 'Y',				-- 휴가 사용여부(Y/N)
	v_note TEXT	        						-- 비고
);


-- [사원 - 퇴직 테이블] ---------------------------------------------------
DROP TABLE retirement_tbl;
CREATE TABLE retirement_tbl(
	resi_list_no INT auto_increment PRIMARY KEY,			-- 퇴직 테이블의 번호, PK
	resi_type VARCHAR(40) NOT NULL,  						-- 퇴사 유형(사직/퇴사/면직/기타)
	resi_app_date DATE DEFAULT (CURRENT_DATE()) NOT NULL,	-- 퇴사 신청일
	resi_date DATE, 										-- 퇴사 예정일
	resi_approval_status VARCHAR(10) DEFAULT '진행중' NOT NULL,-- 승인 상태(=결재 상태, 진행중(ING)/승인(YES)/반려(NO))
	resi_reasons VARCHAR(150),								-- 승인 반려 이유
	resi_succession_yn VARCHAR(1) DEFAULT 'Y' NOT NULL,		-- 인수인계 완료 여부
	resi_note TEXT,											-- 퇴사 이유(=비고)
	e_id INT,												-- 사번
    FOREIGN KEY (e_id)
    REFERENCES employee_tbl(e_id)
    ON DELETE CASCADE	-- 
    ON UPDATE CASCADE,	-- 사원 번호가 바뀌면 퇴직 테이블에서도 자동으로 업데이트됨
    
	-- 퇴사 당시 정보 보존용
	e_name VARCHAR(60),		-- 사원명
	e_position VARCHAR(40),	-- 직위
	d_name VARCHAR(100)		-- 부서명
);