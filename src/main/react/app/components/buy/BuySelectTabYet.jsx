import { Table, Button, Checkbox } from 'rsuite';
import React, { useEffect, useState } from 'react';
import '../../styles/buy.css';
import { useNavigate } from 'react-router-dom';

const { Column, HeaderCell, Cell } = Table;

export default function BuySelectTabYet() {

    const navigate = useNavigate();

    const [buyOrderYetList, setBuyOrderYetList] = useState([]); // 초기값을 모르므로 빈배열로 buyList에 대입

    // fecth()를 통해 톰캣서버에세 데이터를 요청
    useEffect(() => {
        fetch("http://localhost:8081/buy/buyOrderYetList", {
            method: "GET"
        })
            .then(res => res.json() // 응답이 오면 javascript object로 바꾸겠다.
            )
            .then(res => {
                console.log(1, res);
                setBuyOrderYetList(res || []); // 처음에는 비어있으므로 못가져온다. setBoardList(res);
            }
            )
            .catch(error => {
                console.error("데이터 가져오기 오류:", error);
                setBuyOrderYetList([]); // 오류 발생 시 빈 배열 설정 
            });
    }, []); // []은 디펜던시인데, setState()로 렌더링될때 실행되면 안되고, 1번만 실행하도록 빈배열을 넣어둔다.
    // CORS 오류 : Controller 진입 직전에 적용된다. 외부에서 자바스크립트 요청이 오는 것을

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

        fetch("http://localhost:8081/buy/buyOrderItem/" + order_id, {
            method: 'DELETE',
        })
            .then((res) => res.text())
            .then((res) => {
                if (res === "ok") {
                    alert('삭제 성공!');
                    setBuyOrderYetList(buyOrderYetList.filter(order => order.order_id !== order_id)); // UI 업데이트
                } else {
                    alert('삭제 실패');
                }
            })
            .catch(error => console.error("삭제 오류:", error));
    }

    return (
        <>
            <Table height={500} data={buyOrderYetList} style={{ maxWidth: 1500 }}>

                <Column width={40} align="center" fixed>
                    <HeaderCell style={styles}>
                        <Checkbox />  {/* 전체 선택 */}
                    </HeaderCell>
                    <Cell>
                        {rowData => <Checkbox value={rowData.id} />}
                    </Cell>
                </Column>

                <Column width={100}>
                    <HeaderCell style={styles}>등록일자</HeaderCell>
                    <Cell dataKey="order_date" />
                </Column>

                <Column width={100}>
                    <HeaderCell style={styles}>주문번호</HeaderCell>
                    <Cell dataKey="order_id" />
                </Column>

                <Column width={100}>
                    <HeaderCell style={styles}>거래처명</HeaderCell>
                    <Cell dataKey="client_name" />
                </Column>

                <Column width={100}>
                    <HeaderCell style={styles}>품목명</HeaderCell>
                    <Cell dataKey="item_name" />
                </Column>

                <Column width={100}>
                    <HeaderCell style={styles}>금액합계</HeaderCell>
                    <Cell dataKey="total" />
                </Column>

                <Column width={120}>
                    <HeaderCell style={styles}>거래유형</HeaderCell>
                    <Cell dataKey="transaction_type" />
                </Column>

                <Column width={100}>
                    <HeaderCell style={styles}>입고창고</HeaderCell>
                    <Cell dataKey="storage_name" />
                </Column>
                {/* 
                <Column width={100}>
                    <HeaderCell style={styles}>회계반영 여부</HeaderCell>
                    <Cell dataKey="closing_staus"/>
                </Column> */}

                <Column width={100}>
                    <HeaderCell style={styles}>종결여부</HeaderCell>
                    <Cell dataKey="closing_status" />
                </Column>
                {/* 
                <Column width={80} fixed="right">
                    <HeaderCell style={styles}>불러온전표</HeaderCell>
                    <Cell style={{ padding: '6px' }}>
                        {rowData => (
                            <Button color="blue" appearance='link'>
                                조회
                            </Button>
                        )}
                    </Cell>
                </Column>
 */}
                <Column width={60} fixed="right">
                    <HeaderCell style={styles}>조회</HeaderCell>
                    <Cell style={{ padding: '6px' }}>
                        {rowData => (
                            <Button color="blue" appearance='link' onClick={() => updateOrderItem(rowData.order_id)}>
                                조회
                            </Button>
                        )}
                    </Cell>
                </Column>


                <Column width={60} fixed="right">
                    <HeaderCell style={styles}>수정</HeaderCell>
                    <Cell style={{ padding: '6px' }}>
                        {rowData => (
                            <Button color="blue" appearance='link' onClick={() => updateOrderItem(rowData.order_id)}>
                                수정
                            </Button>
                        )}
                    </Cell>
                </Column>

                <Column width={60} fixed="right">
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

