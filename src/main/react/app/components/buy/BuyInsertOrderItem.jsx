import React, { useState } from "react";
import { Button, Input } from "rsuite";
import '../../styles/buy.css';
import { useNavigate } from "react-router-dom";

// eslint-disable-next-line react/prop-types
export default function BuyInsertOrderItem ({ onUpdate }) { //props에서 onUpdate 받기

    const navigate = useNavigate();

    const [orderItem, setOrderItem] = useState({
        order_id: '',
        item_code: '',
        item_name: '',
        quantity: ''
    });

    const handleChange = (name, value) => {
        setOrderItem((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const submitOrderItem = (e) => {
        e.preventDefault();     // submit이 action을 안타고 자기 할일을 그만한다.
        fetch("http://localhost:8081/buy/buyOrderItemInsert", {  // 스프링부트
            method: "POST",
            headers: {
                "content-Type": "application/json;charset=utf-8"
            },
            body: JSON.stringify(orderItem) //javascript 오브젝트를 json으로 변경해서 넘긴다. 저장한 데이터를 스프링부트에서 insert하고 201을 리턴
        })
            .then((res) => {
                console.log(1, res);
                if (res.status === 201) {
                    return res.json();
                } else {
                    return null;
                }
            })
            .then((res) => {    // catch는 여기서 오류가 발생해야 실행됨
                console.log('정상', res);
                if (res !== null) {
                    console.log('navigate', navigate)
                    navigate('/orderList')  // old버전 : props.history.push('/boardList');
                } else {
                    alert("주문 작성에 실패하였습니다.");

                }
            })
            .catch((error) => {
                console.log('실패', error);
            })
    };


    return (
        <>
            <div style={{ display: 'flex'}} >
                <Input
                    name="order_id"
                    placeholder="주문번호 입력"
                    value={orderItem.order_id}
                    onChange={(value) => handleChange("order_id", value)}
                    style={{ width: 150, marginBottom: 10 }}
                />
                <Input
                    name="item_code"
                    placeholder="물품코드 입력"
                    value={orderItem.item_code}
                    onChange={(value) => handleChange("item_code", value)}
                    style={{ width: 150, marginBottom: 10 }}
                />
                <Input
                    name="item_name"
                    placeholder="물품명 입력"
                    value={orderItem.item_name}
                    onChange={(value) => handleChange("item_name", value)}
                    style={{ width: 150, marginBottom: 10 }}
                />
                <Input
                    name="quantity"
                    placeholder="수량 입력"
                    type="number"
                    value={orderItem.quantity}
                    onChange={(value) => handleChange("quantity", value)}
                    style={{ width: 150, marginBottom: 10 }}
                />

            </div>
            <Button appearance="primary" type="submit" onClick={submitOrderItem}  style={{ width: 150, marginBottom: 10 }}>
                입력
            </Button>
        </>
    );
};

