import React, { useEffect, useState } from 'react';
import { /* Link, */ Link, useNavigate, useParams } from '@remix-run/react';
import { Button, Form, Message } from 'rsuite';
import Appconfig from "#config/AppConfig.json";
import '#styles/warehouse.css';
import "#components/common/css/common.css";

const StorageUpdate = () => {
	const fetchURL = Appconfig.fetch['mytest']

    const propsParam = useParams();
    const storage_code = propsParam.storage_code;
    const navigator = useNavigate(); // 밑에서 사용함

    console.log("storage_code : ", storage_code)

    const [storage, setStorageDetail] = useState({
        storage_code: '',
        storage_name: '',
        storage_location: ''
    });

    useEffect(() => {
        fetch(`${fetchURL.protocol}${fetchURL.url}/warehouse/findByStoragecode/${storage_code}`)
            .then(res => res.json())
            .then(res => {
                console.log("res : ", res)
                setStorageDetail(prevState => ({
                    ...prevState,
                    ...res // 기존 상태 유지 + 새 데이터 업데이트
                }));
            })
            .catch(err => console.error('Error fetching storage:', err));
    }, [storage_code]);

    const changeValue = (value, event) => {
        if (!event || !event.target) {
            alert("입력이 불가합니다.")
            return; // 방어 코드 추가
        }

        const name = event.target.name;
        // console.log(value);
        // console.log(name);
        setStorageDetail(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const submitStorage = (e) => {
        if (e && e.preventDefault) e.preventDefault(); // e가 없을 경우 방어 코드 추가

        if (!storage.storage_name || !storage.storage_location) {
            alert("모든 필수 정보를 입력해주세요.");
            return;
        }
        
/*        const query = new URLSearchParams({
			storage_code: storage.storage_code,
            storage_name: storage.storage_name,
            storage_location: storage.storage_location,
        }).toString();*/

		fetch(`${fetchURL.protocol}${fetchURL.url}/warehouse/warehouseUpdate`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json; charset=UTF-8", // utf-8 오타 수정
			},
            body: JSON.stringify(storage)
        }).then(res => {
            console.log(1, res);
            if (res.status === 200)
                return res.json();
            else return null;
        }).then(res => {
            console.log('정상', res);
            if(res !== null) {
				alert('창고 정보 수정에 성공하였습니다.');
				navigator(`/main/logis-warehouse-detail/${storage_code}`);
			}
            else alert('창고 정보 수정에 실패하였습니다.');
        }).catch(error => {
            console.log('실패', error);
        });
    }

    return (
        <div>
			<Message type="error" className="main_title">
				창고 정보 수정
			</Message>
            <Form className="custom_form text_center"> {/* submit 버튼 클릭 시 submitBoard 함수 호출, onClick으로 해도 된다.*/}
                <Form.Group className="mb-3 display_flex" controlId="storage_code">
                    <Form.ControlLabel>창고코드</Form.ControlLabel>
                    <Form.Control type="text" name="storage_code" value={storage.storage_code} readOnly />
                </Form.Group>

                <Form.Group className="mb-3 display_flex" controlId="storage_name">
                    <Form.ControlLabel>창고명</Form.ControlLabel>
                    <Form.Control type="text" placeholder="창고명을 입력하세요" onChange={changeValue} name="storage_name" value={storage.storage_name} />
                </Form.Group>

                <Form.Group className="mb-3 display_flex" controlId="storage_location">
                    <Form.ControlLabel>창고 주소</Form.ControlLabel>
                    <Form.Control type="text" placeholder="창고 주소를 입력하세요" onChange={changeValue} name="storage_location" value={storage.storage_location} />
                </Form.Group>

            </Form>
            <div className='display_flex'>
                <Button appearance="primary" type="submit" onClick={submitStorage}>
                    수정 완료
                </Button>
                <Link to={'/main/logis-warehouse'} className="rs-btn rs-btn-primary" style={{ margin: '0px 10px' }}>창고메인으로</Link>
                <Link to={`/main/logis-warehouse-detail/${storage_code}`} className="rs-btn rs-btn-primary" style={{ margin: '0px 10px' }}>이전으로</Link>
            </div>
        </div>
    )
}

export default StorageUpdate;