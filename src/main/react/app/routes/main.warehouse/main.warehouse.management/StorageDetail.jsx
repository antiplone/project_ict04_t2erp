import {React, useEffect, useState } from 'react';
import { /* Button,*/ Card, CardBody, CardSubtitle, CardText, CardTitle } from 'react-bootstrap';
import { Link, useParams } from 'react-router-dom';
import '../common/css/logisCommon.css'
import { Button } from 'rsuite';
import { useNavigate } from 'react-router-dom';

const StorageDetail = (props) => {
    const navigator = useNavigate();
    
    const propsParam = useParams();
    const storage_code = propsParam.storage_code;

    console.log("storage_code : ", storage_code)

    const [ storage, setStorageDetail ] = useState({
        storage_code:'',
        storage:'',
        storage_location:''
    });

    // console.log("storage_code : ", storage)

    useEffect(()=>{
        fetch('http://localhost:8081/logisstorage/storageDetail/' + storage_code)
        .then(res => res.json())
        .then(res => {
            console.log("res : ", res)
            setStorageDetail(res)
        })
        .catch(err => console.error('Error fetching storageDelete:', err));
    },[]);

    const deletestorage = () =>{
        fetch('http://localhost:8081/logisstorage/storageDelete/' + storage_code , {
            method: "DELETE",
        })
        .then((res) => res.text())
        .then((res) =>{
            if(res === '1'){
                navigator('/warehouseMain'); // 게시글 목록으로 이동
            } else{
                alert('삭제 실패') // catch로 변경해도 된다.
            }
        })
    }

    return (
        <div>
            <div className='header logiHeader' style={{marginBottom:10 + 'px'}}>
                품목 상세 - Detail
            </div>
            <Card>
                <CardBody className='text_center'>
                    <CardTitle className='border_black_1px'>창고 코드 : {storage.storage_code}</CardTitle>
                    <CardSubtitle className='border_black_1px'>창고명 : {storage.storage}</CardSubtitle>
                    <CardText className='border_black_1px'><div>창고 위치 : {storage.storage_location} </div></CardText>
                    <CardText>
                        <div className="btn_space">
                            <Link to={`/storageUpdate/${storage_code}`} className="btn btn-primary area_fit wide_fit">창고 수정</Link>
                            <Button variant="warning" onClick={deletestorage} className="btn btn-primary wide_fit">창고 삭제</Button>
                            <Link to={'/warehouseMain'} className="btn btn-primary area_fit wide_fit">목록으로</Link>
                        </div>
                    </CardText>
                </CardBody>
            </Card>
        </div>
    )
}

export default StorageDetail;