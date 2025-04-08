import { Table, Button } from 'rsuite';
import React, { useEffect, useState } from 'react';
import '../../styles/buy.css';
import { useNavigate } from 'react-router-dom';

const { Column, HeaderCell, Cell } = Table;

export default function BuyOrderItemList () {
    const navigate = useNavigate();
    
    const [orderList, setOrderList] = useState([]);

    // 조회
    useEffect(() => {
        fetch("http://localhost:8081/buy/buyOrderItemList", {
            method: 'GET'
        })
            .then(res => res.json())
            .then(res => {
                setOrderList(res);
            });
    }, []);

    const styles = {
        backgroundColor: '#f8f9fa',
    };

    // 수정
    const updateOrderItem = (order_id) => {
        navigate('/updateForm/' + order_id);    // App.js의 Route에서 UpdateForm(수정페이지) 호출
    }

    // 삭제
    const deleteOrderItem = (order_id) => {
        console.log("삭제할 주문 ID:", order_id); // 디버깅용 로그

        fetch("http://localhost:8081/api/orderItem/" + order_id, {
            method: 'DELETE',
        })
            .then((res) => res.text())
            .then((res) => {
                if (res === "ok") {
                    alert('삭제 성공!');
                    setOrderList(orderList.filter(order => order.order_id !== order_id)); // UI 업데이트
                } else {
                    alert('삭제 실패');
                }
            })
            .catch(error => console.error("삭제 오류:", error));
    }

    return (
        <>
            <Table virtualized height={500} data={orderList} style={{ maxWidth: 1500 }}>

                <Column width={100}>
                    <HeaderCell style={styles}>주문번호</HeaderCell>
                    <Cell dataKey="order_id" />
                </Column>

                <Column width={100}>
                    <HeaderCell style={styles}>물품코드</HeaderCell>
                    <Cell dataKey="item_code" />
                </Column>

                <Column width={100}>
                    <HeaderCell style={styles}>물품명</HeaderCell>
                    <Cell dataKey="item_name" />
                </Column>

                <Column width={100}>
                    <HeaderCell style={styles}>수량</HeaderCell>
                    <Cell dataKey="quantity" />
                </Column>

                <Column width={100} fixed="right">
                    <HeaderCell style={styles}>수정</HeaderCell>
                    <Cell style={{ padding: '6px' }}>
                        {rowData => (
                            <Button color="blue" appearance='link' onClick={() => updateOrderItem(rowData.order_id)}>
                                수정
                            </Button>
                        )}
                    </Cell>
                </Column>

                <Column width={100} fixed="right">
                    <HeaderCell style={styles}>삭제</HeaderCell>
                    <Cell style={{ padding: '6px' }}>
                        {rowData => (
                            <Button color="blue" appearance='link' onClick={() => deleteOrderItem(rowData.order_id)}>
                                삭제
                            </Button>
                        )}
                    </Cell>
                </Column>
            </Table>
        </>
    );
};
