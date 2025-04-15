import { List, Button, Card, Message, ButtonToolbar } from 'rsuite';
// import SearchIcon from '@rsuite/icons/Search';
import React, { useState, useEffect } from "react";
import "../components/common/Sell_maintitle.css";
import AppConfig from "#config/AppConfig.json";
import { useParams, useNavigate } from "react-router-dom";

const sell_all_list_detail = () => {

	const navigate = useNavigate();
	const { order_id } = useParams();

	// 상세 정보
	const [allDetail, setAllDetail] = useState([]);

	const fetchURL = AppConfig.fetch['mytest'];

	// 주문번호 1개에 대해 조회
	useEffect(() => {
		if (!order_id) return; // undefined 방지

		fetch(`${fetchURL.protocol}${fetchURL.url}/sell/allDetail/` + order_id, {
			method: "GET"
		})
		.then(res => res.json())
		.then(res => {
			console.log(1, res);
			setAllDetail(res);
		});
	}, [order_id]);

	// 목록
	const allList = () => {
		navigate('/main/sell_all_list');
	}

	// 수정
	const updateAllList = (order_id) => {
		navigate('/main/sell_all_list_update/' + order_id);
    }

	// 삭제
	const deleteAllList = (order_id) => {
		fetch(`${fetchURL.protocol}${fetchURL.url}/sell/allDelete/` + order_id, {
			method: 'DELETE',
		})
		.then((res) => res.text())
		.then((res) => {
			if (res != null) {	// 대소문자 주의
				alert('삭제에 성공했습니다.');
				navigate('/main/sell_all_list');
				// setReqClient(reqClient.filter(item => item.order_id !== order_id)); // 삭제된 항목 제거
			} else {
				alert('삭제에 실패했습니다.');
			}
		});
	}

	return (
		<div>
			<Message type="success" className="main_title">
				판매조회_상세 정보
			</Message>

			<Card className="detail" shaded>
                <Card.Header as="h5">[ 상세 내역 ] </Card.Header>
                <Card.Body>
                    
                    <List>
                    {allDetail.map((rowData, idx) => (
                    <List.Item key={idx}>
                        <strong>순번</strong>: {rowData.order_id} <br />
                        <strong>출하지시일</strong>: {rowData.shipment_order_date} <br />
						<strong>출하창고</strong>: {rowData.storage_name} <br />
						<strong>담당자명</strong>: {rowData.e_name} <br />
                        <strong>거래처명</strong>: {rowData.client_name} <br />
                        <strong>거래유형</strong>: {rowData.transaction_type} <br /> <br />

                        <strong>물품코드</strong>: {rowData.item_code} <br />
                        <strong>물품명</strong>: {rowData.item_name} <br />
						<strong>수량</strong>: {new Intl.NumberFormat().format(rowData.quantity)} <br /> <br />
                        <strong>단가</strong>: {new Intl.NumberFormat().format(rowData.price)}원<br />
						<strong>공급가액</strong>: {new Intl.NumberFormat().format(rowData.supply)}원 <br />
                        <strong>부가세</strong>: {new Intl.NumberFormat().format(rowData.vat)}원 <br />
						<strong>총액</strong>: {new Intl.NumberFormat().format(rowData.total)}원 <br /><br />
						<strong>진행상태</strong>: {rowData.order_status}<br /><br />
					</List.Item>
                    ))}
                    </List>

                </Card.Body>

                <div className="reqDetailBtn">
                    <Card.Footer>
						<ButtonToolbar>
							<Button onClick={allList} appearance="primary">목록</Button>
							<Button
								onClick={() => updateAllList(allDetail[0]?.order_id)}
								appearance="primary"
							>
							수정
							</Button>
							<Button
								onClick={() => deleteAllList(allDetail[0]?.order_id)}
								appearance="primary"
							>
							삭제
							</Button>
						</ButtonToolbar>
                    </Card.Footer>
                </div>
            </Card>
		</div>
  );
};


export default sell_all_list_detail;
