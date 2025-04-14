-- 창고 테이블
create table warehouse_tbl(
   storage_code INT(10) auto_increment NOT null PRIMARY KEY,    -- 창고코드
   storage_name VARCHAR(255) not null,                     -- 창고명
   storage_location VARCHAR(255) not null                  -- 창고주소
);
-- 재고 테이블
create table stock_tbl(
   item_code INT(10) PRIMARY KEY,
   stock_amount INT not null,            -- 재고량
   safe_stock INT not null,            -- 안전 재고량
   last_date DATE not null,            -- 마지막 입고일
   storage_code INT not null,            -- 창고 코드
   storage_name VARCHAR(255) not null,      -- 창고 명
   storage_location VARCHAR(255) not null,   -- 창고 위치
   CONSTRAINT fk_item_code FOREIGN KEY (item_code) REFERENCES item_tbl (item_code) ON DELETE CASCADE -- PK, FK 지정
);
