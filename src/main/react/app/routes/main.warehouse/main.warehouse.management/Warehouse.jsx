import React from 'react';
import { Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Form, Input, ButtonToolbar, Button } from 'rsuite';

const Textarea = React.forwardRef((props, ref) => <Input {...props} as="textarea" ref={ref} />);

const WarehousingItem = (props) => {

    const { l_code, l_name, l_stock, l_brand, l_madein, l_lack, l_floor } = props.stock || {};
    console.log("l_code", l_code);


    return (
        <div>


            <Form layout="horizontal"
                onChange={formValue => setFormValue(formValue)}
            >
                <Form.Group controlId="name-6">
                    <Form.ControlLabel>Username</Form.ControlLabel>
                    <Form.Control name="name" />
                    <Form.HelpText>Required</Form.HelpText>
                </Form.Group>
                <Form.Group controlId="email-6">
                    <Form.ControlLabel>Email</Form.ControlLabel>
                    <Form.Control name="email" type="email" />
                    <Form.HelpText tooltip>Required</Form.HelpText>
                </Form.Group>
                <Form.Group controlId="password-6">
                    <Form.ControlLabel>Password</Form.ControlLabel>
                    <Form.Control name="password" type="password" autoComplete="off" />
                </Form.Group>
                <Form.Group controlId="textarea-6">
                    <Form.ControlLabel>Textarea</Form.ControlLabel>
                    <Form.Control name="textarea" rows={5} accepter={Textarea} />
                </Form.Group>

                <Form.Group controlId="datePicker">
                    <Form.ControlLabel>DatePicker:</Form.ControlLabel>
                    <Form.Control name="datePicker" accepter={DatePicker} />
                </Form.Group>


                <Form.Group controlId="inputPicker">
                    <Form.ControlLabel>InputPicker:</Form.ControlLabel>
                    <Form.Control name="inputPicker" accepter={InputPicker} data={selectData} />
                </Form.Group>
            </Form>
        </div>
    )
}

export default WarehousingItem;


//             <Card>
//                 <Card.Body>
//                     <Card.Title>판매번호 : {l_code}</Card.Title>
//                     <Card.Title>품목명 : {l_name}</Card.Title>
//                     <Card.Title>재고수량 : {l_stock}</Card.Title>
//                     <Card.Title>출고업체 : {l_brand}</Card.Title>
//                     <Card.Title>입고입자 : {l_madein}</Card.Title>
//                     <Card.Subtitle>
//                         <div className='second_line'>
//                             <div>
//                             보관렉 번호 : {l_lack}
//                             </div>
//                             <div>
//                             상세번호 : {l_floor}
//                             </div>
//                         </div>
//                     </Card.Subtitle>
//                     {/* <Card.Text>내용 : {b_content}</Card.Text> */}
//                     <Link to={"/delivery/" + l_code} className="btn btn-primary">출고 상세보기</Link>
//                 </Card.Body>

//             </Card>
//         </div>
//     )
// }
