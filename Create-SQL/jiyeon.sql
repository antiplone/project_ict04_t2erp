-- [구매/판매 - 주문정보] ---------------------------------------------

DROP TABLE order_tbl; 
CREATE TABLE order_tbl(
   order_id           INT PRIMARY KEY AUTO_INCREMENT, -- 고유 주문번호
   order_type          INT NOT NULL,       -- 판매팀 구매 입력 1, 구매팀 구매 입력 2
   order_code          INT UNIQUE,         -- 구매팀 주문번호(구매 발주시에 쓰는 번호)
    order_date          DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,         -- 입력일자
    e_id              INT,            -- 사원코드 
   client_code        INT,            -- 거래처코드                     
   storage_code       INT,               -- 창고코드
   transaction_type    VARCHAR(255) NOT NULL,  -- 거래유형(부가세 적용, 미적용)
   delivery_date       DATE,                 -- 납기일자             
   shipment_order_date DATE,                 -- 출하지시일            

   CONSTRAINT fk_employee_o FOREIGN KEY (e_id) REFERENCES employee_tbl(e_id)
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_client_o FOREIGN KEY (client_code) REFERENCES client_tbl(client_code)
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_warehouse_o FOREIGN KEY (storage_code) REFERENCES warehouse_tbl(storage_code)
        ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

ALTER TABLE order_tbl
MODIFY COLUMN order_date DATE NOT NULL DEFAULT (CURRENT_DATE);

SELECT * FROM order_tbl;

-- ​[판매/구매 물품 - 금액] ------------------------------------------------​​
drop table order_item_tbl; 
CREATE TABLE order_item_tbl (
   order_id          INT,                     -- 고유 주문번호
   order_type          INT NOT NULL,               -- 판매팀 구매 입력 1, 구매팀 구매 입력 2 FK order_tbl
      order_code          INT,                      -- 구매팀 주문번호
      item_id          INT,                     -- 물품 번호  
    item_code          INT,                     -- 물품 코드 FK item_info_tbl
    quantity          INT CHECK (quantity > 0),         -- 수량
    price              DECIMAL(12,2),                  -- 단가
    supply             DECIMAL(12,2),                  -- 공급가액
    vat             DECIMAL(12,2),                  -- 부가세
    total             DECIMAL(12,2),                  -- 총액
    
    CONSTRAINT fk_order_oi FOREIGN KEY (order_id) REFERENCES order_tbl(order_id)
        ON DELETE CASCADE ON UPDATE cascade,
    CONSTRAINT fk_item_oi FOREIGN KEY (item_id) REFERENCES item_tbl (item_id) 
       ON DELETE cascade ON update CASCADE
) ENGINE=InnoDB;

CREATE INDEX idx_order_code 
ON order_item_tbl(order_code); -- 중복 허용, 빠른 조회 , 그러나 IU에는 부담이 있어서 고민중

SELECT * FROM order_item_tbl;

-- [구매 - 주문상태] ------------------------------------------------
drop table order_status_tbl; 
CREATE TABLE order_status_tbl( 
    order_id        INT,                       -- 고유 주문번호
    order_status    VARCHAR(20) NOT NULL DEFAULT '미확인' 
                   COMMENT '미확인, 진행중, 승인, 승인반려 중 하나',

    CONSTRAINT fk_order_os FOREIGN KEY (order_id) REFERENCES order_tbl(order_id)
        ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

SELECT * FROM order_status_tbl;



