import React, { useEffect, useState } from 'react';
import { /* Link, */ Link, useNavigate, useParams } from '@remix-run/react';
import { Button, Form, Message } from 'rsuite';
import Appconfig from "#config/AppConfig.json";
import { useDaumPostcodePopup } from 'react-daum-postcode';
import '#components/common/css/warehouseform.css';
import "#components/common/css/common.css";
import { useToast } from '#components/common/ToastProvider';

const StorageUpdate = () => {
	const rawURL = Appconfig.fetch['mytest']
	const fetchURL = rawURL.protocol + rawURL.url

    const propsParam = useParams();
    const storage_code = propsParam.storage_code;
    const navigator = useNavigate(); // 밑에서 사용함
	const { showToast } = useToast();

    console.log("storage_code : ", storage_code)

	const [storage, setStorage] = useState({
      storage_name: "",
      storage_zone_code: "",
      storage_base_address: "",
      storage_detail_address: ""
	});

	const open = useDaumPostcodePopup("https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js");
	
	const handleAddress = () => {
		open({
			onComplete: (data) => {
				let baseAddress = data.address;
				let extra = data.bname || '';
				if (data.buildingName) extra += `, ${data.buildingName}`;
				if (extra) baseAddress += ` (${extra})`;
				setStorage(prev => ({
					...prev,
					storage_zone_code: data.zonecode,
					storage_base_address: baseAddress,
					storage_detail_address: ""
				}));
			}
		});
	};
	
    useEffect(() => {
        fetch(`${fetchURL}/warehouse/findByStoragecode/${storage_code}`)
            .then(res => res.json())
            .then(res => {
                console.log("res : ", res)
                setStorage(prevState => ({
                    ...prevState,
                    ...res // 기존 상태 유지 + 새 데이터 업데이트
                }));
            })
            .catch(err => console.error('Error fetching storage:', err));
    }, [storage_code]);

    const changeValue = (value, event) => {
        if (!event || !event.target) {
            showToast("입력이 불가합니다.")
            return; // 방어 코드 추가
        }

        const name = event.target.name;
        // console.log(value);
        // console.log(name);
		setStorage(prevState => ({
			...prevState,
			[event.target.name]: value,
        }));
    };

    const submitStorage = (e) => {
        if (e && e.preventDefault) e.preventDefault(); // e가 없을 경우 방어 코드 추가

        if (!storage.storage_name || !storage.storage_zone_code || !storage.storage_base_address || !storage.storage_detail_address) {
            showToast("모든 필수 정보를 입력해주세요.");
            return;
        }
        
		fetch(`${fetchURL}/warehouse/warehouseUpdate`, {
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
				showToast('창고 정보 수정에 성공하였습니다.');
				navigator(`/main/logis-warehouse-detail/${storage_code}`);
			}
            else showToast('창고 정보 수정에 실패하였습니다.');
        }).catch(error => {
            console.log('실패', error);
        });
    }

    return (
        <div>
			<Message type="error" className="main_title">
				창고 정보 수정
			</Message>
			<Form className="storage-form">
				{/* 창고코드 */}
				<div className="form-row">
					<label className="form-label">창고코드</label>
					<div className="form-value">창고코드는 자동 생성됩니다.</div>
				</div>

				{/* 창고명 */}
				<div className="form-row">
					<label htmlFor="storage_name" className="form-label">창고명</label>
					<input
						type="text"
						id="storage_name"
						name="storage_name"
						className="form-input"
						placeholder="창고명을 입력하세요"
						value={storage.storage_name}
						onChange={e => setStorage({ ...storage, storage_name: e.target.value })}
					/>
				</div>

				{/* 우편번호 */}
				<div className="form-row">
					<label htmlFor="storage_zone_code" className="form-label">우편번호</label>
					<div style={{ display: 'flex', gap: '8px' }}>
						<input
							type="text"
							id="storage_zone_code"
							name="storage_zone_code"
							className="form-input"
							placeholder="우편번호를 입력하세요"
							value={storage.storage_zone_code}
							onChange={e => setStorage({ ...storage, storage_zone_code: e.target.value })}
							style={{ flex: 1 }}
						/>
						<Button size="xs" appearance="ghost" onClick={handleAddress}>
							우편번호 검색
						</Button>
					</div>
				</div>

				{/* 기본주소 */}
				<div className="form-row">
					<label htmlFor="storage_base_address" className="form-label">기본주소</label>
					<input
						type="text"
						id="storage_base_address"
						name="storage_base_address"
						className="form-input"
						placeholder="주소를 입력하세요"
						value={storage.storage_base_address}
						onChange={e => setStorage({ ...storage, storage_base_address: e.target.value })}
					/>
				</div>

				{/* 상세주소 */}
				<div className="form-row">
					<label htmlFor="storage_detail_address" className="form-label">상세주소</label>
					<input
						type="text"
						id="storage_detail_address"
						name="storage_detail_address"
						className="form-input"
						placeholder="상세주소를 입력하세요"
						value={storage.storage_detail_address}
						onChange={e => setStorage({ ...storage, storage_detail_address: e.target.value })}
					/>
				</div>
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