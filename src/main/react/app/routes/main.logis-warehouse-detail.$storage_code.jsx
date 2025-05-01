import React, { useEffect, useState } from 'react';
import { Link, useParams } from '@remix-run/react';
import { Button, Table, Container } from 'rsuite';
import { useNavigate } from 'react-router-dom';
import Appconfig from "#config/AppConfig.json";
import "#components/common/css/common.css";
import MessageBox from '#components/common/MessageBox';

const StorageDetail = () => {
	const fetchURL = Appconfig.fetch['mytest']
	const { storage_code } = useParams();

	const navigator = useNavigate();

	console.log("storage_code : ", storage_code)

	const [storage, setStorageDetail] = useState({
		storage_code: '',
		storage: '',
		storage_location: ''
	});

	// console.log("storage_code : ", storage)

	useEffect(() => {
		if (!storage_code) return;

		fetch(`${fetchURL.protocol}${fetchURL.url}/warehouse/findByStoragecode/${storage_code}`)
			.then(res => res.json())
			.then(res => {
				console.log("res : ", res)
				setStorageDetail(res)
			})
			.catch(err => console.error('Error fetching storageDelete:', err));
	}, []);

	const deletestorage = () => {
		if (!window.confirm(`${storage_code}번 창고를 정말 삭제하시겠습니까?`)) return;
	
		fetch(`${fetchURL.protocol}${fetchURL.url}/warehouse/deletebyStorageCode/${storage_code}`, {
			method: "DELETE",
		})
		.then((res) => res.text())
		.then((res) => {
			if (res === '삭제완료') {
				alert(`${storage_code}번 창고가 삭제되었습니다.`)
				navigator('/main/logis-warehouse'); // 창고 목록으로 이동
			} else {
				alert('삭제 실패') // catch로 변경해도 된다.
			}
		})
		.catch(err => {
			console.error('삭제 요청 중 오류 발생:', err);
			alert('서버 오류로 삭제에 실패했습니다.');
		});
	}

	return (
		<div>
			<MessageBox type="error" text={`창고 상세 - ${storage.storage_name}`} />
			 <Container height={400} style={{margin: '0 auto', maxWidth : '760px'}}>
				<Table data={[storage]} height={400} bordered cellBordered autoHeight className="margin_0_auto detail_table" >
					<Table.Column flexGrow={1}>
						<Table.HeaderCell >창고코드</Table.HeaderCell>
						<Table.Cell dataKey="storage_code" className='text_center'/>
					</Table.Column>

					<Table.Column flexGrow={1}>
						<Table.HeaderCell>창고명</Table.HeaderCell>
						<Table.Cell dataKey="storage_name" />
					</Table.Column>

					<Table.Column flexGrow={4}>
						<Table.HeaderCell>창고 주소</Table.HeaderCell>
						<Table.Cell dataKey="storage_location" />
					</Table.Column>
				</Table>
			</Container>
			<div className="btn_space align_middle" >
				<Link to={`/main/logis-warehouse-update/${storage_code}`} className="btn btn-primary area_fit wide_fit">
					<Button appearance="primary" className="btn btn-primary wide_fit">
						창고 수정
					</Button>
				</Link>
				<Link to={'/main/logis-warehouse'} className="btn btn-primary area_fit wide_fit">
					<Button appearance="primary" className="btn btn-primary wide_fit">
						목록으로
					</Button>
				</Link>
				<Button sytle={{height: '40px'}} appearance="primary" onClick={deletestorage} className="btn btn-primary wide_fit">창고 삭제</Button>
			</div>
		</div>
	)
}

export default StorageDetail;