import React, { useState, useEffect } from 'react';
import { Link, useParams } from '@remix-run/react';
import { Button, Container, Message, Table } from 'rsuite';
import Appconfig from "#config/AppConfig.json";
import "#components/common/css/common.css";

const OrderItemList = () => {
	const fetchURL = Appconfig.fetch['mytest']
    const { order_id } = useParams();
    const [orderItemList, setOrderItemList] = useState([]); // 초기값을 모르므로 빈배열로 orderItemList에 대입
    const [orderAmounts, setOrderAmounts] = useState({}); // 주문 수량 저장
	const [selectedItems, setSelectedItems] = useState(new Set()); // 선택한 품목들 저장

    // // fetch()를 통해 서버에게 데이터를 요청
    useEffect(() => { // 통신 시작 하겠다.
        if (!order_id) {
            console.error("order_id가 없습니다.");
            return;
        }

	/* fetch(`http://localhost:8081/logisorder/orderDetail/` + order_id)*/
        fetch(`${fetchURL.protocol}${fetchURL.url}/logisorder/orderDetail/` + order_id)
            .then(res => res.json())
            .then(res => {
				setOrderItemList(res || []);
			})
            .catch(err => console.error('Error fetching orderDetail:', err));
    }, [order_id]);
	
    const toggleSelection = (item_code, isConfirmed) => {
        if (isConfirmed) return; // 입고완료인 항목은 선택 불가
        setSelectedItems(prev => {
            const newSet = new Set(prev);
            newSet.has(item_code) ? newSet.delete(item_code) : newSet.add(item_code);
            return newSet;
        });
    };
	
    const handleOrderAmountChange = (item_code, newAmount) => {
        setOrderAmounts(prev => ({
            ...prev,
            [item_code]: Number(newAmount),
        }));
    };

    const applyOrderAmountChange = (item_code) => {
        setOrderItemList(prevList =>
            prevList.map(item =>
                item.item_code === item_code
                    ? { ...item, quantity: orderAmounts[item_code] || item.quantity }
                    : item
            )
        );
        alert(`품목 ${item_code}의 주문 수량이 변경되었습니다!`);
    };

    // 전체 선택 버튼 관련
    const toggleSelectAll = () => {
        const selectable = orderItemList.filter(item => item.income_confirm !== 'Y').map(item => item.item_code);
        setSelectedItems(prev => {
            return prev.size === selectable.length ? new Set() : new Set(selectable);
        });
    };

    // 데이터 전송(Submit)
	const handleSubmitSelected = () => {
		const itemsToSubmit = [...selectedItems].filter(code => {
			const item = orderItemList.find(i => i.item_code === code);
			return item && item.income_confirm !== 'Y';
		});

		if (itemsToSubmit.length === 0) {
			alert("입고 확정할 새 품목이 없습니다.");
			return;
		}

		// 주문 수량과 실제 입고 수량이 다른 항목 확인

		const invalidItems = itemsToSubmit.filter(code => {
			const item = orderItemList.find(i => i.item_code === code);
			if (!item) return false;

			const actualAmount = orderAmounts.hasOwnProperty(code) // 실제 사용자가 변경했는지 판단
				? orderAmounts[code]
				: item.quantity; // 바꿨으면 orderAmount로 바꾸지 않았으면 item.quantity의 값으로

			return actualAmount !== item.order_amount;
		});

		/*if (invalidItems.length > 0) {
			const proceed = window.confirm("입고 수량이 주문 수량과 다릅니다. 계속 진행할까요?");
			if (!proceed) return;
		}*/

		Promise.all(
			itemsToSubmit.map((item_code) => {
				const item = orderItemList.find(item => item.item_code === item_code);
				if (!item) return Promise.resolve(); // 아무 작업도 하지 않음

				const updatedOrderAmount = orderAmounts[item_code] || item.quantity;

				const query = new URLSearchParams({
					stock_amount: updatedOrderAmount,
					item_code: item_code,
					storage_code: item.storage_code,
					order_id: order_id
				}).toString();

				console.log("query => ", query);

				return fetch(`${fetchURL.protocol}${fetchURL.url}/logisstock/stockUpdate?${query}`, {
					method: "PUT",
					headers: {
						"Content-Type": "application/json"
					},
					body: JSON.stringify({})
				}).then(response => {
					if (!response.ok) {
						alert(`품목 ${item_code} 전송 중 오류 발생.`);
					}
				}).catch(error => {
					console.error(`Error submitting ${item_code}:`, error);
				});
			})
		).then(() => {
			alert("선택된 품목들이 성공적으로 입고 확정되었습니다!");
			setSelectedItems(new Set());

			// 데이터 갱신
			fetch(`${fetchURL.protocol}${fetchURL.url}/logisorder/orderDetail/${order_id}`)
				.then(res => res.json())
				.then(updatedData => {
					setOrderItemList(updatedData || []);
				})
				.catch(err => {
					console.error("Error fetching updated data:", err);
					alert("데이터 갱신 실패");
				});
		}).catch(err => {
			console.error("Error in Promise.all:", err);
			alert("네트워크 오류 발생");
		})
	}
    
	/* 입고 상태 컬럼 렌더링 */
	const renderIncomeConfirmCell = (rowData) => (
	    <div className={rowData.income_confirm === 'Y' ? 'b_confirm' : 'b_no_confirm'}>
	        {rowData.income_confirm === 'Y' ? '입고완료' : '미입고'}
	    </div>
	);
    
    return (
        <div>
            <Container>
               	<Message type="success" className="main_title">
                    주문 상세 목록 (주문 번호 : {order_id})
                </Message>
                <br />
                <Table height={400} data={orderItemList} className='text_center'>
	                <Table.Column width={80} align="center">
	                    <Table.HeaderCell>
	                        <input
	                            type="checkbox"
	                            onChange={toggleSelectAll}
	                            checked={
									selectedItems.size > 0 &&
									selectedItems.size === orderItemList.filter(item => item.income_confirm !== 'Y').length
								}
	                        />
	                    </Table.HeaderCell>
	                    <Table.Cell>
	                        {rowData => (
	                            <input
	                                type="checkbox"
	                                checked={selectedItems.has(rowData.item_code)}
	                                disabled={rowData.income_confirm === 'Y'} // 확정된 품목은 선택 불가
	                                onChange={() => toggleSelection(rowData.item_code)}
	                            />
	                        )}
	                    </Table.Cell>
	                </Table.Column>

                    <Table.Column width={100}>
                        <Table.HeaderCell>품목코드</Table.HeaderCell>
                        <Table.Cell dataKey="item_code" />
                    </Table.Column>

                    <Table.Column width={160}>
                        <Table.HeaderCell>품목명</Table.HeaderCell>
                        <Table.Cell dataKey="item_name" />
                    </Table.Column>

                    <Table.Column width={80}>
                        <Table.HeaderCell>주문수량</Table.HeaderCell>
                        <Table.Cell dataKey="quantity" />
                    </Table.Column>
                    
					<Table.Column width={120}>
						<Table.HeaderCell>실제 입고 수량</Table.HeaderCell>
						<Table.Cell dataKey="income_confirm">
							{rowData => (
								<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-evenly' }}>
									<input
										type="number"
										min="0"
										value={orderAmounts[rowData.item_code] ?? rowData.quantity}
										disabled={rowData.income_confirm === 'Y'}
										onChange={(e) => handleOrderAmountChange(rowData.item_code, e.target.value)}
										className='input_width text_center'
									/>

									<Button
                                        size="xs"
                                        onClick={() => applyOrderAmountChange(rowData.item_code)}
                                        disabled={rowData.income_confirm === 'Y'}
                                        className='mini_btn'
                                    >
										적용
									</Button>
								</div>
							)}
						</Table.Cell>
					</Table.Column>

                    <Table.Column width={160}>
                        <Table.HeaderCell>규격</Table.HeaderCell>
                        <Table.Cell dataKey="item_standard" />
                    </Table.Column>
                    
					<Table.Column width={200}>
						<Table.HeaderCell>입고 상태</Table.HeaderCell>
						<Table.Cell>
							{renderIncomeConfirmCell}
						</Table.Cell>
					</Table.Column>

                    <Table.Column width={150} style={{ padding: '6px' }}>
                        <Table.HeaderCell>창고 상세보기</Table.HeaderCell>
                        <Table.Cell dataKey="order_id">
                            {(rowData) => (
                                <Link to={`/main/logis-order-item-detail/${rowData.order_id}/${rowData.item_code}/${rowData.order_type}`}
                                    className="btn btn-primary area_fit wide_fit">
                                    품목 상세
                                </Link>
                            )}
                        </Table.Cell>
                    </Table.Column>
                    
                     <Table.Column width={160}>
                        <Table.HeaderCell>입고 창고 코드</Table.HeaderCell>
                        <Table.Cell dataKey="storage_code" />
                    </Table.Column>
                </Table>
                
                <div className='display_flex'>
					<Button
						className="btn btn-success"
						onClick={handleSubmitSelected}
						disabled={selectedItems.size === 0}
					>
						선택된 품목 입고 확정
					</Button>
                    <Link to={'/main/logis-income-list'} className="btn btn-primary area_fit wide_fit margin_0">입고 목록</Link>
                </div>
            </Container>
        </div>
    )
}

export default OrderItemList;