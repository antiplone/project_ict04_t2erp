-- 판매 물품 조회
create view sell_searchItemList_view as
select
   st.item_code as 'item_code',   -- 품목코드
   it.item_name as 'item_name',   -- 품목명
   it.item_standard as 'item_standard',   -- 규격
   st.storage_code as 'storage_code',   -- 창고코드
   st.storage_name as 'storage_name',   -- 창고명
   st.stock_amount as 'stock_amount',   -- 창고수량
   it.item_reg_date as 'item_reg_date'   -- 등록일
from
   stock_tbl as st
inner join
   item_tbl as it
WHERE st.item_code = it.item_code
ORDER BY st.item_code DESC;

select * from sell_searchItemList_view;

===========================
-- 판매 조회 (sell_all_list.jsx)

create view sell_allList_view as
select 
   ot.order_id as order_id, -- 주문 번호
   ot.order_type as order_type, -- 판매 1 / 구매 2
   ot.order_date as order_date, -- 등록일자
   ot.shipment_order_date as shipment_order_date, -- 출하지시일
   ot.client_code as client_code, -- 거래처코드 fk
   cl.client_name as client_name, -- 거래처명
   oi.item_code as item_code, -- 물품코드
   it.item_name as item_name, -- 물품명
   oi.quantity as quantity, -- 수량
   oi.price as price,    -- 단가
   oi.supply as supply,    -- 공급가액
   oi.total as total, -- 금액합계
   oi.vat as vat,   -- 부가세
   ot.transaction_type as transaction_type, -- 거래유형
   ot.storage_code as storage_code, -- 창고코드
   wt.storage_name as storage_name -- 창고명
from
   order_tbl as ot 
inner join
   order_item_tbl as oi ON ot.order_id = oi.order_id
inner join
   warehouse_tbl as wt ON wt.storage_code = ot.storage_code
inner join
   item_tbl as it ON it.item_code = oi.item_code
inner join
   client_tbl as cl ON cl.client_code = ot.client_code
WHERE ot.order_type=1
ORDER BY ot.order_id DESC;

SELECT * FROM sell_allList_view;

============================

-- 테이블 생성 / 거래처 등록 결재 테이블
create table request_client_approval_tbl (
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
create table request_client_tbl(
   sc_id          INT auto_increment primary key,         -- 요청 넘버 PK
   sc_req_d_name    VARCHAR(255),                     -- 요청 부서
   sc_client_name  VARCHAR(100) not null,               -- 거래처명
   sc_ceo          VARCHAR(100) not null,               -- 대표자명
   sc_biz_num       INT,                           -- 사업자등록번호
   sc_email       VARCHAR(255),                     -- 이메일
   sc_tel          VARCHAR(255),                     -- 연락처
   sc_address      VARCHAR(255),                     -- 거래처 주소
   sc_type       VARCHAR(100),                      -- 업태
   sc_industry    VARCHAR(100),                     -- 업종
   sc_status        VARCHAR(100) default '진행중',            -- 승인 상태
   sc_note         TEXT,                            -- 비고
   sc_date       DATETIME DEFAULT CURRENT_TIMESTAMP         -- 요청일자
);
