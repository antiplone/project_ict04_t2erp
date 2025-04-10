import React, { useState, useEffect } from 'react';
import { Container, /* Form, */ Table } from 'rsuite';
//import { Link  } from 'react-router-dom';
// import WarehousingItem from '../components/WarehousingItem';

const StockItems = () => {

    const [warehousingList, setWarehousingList] = useState([]); // 초기값을 모르므로 빈배열로 Warehousingist에 대입

    // // fetch()를 통해 서버에게 데이터를 요청
    useEffect(() => { // 통신 시작 하겠다.
        fetch("http://localhost:8081/logisstock/logisStockList", { // 스프링부트에 요청한다.
            method: "GET" // "GET" 방식으로
        }).then(
            res => res.json() // 응답이 오면 javascript object로 바꾸겠다.
        ).then(
            res => {
                console.log(1, res); // setWarehousingist를 통해서 뿌려준다.
                // const list = Array.isArray(res) ? res : res?.warehousingList || [];
                setWarehousingList(res);
            }
        ).catch(error => {
            console.error("warehousing list:", error);
            setWarehousingList([]); // 오류 시 빈 배열 설정
        });
    }, []);
    // // []은 디펜던시인데, setState()로 렌더링 될 때마다 싱행되면 안되고, 한 번만 실행하도록 빕배여ㅕ르ㅏㅏ

    return (
        <div>
            <Container>
                <div className='header logiHeader'>
                    입고관리
                </div>
                <br />
                    <Table height={400} data={warehousingList}>
                        <Table.Column width={100} align="center" fixed>
                            <Table.HeaderCell>Item Code</Table.HeaderCell>
                            <Table.Cell dataKey="item_code" />
                        </Table.Column>

                        <Table.Column width={200}>
                            <Table.HeaderCell>Item Name</Table.HeaderCell>
                            <Table.Cell dataKey="item_name" />
                        </Table.Column>

                        <Table.Column width={150}>
                            <Table.HeaderCell>Item Standard</Table.HeaderCell>
                            <Table.Cell dataKey="item_standard" />
                        </Table.Column>

                        <Table.Column width={120}>
                            <Table.HeaderCell>Stock Amount</Table.HeaderCell>
                            <Table.Cell dataKey="stock_amount" />
                        </Table.Column>

                        <Table.Column width={120}>
                            <Table.HeaderCell>Safe Stock</Table.HeaderCell>
                            <Table.Cell dataKey="safe_stock" />
                        </Table.Column>

                        <Table.Column width={150}>
                            <Table.HeaderCell>Last Date</Table.HeaderCell>
                            <Table.Cell dataKey="last_date" />
                        </Table.Column>

                        <Table.Column width={150}>
                            <Table.HeaderCell>Client Name</Table.HeaderCell>
                            <Table.Cell dataKey="client_name" />
                        </Table.Column>

                        <Table.Column width={150}>
                            <Table.HeaderCell>Storage</Table.HeaderCell>
                            <Table.Cell dataKey="storage" />
                        </Table.Column>

                        <Table.Column width={150}>
                            <Table.HeaderCell>Storage</Table.HeaderCell>
                            <Table.Cell dataKey="storage" />
                        </Table.Column>
                    </Table>
                    {/* <Form>
                    {warehousingList.map(warehousing => 
                        <WarehousingItem key={warehousing.item_code} warehousing={warehousing} />
                    )}
                    </Form> */}
            </Container>
        </div>
    )
}

export default StockItems;