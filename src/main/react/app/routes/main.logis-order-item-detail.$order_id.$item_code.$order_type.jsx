import React, { useState, useEffect } from 'react';
import { Link, useParams} from '@remix-run/react';
import { Button, Container, Divider, Table, Loader } from 'rsuite';
import Appconfig from "#config/AppConfig.json";
import "#components/common/css/common.css";
import MessageBox from '../components/common/MessageBox';
const { Column, HeaderCell, Cell } = Table;

const OrderItemDetail = () => { 
    const fetchURL = Appconfig.fetch['mytest']
    const { order_id, item_code, order_type } = useParams();

    console.log("OrderItemDetail order_id:", order_id);
    console.log("OrderItemDetail item_code:", item_code);
    console.log("OrderItemDetail order_type:", order_type);

    const query = new URLSearchParams({
        order_id,
        item_code,
        order_type
      }).toString();

    const [orderItemDetail, setOrderItemDetail] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!order_id || !item_code) {
            console.error("필요한 파라미터가 없습니다.");
            return;
        }
        setLoading(true);

        /*fetch(`http://localhost:8081/logisorder/orderItemDetail?${query}`)*/
        fetch(`${fetchURL.protocol}${fetchURL.url}/logisorder/orderItemDetail?${query}`)
        .then(res => {
            if (!res.ok) {
                throw new Error('Error fetching item details');
            }
            return res.json();
        })
        .then(data => {
            setOrderItemDetail(data);
        })
        .catch(err => {
            setError(err.message);
        })
		.finally(() => {
			setLoading(false);
		});
    }, [order_id, item_code]);

    if (error) return <div>Error: {error}</div>;

    return (
        <div>
        	<MessageBox type="success" text={`입고 아이템 상세 - 아이템번호:${order_id}`} />
            <br />
            <Container style={{fontSize:'16px'}}>
				{loading ? (
					<div style={{ height: '100px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
						<Loader size="md" content="데이터를 불러오는 중입니다..." />
					</div>
				) : (
                <Table height={100} width={930} data={orderItemDetail ? [orderItemDetail] : []} onRowClick={OrderData => console.log(OrderData)} style={{margin: '0 auto'}}>

					<Column width={120} className="text_center">
						<HeaderCell style={{fontSize:'16px'}}>발주번호</HeaderCell>
						<Cell dataKey="order_id" />
					</Column>

					<Column width={120} className="text_center">
						<HeaderCell style={{fontSize:'16px'}}>입고예정일</HeaderCell>
						<Cell dataKey="delivery_date" />
					</Column>

					<Column width={120} className="text_center">
						<HeaderCell style={{fontSize:'16px'}} >담당 부서</HeaderCell>
						<Cell dataKey="d_name" />
					</Column>

					<Column width={150} className="text_center">
						<HeaderCell style={{fontSize:'16px'}}>담당자명</HeaderCell>
						<Cell dataKey="e_name" />
					</Column>

					<Column width={150} className="text_center">
						<HeaderCell style={{fontSize:'16px'}}>거래처명</HeaderCell>
						<Cell dataKey="client_name" />
					</Column>

					<Column width={150} className="text_center">
						<HeaderCell style={{fontSize:'16px'}}>출하창고</HeaderCell>
						<Cell dataKey="storage_name" />
					</Column>

					<Column width={120} className="text_center">
						<HeaderCell style={{fontSize:'16px'}}>수주일자</HeaderCell>
						<Cell dataKey="order_date" />
					</Column>

				</Table>
				)}
				<Divider />
				{loading ? (
					<div style={{ height: '100px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
						<Loader size="md" content="데이터를 불러오는 중입니다..." />
					</div>
				) : (
				<Table height={100} width={870} data={orderItemDetail ? [orderItemDetail] : []} onRowClick={OrderData => console.log(OrderData)} style={{ margin: '0 auto' }}>

					<Column width={120} className="text_center">
						<HeaderCell style={{fontSize:'16px'}}>아이템 코드</HeaderCell>
						<Cell dataKey="item_code" />
					</Column>

					<Column width={260} className="text_center">
						<HeaderCell style={{fontSize:'16px'}}>품목명</HeaderCell>
						<Cell dataKey="item_name" />
					</Column>

					<Column width={340} className="text_center">
						<HeaderCell style={{fontSize:'16px'}}>규격</HeaderCell>
						<Cell dataKey="item_standard" />
					</Column>

					<Column width={150} className="text_center">
						<HeaderCell style={{fontSize:'16px'}}>최근 등록일</HeaderCell>
						<Cell dataKey="item_reg_date" />
					</Column>
				</Table>
				)}
				<Link to={`/main/logis-order-item-list/${order_id}`} className="btn btn-primary area_fit wide_fit">
					<Button appearance="primary">
						주문 으로
					</Button>
				</Link>
            </Container>
        </div>
    );
}

export default OrderItemDetail; 