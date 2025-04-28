// 구매팀 - 구매조회 탭 미확인
import AppConfig from "#config/AppConfig.json";
import { Table, Button, ButtonToolbar } from 'rsuite';
import React, { useEffect, useState } from 'react';
import '../../styles/buy.css';
import { Link } from 'react-router-dom';

const { Column, HeaderCell, Cell } = Table;

export default function BuySelectTabUnchk() {

    const [buyOrderUnchkList, setBuyOrderUnchkList] = useState([]); // 초기값을 모르므로 빈배열로 buyList에 대입

    const getNumberedList = (data) => {
        let result = [];
        let groupedByDate = {};

        // 날짜별로 그룹핑
        data.forEach(item => {
            if (!groupedByDate[item.order_date]) {
                groupedByDate[item.order_date] = [];
            }
            groupedByDate[item.order_date].push(item);
        });

        // 날짜별로 처리
        Object.keys(groupedByDate).forEach(date => {
            // groupedByDate : 날짜별로 데이터를 묶어둔 객체
            // ex: { '2025-04-10': [item1, item2, ...], '2025-04-11': [item3, ...] }
            let orders = groupedByDate[date];	// 해당 날짜(date)의 전체 주문 데이터 배열
            let seenOrderIds = new Set();	// 중복된 주문(order_id)을 한 번만 처리하기 위해 사용
            let count = 1;

            orders.forEach(item => {
                if (seenOrderIds.has(item.order_id)) return;	 // 이미 처리한 주문번호(order_id)는 무시
                seenOrderIds.add(item.order_id);

                // 같은 order_id의 품목 모으기
                const sameOrderItems = orders.filter(x => x.order_id === item.order_id);
                // 주문번호와 item 주문번호가 같은 걸 배열로 만들기
                const firstItemName = sameOrderItems[0].item_name;
                const displayName = sameOrderItems.length > 1
                    ? `${firstItemName} 외 ${sameOrderItems.length - 1}건`
                    : firstItemName;

                // 한 줄만 push
                result.push({
                    ...item,
                    date_no: count,
                    item_display: displayName
                });

                count++;
            });
        });

        return result;
    };

    const fetchURL = AppConfig.fetch["mytest"];

    // fecth()를 통해 톰캣서버에세 데이터를 요청
    useEffect(() => {
        fetch(`${fetchURL.protocol}${fetchURL.url}/buy/buyOrderUnchkList`, {
            method: "GET"
        })
            .then(res => res.json() // 응답이 오면 javascript object로 바꾸겠다.
            )
            .then(res => {
                console.log(1, res);
                const numbered = getNumberedList(res);
                setBuyOrderUnchkList(numbered);
            }
            )
            .catch(error => {
                console.error("데이터 가져오기 오류:", error);
                setBuyOrderUnchkList([]); // 오류 발생 시 빈 배열 설정 
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

    return (
        <>
            <Table height={500} data={buyOrderUnchkList}>

                <Column width={120} align="center">
                    <HeaderCell style={styles}>등록일자</HeaderCell>
                    <Cell>
                        {(orderDate) => (
                            <span
                                onClick={() => buyOrderUnchkList(orderDate.order_id)}
                            >
                                {`${orderDate.order_date}_${orderDate.date_no}`}
                            </span>
                        )}
                    </Cell>
                </Column>

                <Column width={120} align="center">
                    <HeaderCell style={styles}>발주번호</HeaderCell>
                    <Cell dataKey="order_id" />
                </Column>

                <Column width={150}>
                    <HeaderCell style={styles}>거래처명</HeaderCell>
                    <Cell dataKey="client_name" />
                </Column>

                <Column width={250}>
                    <HeaderCell style={styles}>품목명</HeaderCell>
                    <Cell dataKey="item_display" />
                </Column>

                <Column width={150}>
                    <HeaderCell style={styles}>금액합계</HeaderCell>
                    <Cell>
                        {(totalData) => new Intl.NumberFormat().format(totalData.total)}
                        {/* new Intl.NumberFormat().format : 천 단위로 콤마(,) 넣기 */}
                    </Cell>
                </Column>

                <Column width={150}>
                    <HeaderCell style={styles}>거래유형</HeaderCell>
                    <Cell dataKey="transaction_type" />
                </Column>

                <Column width={150}>
                    <HeaderCell style={styles}>입고창고</HeaderCell>
                    <Cell dataKey="storage_name" />
                </Column>

                <Column width={120}>
                    <HeaderCell style={styles}>납기일자</HeaderCell>
                    <Cell dataKey="delivery_date" />
                </Column>

                <Column width={120}>
                    <HeaderCell style={styles}>진행상태</HeaderCell>
                    <Cell dataKey="order_status" />
                </Column>

                {/*          
                <Column width={150} fixed="right">
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
                        {buyOrderUnchkList => (
                            <Link to={`/main/buy-select-detail/${buyOrderUnchkList.order_id}`}>
                                <Button color="green" appearance='ghost' size="xs">
                                    조회
                                </Button>
                            </Link>
                        )}
                    </Cell>
                </Column>
            </Table>

            <>
                <ButtonToolbar>
                    <Link to="/main/buy-insert">
                        <Button appearance="ghost" color="blue" style={{ marginTop: 20, marginLeft: 10 }} >구매 입력</Button>
                    </Link>
                </ButtonToolbar>
            </>


        </>
    );
};

