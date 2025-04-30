-- [근태관리-근태항목관리 테이블] ---------------------------------------------------
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


-- [근태관리-휴가항목관리 테이블] ---------------------------------------------------
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


-- [인사관리-퇴직 테이블] ---------------------------------------------------
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

-- API
-- [ 날씨 API 테이블 ] ---------------------------------------------------
DROP TABLE weather_info;
CREATE TABLE weather_info (
    weather_id INT AUTO_INCREMENT PRIMARY KEY,	-- 기본키
    weather_date DATE NOT NULL,					-- 예보 날짜
    weather_time TIME NOT NULL,          		-- 예보 시간
    weather_temperature DECIMAL(5,2),    		-- 기온 (섭씨):소수점 2자리까지, 예: 15.25도
    weather_rain_probability INT,        		-- 강수확률 (0~100, 비올 확률 %)
    weather_humidity INT,                		-- 습도 (0~100, 대기 중 수분 %)
    weather_description VARCHAR(100),    		-- 사람이 읽는 날씨 설명 (맑음, 흐림 등)
    weather_created_at DATETIME DEFAULT CURRENT_TIMESTAMP-- 이 데이터가 저장된 시간 (기본 현재시간 자동 기록)
);

-- [ Full Calendar ] ---------------------------------------------------
DROP TABLE calendar_event_tbl;
CREATE TABLE calendar_event_tbl (
    cal_event_id INT AUTO_INCREMENT PRIMARY KEY,   -- 일정 고유 ID
    cal_title VARCHAR(100) NOT NULL,                -- 일정 제목
    cal_start_date DATETIME NOT NULL,               -- 시작 날짜 및 시간
    cal_end_date DATETIME,                          -- 종료 날짜 및 시간 (nullable)
    cal_all_day CHAR(1) DEFAULT 'N',              	-- 종일 여부. Y라면 하루 종일 표시됨.
    cal_description TEXT,                           -- 일정 상세 설명
    cal_location VARCHAR(100),                      -- 장소
    cal_event_type VARCHAR(100),  -- 일정 유형
    e_id INT,                     -- 작성자 (사원명 또는 관리자 ID)
    cal_created_at DATETIME DEFAULT CURRENT_TIMESTAMP, -- 등록일시(=현재시간)
    cal_updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, -- 수정일시. UPDATE 쿼리가 발생할 때 자동으로 수정 시간을 최신으로 갱신함.
    FOREIGN KEY(e_id)
    	REFERENCES employee_tbl(e_id)
    		ON DELETE CASCADE
    		ON UPDATE CASCADE
);