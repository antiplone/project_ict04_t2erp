import { Button, Message, Container, Divider, Table, toaster } from 'rsuite';
import React, { useState, useEffect } from "react";
import "#styles/sell.css";
import AppConfig from "#config/AppConfig.json";
import { useParams, useNavigate, Link } from "react-router-dom";

//  sell_all_list_detail => 판매 입력건 상세 페이지

const { Column, HeaderCell, Cell } = Table;

const sell_all_list_detail = () => {

	const fetchURL = AppConfig.fetch['mytest'];
	const navigate = useNavigate();
	const { order_id } = useParams();

	// 상세 정보
	const [allDetail, setAllDetail] = useState([]);
	
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
			if (res != null) {
				toaster.push(
					<Message showIcon type="success" closable>
						삭제에 성공했습니다.
					</Message>,
					{ placement: "topCenter" }
				);
				navigate('/main/sell_all_list');
			} else {
				toaster.push(
					<Message showIcon type="error" closable>
						삭제에 실패했습니다.
					</Message>,
					{ placement: "topCenter" }
				);
			}
		})
		.catch(() => {
			toaster.push(
				<Message showIcon type="error" closable>
					요청 중 오류 발생.
				</Message>,
				{ placement: "topCenter" }
			);
		});
	}

	const styles = {
		backgroundColor: '#f8f9fa',
	  };

	return (
		<>
			<Container>
				<Message type="success" className="main_title">
					판매 상세페이지 - 주문번호: {order_id}
				</Message>
				<br />
			<>

			{allDetail.length > 0 && (	// 주문정보는 1회만 출력되어야 하므로 첫번째 데이터만 가져오기
			<Table height={100} width={1200} data={[allDetail[0]]} >
				<Column className="text_center" width={120}><HeaderCell style={styles}>주문번호</HeaderCell><Cell dataKey="order_id" /></Column>
				<Column className="text_center" width={120}><HeaderCell style={styles}>요청일자</HeaderCell><Cell dataKey="order_date" /></Column>
				<Column className="text_center" width={120}><HeaderCell style={styles}>판매요청 부서</HeaderCell>
					<Cell>
						{(rowData) => rowData.order_type === 1 ? "판매팀" : rowData.order_type === 2 ? "구매팀" : ""}
					</Cell>
				</Column>
				<Column className="text_center" width={150}><HeaderCell style={styles}>담당자명</HeaderCell><Cell dataKey="e_name" /></Column>
				<Column width={150}><HeaderCell className="text_center" style={styles}>거래처명</HeaderCell><Cell className="text_left" dataKey="client_name" /></Column>
				<Column width={150}><HeaderCell style={styles}>거래유형</HeaderCell><Cell className="text_left" dataKey="transaction_type" /></Column>
				<Column width={150}><HeaderCell style={styles}>출하창고</HeaderCell><Cell className="text_left" dataKey="storage_name" /></Column>
				<Column className="text_center" width={120}><HeaderCell style={styles}>출하지시일</HeaderCell><Cell dataKey="shipment_order_date" /></Column>
				<Column className="text_center" width={120}><HeaderCell style={styles}>진행상태</HeaderCell><Cell dataKey="order_status" /></Column>
			</Table> )}
			</>

        <Divider style={{maxWidth: 1200}}/>
        <>
			<Table height={400} width={1200} data={allDetail}>
				<Column className="text_center" width={120}><HeaderCell style={styles}>물품코드</HeaderCell><Cell dataKey="item_code" /></Column>
				<Column width={250}><HeaderCell className="text_center" style={styles}>물품명</HeaderCell><Cell className="text_left" dataKey="item_name" /></Column>
				<Column align="right" width={110}>
					<HeaderCell style={styles}>수량</HeaderCell>
					<Cell>{rowData => Number(rowData.quantity).toLocaleString()}</Cell>
				</Column>	
				{/* Number(...).toLocaleString() : 문자열 숫자("1234" 등)도 자동으로 변환됨 
				 	new Intl.NumberFormat().format(...): 다양한 국가별 통화/숫자 형식 지원 */}
				<Column align="right" width={180}>
					<HeaderCell style={styles}>단가</HeaderCell>
					<Cell>{rowData => Number(rowData.price).toLocaleString()}</Cell>
				</Column>
				<Column align="right" width={180}>
					<HeaderCell style={styles}>공급가액</HeaderCell>
					<Cell>{rowData => Number(rowData.supply).toLocaleString()}</Cell>
				</Column>
				<Column align="right" width={180}>
					<HeaderCell style={styles}>부가세</HeaderCell>
					<Cell>{rowData => Number(rowData.vat).toLocaleString()}</Cell>
				</Column>
				<Column align="right" width={180}>
					<HeaderCell style={styles}>총액</HeaderCell>
					<Cell>{rowData => Number(rowData.total).toLocaleString()}</Cell>
				</Column>
        	</Table>
        </>
      </Container>

      <Divider style={{maxWidth: 1200}}/>

      <div className="sell_DetailBtnBox">
        <Button appearance="ghost" color="blue" className="sell_DetailBtn" onClick={() => updateAllList(order_id)}>수정</Button>
        <Button style={{ marginRight: 10, border: '1px solid #22284C', color: '#22284C' }} appearance="ghost" className="sell_DetailBtn" onClick={() => allList()}> 목록</Button>
        <Button appearance="ghost" color="red" className="sell_DetailBtn" onClick={() => deleteAllList(order_id)}>삭제</Button>

      </div>
	</>
  );
};


export default sell_all_list_detail;
