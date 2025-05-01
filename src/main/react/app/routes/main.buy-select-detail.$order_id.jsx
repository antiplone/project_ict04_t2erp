// 구매팀 - 상세조회 페이지
/* eslint-disable react/react-in-jsx-scope */
import AppConfig from "#config/AppConfig.json";
import React, { useEffect, useState } from "react";
import "../styles/buy.css";
import '../styles/common.css';
import { useParams, Link, useNavigate } from "react-router-dom";
import { Button, Container, Divider, Loader, Message, Placeholder, Table, toaster } from "rsuite";
import { useToast } from '#components/common/ToastProvider';
import MessageBox from '../components/common/MessageBox';

export function meta() {
  return [
    { title: `${AppConfig.meta.title} : 구매내역 상세조회` },
    { name: "description", content: "구매현황조회" },
  ];
};

const { Column, HeaderCell, Cell } = Table;

export default function BuySelectDetail() {

  const fetchURL = AppConfig.fetch['mytest'];
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true); // 페이지 로딩중

  const { showToast } = useToast();

  const { order_id } = useParams(); // URL에서 전달된 파라미터들을 객체 형태로 반환 ex) order_id -> '1' 문자열로 출력됨
  
  // 주문정보 (단일 객체)
  const [orderInfo, setOrderInfo] = useState({});

  // 물품정보 (배열)
  const [orderItems, setOrderItems] = useState([]);

  // 컴포넌트가 처음 마운트 될때, 또는 order_id가 바뀔 때마다 주문 상세 데이터를 요청
  useEffect(() => {
    if (!order_id) return; // order_id가 null 이면 종료

    setLoading(true);

    // fecth()를 통해 톰캣서버에세 데이터를 요청
    fetch(`${fetchURL.protocol}${fetchURL.url}/buy/buyOrderDetail/${order_id}`, {
      method: "GET"
    })
      .then(res => { // 서버의 응답을 받았을 때 실행
        if (!res.ok) throw new Error(`buyOrderDetail 응답 오류: ${res.status}`);
        return res.json();  // 응답 받은 내용을 json 형식으로 파싱
      })
      .then(json => {
        //console.log("buyOrderDetail 응답 확인:", json);
        if (Array.isArray(json) && json.length > 0) {
          setOrderInfo(json[0]);  // 주문정보
          setOrderItems(json[0].items || []); // 물품 목록
          setLoading(false); // 로딩완료
        } else {
          setOrderInfo({});
          setOrderItems([]);
          setLoading(false);  // 실패해도 로딩 종료 처리
        }
      })
      .catch(error => {
        //console.error("buyOrderDetail 가져오기 오류:", error);
        setOrderInfo({}); // 상태값 초기화
        setOrderItems([]);
        setLoading(false);  // 실패해도 로딩 종료 처리
      });
  }, [order_id]); // 컴포넌트 처음 렌더링될 때 또는 order_id가 바뀔 때마다 이 로직이 실행


  // 삭제
  const deleteOrderItem = (order_id) => {
    //console.log("삭제할 주문 ID:", order_id); // 디버깅용 로그

    fetch(`${fetchURL.protocol}${fetchURL.url}/buy/buyOrder/` + order_id, {
      method: 'DELETE',
    })
      .then((res) => res.text())
      .then((res) => {
        if (res === "ok") {
          showToast("주문이 정상적으로 삭제되었습니다.", "success");

          navigate("/main/buy-select");
        } else {
          showToast("주문 삭제를 실패했습니다.", "error");
        }
      })
      .catch(error => console.error("삭제 오류:", error));
  }

  return (
    <>
      <Container>
        {loading ? (
          <Container style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 100 }}>
            <Placeholder.Paragraph rows={15} />
            <Loader center content="불러오는 중..." />
          </Container>
        ) : (
          <>
            <MessageBox type="info" text={`구매 상세페이지 - 발주번호:${order_id}`} />
            <br />

            {/* data={[orderInfo]} 여기만 대괄호를 준 이유는 orderInfo는 하나의 객체 단일 주문 정보이기 때문에 배열로 감싸줬음 => rsuite의 <Table data={...}>는 배열형태의 데이터를 요구함*/}
            <Table height={100} data={[orderInfo]}>

              <Column width={200} className='text_center'>
                <HeaderCell className='text_center'>발주번호</HeaderCell>
                <Cell dataKey="order_id" />
              </Column>

              <Column width={220} className='text_center'>
                <HeaderCell className='text_center'>발주일자</HeaderCell
                ><Cell dataKey="order_date" />
              </Column>

              <Column width={200} className='text_center'>
                <HeaderCell className='text_center'>구매요청 부서</HeaderCell>
                <Cell dataKey="order_type" />
              </Column>

              <Column width={220} className='text_center'>
                <HeaderCell className='text_center'>담당자명</HeaderCell>
                <Cell dataKey="e_name" />
              </Column>

              <Column width={220} className='text_center'>
                <HeaderCell className='text_center'>거래처명</HeaderCell>
                <Cell dataKey="client_name" />
              </Column>

              <Column width={220} className='text_center'>
                <HeaderCell className='text_center'>거래유형</HeaderCell>
                <Cell dataKey="transaction_type" />
              </Column>

              <Column width={220} className='text_center'>
                <HeaderCell className='text_center'>입고창고</HeaderCell>
                <Cell dataKey="storage_name" />
              </Column>

              <Column width={220} className='text_center'>
                <HeaderCell className='text_center'>납기일자</HeaderCell>
                <Cell dataKey="delivery_date" />
              </Column>

              <Column width={200} className='text_center'>
                <HeaderCell className='text_center'>진행상태</HeaderCell>
                <Cell dataKey="order_status" />
              </Column>

              {/* 
            <Column width={120}>
            <HeaderCell>회계처리 여부</HeaderCell>
            <Cell dataKey="" />
            </Column> 
            */}
            </Table>

            <Divider />

            <Table height={400} data={orderItems}>
              <Column width={200} className='text_center'>
                <HeaderCell className='text_center'>물품코드</HeaderCell>
                <Cell dataKey="item_code" />
              </Column>

              <Column width={340} className='text_center'>
                <HeaderCell className='text_center'>물품명</HeaderCell>
                <Cell dataKey="item_name" />
              </Column>

              <Column width={270} className='text_center'>
                <HeaderCell className='text_center'>수량</HeaderCell>
                <Cell dataKey="quantity" />
              </Column>

              <Column width={270} className='text_right'>
                <HeaderCell className='text_center'>단가</HeaderCell>
                <Cell>
                  {priceData => new Intl.NumberFormat().format(priceData.price)}
                </Cell>
              </Column>

              <Column width={270} className='text_right'>
                <HeaderCell className='text_center'>공급가액</HeaderCell>
                <Cell>
                  {supplyData => new Intl.NumberFormat().format(supplyData.supply)}
                </Cell>
              </Column>

              <Column width={270} className='text_right'>
                <HeaderCell className='text_center'>부가세</HeaderCell>
                <Cell>
                  {vatData => new Intl.NumberFormat().format(vatData.vat)}
                </Cell>
              </Column>

              <Column width={300} className='text_right'>
                <HeaderCell className='text_center'>총액</HeaderCell>
                <Cell>
                  {totalData => new Intl.NumberFormat().format(totalData.total)}
                </Cell>
              </Column>
            </Table>

            <Divider />

            <div className="buyBtnBox">
              <Link to={`/main/buy-order-update/${order_id}`}>
                <Button appearance="ghost" color="blue">
                  수정
                </Button>
              </Link>
              <Link to={`/main/buy-select`}>
                <Button appearance="ghost" className="ListBtn">
                  목록
                </Button>
              </Link>
              <Button appearance="ghost" color="red" onClick={() => deleteOrderItem(orderInfo.order_id)}>
                삭제
              </Button>
            </div>
          </>
        )}
      </Container>
    </>
  );

};
