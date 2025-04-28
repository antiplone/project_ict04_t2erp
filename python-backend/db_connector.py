from sqlalchemy import create_engine, text
import pandas as pd
import datetime as dt

# MySQL 접속 정보
DB_USER = "orditdba"
DB_PASSWORD = "korict04a"
DB_HOST = "ymlqsdatb.daz-i.com"
DB_PORT = "3306"
DB_NAME = "ordit"

# SQLAlchemy 연결 문자열
db_url = f"mysql+pymysql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
engine = create_engine(db_url)

# 기간 선택이 가능한 주문건수 조회 함수
def get_order_count(start_date=None, end_date=None):
    query = """
    SELECT 
        ot.shipment_order_date,
        COUNT(DISTINCT ot.order_id) AS 처리건수
    FROM order_tbl ot
    WHERE ot.order_type = 1
    """
    if start_date:
        query += f" AND ot.shipment_order_date >= '{start_date}'"
    if end_date:
        query += f" AND ot.shipment_order_date <= '{end_date}'"
    query += " GROUP BY ot.shipment_order_date ORDER BY ot.shipment_order_date ASC"
    df = pd.read_sql(query, engine)
    df['shipment_order_date'] = pd.to_datetime(df['shipment_order_date'])
    df.rename(columns={"주문건수": "order_count"}, inplace=True)
    df = df.sort_values('shipment_order_date')
    return df.to_dict(orient="records")

# 기간 선택이 가능한 주문 아이템 수량 조회 함수
def get_order_items(start_date=None, end_date=None):
    query = """
    SELECT 
        ot.shipment_order_date,
        oit.order_id, 
        SUM(oit.quantity) AS total_quantity
    FROM order_item_tbl oit 
    INNER JOIN order_tbl ot 
        ON ot.order_id = oit.order_id 
    WHERE oit.order_type = 1
    """
    if start_date:
        query += f" AND ot.shipment_order_date >= '{start_date}'"
    if end_date:
        query += f" AND ot.shipment_order_date <= '{end_date}'"
    query += " GROUP BY ot.shipment_order_date ORDER BY ot.shipment_order_date ASC"
    df = pd.read_sql(query, engine)
    df = df.sort_values('shipment_order_date')
    return df.to_dict(orient="records")
    
def get_order_count(start_date=None, end_date=None):
    query = """
   SELECT 
        ot.shipment_order_date,
        oit.order_id, 
        SUM(oit.quantity) AS total_quantity
    FROM order_item_tbl oit 
    INNER JOIN order_tbl ot 
        ON ot.order_id = oit.order_id 
    WHERE oit.order_type = 2
    """
    if start_date:
        query += f" AND ot.shipment_order_date >= '{start_date}'"
    if end_date:
        query += f" AND ot.shipment_order_date <= '{end_date}'"
    query += " GROUP BY ot.shipment_order_date ORDER BY ot.shipment_order_date ASC"
    df = pd.read_sql(query, engine)
    df['shipment_order_date'] = pd.to_datetime(df['shipment_order_date'])
    df.rename(columns={"주문건수": "order_count"}, inplace=True)
    df = df.sort_values('shipment_order_date')
    return df.to_dict(orient="records")

# 기간 선택이 가능한 주문 아이템 수량 조회 함수
def get_sales_items(start_date=None, end_date=None):
    query = """
    SELECT 
        ot.delivery_date,
        it.item_code,
        it.item_name,
        SUM(oit.quantity) AS total_quantity
    FROM order_item_tbl oit 
    LEFT JOIN order_tbl ot 
        ON ot.order_id = oit.order_id 
    LEFT JOIN item_tbl it
        ON it.item_id = oit.item_id
    WHERE ot.order_type = 2
    GROUP BY ot.delivery_date, it.item_code, it.item_name
    ORDER BY ot.delivery_date ASC, it.item_code ASC
    """
    if start_date:
        query += f" AND ot.delivery_date >= '{start_date}'"
    if end_date:
        query += f" AND ot.delivery_date <= '{end_date}'"
    query += " GROUP BY ot.delivery_date ORDER BY ot.delivery_date ASC"
    df = pd.read_sql(query, engine)
    df = df.sort_values('delivery_date')
    return df.to_dict(orient="records")

def get_sales_count(start_date=None, end_date=None):
    query = """
    SELECT 
        ot.delivery_date ,
        COUNT(DISTINCT ot.order_id) AS 주문건수
    FROM order_tbl ot
    WHERE ot.order_type = 2
    """
    if start_date:
        query += f" AND ot.delivery_date >= '{start_date}'"
    if end_date:
        query += f" AND ot.delivery_date <= '{end_date}'"
    query += " GROUP BY ot.delivery_date ORDER BY ot.delivery_date ASC"
    df = pd.read_sql(query, engine)
    df['delivery_date'] = pd.to_datetime(df['delivery_date'])
    df.rename(columns={"처리건수": "order_count"}, inplace=True)
    df = df.sort_values('delivery_date')
    return df.to_dict(orient="records")

# 사용 예시 (주석 해제 시 동작)
# print(get_order_count('2025-01-01', '2025-01-31'))
# print(get_order_items('2025-01-01', '2025-01-31'))
# print(get_sales_count('2025-01-01', '2025-01-31'))
# print(get_sales_items('2025-01-01', '2025-01-31'))
