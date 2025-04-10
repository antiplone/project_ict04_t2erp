import React, { useState, useEffect } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { Card, Container, Table } from 'rsuite';

const OrderItemDetail = () => { 
    const order_id = parseInt(useParams().order_id, 10);
    const [searchParams] = useSearchParams();
    const item_code = parseInt(searchParams.get("item_code"), 10);
    
    console.log("OrderItemDetail order_id:", order_id);
    console.log("OrderItemDetail item_code:", item_code);

    const [orderItemDetail, setOrderItemDetail] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!order_id || !item_code) {
            console.error("필요한 파라미터가 없습니다.");
            setLoading(false);
            return;
        }

        fetch(`http://localhost:8081/warehouse/orderItemDetail/${order_id}?item_code=${item_code}`)
        .then(res => {
            if (!res.ok) {
                throw new Error('Error fetching item details');
            }
            return res.json();
        })
        .then(data => {
            setOrderItemDetail(data);
            setLoading(false);
        })
        .catch(err => {
            setError(err.message);
            setLoading(false);
        });
    }, [order_id, item_code]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div>
            <Container>
                <div className='header logiHeader'>입고관리</div>
                <br />
                <Card className='no_border'>
                    <div className='text_center no_border'>
                        {orderItemDetail ? (
                            <div className='padding_10px max_content_margin_10px_auto border_black_1px borderradius_10px'>
                                <h2 className='padding_10px'>
                                    주문번호 : {orderItemDetail.order_code}
                                </h2>
                                <h3 className='padding_10px'>
                                    품목코드 : {orderItemDetail.item_code}
                                </h3>
                                <div className='padding_10px'>
                                    품목명 : {orderItemDetail.item_name}
                                </div>
                                <div className='padding_10px'>
                                    입고수량 : {orderItemDetail.quantity}
                                </div>
                                <div className='padding_10px'>
                                    규격 : {orderItemDetail.item_standard}
                                </div>
                            </div>
                        ) : (
                            <div>데이터를 불러올 수 없습니다.</div>
                        )}
                    </div>
                </Card>
                 <Link to={`/orderDetail/` + order_id} className="btn btn-primary area_fit wide_fit">주문 으로</Link>
            </Container>
        </div>
    );
}

export default OrderItemDetail; 
