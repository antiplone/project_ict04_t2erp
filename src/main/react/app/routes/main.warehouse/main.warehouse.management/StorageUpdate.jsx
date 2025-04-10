import  React, {useEffect, useState } from 'react';
import { /* Link, */ Link, useParams } from 'react-router-dom';
import '../common/css/logisCommon.css'
import { Button, Form } from 'rsuite';
import { useNavigate } from 'react-router-dom';

const StorageUpdate = () => {
    const navigator = useNavigate();

    const propsParam = useParams();
    const storage_code = propsParam.storage_code;

    console.log("storage_code : ", storage_code)

    const [storage, setStorageDetail] = useState({
        storage_code: '',
        storage: '',
        storage_location: ''
    });
    
    useEffect(() => {
        fetch('http://localhost:8081/api5/storageDetail/' + storage_code)
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

    // const changeValue = (e) => {
    //     setStorageDetail(prevState  => ({
    //         ...prevState,   // 최종 입력 한 input에 입력한 값이 지워지지 않게 해준다.
    //         // 이 문구가 없으면 가장 마지막 Form.Control(input) 값만 저장 됨
    //         // 예) ...board 생략 시 content 작성 시 title의 내용이 사라지고, writer 작성 시 content 내용이 사라짐
    //         [e.target.name]: e.target.value // 동적으로 키값 만들기(compute properties)
    //     }));
    // }

    const submitStorage = (e) => {

        if (!storage.storage || !storage.storage_location) {
            alert("모든 필수 정보를 입력해주세요.");
            return;
        }
        
        if (e && e.preventDefault) e.preventDefault(); // e가 없을 경우 방어 코드 추가
        
        fetch("http://localhost:8081/logisstorage/storageUpdate/" + storage_code, {
            method: "PUT", // update는 PUT으로 전달
            headers: {
                "Content-Type": "application/json; charset-utf-8", // 데이터를 json으로 받겠다. 
            },
            body: JSON.stringify(storage)
        }).then(res => {
            console.log(1, res);
            if (res.status === 200)
                return res.json();
            else return null;
        }).then(res => {
            console.log('정상', res);
            if (res !== null)
                navigator(`/storageDetail/${storage_code}`);
            else alert('창고 정보 수정에 실패하였습니다.');
        }).catch(error => {
            console.log('실패', error);
        });
    }

    return (
        <Form onSubmit={submitStorage} className="text_center"> {/* submit 버튼 클릭 시 submitBoard 함수 호출, onClick으로 해도 된다.*/}
            <Form.Group className="mb-3" controlId="storage_code">
                <Form.ControlLabel>창고코드</Form.ControlLabel>
                <Form.Control type="text" name="storage_code" value={storage.storage_code} readOnly />
            </Form.Group>

            <Form.Group className="mb-3" controlId="storage">
                <Form.ControlLabel>창고명</Form.ControlLabel>
                <Form.Control type="text" placeholder="창고명을 입력하세요" onChange={changeValue} name="storage" value={storage.storage} />
            </Form.Group>

            <Form.Group className="mb-3" controlId="storage_location">
                <Form.ControlLabel>창고 주소</Form.ControlLabel>
                <Form.Control type="text" placeholder="창고 주소를 입력하세요" onChange={changeValue} name="storage_location" value={storage.storage_location} />
            </Form.Group>

            <Button appearance="primary" type="submit">
                수정 완료
            </Button>

            <Link to={'/warehouseMain'} className="rs-btn rs-btn-primary" style={{margin:'0px 10px'}}>목록으로</Link>
        </Form>
    )
}

export default StorageUpdate;