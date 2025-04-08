// import React from 'react';
// import { Card } from 'react-bootstrap';
// import { Link } from 'react-router-dom';

// const WarehousingItem = (props) => {

//     const{ item_code, item_name, item_standard, stock_amount, safe_stock, last_date, client_name, client_code, storage} = props.warehousing || {};

//     console.log("b_num", item_code);

//     return (
//         <div>
            
//             <Card>
//                 <Card.Body>
//                     <Card.Title>품목코드 : {item_code}</Card.Title>
//                     <Card.Title>출고일자 : {item_name}</Card.Title>
//                     <Card.Title>보관창고명 : {item_standard}</Card.Title>
//                     <Card.Subtitle>
//                         <div className='second_line'>
//                             <div>
//                             보관렉 번호 : {stock_amount}
//                             </div>
//                             <div>
//                             상세번호 : {safe_stock}
//                             </div>
//                         </div>
                        
//                     </Card.Subtitle>
//                     {/* <Card.Text>내용 : {b_content}</Card.Text> */}
//                     <Link to={"/detail/" + item_code} className="btn btn-primary">상세보기</Link>
//                 </Card.Body>

//             </Card>
//         </div>
//     )
// }

// export default WarehousingItem;