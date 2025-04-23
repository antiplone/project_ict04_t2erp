-- 판매 물품 조회
DROP VIEW sell_searchItemList_view;  

CREATE VIEW sell_searchItemList_view AS
SELECT
	st.item_code AS 'item_code',	-- 품목코드
	it.item_name AS 'item_name',	-- 품목명
	it.item_standard AS 'item_standard',	-- 규격
	st.storage_code AS 'storage_code',	-- 창고코드
	st.storage_name AS 'storage_name',	-- 창고명
	st.stock_amount AS 'stock_amount',	-- 창고수량
	it.item_reg_date AS 'item_reg_date'	-- 등록일
FROM
	stock_tbl AS st
INNER JOIN
	item_tbl AS it
WHERE st.item_code = it.item_code
ORDER BY st.item_code DESC;

===========================
-- 판매 조회 (sell_all_list.jsx)
DROP VIEW sell_allList_view;  

CREATE VIEW sell_allList_view AS
SELECT 
	ot.order_id AS order_id, -- 주문 번호
	oi.order_item_id AS order_item_id, -- 아이템 테이블 주문번호
	ot.order_type AS order_type, -- 판매 1 / 구매 2
	ot.e_id AS e_id,	-- 담당자 사번
	et.e_name AS e_name, -- 담당자명
	ot.order_date AS order_date, -- 등록일자
	ot.shipment_order_date AS shipment_order_date, -- 출하지시일
	ot.client_code AS client_code, -- 거래처코드 fk
	cl.client_name AS client_name, -- 거래처명
	oi.item_code AS item_code, -- 물품코드
	it.item_name AS item_name, -- 물품명
	it.item_standard AS item_standard, -- 물품 규격
	oi.quantity AS quantity, -- 수량
	oi.price AS price, 	-- 단가
	oi.supply AS supply, 	-- 공급가액
	oi.total AS total, -- 금액합계
	oi.vat AS vat,	-- 부가세
	ot.transaction_type AS transaction_type, -- 거래유형
	ot.storage_code AS storage_code, -- 창고코드
	wt.storage_name AS storage_name, -- 창고명
	st.stock_amount AS stock_amount, -- 재고
	oi.income_confirm AS income_confirm, -- 출하여부
	os.order_status AS order_status, -- 결재 상태
	ot.order_show AS order_show -- 보여짐 유무 (삭제는 N)
FROM
	order_tbl AS ot 
INNER JOIN
	order_item_tbl AS oi ON ot.order_id = oi.order_id
INNER JOIN
	warehouse_tbl AS wt ON wt.storage_code = ot.storage_code
INNER JOIN
	item_tbl AS it ON it.item_code = oi.item_code
INNER JOIN
	client_tbl AS cl ON cl.client_code = ot.client_code
INNER JOIN
	employee_tbl AS et ON et.e_id = ot.e_id
INNER JOIN
	stock_tbl AS st ON st.item_code = oi.item_code
INNER JOIN (
    SELECT DISTINCT order_id, order_status
    FROM order_status_tbl
	) os on os.order_id = ot.order_id
WHERE ot.order_type=1
AND order_show='Y'
 AND wt.storage_code = st.storage_code
ORDER BY ot.order_id DESC;


-- 판매 조회_거래명세서 테이블 (sell_all_list.jsx)
DROP VIEW sell_invoice_view;

