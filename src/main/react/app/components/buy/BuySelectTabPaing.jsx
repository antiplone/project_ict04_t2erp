// 구매팀 - 구매조회 탭 결재중
import AppConfig from "#config/AppConfig.json";
import { Table, Button, ButtonToolbar } from 'rsuite';
import React, { useEffect, useState } from 'react';
import '../../styles/buy.css';
import { Link } from 'react-router-dom';

const { Column, HeaderCell, Cell } = Table;

export default function BuySelectTabPaing() {

    const [buyOrderPayingList, setBuyOrderPayingList] = useState([]); // 초기값을 모르므로 빈배열로 buyList에 대입

    const fetchURL = AppConfig.fetch["mytest"];

    // fecth()를 통해 톰캣서버에세 데이터를 요청
    useEffect(() => {
        fetch(`${fetchURL.protocol}${fetchURL.url}/buy/buyOrderPayingList`, {
            method: "GET"
        })
            .then(res => res.json() // 응답이 오면 javascript object로 바꾸겠다.
            )
            .then(res => {
                console.log(1, res);
                setBuyOrderPayingList(res || []); // 처음에는 비어있으므로 못가져온다. setBoardList(res);
            }
            )
            .catch(error => {
                console.error("데이터 가져오기 오류:", error);
                setBuyOrderPayingList([]); // 오류 발생 시 빈 배열 설정 
            });
    }, []); // []은 디펜던시인데, setState()로 렌더링될때 실행되면 안되고, 1번만 실행하도록 빈배열을 넣어둔다.
    // CORS 오류 : Controller 진입 직전에 적용된다. 외부에서 자바스크립트 요청이 오는 것을

    const styles = {
        backgroundColor: '#f8f9fa',
    };

    return (
        <>
            <Table height={500} data={buyOrderPayingList} style={{ maxWidth: 1500 }}>

                <Column width={120}>
                    <HeaderCell style={styles}>등록일자</HeaderCell>
                    <Cell dataKey="order_date" />
                </Column>

                <Column width={120}>
                    <HeaderCell style={styles}>발주번호</HeaderCell>
                    <Cell dataKey="order_id" />
                </Column>

                <Column width={150}>
                    <HeaderCell style={styles}>거래처명</HeaderCell>
                    <Cell dataKey="client_name" />
                </Column>

                <Column width={250}>
                    <HeaderCell style={styles}>품목명</HeaderCell>
                    <Cell dataKey="item_name" />
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
                        {buyOrderPayingList => (
                            <Link to={`/main/buy-select-detail/${buyOrderPayingList.order_id}`}>
                                <Button color="green" appearance='ghost'>
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
                        <Button appearance="ghost" color="blue" style={{ marginTop: 20 }} >구매 입력</Button>
                    </Link>
                </ButtonToolbar>
            </>

        </>
    );
};

