import React from 'react';
import { Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const WarehousingItem = (props) => {

    const{ item_code, item_name, item_standard, stock_amount, safe_stock, last_date, client_name, client_code, storage} = props.warehousing || {};

    console.log("item_code", item_code);

    return (
        <div>
            
            <Card>
                <Card.Body>
                    <Card.Title>품목코드 : {item_code}</Card.Title>
                    <Card.Title>품목명 : {item_name}</Card.Title>
                    <Card.Title>규격 : {item_standard}</Card.Title>
                    <Card.Subtitle>
                        <div className='second_line'>
                            <div>
                            재고량 : {stock_amount}
                            </div>
                            <div>
                            안전재고량량 : {safe_stock}
                            </div>
                        </div>
                    </Card.Subtitle>
                    <Card.Title>출고일자 : {last_date}</Card.Title>
                    <Card.Title>입고업체체 : {client_name}</Card.Title>
                    <Card.Title>업체코드 : {client_code}</Card.Title>
                    <Card.Title>보관창고명 : {storage}</Card.Title>
                    <Link to={"/detail/" + item_code} className="btn btn-primary">상세보기</Link>
                </Card.Body>

            </Card>
        </div>
    )
}

export default WarehousingItem;