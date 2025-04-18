import React, { useState, useMemo, useEffect } from "react";
import { Button, ButtonToolbar, Message, DatePicker, Form, 
		 InputGroup, Input, Table, InputPicker,
		 Divider, InputNumber } from "rsuite";
import { useParams } from "react-router-dom";
import "#styles/sell.css";
import SellClientSearchModal from "#components/sell/SellClientSearchModal.jsx";
import SellEmployeeSearchModal from "#components/sell/SellEmployeeSearchModal.jsx";
import SellStorageSearchModal from "#components/sell/SellStorageSearchModal.jsx";
import SellItemSearchModal from "#components/sell/SellItemSearchModal.jsx";
import AppConfig from "#config/AppConfig.json";
import readingGlasses from "#images/common/readingGlasses.png";
import ashBn from "#images/common/ashBn.png";
import { useNavigate } from "@remix-run/react";

// sell_all_list_update => 판매 입력건 수정 페이지



const { Column, HeaderCell, Cell } = Table;

/* 거래유형 - 선택 데이터 */
const sellType = ["부과세율 적용", "부가세율 미적용"].map(
	(item) => ({
		label: item, 
		value: item,
	})
);


const sell_all_list_update = (props) => {

	const navigate = useNavigate();

	const propsparam = useParams();
	const order_id = propsparam.order_id;

	// 현재 편집중인 셀
	const [currentEditIndex, setCurrentEditIndex] = useState(null);
	
	// 입력한 내역 저장
	const [sellAdd, setSellAdd] = useState([]);

	// 백엔드로 전달하기 위해 출하창고 저장
	const [shipmentOrderDate, setShipmentOrderDate] = useState(null);
	// 백엔드로 전달하기 위해 거래유형 저장
	const [transactionType, setTransactionType] = useState(null);

	// 거래처 모달 관리
	const [selectedClient, setSelectedClient] = useState(null);
	const [selectedClientName, setSelectedClientName] = useState(null);
	const [isClientModalOpen, setClientModalOpen] = useState(false);

	const handleClientSelect = (client_code, client_name) => {
        setSelectedClient(client_code);
		setSelectedClientName(client_name);
        setClientModalOpen(false);
    };

	// 담당자 모달 관리
	const [selectedIncharge, setSelectedIncharge] = useState(null);
	const [selectedInchargeName, setSelectedInchargeName] = useState(null);
	const [isInchargeModalOpen, setInchargeModalOpen] = useState(false);

	const handleInchargeSelect = (e_id, e_name) => {
        setSelectedIncharge(e_id);
		setSelectedInchargeName(e_name);
        setInchargeModalOpen(false);
    };

	// 창고 모달 관리
	const [selectedStorage, setSelectedStorage] = useState(null);
	const [selectedStorageName, setSelectedStorageName] = useState(null);
	const [isStorageModalOpen, setStorageModalOpen] = useState(false);

	const handleStorageSelect = (storage_code, storage_name) => {
        setSelectedStorage(storage_code);
		setSelectedStorageName(storage_name);
        setStorageModalOpen(false);
    };

	//
	const [orderItemId, setOrderItemId] = useState(null);

	// 물품 검색 모달 관리
	const [isItemModalOpen, setItemModalOpen] = useState(null);

	// 물품 수정 핸들러
	const updateItem = (index, newData) => {
		setSellAdd(prev => {
            const updated = [...prev];
            const current = { ...updated[index], ...newData };
			
			// Number(...) || 0는 null, undefined, '' 등의 경우에도 숫자 계산 가능하게 처리
			const quantity = Number(current.quantity) || 0;
			const price = Number(current.price) || 0;
			const supply = quantity * price;
			const vat = Math.floor(supply * 0.1);
			const total = supply + vat;

			updated[index] = {
                ...current,
                supply,
                vat,
                total,
            };

            return updated;
        });
	};

	// 행 삭제
    const handleDeleteRow = (id) => {
        setSellAdd(prev => prev.filter(item => item.id !== id));
    };

	const fetchURL = AppConfig.fetch['mytest'];
	
	// 주문번호 1개에 대한 입력건들 조회
	useEffect(() => {
		if (!order_id) return; // undefined 방지

		fetch(`${fetchURL.protocol}${fetchURL.url}/sell/allDetail/${order_id}`, {
			method: "GET"
		})
		.then(res => res.json())
		.then(res => {
			console.log(1, res);
			setSellAdd(res);
			// 상단 입력값 세팅
			if (res.length > 0) {
				const firstRow = res[0];
				
				setShipmentOrderDate(new Date(firstRow.shipment_order_date)); // 날짜는 Date로 변환 필요
				setSelectedIncharge(firstRow.e_id);
				setSelectedInchargeName(firstRow.e_name);
				setSelectedClient(firstRow.client_code);
				setSelectedClientName(firstRow.client_name);
				setTransactionType(firstRow.transaction_type);
				setSelectedStorage(firstRow.storage_code);
				setSelectedStorageName(firstRow.storage_name);
			}
			});
	}, [order_id]);

	// 수정 입력한 값을 백엔드로 전달
	const submitSellUpInsert = (e) => {
		e.preventDefault();
		const filteredSellAdd = sellAdd.map(({ status, id, ...rest }) => rest);

		const payload = {
			shipment_order_date: shipmentOrderDate,
			e_id: selectedIncharge,
			e_name: selectedInchargeName,
			client_code: selectedClient,
			client_name: selectedClientName,
			transaction_type: transactionType,
			storage_code: selectedStorage,
			storage_name: selectedStorageName,
			orderItemList: filteredSellAdd,
		};

		console.log("제출할 전체 데이터:", payload); // 확인용
		console.log("제출할 전체 데이터:", filteredSellAdd.order_item_id);
		console.log("제출할 전체 데이터:", payload.orderItemList.order_item_id);
		// fetch(`${fetchURL.protocol}${fetchURL.url}/sell/allListUpdate/${order_id}/${sellAdd.order_item_id}`, {
		fetch(`${fetchURL.protocol}${fetchURL.url}/sell/allListUpdate/${order_id}`, {
			method: "PUT",
			headers: {
				"Content-Type":"application/json;charset=utf-8"
			},
			body: JSON.stringify(payload)
		})
		// 결과를 돌려받는 곳
		.then((res) => {
			console.log(1, res);

			if(res.status === 201) return res.json();   // 정상(201)이면 ture 리턴
			else return null;
		})
		.then((res) => {
			console.log('정상', res);

			// 등록 성공 시 페이지 새로고침
			if(res != 0) { 
				alert('수정이 완료 되었습니다.');
                navigate(`/main/sell_all_list`);
			}
			else alert("수정에 실패했습니다.");
		})
		// 예외처리
		.catch(error => {
			console.log('실패', error);
		})
	}

	// 리셋을 위해 공통인 부분 묶기
	const resetCommon = () => {
		setShipmentOrderDate(null);
		setTransactionType(null);

		setSelectedClient(null);
		setSelectedClientName(null);
		setClientModalOpen(false);

		setSelectedIncharge(null);
		setSelectedInchargeName(null);
		setInchargeModalOpen(false);

		setSelectedStorage(null);
		setSelectedStorageName(null);
		setStorageModalOpen(false);
	};

	// '검색초기화' 버튼 - 검색 필터 초기화
	const searchStatusReset = () => {
		resetCommon(); // 공통 리셋만
	}

	// '다시 작성' 버튼 - 전체 내용 리셋
	const handleResetForm = () => {
		resetCommon(); // 공통 리셋
		setSellAdd([]); // 하위 테이블 초기화만 추가
	};

	// 총액 계산
	const totalSum = useMemo(() => {
		return sellAdd.reduce((sum, row) => {
			const value = Number(row.total);
			return sum + (isNaN(value) ? 0 : value);
		}, 0);
	}, [sellAdd]);

	return (
		<div>
			<Message type="info" className="main_title">
			판매 정보 수정페이지 - 주문번호: {order_id}
    		</Message>

			<Form layout="horizontal">

			{/* 입력 상위 칸 */}
			<div className="add_final">

				<div className="form_div">
					<div className="add_div">
						<InputGroup className="insert_input">
							<InputGroup.Addon style={{ width: 90 }}>
							출하지시일
							</InputGroup.Addon>
							<DatePicker 
								name="shipment_order_date"
								value={shipmentOrderDate}
  								onChange={setShipmentOrderDate} />
						</InputGroup>
					</div>

					<div className="add_div">
						<InputGroup className="insert_inputBox">
							<InputGroup.Addon style={{ width: 90 }}>
								담당자
							</InputGroup.Addon>
							<Input
								placeholder='담당자'
								name="e_id"
								value={selectedIncharge || ""} readOnly
							/>
							<InputGroup.Addon tabIndex={-1} onClick={() => setInchargeModalOpen(true)}>
								<img
								src={readingGlasses}
								alt="돋보기"
								width={20}
								height={20}
								style={{ cursor: "pointer "}}
								/>
							</InputGroup.Addon>
						</InputGroup>
						<Input name="e_name" type="text" autoComplete="off" style={{ width: 150 }}
							value={selectedInchargeName || ""} readOnly />
					</div>

					<div className="add_div">
						<InputGroup className="insert_inputBox">
							<InputGroup.Addon style={{ width: 90 }}>
								거래처
							</InputGroup.Addon>
							<Input placeholder='거래처'
								name="client_code"
								value={selectedClient || ""} readOnly
							/>
							<InputGroup.Addon tabIndex={-1} onClick={() => setClientModalOpen(true)}>
								<img
								src={readingGlasses}
								alt="돋보기"
								width={20}
								height={20}
								style={{ cursor: "pointer "}}
								/>
							</InputGroup.Addon>
						</InputGroup>
						<Input type="text" autoComplete="off" style={{ width: 150 }}
							name="client_name"
							value={selectedClientName || ""} readOnly />
					</div>

				</div>

				<div className="form_div">
					<div className="add_div">
						<InputGroup className="insert_input">
							<InputGroup.Addon style={{ width: 90 }}>
								거래유형
							</InputGroup.Addon>
							<InputPicker
								placeholder='거래유형 선택'
								name="transaction_type"
								data={sellType}
								value={transactionType}
								onChange={setTransactionType}
								style={{ width: 224, border: 'none', height: 38}}
							/>
						</InputGroup>
					</div>

					<div className="add_div">
						<InputGroup className="insert_inputBox">
							<InputGroup.Addon style={{ width: 90 }}>
								출하창고
							</InputGroup.Addon>
							<Input 
								placeholder='창고' 
								name="storage_code"
								value={selectedStorage || ""} readOnly
							/>
							<InputGroup.Addon tabIndex={-1} onClick={() => setStorageModalOpen(true)}>
								<img
								src={readingGlasses}
								alt="돋보기"
								width={20}
								height={20}
								style={{ cursor: "pointer "}}
								/>
							</InputGroup.Addon>
						</InputGroup>
						<Input type="text" autoComplete="off" style={{ width: 150 }}
							name="storage_name"
							value={selectedStorageName || ""} readOnly />
					</div>
				</div>

					<ButtonToolbar>
						<Button appearance="primary"
							onClick={() => {
								const newId = sellAdd.length > 0
											? Math.max(...sellAdd.map(item => item.id)) + 1
											: 1;
								const newItem = {
									id: newId,
									item_code: '',
									item_name: '',
									item_standard: '',
									quantity: 0,
									price: 0,
									supply: 0,
									vat: 0,
									total: 0,
									status: 'EDIT'
								};
							
								setSellAdd(prev => [newItem, ...prev]);
								// setEditingRowId(newId);
							}}
						>
							입력 추가하기
						</Button>

						<Button appearance="primary" type="submit" onClick={searchStatusReset}>
							검색창 초기화
						</Button>
					</ButtonToolbar>

						<hr />
			</div>

			<div className="updateItem">
				{/* 입력 하위 칸 */}
				{sellAdd.map((item, index) => (
                    <Form
                        key={item.id} // 여기 꼭 고유한 id
                        fluid
                        formValue={item}
                        onChange={val => updateItem(index, val)}
                    >
                        <div className="sellUpdateFrom">
                            <Form.Group>
                                <Form.ControlLabel className="updateLabel">물품코드</Form.ControlLabel>
                                <Form.Control
                                    name="item_code"
									placeholder="물품코드"
                                    plaintext={false}
                                    value={item.item_code}
                                    onDoubleClick={() => {
                                        setCurrentEditIndex(index);  // 현재 행 ID 저장
                                        setItemModalOpen(true);     // 모달 열기
                                    }}
									className="updateBox"
                                />
                            </Form.Group>

                            <Form.Group>
                                <Form.ControlLabel className="updateLabel">물품명</Form.ControlLabel>
                                <Form.Control 
									name="item_name" 
									placeholder="물품명" 
									className="updateBox"
									onDoubleClick={() => {
                                        setCurrentEditIndex(index);  // 현재 행 ID 저장
                                        setItemModalOpen(true);     // 모달 열기
                                    }}
								/>
                            </Form.Group>
							
							<Form.Group>
                                <Form.ControlLabel className="updateLabel">규격</Form.ControlLabel>
                                <Form.Control 
									name="item_standard" 
									placeholder="규격" 
									className="updateBox" 
									onDoubleClick={() => {
                                        setCurrentEditIndex(index);  // 현재 행 ID 저장
                                        setItemModalOpen(true);     // 모달 열기
                                    }}
								/>
                            </Form.Group>

                            <Form.Group>
                                <Form.ControlLabel className="updateLabel">수량</Form.ControlLabel>
                                <Form.Control name="quantity" type="number" placeholder="수량" className="updateBox" />
                            </Form.Group>

                            <Form.Group>
                                <Form.ControlLabel className="updateLabel">단가</Form.ControlLabel>
                                <Form.Control name="price" type="number" placeholder="단가" className="updateBox" />
                            </Form.Group>

                            <Form.Group>
							<Form.ControlLabel className="updateLabel">공급가액</Form.ControlLabel>
							<Form.Control
								name="supply"
								plaintext
								className="updateBox_price"
							/>
						</Form.Group>

						<Form.Group>
							<Form.ControlLabel className="updateLabel">부가세</Form.ControlLabel>
							<Form.Control
								name="vat"
								plaintext
								className="updateBox_price"
								
							/>
						</Form.Group>

						<Form.Group>
							<Form.ControlLabel className="updateLabel">총액</Form.ControlLabel>
							<Form.Control className="updateBox_price"
								name="total"
								plaintext
							/>
						</Form.Group>

                            <Button style={{ display: 'flex', width: 20, height: 40, margin: 20 }}>
                                <img
                                    src={ashBn}
                                    alt="휴지통"
                                    width={20}
                                    height={20}
                                    onClick={() => handleDeleteRow(item.id)}
                                    style={{ cursor: "pointer" }}
                                />
                            </Button>
                        </div>
                    </Form>
                ))}

					</div>
					<Divider style={{ maxWidth: 1500 }} />
						<div className="resultContainer">
							<div className="resultBtn">
							<ButtonToolbar >
								<Button appearance="primary" onClick={submitSellUpInsert}>저장</Button>
								<Button appearance="primary" onClick={handleResetForm}>다시 작성</Button>
							</ButtonToolbar>
							</div>

							<div className="total">
								총액: {totalSum.toLocaleString()} 원
							</div>
						</div>
					<hr></hr>
				
				<SellClientSearchModal
					onClientSelect={handleClientSelect}	// client_code, client_name 받기
					handleOpen={isClientModalOpen}
					handleClose={() => setClientModalOpen(false)}
				/>

				<SellEmployeeSearchModal
					onInchargeSelect={handleInchargeSelect}	// e_id, e_name 받기
					handleOpen={isInchargeModalOpen}
					handleClose={() => setInchargeModalOpen(false)}
				/>

				<SellStorageSearchModal
					onStorageSelect={handleStorageSelect}	// storage_code, storage_name 받기
					handleOpen={isStorageModalOpen}
					handleClose={() => setStorageModalOpen(false)}
				/>

				<SellItemSearchModal
					handleOpen={isItemModalOpen}
					handleClose={() => setItemModalOpen(false)}
					onItemSelect={(item_code, item_name, item_standard) => {
						if (currentEditIndex !== null) {
							updateItem(currentEditIndex, { item_code, item_name, item_standard });
						}
						setItemModalOpen(false);
					}}
				/>
			{/* <hr></hr> */}
			</Form>
		</div>
		
	);
};

export default sell_all_list_update;