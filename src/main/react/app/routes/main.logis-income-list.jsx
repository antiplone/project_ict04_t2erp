import React, { useState, useEffect } from 'react';
import { Link } from "@remix-run/react";
import { Container, Message, /* Form, */ Table } from 'rsuite';
import "#components/common/css/common.css";

const OrderIncomeList = () => {

    const [orderList, setOrderList] = useState([]); // 초기값을 모르므로 빈배열로 Warehousingist에 대입

    // // fetch()를 통해 서버에게 데이터를 요청
    useEffect(() => { // 통신 시작 하겠다.
        fetch("http://localhost:8081/logisorder/logisOrderList", { // 스프링부트에 요청한다.
            method: "GET" // "GET" 방식으로
        }).then(
            res => res.json() // 응답이 오면 javascript object로 바꾸겠다.
        ).then(
            res => {
                console.log(1, res); // setWarehousingist를 통해서 뿌려준다.
                const resjson = Array.isArray(res) ? res : [];
                setOrderList(resjson);
            }
        ).catch(error => {
            console.error("logisOrderList : ", error);
            setOrderList([]); // 오류 시 빈 배열 설정
        });
    }, []);
    // // []은 디펜던시인데, setState()로 렌더링 될 때마다 싱행되면 안되고, 한 번만 실행하도록 빕배여ㅕ르ㅏㅏ

    const orderListWithRowNum = orderList.map((order, index) => ({
        ...order,
        row_num: index + 1, // 1부터 시작하는 번호 부여
    }));

    return (
        <div>
            <Container >
                <Message type="success" className="main_title">
                    금일 입고 목록
                </Message>
                <br />
                <Table height={400} data={orderListWithRowNum} className="text_center">
                    <Table.Column width={80} align="center" fixed>
                        <Table.HeaderCell>번호</Table.HeaderCell>
                        <Table.Cell dataKey="row_num" />
                    </Table.Column>

                    <Table.Column width={80} align="center" fixed>
                        <Table.HeaderCell>주문고유번호</Table.HeaderCell>
                        <Table.Cell dataKey="order_id" />
                    </Table.Column>

                    <Table.Column width={120}>
                        <Table.HeaderCell>입고일자</Table.HeaderCell>
                        <Table.Cell dataKey="delivery_date" />
                    </Table.Column>

                    <Table.Column width={150}>
                        <Table.HeaderCell>아이템 비고</Table.HeaderCell>
                        <Table.Cell dataKey="item_name" style={{ padding: '6px' }}>
                            {orderList => (
                                <Link to={`/main/logis-order-item-list/${orderList.order_id}`} className="btn btn-primary area_fit wide_fit">주문상세보기</Link>
                            )}
                        </Table.Cell>
                    </Table.Column>

                    <Table.Column width={120}>
                        <Table.HeaderCell>발주처</Table.HeaderCell>
                        <Table.Cell dataKey="client_name" />
                    </Table.Column>

                    {/* <Table.Column width={120}>
                            <Table.HeaderCell>발주일</Table.HeaderCell>
                            <Table.Cell dataKey="order_date" />
                        </Table.Column> */}

                    <Table.Column width={160}>
                        <Table.HeaderCell>입고창고</Table.HeaderCell>
                        <Table.Cell dataKey="storage_name" />
                    </Table.Column>
                </Table>
            </Container>
        </div>
    );
}

export default OrderIncomeList;