CREATE TABLE employee_auth_tbl (
	e_id INT NOT NULL,
	e_auth_id VARCHAR(24) NOT NULL COLLATE 'utf8mb4_general_ci',
	e_password VARCHAR(64) NOT NULL COLLATE 'utf8mb4_general_ci',
	e_token VARCHAR(40) NULL DEFAULT NULL COLLATE 'utf8mb4_general_ci',
	PRIMARY KEY (e_auth_id) USING BTREE,
	UNIQUE INDEX `e_id` (`e_id`) USING BTREE,
	CONSTRAINT employee_auth_tbl_ibfk_1 FOREIGN KEY (e_id) REFERENCES employee_tbl (e_id) ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE OR REPLACE VIEW transaction_list_view AS
SELECT 
	ot.order_id AS order_id, -- 주문 번호
	oi.order_item_id AS order_item_id, -- 아이템 테이블 주문번호
	ot.order_type AS order_type, -- 판매 1 / 구매 2
	tt.t_type AS t_type, -- 거래유형
	tt.t_classification AS t_class, -- 회계유형
	ot.e_id AS e_id,	-- 담당자 사번
	et.e_name AS e_name, -- 담당자명
	ot.order_date AS order_date, -- 등록일자
	cl.client_name AS client_name, -- 거래처명
	it.item_name AS item_name, -- 물품명
	it.item_standard AS item_standard, -- 물품 규격
	oi.quantity AS quantity, -- 수량
	oi.price AS price, 	-- 단가
	oi.supply AS supply, 	-- 공급가액
	oi.total AS total, -- 금액합계
	oi.vat AS vat,	-- 부가세
	ot.transaction_type AS transaction_type, -- 거래유형
	os.order_status AS order_status, -- 결재 상태
	ot.order_show AS order_show -- 보여짐 유무 (삭제는 N)
FROM
	order_tbl AS ot
INNER JOIN
	transaction_tbl AS tt ON ot.order_type = tt.t_id
INNER JOIN
	order_item_tbl AS oi ON ot.order_id = oi.order_id
INNER JOIN
	item_tbl AS it ON it.item_code = oi.item_code
INNER JOIN
	client_tbl AS cl ON cl.client_code = ot.client_code
INNER JOIN
	employee_tbl AS et ON et.e_id = ot.e_id
INNER JOIN (
	SELECT DISTINCT order_id, order_status
	FROM order_status_tbl
) os on os.order_id = ot.order_id
AND order_show='Y'
ORDER BY ot.order_id DESC;


CREATE OR REPLACE VIEW emp_info_view AS
SELECT 
	et.e_id AS e_id,
	ea.e_auth_id AS e_auth_id,
	et.e_name AS e_name,
	et.e_position AS e_position,
	dt.d_name AS d_name,
	ea.e_token AS e_token
FROM
	employee_tbl AS et
INNER JOIN
	employee_auth_tbl AS ea ON et.e_id = ea.e_id
INNER JOIN
	department_tbl AS dt ON et.d_code = dt.d_code;
