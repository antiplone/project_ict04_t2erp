// 구매팀 - 구매조회 탭 전체
import AppConfig from "#config/AppConfig.json";
import { Table, Button, ButtonToolbar, Modal } from 'rsuite';
import React, { useEffect, useState } from 'react';
import '../../styles/common.css';
import '../../styles/buy.css';
import { Link } from 'react-router-dom';
import SellSlipAll from '#components/sell/SellSlipAll';
import { useToast } from '#components/common/ToastProvider';

const { Column, HeaderCell, Cell } = Table;

export default function BuySelectTabAll({ rowState }) {

    const fetchURL = AppConfig.fetch["mytest"];

    const { showToast } = useToast();

    // 전체 목록
    const [buyOrderAllList, setBuyOrderAllList] = useState([]); // 초기값을 모르므로 빈배열로 buyList에 대입
    const [rowData, setRowData] = rowState;

    // 날짜 별로 순번 붙이기 (동일한 날짜+동일 주문건이면 동일한 No.)
    const getNumberedList = (data) => {
        let result = [];
        let groupedByDate = {};

        // 날짜별로 그룹핑
        data.forEach(item => {
            if (!groupedByDate[item.order_date]) {
                groupedByDate[item.order_date] = [];
            }
            groupedByDate[item.order_date].push(item);
        });

        // 날짜별로 처리
        Object.keys(groupedByDate).forEach(date => {
            // groupedByDate : 날짜별로 데이터를 묶어둔 객체
            // ex: { '2025-04-10': [item1, item2, ...], '2025-04-11': [item3, ...] }
            let orders = groupedByDate[date];	// 해당 날짜(date)의 전체 주문 데이터 배열
            let seenOrderIds = new Set();	// 중복된 주문(order_id)을 한 번만 처리하기 위해 사용
            let count = 1;

            orders.forEach(item => {
                if (seenOrderIds.has(item.order_id)) return;	 // 이미 처리한 주문번호(order_id)는 무시
                seenOrderIds.add(item.order_id);

                // 같은 order_id의 품목 모으기
                const sameOrderItems = orders.filter(x => x.order_id === item.order_id);
                // 주문번호와 item 주문번호가 같은 걸 배열로 만들기
                const firstItemName = sameOrderItems[0].item_name;
                const displayName = sameOrderItems.length > 1
                    ? `${firstItemName} 외 ${sameOrderItems.length - 1}건`
                    : firstItemName;

				const totalSum = sameOrderItems.reduce((sum, curr) => sum + curr.total, 0);

                // 한 줄만 push
                result.push({
                    ...item,
                    date_no: count,
                    items: sameOrderItems,
                    item_display: displayName,
                    total_sum: totalSum
                });

                count++;
            });
        });

        return result;
    };

    // fecth()를 통해 톰캣서버에세 데이터를 요청
    useEffect(() => {
        fetch(`${fetchURL.protocol}${fetchURL.url}/buy/buyOrderAllList`, {
            method: "GET"
        })
            .then(res => res.json() // 응답이 오면 javascript object로 바꿈.
            )
            .then(res => {
                //console.log(1, res);
                const numbered = getNumberedList(res);
                setBuyOrderAllList(numbered);
            })
            .catch(error => {
                //console.error("데이터 가져오기 오류:", error);
                setBuyOrderAllList([]); // 오류 발생 시 빈 배열 설정 
            });
    }, [rowData]); // []은 디펜던시인데, setBuyOrderAllList()로 렌더링될때 실행되면 안되고, 1번만 실행하도록 빈배열을 넣어둔다.
    // CORS 오류 : Controller 진입 직전에 적용된다. 외부에서 자바스크립트 요청이 오는 것을

    // '불러온 전표' 모달
    const [open2, setOpen2] = useState(false);
    const handleOpen2 = (rowData) => {
        if (rowData.order_status === '결재중') {
            showToast("전표 처리 진행중입니다.", "warning");
            return;
        }
        else {

			fetch(`${fetchURL.protocol}${fetchURL.url}/voucher/get/${rowData.order_id}`, {
				method: "GET",
				mode: "cors",
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json'
				},
			})
				.then(res => {
	
					if (res.ok) {
	
						const entity = res.json();
						entity.then(res => {

//							console.log("res :", res);
							rowData.voucher_no = res.v_number;
							rowData.v_assigner = res.v_assigner;
							rowData.v_assign_date = res.v_assign_date;
							rowData.order_type = res.v_classification;

							for (const it of rowData.items) {
								it.order_type = res.v_classification;
								switch (res.v_classification) {
	
									case 1 : it.t_type = '판매'; break;
									case 2 : it.t_type = '구매'; break;
								}
							}
							setRowData(rowData);
						});
					}
				});
			
		}
        setOpen2(true);
    };
    const handleClose2 = () => setOpen2(false);

    return (
        <>
            <Table height={500} data={buyOrderAllList}>

                <Column width={150} className='text_center'>
                    <HeaderCell className='text_center'>등록일자_No.</HeaderCell>
                    <Cell>
                        {(orderDate) => (
                            <span
                                onClick={() => buyOrderAllList(orderDate.order_id)}
                            >
                                {`${orderDate.order_date}_${orderDate.date_no}`}
                            </span>
                        )}
                    </Cell>
                </Column>

                <Column width={150} className='text_center'>
                    <HeaderCell className='text_center'>발주번호</HeaderCell>
                    <Cell dataKey="order_id" />
                </Column>

                <Column width={200} className='text_left'>
                    <HeaderCell className='text_center'>거래처명</HeaderCell>
                    <Cell dataKey="client_name" />
                </Column>

                <Column width={250} className='text_left'>
                    <HeaderCell className='text_center'>품목명</HeaderCell>
                    <Cell dataKey="item_display" />
                </Column>

                <Column width={170} className='text_right'>
                    <HeaderCell className='text_center'>금액합계</HeaderCell>
                    <Cell>
                        {(totalData) => new Intl.NumberFormat().format(totalData.total)}
                        {/* new Intl.NumberFormat().format : 천 단위로 콤마(,) 넣기 */}
                    </Cell>
                </Column>

                <Column width={200} className='text_center'>
                    <HeaderCell className='text_center'>거래유형</HeaderCell>
                    <Cell dataKey="transaction_type" />
                </Column>

                <Column width={200} className='text_left'>
                    <HeaderCell className='text_center'>입고창고</HeaderCell>
                    <Cell dataKey="storage_name" />
                </Column>

                <Column width={150} className='text_center'>
                    <HeaderCell className='text_center'>납기일자</HeaderCell>
                    <Cell dataKey="delivery_date" />
                </Column>

                <Column width={150} className='text_center'>
                    <HeaderCell className='text_center'>진행상태</HeaderCell>
                    <Cell dataKey="order_status" />
                </Column>

                <Column width={150} className='text_center'>
                    <HeaderCell className='text_center'>상세조회</HeaderCell>
                    <Cell>
                        {buyOrderAllList => (
                            <Link to={`/main/buy-select-detail/${buyOrderAllList.order_id}`}>
                                <Button color="green" appearance='ghost' size="xs">
                                    조회
                                </Button>
                            </Link>
                        )}
                    </Cell>
                </Column>

                <Column width={150} className='text_center'>
                    <HeaderCell className='text_center'>불러온전표</HeaderCell>
                    <Cell>
                        {rowData => (
                            <Button
                                color="yellow"
                                appearance="ghost"
                                size="xs"
                                onClick={() => handleOpen2(rowData)}
                            >
                                조회
                            </Button>
                        )}
                    </Cell>
                </Column>
            </Table>

            <Modal open={open2} onClose={handleClose2} onExited={() => setRowData({})}
                style={{
                    position: 'fixed',
                    left: '30%',
                    width: 800
                }}>
                <Modal.Header>
                    <Modal.Title>전표</Modal.Title>
                </Modal.Header>

                <Modal.Body>
					<SellSlipAll rowState={rowState}/>
                </Modal.Body>

                <Modal.Footer>
                    <Button onClick={handleClose2} appearance="default">닫기</Button>
                </Modal.Footer>
            </Modal>

            <>
                <ButtonToolbar>
                    <Link to="/main/buy-insert">
                        <Button appearance="ghost" color="blue" style={{ marginTop: 20, marginLeft: 10 }} >구매 입력</Button>
                    </Link>
                </ButtonToolbar>
            </>

        </>
    );
};

