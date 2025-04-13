import React, { useState, useEffect } from 'react';
import { Link } from "@remix-run/react";
import { Container, Message, /* Form, */ Table } from 'rsuite';
import "#components/common/css/common.css";
import Appconfig from "#config/AppConfig.json";


const StockItemsList = () => {
    const fetchURL = Appconfig.fetch['mytest']
    const [logisStockList, setLogisStockList] = useState([]); // 초기값을 모르므로 빈배열로 Warehousingist에 대입

    // // fetch()를 통해 서버에게 데이터를 요청
    useEffect(() => { // 통신 시작 하겠다.
        fetch(`${fetchURL.protocol}${fetchURL.url}/logisstock/logisStockList`, { // 스프링부트에 요청한다.
            method: "GET" // "GET" 방식으로
        }).then(
            res => res.json() // 응답이 오면 javascript object로 바꾸겠다.
        ).then(
            res => {
                console.log(1, res); // setWarehousingist를 통해서 뿌려준다.
                // const list = Array.isArray(res) ? res : res?.warehousingList || [];
                setLogisStockList(res);
            }
        ).catch(error => {
            console.error("warehousing list:", error);
            setLogisStockList([]); // 오류 시 빈 배열 설정
        });
    }, []);
   
    return (
        <div>
            <Container>
                <Message type="success" className='main_title'>
                    <p>재고 목록</p>
                </Message>

                <Table height={400} data={logisStockList} className='text_center'>
                    <Table.Column width={100} align="center" fixed>
                        <Table.HeaderCell>품목코드</Table.HeaderCell>
                        <Table.Cell dataKey="item_code" />
                    </Table.Column>

                    <Table.Column width={200}>
                        <Table.HeaderCell>품목명</Table.HeaderCell>
                        <Table.Cell dataKey="item_name" />
                    </Table.Column>

                    <Table.Column width={150}>
                        <Table.HeaderCell>품목규격</Table.HeaderCell>
                        <Table.Cell dataKey="item_standard" />
                    </Table.Column>

                    <Table.Column width={120}>
                        <Table.HeaderCell>현 재고량</Table.HeaderCell>
                        <Table.Cell dataKey="stock_amount" >
							{(rowData) => (
								<span
									style={{
										color: rowData.stock_amount < rowData.safe_stock ? 'red' : 'inherit',
										fontWeight: rowData.stock_amount < rowData.safe_stock ? 'bold' : 'normal'
									}}
								>
									{rowData.stock_amount}
								</span>
							)}
                        </Table.Cell>
                    </Table.Column>

                    <Table.Column width={120}>
                        <Table.HeaderCell>안전 재고</Table.HeaderCell>
                        <Table.Cell dataKey="safe_stock" />
                    </Table.Column>

                    <Table.Column width={150}>
                        <Table.HeaderCell>최근 입고일</Table.HeaderCell>
                        <Table.Cell dataKey="last_date" />
                    </Table.Column>

                 	{/*<Table.Column width={150}>
                        <Table.HeaderCell>제조사</Table.HeaderCell>
                        <Table.Cell dataKey="client_name" />
                    </Table.Column>*/}

                    <Table.Column width={150}>
                        <Table.HeaderCell>보관창고</Table.HeaderCell>
                        <Table.Cell dataKey="storage_name" />
                    </Table.Column>
                    
					<Table.Column width={150}>
					      <Table.HeaderCell>창고코드</Table.HeaderCell>
					      <Table.Cell dataKey="storage_code" />
					</Table.Column>
					

                </Table>

                <br />

                {/* <Form>
                    {warehousingList.map(warehousing => 
                        <WarehousingItem key={warehousing.item_code} warehousing={warehousing} />
                    )}
                    </Form> */}
            </Container>
        </div>
    )
}

export default StockItemsList;