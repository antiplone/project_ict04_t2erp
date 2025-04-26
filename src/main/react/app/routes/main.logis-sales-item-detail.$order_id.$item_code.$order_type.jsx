import React, { useState, useEffect } from 'react';
import { Link, useParams } from '@remix-run/react';
import { Container, Divider, Message, Table } from 'rsuite';
import Appconfig from "#config/AppConfig.json";
import "#components/common/css/common.css";
import MessageBox from '../components/common/MessageBox';
const { Column, HeaderCell, Cell } = Table;

const SalesItemDetail = () => { 
	const fetchURL = Appconfig.fetch['mytest']
    const { order_id, item_code, order_type } = useParams();

    console.log("SalesItemDetail order_id:", order_id);
    console.log("SalesItemDetail item_code:", item_code);
    console.log("SalesItemDetail order_type:", order_type);

    const query = new URLSearchParams({
        order_id,
        item_code,
        order_type
      }).toString();

    const [salesItemDetail, setSalesItemDetail] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!order_id || !item_code) {
            console.error("필요한 파라미터가 없습니다.");
            return;
        }

        fetch(`${fetchURL.protocol}${fetchURL.url}/logissales/salesItemDetail?${query}`)
        .then(res => {
            if (!res.ok) {
                throw new Error('Error fetching item details');
            }
            return res.json();
        })
        .then(data => {
            setSalesItemDetail(data);
            console.log(setSalesItemDetail)
        })
        .catch(err => {
            setError(err.message);
        });
    }, [order_id, item_code]);

    if (error) return <div>Error: {error}</div>;

    return (
        <div>
        	<MessageBox type="info" text={`출고 아이템 상세 - 아이템번호:${order_id}`} />
            <br />
			<Container>
				<Table height={100} width={930} data={salesItemDetail ? [salesItemDetail] : []} onRowClick={OrderData => console.log(OrderData)} style={{margin: '0 auto'}}>

					<Column width={120} className="text_center">
						<HeaderCell >발주번호</HeaderCell>
						<Cell dataKey="order_id" />
					</Column>

					<Column width={120} className="text_center">
						<HeaderCell >출하요청일</HeaderCell>
						<Cell dataKey="shipment_order_date" />
					</Column>

					<Column width={120} className="text_center">
						<HeaderCell >담당 부서</HeaderCell>
						<Cell dataKey="d_name" />
					</Column>

					<Column width={150} className="text_center">
						<HeaderCell >담당자명</HeaderCell>
						<Cell dataKey="e_name" />
					</Column>

					<Column width={150} className="text_center">
						<HeaderCell >거래처명</HeaderCell>
						<Cell dataKey="client_name" />
					</Column>

					<Column width={150} className="text_center">
						<HeaderCell >출하창고</HeaderCell>
						<Cell dataKey="storage_name" />
					</Column>

					<Column width={120} className="text_center">
						<HeaderCell >납기일자</HeaderCell>
						<Cell dataKey="order_date" />
					</Column>

				</Table>
				<Divider width={940}/>
					<Table height={100} width={870} data={salesItemDetail ? [salesItemDetail] : []} onRowClick={OrderData => console.log(OrderData)} style={{margin: '0 auto'}}>

						<Column width={120} className="text_center">
							<HeaderCell >아이템 코드</HeaderCell>
							<Cell dataKey="item_code" />
						</Column>

						<Column width={260} className="text_center">
							<HeaderCell >품목명</HeaderCell>
							<Cell dataKey="item_name" />
						</Column>

						<Column width={340} className="text_center">
							<HeaderCell >규격</HeaderCell>
							<Cell dataKey="item_standard" />
						</Column>

						<Column width={150} className="text_center">
							<HeaderCell >최근 등록일</HeaderCell>
							<Cell dataKey="item_reg_date" />
						</Column>
					</Table>

					<Link to={`/main/logis-sales-item-list/${order_id}`} className="btn btn-primary area_fit wide_fit">주문 으로</Link>
			</Container>
        </div>
    );
}

export default SalesItemDetail