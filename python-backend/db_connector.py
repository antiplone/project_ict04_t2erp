from sqlalchemy import create_engine, text
import pandas as pd
import datetime as dt
from datetime import date, timedelta

# MySQL 접속 정보
DB_USER = "orditdba"
DB_PASSWORD = "korict04a"
DB_HOST = "ymlqsdatb.daz-i.com"
DB_PORT = "3306"
DB_NAME = "ordit"

# SQLAlchemy 연결 문자열
db_url = f"mysql+pymysql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
engine = create_engine(db_url)

# 유효한 날짜인지 확인하는 함수
def is_valid_date(date_string):
    try:
        pd.to_datetime(date_string)
        return True
    except ValueError:
        return False

# 기간 선택이 가능한 주문건수 조회 함수
def get_order_count(start_date=None, end_date=None):
    try:
        # 시작일과 종료일이 주어지지 않으면 이번 달의 첫날과 마지막 날을 기본값으로 설정
        if not start_date and not end_date:
            today = date.today()
            start_date = today.replace(day=1)  # 이번 달의 첫 날
            end_date = (today.replace(day=1) + timedelta(days=32)).replace(day=1) - timedelta(days=1)  # 이번 달의 마지막 날

        # 날짜 유효성 검증
        if start_date and not is_valid_date(start_date):
            raise ValueError(f"Invalid start_date format: {start_date}")
        if end_date and not is_valid_date(end_date):
            raise ValueError(f"Invalid end_date format: {end_date}")

        query = """
        SELECT 
            ot.delivery_date,
            COUNT(DISTINCT ot.order_id) AS order_count
        FROM order_tbl ot
        WHERE ot.order_type = 2
        """
        if start_date:
            query += f" AND ot.delivery_date >= '{start_date}'"
        if end_date:
            query += f" AND ot.delivery_date <= '{end_date}'"
        query += " GROUP BY ot.delivery_date ORDER BY ot.delivery_date ASC"

        # 데이터베이스에서 쿼리 실행
        df = pd.read_sql(query, engine)
        df['delivery_date'] = pd.to_datetime(df['delivery_date'], errors='coerce')  # 잘못된 날짜 처리
        df = df.dropna(subset=['delivery_date'])  # 잘못된 날짜 제거

        # 만약 데이터가 없다면 예외 발생
        if df.empty:
            raise ValueError("조회된 데이터가 없습니다.")

        # 결과를 딕셔너리 형식으로 반환
        return df.to_dict(orient="records")
    
    except Exception as e:
        logging.error(f"get_sales_count 에러: {traceback.format_exc()}")
        raise e  # 예외를 외부에서 처리할 수 있게 다시 던짐

# 기간 선택이 가능한 주문 아이템 수량 조회 함수
def get_order_items(start_date=None, end_date=None):
    today = date.today()

    # 이번 달 1일
    if start_date is None:
        start_date = today.replace(day=1)

    # 다음 달 1일에서 하루 빼기 → 이번 달 마지막 날
    if end_date is None:
        next_month = today.replace(day=28) + timedelta(days=4)  # 무조건 다음 달 됨
        end_date = next_month.replace(day=1) - timedelta(days=1)

    query = """
    SELECT 
        it.item_code,
        it.item_name,
        SUM(oit.quantity) AS total_quantity
    FROM order_item_tbl oit 
    LEFT JOIN order_tbl ot 
        ON ot.order_id = oit.order_id 
    LEFT JOIN item_tbl it
        ON it.item_id = oit.item_id
    WHERE ot.order_type = 2
      AND ot.delivery_date >= %(start_date)s
      AND ot.delivery_date <= %(end_date)s
    GROUP BY it.item_code, it.item_name
    ORDER BY it.item_code ASC
    """
    params = {
        'start_date': start_date,
        'end_date': end_date
    }

    df = pd.read_sql(query, engine, params=params)
    return df.to_dict(orient="records")

# 기간 선택이 가능한 주문 아이템 수량 조회 함수
def get_sales_items(start_date=None, end_date=None):
    today = dt.date.today()
    
    # 이번 달 1일
    if start_date is None:
        start_date = today.replace(day=1)

    # 다음 달 1일에서 하루 빼기 + 이번 달 마지막 날
    if end_date is None:
        next_month = today.replace(day=28) + dt.timedelta(days=4)  # 무조건 다음 달 됨
        end_date = next_month.replace(day=1) - dt.timedelta(days=1)

    query = """
    SELECT 
        it.item_code,
        it.item_name,
        SUM(oit.quantity) AS total_quantity
    FROM order_item_tbl oit 
    LEFT JOIN order_tbl ot 
        ON ot.order_id = oit.order_id 
    LEFT JOIN item_tbl it
        ON it.item_id = oit.item_id
    WHERE ot.order_type = 2
        AND ot.delivery_date >= %(start_date)s
        AND ot.delivery_date <= %(end_date)s
    GROUP BY it.item_code, it.item_name
    ORDER BY it.item_code ASC
    """
    params = {
        'start_date': start_date,
        'end_date': end_date
    }

    df = pd.read_sql(query, engine, params=params)
    return df.to_dict(orient="records")

# 기간 선택이 가능한 출고 처리 건수 조회 함수
def get_sales_count(start_date=None, end_date=None):
    try:
        # 시작일과 종료일이 주어지지 않으면 이번 달의 첫날과 마지막 날을 기본값으로 설정
        if not start_date and not end_date:
            today = date.today()
            start_date = today.replace(day=1)  # 이번 달의 첫 날
            end_date = (today.replace(day=1) + timedelta(days=32)).replace(day=1) - timedelta(days=1)  # 이번 달의 마지막 날

        # 날짜 유효성 검증
        if start_date and not is_valid_date(start_date):
            raise ValueError(f"Invalid start_date format: {start_date}")
        if end_date and not is_valid_date(end_date):
            raise ValueError(f"Invalid end_date format: {end_date}")

        query = """
        SELECT 
            ot.shipment_order_date,
            COUNT(DISTINCT ot.order_id) AS order_count
        FROM order_tbl ot
        WHERE ot.order_type = 1
        """
        if start_date:
            query += f" AND ot.shipment_order_date >= '{start_date}'"
        if end_date:
            query += f" AND ot.shipment_order_date <= '{end_date}'"
        query += " GROUP BY ot.shipment_order_date ORDER BY ot.shipment_order_date ASC"

        # 데이터베이스에서 쿼리 실행
        df = pd.read_sql(query, engine)
        df['shipment_order_date'] = pd.to_datetime(df['shipment_order_date'], errors='coerce')  # 잘못된 날짜 처리
        df = df.dropna(subset=['shipment_order_date'])  # 잘못된 날짜 제거

        # 만약 데이터가 없다면 예외 발생
        if df.empty:
            raise ValueError("조회된 데이터가 없습니다.")

        # 결과를 딕셔너리 형식으로 반환
        return df.to_dict(orient="records")
    
    except Exception as e:
        logging.error(f"get_sales_count 에러: {traceback.format_exc()}")
        raise e  # 예외를 외부에서 처리할 수 있게 다시 던짐