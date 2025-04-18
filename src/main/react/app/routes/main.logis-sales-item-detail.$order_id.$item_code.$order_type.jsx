import React, { useState, useEffect } from 'react';
import { Link, useParams } from '@remix-run/react';
import { Card, Container, Message } from 'rsuite';
import Appconfig from "#config/AppConfig.json";
import "#components/common/css/common.css";

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
            <Container>
                <Message type="info" className="main_title">
                	출고 아이템 상세
                </Message>
                <br />
                <Card className='no_border'>
                    <div className='text_center no_border'>
                        {salesItemDetail ? (
                            <div className='padding_10px max_content_margin_10px_auto border_black_1px borderradius_10px'>
                                <h2 className='padding_10px'>
                                    주문번호 : {salesItemDetail.order_id}
                                </h2>
                                <h3 className='padding_10px'>
                                    품목코드 : {salesItemDetail.item_code}
                                </h3>
                                <div className='padding_10px'>
                                    품목명 : {salesItemDetail.item_name}
                                </div>
                                <div className='padding_10px'>
                                    출고수량 : {salesItemDetail.quantity}
                                </div>
                                <div className='padding_10px'>
                                    규격 : {salesItemDetail.item_standard}
                                </div>
                            </div>
                        ) : (
                            <div>데이터를 불러올 수 없습니다.</div>
                        )}
                    </div>
                </Card>
                 <Link to={`/main/logis-sales-item-list/${order_id}`} className="btn btn-primary area_fit wide_fit">주문 으로</Link>
            </Container>
        </div>
    );
}

export default SalesItemDetail