CREATE VIEW sell_invoice_view AS
SELECT 
	ot.order_id as order_id, -- 주문 번호
	-- oi.order_item_id as order_item_id, -- 아이템 테이블 주문번호
	ot.order_type as order_type, -- 판매 1 / 구매 2
	ot.e_id as e_id,	-- 담당자 사번
	et.e_name as e_name, -- 담당자명
	ot.order_date as order_date, -- 등록일자
	-- ot.shipment_order_date as shipment_order_date, -- 출하지시일
	ot.client_code as client_code, -- 거래처코드 fk
	cl.client_name as client_name, -- 거래처명
	cl.c_base_address as c_base_address, -- 거래처 주소(도로명)
	cl.c_detail_address as c_detail_address, -- 거래처 주소(상세주소)
	cl.c_biz_num as c_biz_num, -- 사업자등록번호
	cl.c_tel as c_tel, -- 연락처
	oi.item_code as item_code, -- 물품코드
	it.item_name as item_name, -- 물품명
	it.item_standard as item_standard, -- 물품 규격
	oi.quantity as quantity, -- 수량
	oi.price as price, 	-- 단가
	oi.supply as supply, 	-- 공급가액
	oi.total as total, -- 금액합계
	oi.vat as vat,	-- 부가세
	-- ot.transaction_type as transaction_type, -- 거래유형
	-- ot.storage_code as storage_code, -- 창고코드
	-- wt.storage_name as storage_name, -- 창고명
	-- oi.income_confirm as income_confirm, -- 출하여부
	-- os.order_status as order_status, -- 결재 상태
	ot.order_show as order_show -- 보여짐 유무 (삭제는 N)
FROM
	order_tbl AS ot 
INNER JOIN
	order_item_tbl AS oi ON ot.order_id = oi.order_id
INNER JOIN
	item_tbl AS it ON it.item_code = oi.item_code
INNER JOIN
	client_tbl AS cl ON cl.client_code = ot.client_code
INNER JOIN
	employee_tbl AS et ON et.e_id = ot.e_id
WHERE ot.order_type=1
AND order_show='Y'
ORDER BY ot.order_id DESC;
============================

-- 테이블 생성 / 거래처 등록 결재 테이블
DROP TABLE request_client_approval_tbl;

CREATE TABLE request_client_approval_tbl (
   sa_approval_id INT AUTO_INCREMENT PRIMARY key,         -- 결재 번호
   sa_request_id INT,                              -- 요청 테이블의 요청 넘버 fk
   sa_e_id INT,                                 -- 결재자 사원번호
   sa_app_e_name VARCHAR(60),                       -- 결재자 이름
   sa_approval_status VARCHAR(100),                 -- 승인 상태( '진행중', '승인', '반려' )
   sa_approval_comment TEXT,                        -- 비고란
   sa_approval_date DATETIME DEFAULT CURRENT_TIMESTAMP,  -- 결재처리일

    CONSTRAINT fk_reqApprovalId FOREIGN KEY (sa_request_id)
       REFERENCES request_client_tbl(sc_id)
        ON DELETE CASCADE ON UPDATE CASCADE,
        
   CONSTRAINT fk_reqApprovalE_id FOREIGN KEY (sa_e_id) 
      REFERENCES employee_tbl(e_id)
        ON DELETE CASCADE ON UPDATE CASCADE
    );

-----------------------------------
-- 테이블 생성 / 거래처 등록 요청 테이블
DROP TABLE request_client_tbl;

CREATE TABLE request_client_tbl(
	sc_id 			INT auto_increment primary key,			-- 요청 넘버 PK
	sc_req_d_name 	VARCHAR(255),							-- 요청 부서
	sc_client_name  VARCHAR(100) not null,					-- 거래처명
	sc_ceo 			VARCHAR(100) not null,					-- 대표자명
	c_biz_num 		VARCHAR(100),							-- 사업자등록번호
	sc_email 		VARCHAR(255),							-- 이메일
	sc_tel 			VARCHAR(255),							-- 연락처
	zone_code 		VARCHAR(10),							-- 우편번호
	base_address  	VARCHAR(255),							-- 기본 주소
	detail_address	VARCHAR(255),							-- 상세 주소
	sc_type 		VARCHAR(100), 							-- 업태
	sc_industry 	VARCHAR(100),							-- 업종
	sc_note			TEXT, 									-- 비고
	sc_show			VARCHAR(100) default 'Y',				-- 삭제 전일 경우 Y (삭제되면 N)
	sc_date 		DATETIME DEFAULT CURRENT_TIMESTAMP			-- 요청일자
);