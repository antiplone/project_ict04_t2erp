// 구매팀 - 구매상세 조회 페이지
/* eslint-disable react/react-in-jsx-scope */
import AppConfig from "#config/AppConfig.json";
import * as rs from 'rsuite';
import Table from 'rsuite/Table';
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../styles/buy.css"

const { Column, HeaderCell, Cell } = Table;

export default function BuySelectDetail() {

    const navigate = useNavigate();

    const [buyOrderAllList, setBuyOrderAllList] = useState([]); // 초기값을 모르므로 빈배열로 buyList에 대입

    const { order_id } = useParams();

    const fecthURL = AppConfig.fetch['mytest']

    const [buyOrderDetail, setBuyOrderDetail] = useState([]);

    // fecth()를 통해 톰캣서버에세 데이터를 요청
    useEffect(() => {

        if (!order_id) return;

        fetch(`${fecthURL.protocol}${fecthURL.url}/buy/buyOrderDetail/${order_id}`, {
            method: "GET"
        })
            .then(res => res.json() // 응답이 오면 javascript object로 바꿈.
            )
            .then(res => {
                console.log(1, res);
                setBuyOrderDetail(res || []); // 처음에는 비어있으므로 못가져온다. setBuyOrderDetail(res);
            }
            )
            .catch(error => {
                console.error("데이터 가져오기 오류:", error);
                setBuyOrderDetail([]); // 오류 발생 시 빈 배열 설정
            });
    }, [order_id]); // []은 디펜던시인데, setBuyOrderDetail()로 렌더링될때 실행되면 안되고, 1번만 실행하도록 빈배열을 넣어둔다.
    // CORS 오류 : Controller 진입 직전에 적용된다. 외부에서 자바스크립트 요청이 오는 것을

    return (
        <rs.Container>
            <>
                <rs.Message type="info" style={{ width: 960 }}>
                    <strong>구매 상세페이지</strong>
                </rs.Message>
                <br />
                <>
                <Table height={100} width={960} data={buyOrderDetail} onRowClick={itemData => console.log(itemData)}>
                    <Column width={120}><HeaderCell>발주일자</HeaderCell><Cell dataKey="order_date" /></Column>
                    <Column width={120}><HeaderCell>구매요청 부서</HeaderCell><Cell dataKey="order_date" /></Column>
                    <Column width={120}><HeaderCell>담당자</HeaderCell><Cell dataKey="e_id" /></Column>
                    <Column width={120}><HeaderCell>거래처명</HeaderCell><Cell dataKey="client_name" /></Column>
                    <Column width={120}><HeaderCell>거래유형</HeaderCell><Cell dataKey="transaction_type" /></Column>
                    <Column width={120}><HeaderCell>입고창고</HeaderCell><Cell dataKey="storage_name" /></Column>
                    <Column width={120}><HeaderCell>진행상태</HeaderCell><Cell dataKey="order_status" /></Column>
                    <Column width={120}><HeaderCell>회계처리 여부</HeaderCell><Cell dataKey="" /></Column>
                </Table>
                </>

                <>
                <Table height={400} width={960}  onRowClick={itemData => console.log(itemData)}>
                    <Column width={120}><HeaderCell>물품코드</HeaderCell><Cell dataKey="order_date" /></Column>
                    <Column width={120}><HeaderCell>물품명</HeaderCell><Cell dataKey="client_name" /></Column>
                    <Column width={120}><HeaderCell>수량</HeaderCell><Cell dataKey="item_name" /></Column>
                    <Column width={120}><HeaderCell>단가</HeaderCell><Cell dataKey="quantity" /></Column>
                    <Column width={120}><HeaderCell>공급가액</HeaderCell><Cell dataKey="price" /></Column>
                    <Column width={120}><HeaderCell>부가세</HeaderCell><Cell dataKey="total" /></Column>
                    <Column width={120}><HeaderCell>총액</HeaderCell><Cell dataKey="total" /></Column>
                </Table>
                </>
            </>
        </rs.Container>
    );
};

