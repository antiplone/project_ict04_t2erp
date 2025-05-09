-- [거래처 테이블]
CREATE TABLE `client_tbl` (
  `client_code` INT PRIMARY key AUTO_INCREMENT,               -- 거래처 코드 (PK)
  `client_name` VARCHAR(100) NOT NULL,                        -- 거래처명
  `c_ceo` VARCHAR(100) NOT NULL,                              -- 대표자명
  `c_biz_num` VARCHAR(100) NOT NULL,                          -- 사업자등록번호
  `c_zone_code` VARCHAR(20) DEFAULT NULL,                     -- 우편번호
  `c_base_address` VARCHAR(200) DEFAULT NULL,                 -- 기본 주소
  `c_detail_address` VARCHAR(200) DEFAULT NULL,               -- 상세 주소
  `c_tel` VARCHAR(100) NOT NULL,                              -- 연락처
  `c_email` VARCHAR(150) DEFAULT NULL,                        -- 이메일
  `c_type` VARCHAR(100) DEFAULT NULL,                         -- 거래처 유형
  `c_industry` VARCHAR(100) DEFAULT NULL,                     -- 업종
  `c_status` VARCHAR(100) DEFAULT NULL,                       -- 거래 상태
  `c_note` TEXT,                                              -- 비고
  `c_reg_date` DATE NOT NULL                                  -- 등록일
);

-- [거래처 승인 테이블]
CREATE TABLE request_client_approval_tbl(
    sa_approval_id      INT PRIMARY KEY AUTO_INCREMENT,               -- 승인 처리 고유 번호
    sa_request_id       INT,                                          -- 요청 ID (request_client_tbl.sc_id)
    sa_e_id             INT,                                          -- 처리자 사번 (employee_tbl.e_id)
    sa_app_e_name       VARCHAR(60),                                  -- 처리자 이름
    sa_approval_status  VARCHAR(100) DEFAULT '진행중',                -- 승인 상태
    sa_approval_comment TEXT,                                         -- 비고
    sa_approval_date    DATETIME DEFAULT CURRENT_TIMESTAMP,           -- 승인 일자
    FOREIGN KEY (sa_request_id) REFERENCES request_client_tbl(sc_id)
        ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (sa_e_id) REFERENCES employee_tbl(e_id)
        ON DELETE CASCADE ON UPDATE CASCADE
);

-- [상품 테이블]
create table item_tbl(
   item_id			INT PRIMARY key AUTO_INCREMENT,	-- 물품 번호 
   item_code		INT,							              -- 물품코드
   item_name		VARCHAR(255) NOT NULL,			    -- 물품명
   item_status		VARCHAR(255),			            -- 물품 사용 상태
   item_standard	VARCHAR(255),					        -- 물품 규격
   item_reg_date	DATE NOT NULL						      -- 물품 등록일
);


CREATE TABLE employee_tbl (
  e_id INT AUTO_INCREMENT PRIMARY KEY,    		  -- 사원번호, PK
  e_name VARCHAR(60) NOT NULL,             		  -- 사원 이름
  e_tel VARCHAR(20) NOT NULL,               	  -- 사원 전화번호
  e_position VARCHAR(40) NOT NULL,         		  -- 사원 직위 (사원, 대리, 과장 등)
  e_reg_date DATE DEFAULT (CURRENT_DATE()), 	  -- 등록일 (기본값: 오늘 날짜)
  e_status VARCHAR(40) NOT NULL,            	  -- 재직 상태 (재직, 퇴직, 휴직 등)
  e_email VARCHAR(150) NOT NULL,            	  -- 이메일
  e_birth DATE NOT NULL,                    	  -- 생년월일
  e_entry VARCHAR(20),                      	  -- 입사 구분 (신입/경력)
  e_zone_code VARCHAR(20),                  	  -- 주소: 우편번호
  e_base_address VARCHAR(200),              	  -- 주소: 기본주소
  e_detail_address VARCHAR(200),            	  -- 주소: 상세주소
  e_photo TEXT,                             	  -- 사진 파일 경로
  e_salary_account_bank VARCHAR(50) NOT NULL, 	-- 급여통장: 은행명
  e_salary_account_num VARCHAR(50) NOT NULL,  	-- 급여통장: 계좌번호
  e_salary_account_owner VARCHAR(50) NOT NULL,	-- 급여통장: 예금주
  e_note TEXT,                              	  -- 비고
  d_code VARCHAR(5),                        	  -- 부서코드 (FK)
  FOREIGN KEY (d_code) REFERENCES department_tbl(d_code)
    ON DELETE CASCADE    		                    -- 부서가 삭제되면 연쇄 삭제
    ON UPDATE CASCADE    		                    -- 부서 코드 변경되면 자동 반영
);

-- [인사카드 뷰테이블]
CREATE VIEW empCard_view AS
SELECT 
  e.*, 
  d.d_name 
FROM employee_tbl e
LEFT JOIN department_tbl d ON e.d_code = d.d_code;

-- [부서 테이블]
create table department_tbl(
   d_code VARCHAR(5) primary key,      -- 부서 코드
   d_name VARCHAR(255) unique not null,   -- 부서명
   d_tel VARCHAR(40) not null,         -- 부서 전화번호
   d_manager VARCHAR(50) null      -- 부서장 (부서장이 확정되지 않는 경우 NULL 허용 가능)
);

-- [발령 테이블]
CREATE TABLE appointment_tbl (
    appoint_id         INT AUTO_INCREMENT PRIMARY KEY, -- 고유 발령 번호
    e_id               INT NOT NULL,           -- 사번 (사원 테이블 FK)
    appoint_type       VARCHAR(50) NOT NULL,           -- 발령 구분(ex. 전보, 승진, 복직, 파견)
    old_position       VARCHAR(50) NOT NULL,           -- 이전 직급
    new_position       VARCHAR(50) NOT NULL,           -- 발령 직급
    old_department     VARCHAR(100) NOT NULL,          -- 이전 부서명
    new_department     VARCHAR(100) NOT NULL,          -- 발령 부서명
    appoint_note       TEXT,                           -- 비고
    appoint_date       DATE NOT NULL,                  -- 발령 일자
    created_at         TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (e_id) REFERENCES employee_tbl(e_id)        -- 사원 테이블 연결
);