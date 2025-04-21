-- [사원 테이블] ------
create table employee_tbl(
   e_id INT auto_increment primary key,   -- 사원번호, PK
   e_name VARCHAR(60) not null,        -- 사원 이름
   e_tel VARCHAR(20) not null,        -- 사원 전화번호
   e_position VARCHAR(40) not null,   -- 사원 직위(사원,대리,과장, ...)
   e_reg_date DATE DEFAULT (CURRENT_DATE()),   -- 사원 카드 등록일
   e_status VARCHAR(40) not null,               -- 사원 재직상태(재직,퇴직,휴직,...)
   e_email VARCHAR(150) not null,            -- 사원 이메일
   e_birth DATE not null,               -- 사원 생년월일
   e_entry VARCHAR(20),      -- 입사 구분(경력/신입)
   e_address VARCHAR(200),         -- 주소
   e_photo TEXT,         -- 사진
   e_salary_account_bank VARCHAR(50) not null,      -- 급여통장:은행
   e_salary_account_num VARCHAR(50) not null,      -- 급여통장:계좌번호
   e_salary_account_owner VARCHAR(50) not null,      -- 급여통장:예금주
   e_note TEXT,      -- 비고
   d_code VARCHAR(5),   -- 부서코드
   foreign key (d_code)
   references department_tbl(d_code)
   on delete cascade   -- 테이블의 행이 삭제될 때, 관련된 컬럼도 삭제.
   on update cascade   -- 참조되는 테이블이 컬럼값이 변경되면 똑같이 값이 변경되도록 설정
);
select * from employee_tbl;   -- 테이블 확인


-- [인사카드]
CREATE VIEW empCard_view AS
SELECT 
  e.*, 
  d.d_name 
FROM employee_tbl e
LEFT JOIN department_tbl d ON e.d_code = d.d_code;

select * from empCard_view;