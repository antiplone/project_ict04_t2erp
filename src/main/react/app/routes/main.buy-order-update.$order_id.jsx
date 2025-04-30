// 구매팀 - 주문 수정 페이지
/* eslint-disable react/react-in-jsx-scope */
import AppConfig from "#config/AppConfig.json";
import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import "../styles/buy.css";
import { Form, Button, Container, Message, Divider, InputGroup, Input, InputPicker, toaster, Placeholder, Loader } from 'rsuite';
import ashBn from "#images/common/ashBn.png";
import ClientSearchModal from "#components/buy/ClientSearchModal.jsx";
import InchargeSearchModal from "#components/buy/InchargeSearchModal.jsx";
import StorageSearchModal from "#components/buy/StorageSearchModal.jsx";
import readingGlasses from "#images/common/readingGlasses.png";
import ItemSearchModal from "#components/buy/ItemSearchModal.jsx";
import { useToast } from '#components/common/ToastProvider';
import MessageBox from '../components/common/MessageBox';

export function meta() {
    return [
        { title: `${AppConfig.meta.title} : 구매 정보 수정페이지` },
        { name: "description", content: "구매 정보 수정" },
    ];
};

export default function BuyOrderUpdate() {

    const fetchURL = AppConfig.fetch['mytest'];
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true); // 페이지 로딩중

    const { showToast } = useToast();

    const { order_id } = useParams(); // URL에서 전달된 파라미터들을 객체 형태로 반환 ex) order_id -> '1' 문자열로 출력됨

    // 주문 정보 및 물품 정보
    const [orderInfo, setOrderInfo] = useState({});
    const [orderItems, setOrderItems] = useState([]);

    // 물품 모달관리
    const [isItemModalOpen, setItemModalOpen] = useState(null);

    // 현재 편집중인 셀
    const [currentEditIndex, setCurrentEditIndex] = useState(null);

    // 거래처 모달관리
    const [selectedClient, setSelectedClient] = useState(null);
    const [selectedClientName, setSelectedClientName] = useState(null);
    const [isClientModalOpen, setClientModalOpen] = useState(false);

    // 담당자 모달관리
    const [selectedIncharge, setSelectedIncharge] = useState(null);
    const [selectedInchargeName, setSelectedInchargeName] = useState(null);
    const [isInchargeModalOpen, setInchargeModalOpen] = useState(false);

    // 입고 창고 모달 관리
    const [selectedStorage, setSelectedStorage] = useState(null);
    const [selectedStorageName, setSelectedStorageName] = useState(null);
    const [isStorageModalOpen, setStorageModalOpen] = useState(false);

    // 물품 항목 수정 핸들러
    const updateItem = (index, newData) => {  // 수정하려는 행의 인덱스, 사용자가 입력한 변경값
        setOrderItems(prev => {
            const updated = [...prev];  // 기존 물품리스트 불러와서 updated 새로운 배열 생성
            const current = { ...updated[index], ...newData };  // 기존 인덱스 항목 (...updated[index])에 변경값을 덮어씀 => 수정된 내용만 적용

            // 수량과 단가가 모두 있는 경우 자동 계산
            const quantity = Number(current.quantity) || 0;
            const price = Number(current.price) || 0;
            const supply = quantity * price;  // 공급가액 = 수량 × 단가
            const vat = supply * 0.1;         // 부가세 = 공급가액의 10%
            const total = supply + vat;       //  총액 = 공급가액 + 부가세

            updated[index] = { // updated에 계산한 값을 덮어서 수정
                ...current,
                supply,
                vat,
                total,
            };

            return updated;
        });
    };

    // 행 추가 함수
    const handleAddRow = () => {
        // 현재 입력된 모든 행의 id 값만 추출 ex) [{id:1}, {id:2}, {id:5}] → [1, 2, 5] / 현재 존재하는 id 중 가장 큰 값을 찾아서 +1
        const newId = orderItems.length > 0
            ? Math.max(...orderItems.map(d => d.id)) + 1
            : 1;
        const newItem = {
            id: newId,
            order_id: orderInfo.order_id, // 누락시 물품정보 추가해도 db에 해당 order_id의 물품정보가 안들어간다.
            item_code: '',
            item_name: '',
            quantity: 0,
            price: 0,
            supply: 0,
            vat: 0,
            total: 0
        };
        setOrderItems(prev => [...prev, newItem]); // 기존 orderItems 배열에 새 항목 newItem 추가
    };


    // 행 삭제
    const handleDeleteRow = (id) => {
        setOrderItems(prev => prev.filter(item => item.id !== id));
    };

    // 총액 합계 계산 
    // reduce는 배열의 각 항목을 순차적으로 처리 => 하나의 결과 값을 받환 (acc: 누적값, item: 현재 항목) / null 일 경우 0으로 대체
    const totalSum = orderItems.reduce((acc, item) => acc + (item.total || 0), 0);

    // 주문정보 조회
    useEffect(() => {
        if (!order_id) return; // order_id가 null 이면 종료

        fetch(`${fetchURL.protocol}${fetchURL.url}/buy/buyOrderDetail/${order_id}`, {
            method: "GET"
        })
            .then(res => res.json()) // 응답 받은 내용을 json 형식으로 파싱
            .then(json => {
                if (Array.isArray(json) && json.length > 0) { // 서버 응답이 배열 형태일때 첫번째 요소를 꺼냄
                    const data = json[0]; // 추가 하지 않으면 모달에 값들이 안들어온다.
                    const withIds = (data.items || []).map((item, index) => ({ // data.items에 id 값 부여
                        ...item,
                        id: index
                    }));
                    setOrderInfo(data);
                    setOrderItems(withIds);
                    setLoading(false);  // 실패해도 로딩 종료 처리

                    // 모달창 선택용 값 저장 (표시용)
                    setSelectedClient(data.client_code || null); // 선택값 없을 경우 대비 null 또는 ""
                    setSelectedClientName(data.client_name || "");
                    setSelectedIncharge(data.e_id || null);
                    setSelectedInchargeName(data.e_name || "");
                    setSelectedStorage(data.storage_code || null);
                    setSelectedStorageName(data.storage_name || "");
                }
            })
            .catch(err => {
                console.error("데이터 가져오기 오류:", err);
                setOrderInfo({}); // 상태 초기화
                setOrderItems([]);
                setLoading(false);  // 실패해도 로딩 종료 처리
            });
    }, [order_id]);
    // []은 디펜던시인데, setBuyOrderDetail()로 렌더링될때 실행되면 안되고, 1번만 실행하도록 빈배열을 넣어둔다.
    // CO오류 : Controller 진입 직전에 적용된다. 외부에서 자바스크립트 요청이 오는 것을

    // 1. 아래 url로 요청시 서버쪽에서 받아주는지 확인
    // 2. 실제로 받았다면 submit이 제대로 되었는지 확인
    // 저장 버튼 클릭 시
    const submitOrder = (e) => {
        e.preventDefault();     // submit이 action을 안타고 자기 할일을 그만한다. (새로고침 방지)

        const itemsWithOrderId = orderItems.map(({ id, ...item }) => ({  // 각 물품 객체에 order_id를 명시적으로 추가
            ...item,
            order_id: orderInfo.order_id || order_id
        }));

        fetch(`${fetchURL.protocol}${fetchURL.url}/buy/buyOrderUpdate/${order_id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json; charset=utf-8"
            },
            body: JSON.stringify({
                order: orderInfo,
                items: itemsWithOrderId,
                status: { order_status: orderInfo.order_status },
                txType: { transaction_type: orderInfo.transaction_type }
            })
        })
            .then(res => {
                if (!res.ok) {
                    throw new Error("주문 수정 실패");
                }
                showToast("주문이 수정되었습니다.", "success");

                navigate(`/main/buy-select`);
            })
            .catch(() => {
                showToast("주문 수정을 실패했습니다.", "error");
            });
    };
    //[]은 디펜던시인데, setBuyOrderDetail()로 렌더링될때 실행되면 안되고, 1번만 실행하도록 빈배열을 넣어둔다.
    //CO오류 : Controller 진입 직전에 적용된다. 외부에서 자바스크립트 요청이 오는 것을

    return (
        <>
            <Container>
                {loading ? (
                    <Container style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 100 }}>
                        <Placeholder.Paragraph rows={15} />
                        <Loader center content="불러오는 중..." />
                    </Container>
                ) : (
                    <>
                        <MessageBox type="info" text={`구매 정보 수정페이지 - 발주번호:${order_id}`} />
                        <br />

                        {/* 주문 정보 수정 */}
                        <Form fluid formValue={orderInfo} onChange={setOrderInfo} >
                            <div className="BuyUpdateFrom">
                                <Form.Group>
                                    <Form.ControlLabel>발주일자</Form.ControlLabel>
                                    <Form.Control name="order_date" className="updateInput" />
                                </Form.Group>

                                <Form.Group>
                                    <Form.ControlLabel>구매요청 부서</Form.ControlLabel>
                                    <Form.Control name="order_type" className="updateInput" />
                                </Form.Group>

                                <Form.Group>
                                    <Form.ControlLabel>납기일자</Form.ControlLabel>
                                    <Form.Control name="delivery_date" className="updateInput" />
                                </Form.Group>

                                <Form.Group>
                                    <Form.ControlLabel>거래유형</Form.ControlLabel>
                                    <Form.Control
                                        name="transaction_type"
                                        accepter={InputPicker}
                                        data={[{ label: '부과세율 적용', value: '부과세율 적용' },
                                        { label: '부가세율 미적용', value: '부가세율 미적용' }]}
                                        className="updateInput"
                                    />
                                </Form.Group>

                                <Form.Group>
                                    <Form.ControlLabel>진행상태</Form.ControlLabel>
                                    <Form.Control
                                        name="order_status"
                                        accepter={InputPicker}
                                        data={[
                                            { label: '진행중', value: '진행중' },
                                            { label: '승인', value: '승인' },
                                            { label: '반려', value: '반려' }]}
                                        className="updateInput"
                                    />
                                </Form.Group>
                            </div>

                            <div className="inputBox">
                                <div className="input">
                                    <InputGroup className="inputModal">
                                        <InputGroup.Addon style={{ width: 80 }}>담당자</InputGroup.Addon>
                                        <Input value={selectedIncharge || ""} readOnly onClick={() => setInchargeModalOpen(true)} />
                                        <InputGroup.Button tabIndex={-1}>
                                            <img
                                                src={readingGlasses}
                                                alt="돋보기"
                                                width={20}
                                                height={20}
                                                style={{ cursor: "pointer" }}
                                            />
                                        </InputGroup.Button>
                                    </InputGroup>
                                    <Input value={selectedInchargeName || ""} readOnly className="inputModalSide" />
                                </div>

                                <div className="input">
                                    <InputGroup className="inputModal">
                                        <InputGroup.Addon style={{ width: 80 }}>거래처</InputGroup.Addon>
                                        <Input value={selectedClient || ""} readOnly onClick={() => setClientModalOpen(true)} />
                                        <InputGroup.Addon>
                                            <img
                                                src={readingGlasses}
                                                alt="돋보기"
                                                width={20}
                                                height={20}
                                                style={{ cursor: "pointer" }}
                                            />
                                        </InputGroup.Addon>
                                    </InputGroup>
                                    <Input value={selectedClientName || ""} readOnly className="inputModalSide" />
                                </div>

                                <div className="input">
                                    <InputGroup className="inputModal">
                                        <InputGroup.Addon style={{ width: 80 }}>입고창고</InputGroup.Addon>
                                        <Input value={selectedStorage || ""} readOnly onClick={() => setStorageModalOpen(true)} />
                                        <InputGroup.Addon>
                                            <img
                                                src={readingGlasses}
                                                alt="돋보기"
                                                width={20}
                                                height={20}
                                                style={{ cursor: "pointer" }}
                                            />
                                        </InputGroup.Addon>
                                    </InputGroup>
                                    <Input value={selectedStorageName || ""} readOnly className="inputModalSide" />
                                </div>
                            </div>
                        </Form>
                        <Divider />

                        {/* 거래처 모달 관리 */}
                        <ClientSearchModal
                            handleOpen={isClientModalOpen}
                            handleColse={() => setClientModalOpen(false)}
                            onClientSelect={(code, name) => {
                                setSelectedClient(code);
                                setSelectedClientName(name);
                                setOrderInfo(prev => ({ ...prev, client_code: code }));  // ← 추가
                            }}
                        />

                        {/* 담당자 모달 관리 */}
                        <InchargeSearchModal
                            handleOpen={isInchargeModalOpen}
                            handleColse={() => setInchargeModalOpen(false)}
                            onInchargeSelect={(id, name) => {
                                setSelectedIncharge(id);
                                setSelectedInchargeName(name);
                                setOrderInfo(prev => ({ ...prev, e_id: id }));  // ← 추가
                            }}
                        />

                        {/* 입고창고 모달관리 */}
                        <StorageSearchModal
                            handleOpen={isStorageModalOpen}
                            handleColse={() => setStorageModalOpen(false)}
                            onStorageSelect={(code, name) => {
                                setSelectedStorage(code);
                                setSelectedStorageName(name);
                                setOrderInfo(prev => ({ ...prev, storage_code: code }));  // ← 추가
                            }}
                        />

                        {/* 물품 모달 관리 */}
                        <ItemSearchModal
                            handleOpen={isItemModalOpen}
                            handleColse={() => setItemModalOpen(false)}
                            onItemSelect={(item_code, item_name) => {
                                if (currentEditIndex !== null) {
                                    updateItem(currentEditIndex, { item_code, item_name });
                                    setItemModalOpen(false);
                                }
                            }}
                        />

                        {/* 물품 정보 수정 */}
                        {orderItems.map((item, index) => (
                            <Form
                                key={item.id} // 여기 꼭 고유한 id
                                fluid
                                formValue={item}
                                onChange={val => updateItem(index, val)}
                            >
                                <div className="BuyUpdateFrom">
                                    <Form.Group>
                                        <Form.ControlLabel>물품코드</Form.ControlLabel>
                                        <Form.Control
                                            name="item_code"
                                            plaintext={false} // 읽기 전용 아님
                                            value={item.item_code}
                                            onDoubleClick={() => {
                                                setCurrentEditIndex(index);  // 현재 클릭한 행의 인덱스를 저장
                                                setItemModalOpen(true);     // 모달 열기
                                            }}
                                        />
                                    </Form.Group>

                                    <Form.Group>
                                        <Form.ControlLabel>물품명</Form.ControlLabel>
                                        <Form.Control name="item_name" placeholder="물품명" />
                                    </Form.Group>

                                    <Form.Group>
                                        <Form.ControlLabel>수량</Form.ControlLabel>
                                        <Form.Control name="quantity" type="number" placeholder="수량" />
                                    </Form.Group>

                                    <Form.Group>
                                        <Form.ControlLabel>단가</Form.ControlLabel>
                                        <Form.Control name="price" type="number" placeholder="단가" />
                                    </Form.Group>

                                    <Form.Group>
                                        <Form.ControlLabel>공급가액</Form.ControlLabel>
                                        <Form.Control name="supply" type="number" placeholder="공급가액" />
                                    </Form.Group>

                                    <Form.Group>
                                        <Form.ControlLabel>부가세</Form.ControlLabel>
                                        <Form.Control name="vat" type="number" placeholder="부가세" />
                                    </Form.Group>

                                    <Form.Group>
                                        <Form.ControlLabel>총액</Form.ControlLabel>
                                        <Form.Control name="total" type="number" placeholder="총액" />
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

                        <Divider />
                        <div className="updateTotalSum">
                            총액 합계: {totalSum.toLocaleString()} 원
                        </div>

                        <div className="buyBtnBox">
                            <Button appearance="default" className="buyBtn" onClick={handleAddRow}>행 추가</Button>
                            <Button appearance="ghost" color="blue" onClick={submitOrder}>저장</Button>
                            <Link to={`/main/buy-select`}>
                                <Button appearance="ghost" className="ListBtn">
                                    목록
                                </Button>
                            </Link>
                            <Button appearance="ghost" color="red" onClick={() => navigate(-1)}>취소</Button> {/* navigate(-1); 브라우저 history 뒤로 */}
                        </div>
                    </>
                )}
            </Container>
        </>
    );
};