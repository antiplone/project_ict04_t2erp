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
