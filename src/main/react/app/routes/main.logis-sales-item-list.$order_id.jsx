import React, { useState, useEffect } from 'react';
import { Link, useParams } from '@remix-run/react';
import { Button, Container, Placeholder, Loader, Table } from 'rsuite';
import Appconfig from "#config/AppConfig.json";
import "#components/common/css/common.css";
import MessageBox from '../components/common/MessageBox';

const SalesItemList = () => {
	const fetchURL = Appconfig.fetch['mytest']
    const { order_id } = useParams();
	const [loading, setLoading] = useState(true);	// 로딩중일때
    const [salesItemList, setSalesItemList] = useState([]); // 초기값을 모르므로 빈배열로 salesItemList에 대입
    const [salesAmounts, setSalesAmounts] = useState({}); // 주문 수량 저장
	const [selectedItems, setSelectedItems] = useState(new Set()); // 선택한 품목들 저장
    console.log("OderItemList sales_id : ", order_id)

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
                setLoading(true);
            })
            .catch(err => console.error('Error fetching salesDetail:', err));
    }, [order_id]);
    
	const toggleSelection = (item_code, isConfirmed) => {
		if (isConfirmed) return; // 입고완료인 항목은 선택 불가
		setSelectedItems(prev => {
			const newSet = new Set(prev);
			newSet.has(item_code) ? newSet.delete(item_code) : newSet.add(item_code);
			return newSet;
		});
	};
	
	const handleSalesAmountChange = (item_code, newAmount) => {
		setSalesAmounts(prev => ({
			...prev,
			[item_code]: Number(newAmount),
		}));
	};
    
	const applySalesAmountChange = (item_code) => {
		setSalesItemList(prevList =>
			prevList.map(item =>
				item.item_code === item_code
					? { ...item, quantity: salesAmounts[item_code] || item.quantity }
					: item
			)
		);
		alert(`품목 ${item_code}의 주문 수량이 변경되었습니다!`);
	};
	
    // 전체 선택 버튼 관련
    const toggleSelectAll = () => {
        const selectable = salesItemList.filter(item => item.income_confirm !== 'Y').map(item => item.item_code);
        setSelectedItems(prev => {
            return prev.size === selectable.length ? new Set() : new Set(selectable);
        });
    };
    
    // 데이터 전송(Submit)
	const handleSubmitSelected = () => {
		const itemsToSubmit = [...selectedItems].filter(code => {
			const item = salesItemList.find(i => i.item_code === code);
			return item && item.income_confirm !== 'Y';
		});

		if (itemsToSubmit.length === 0) {
			alert("입고 확정할 새 품목이 없습니다.");
			return;
		}

		// 주문 수량과 실제 입고 수량이 다른 항목 확인

		const invalidItems = itemsToSubmit.filter(code => {
			const item = salesItemList.find(i => i.item_code === code);
			if (!item) return false;

			const actualAmount = salesAmounts.hasOwnProperty(code) // 실제 사용자가 변경했는지 판단
				? salesAmounts[code]
				: item.quantity; // 바꿨으면 orderAmount로 바꾸지 않았으면 item.quantity의 값으로

			return actualAmount !== item.order_amount;
		});
		
		Promise.all(
			itemsToSubmit.map((item_code) => {
				const item = salesItemList.find(item => item.item_code === item_code);
				if (!item) return Promise.resolve(); // 아무 작업도 하지 않음

				const updatedOrderAmount = salesAmounts[item_code] || item.quantity;

				const query = new URLSearchParams({
					stock_amount: updatedOrderAmount,
					item_code: item_code,
					storage_code: item.storage_code,
					order_id: order_id
				}).toString();

				console.log("query => ", query);

				return fetch(`http://localhost:8081/logisstock/sellStockUpdate?${query.toString()}`, {
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
			fetch(`${fetchURL.protocol}${fetchURL.url}/logissales/salesDetail/${order_id}`)
				.then(res => res.json())
				.then(updatedData => {
					setSalesItemList(updatedData || []);
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
	        {rowData.income_confirm === 'Y' ? '출고완료' : '미출고'}
	    </div>
	);
    
    
    return (
        <div>
            <MessageBox type="info" className="main_title"  text={`판매 상세 목록 (판매 번호 :${order_id})`} />
            <Container style={{margin: '0 auto', maxWidth : '1480px'}}>
				{/* 로딩 중일 때 */}
				{/* Placeholder.Paragraph : 여러 줄의 더미 텍스트 박스. 스켈레톤(skeleton) 로딩 UI를 자동 생성 */}
				{loading ? (
					<Container>
						<Placeholder.Paragraph rows={15} />
						<Loader center content="불러오는중..." />
					</Container>
				) : (
                <Table width={1450} data={salesItemList} className='text_center'>
					<Table.Column width={100} align="center">
						<Table.HeaderCell>
							<input
								type="checkbox"
								onChange={toggleSelectAll}
								checked={
									selectedItems.size > 0 &&
									selectedItems.size === salesItemList.filter(item => item.income_confirm !== 'Y').length
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
                        <Table.HeaderCell className='text_center'>품목코드</Table.HeaderCell>
                        <Table.Cell dataKey="item_code" />
                    </Table.Column>

                    <Table.Column width={260}>
                        <Table.HeaderCell className='text_center'>품목명</Table.HeaderCell>
                        <Table.Cell dataKey="item_name" />
                    </Table.Column>

                    <Table.Column width={100}>
                        <Table.HeaderCell className='text_center'>판매수량</Table.HeaderCell>
                        <Table.Cell dataKey="quantity" />
                    </Table.Column>
                    
                    <Table.Column width={120}>
						<Table.HeaderCell className='text_center'>실제 출고 수량</Table.HeaderCell>
						<Table.Cell dataKey="income_confirm">
							{rowData => (
								<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-evenly' }}>
									<input
										type="number"
										min="0"
										value={salesAmounts[rowData.item_code] ?? rowData.quantity}
										disabled={rowData.income_confirm === 'Y'}
										onChange={(e) => handleSalesAmountChange(rowData.item_code, e.target.value)}
										className='input_width text_center'
									/>

									<Button
                                        size="xs"
                                        onClick={() => applySalesAmountChange(rowData.item_code)}
                                        disabled={rowData.income_confirm === 'Y'}
                                        className='mini_btn'
                                    >
										적용
									</Button>
								</div>
							)}
						</Table.Cell>
					</Table.Column>

                    <Table.Column width={320}>
                        <Table.HeaderCell>규격</Table.HeaderCell>
                        <Table.Cell dataKey="item_standard" />
                    </Table.Column>
                    
					<Table.Column width={200}>
						<Table.HeaderCell className='text_center'>출고 상태</Table.HeaderCell>
						<Table.Cell>
							{renderIncomeConfirmCell}
						</Table.Cell>
					</Table.Column>

                    <Table.Column width={150} style={{ padding: '6px' }}>
                        <Table.HeaderCell className='text_center'>창고 상세보기</Table.HeaderCell>
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
                    
                    <Table.Column width={100}>
                        <Table.HeaderCell className='text_center'>출고 창고 코드</Table.HeaderCell>
                        <Table.Cell dataKey="storage_code" />
                    </Table.Column>
                    
                    
                </Table>
                )}
				<div className='display_flex'>
					<Button
						appearance="primary"
						className="btn btn-success"
						onClick={handleSubmitSelected}
						disabled={selectedItems.size === 0}
					>
						출고 확정
					</Button>
                    <Link to={'/main/logis-outgoing-list'} className="btn btn-primary area_fit wide_fit margin_0 padding_0px">
						<Button appearance="primary">
                    		출고 목록
						</Button>
                    </Link>
                </div>
            </Container>
        </div>
    )
}

export default SalesItemList;