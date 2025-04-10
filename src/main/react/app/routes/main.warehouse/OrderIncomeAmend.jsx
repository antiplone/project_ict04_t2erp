import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Container, Table } from 'rsuite';
import '../common/css/logisCommon.css'

const OrderItemList = () => {
    
    const { order_id } = useParams();
    console.log("OderItemList order_id : ", order_id)
    // console.log("Number(orderItemList.item_code) : ", (Number(orderItemList.item_code)))
    
    const [orderItemList, setOrderItemList] = useState([]); // 초기값을 모르므로 빈배열로 Warehousingist에 대입


    // // fetch()를 통해 서버에게 데이터를 요청
    useEffect(() => { // 통신 시작 하겠다.
        if (!order_id) {
            console.error("order_id가 없습니다.");
            return;
        }

        fetch(`http://localhost:8081/logisorder/orderDetail/` + order_id)
        .then(res => res.json())
        .then(res => {
            setOrderItemList(res|| []);
        })
        .catch(err => console.error('Error fetching orderDetail:', err));
    },[order_id]); 
    // // []은 디펜던시인데, setState()로 렌더링 될 때마다 싱행되면 안되고, 한 번만 실행하도록 빕배여ㅕ르ㅏㅏ

    return (
        <div>
            <Container>
                <div className='header logiHeader'>
                    주문 상세 목록 (주문 번호 : {order_id})
                </div>
                <br />
                <Table height={400} data={orderItemList}>
                    <Table.Column width={100} align="center" fixed>
                        <Table.HeaderCell>주문코드</Table.HeaderCell>
                        <Table.Cell dataKey="order_code" />
                    </Table.Column>

                    <Table.Column width={100}>
                        <Table.HeaderCell>품목코드</Table.HeaderCell>
                        <Table.Cell dataKey="item_code" />
                    </Table.Column>

                    <Table.Column width={160}>
                        <Table.HeaderCell>품목명</Table.HeaderCell>
                        <Table.Cell dataKey="item_name" />
                    </Table.Column>

                    <Table.Column width={100}>
                        <Table.HeaderCell>주문수량</Table.HeaderCell>
                        <Table.Cell dataKey="order_amount" />
                    </Table.Column>

                    <Table.Column width={160}>
                        <Table.HeaderCell>규격</Table.HeaderCell>
                        <Table.Cell dataKey="item_standard" />
                    </Table.Column>

                    {/* <Table.Column width={150} style={{padding:'6px'}}>
                        <Table.HeaderCell>창고 상세보기</Table.HeaderCell>
                        <Table.Cell dataKey="order_id">
                        {(orderItemList) => (
                            <Link to={`/orderItemDetail/${orderItemList.order_id}?item_code=${orderItemList.item_code}`} className="btn btn-primary area_fit wide_fit" >품목 상세</Link>
                        )}
                        </Table.Cell>
                    </Table.Column> */}
                </Table>
                <Link to={'/oderIncomeUpdate'} className="btn btn-primary area_fit wide_fit">수정 완료</Link>
                <Link to={'/oderIncomeList'} className="btn btn-primary area_fit wide_fit">입고 목록</Link>
            </Container>
        </div>
    )
}

// const orderItemList = {
//     order_id: orderItemList.order_id,
//     item_code: orderItemList.item_code
//   };
export default OrderItemList ;