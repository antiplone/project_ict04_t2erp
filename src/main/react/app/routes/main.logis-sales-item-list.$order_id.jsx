import React, { useState, useEffect } from 'react';
import { Link, useParams } from '@remix-run/react';
import { Container, Message, Table } from 'rsuite';
import Appconfig from "#config/AppConfig.json";
import "#components/common/css/common.css";

const SalesItemList = () => {
	const fetchURL = Appconfig.fetch['mytest']
    const { order_id } = useParams();
    console.log("OderItemList sales_id : ", order_id)

    const [salesItemList, setSalesItemList] = useState([]); // 초기값을 모르므로 빈배열로 Warehousingist에 대입


    // // fetch()를 통해 서버에게 데이터를 요청
    useEffect(() => { // 통신 시작 하겠다.
        if (!order_id) {
            console.error("order_id가 없습니다.");
            return;
        }

        fetch(`${fetchURL.protocol}${fetchURL.url}/logissales/salesDetail/` + order_id)
            .then(res => res.json())
            .then(res => {
                setSalesItemList(res || []);
            })
            .catch(err => console.error('Error fetching salesDetail:', err));
         console.log("salesItemList : ", salesItemList);
    }, [order_id]);
    
	const handleConfirmClick = async () => {
		if (!order_id) return;

		try {
			for (const item of salesItemList) {
				const query = new URLSearchParams({
					stock_amount: item.quantity,
					item_code: item.item_code,
					order_id: item.order_id,
				});

				const response = await fetch(`http://localhost:8081/logisstock/stockSellUpdate?${query.toString()}`, {
					method: "PUT",
					headers: {
						"Content-Type": "application/json"
					},
					body: JSON.stringify({})
				});

				if (!response.ok) {
					throw new Error(`서버 응답 실패 (item_code: ${item.item_code})`);
				}
			}

			alert("재고 업데이트가 완료되었습니다.");
		} catch (error) {
			console.error("재고 업데이트 오류:", error);
			alert("재고 업데이트 중 오류가 발생했습니다.");
		}
	};

    return (
        <div>
            <Container>
                <Message type="info" className="main_title">
                    판매 상세 목록 (판매 번호 : {order_id})
               	</Message>
                <br />
                <Table height={400} data={salesItemList}>
                    <Table.Column width={100} align="center" fixed>
                        <Table.HeaderCell>판매번호</Table.HeaderCell>
                        <Table.Cell dataKey="order_id" />
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
                        <Table.HeaderCell>판매수량</Table.HeaderCell>
                        <Table.Cell dataKey="quantity" />
                    </Table.Column>

                    <Table.Column width={160}>
                        <Table.HeaderCell>규격</Table.HeaderCell>
                        <Table.Cell dataKey="item_standard" />
                    </Table.Column>

                    <Table.Column width={150} style={{ padding: '6px' }}>
                        <Table.HeaderCell>창고 상세보기</Table.HeaderCell>
                        <Table.Cell dataKey="order_id">
                            {(rowData) => (
                                <Link
                                    to={`/main/logis-sales-item-detail/${rowData.order_id}/${rowData.item_code}/${rowData.order_type}`}
                                    className="btn btn-primary area_fit wide_fit"
                                >
                                    품목 상세
                                </Link>
                            )}
                        </Table.Cell>
                    </Table.Column>
                </Table>
                <div className='display_flex'>
                	<button onClick={handleConfirmClick} className="btn btn-primary area_fit wide_fit margin_0">확정</button>
                    <Link to={'/main/logis-outgoing-list'} className="btn btn-primary area_fit wide_fit margin_0">출고 목록</Link>
                </div>
            </Container>
        </div>
    )
}

export default SalesItemList;