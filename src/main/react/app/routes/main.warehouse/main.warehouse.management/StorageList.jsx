import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Container, /* Form, */ Table } from 'rsuite';
import '../common/css/logisCommon.css'
//import { Link  } from 'react-router-dom';
// import WarehousingItem from '../components/WarehousingItem';

const StockItems = () => {

    const [storageList, setStorageList] = useState([]); // 초기값을 모르므로 빈배열로 Warehousingist에 대입

    // // fetch()를 통해 서버에게 데이터를 요청
    useEffect(() => { // 통신 시작 하겠다.
        fetch("http://localhost:8081/logisstorage/logisStorageList/", { // 스프링부트에 요청한다.
            method: "GET" // "GET" 방식으로
        }).then(
            res => res.json() // 응답이 오면 javascript object로 바꾸겠다.
        ).then(
            res => {
                console.log(1, res); // setWarehousingist를 통해서 뿌려준다.
                // const list = Array.isArray(res) ? res : res?.warehousingList || [];
                setStorageList(res);
            }
        ).catch(error => {
            console.error("storageList list:", error);
            setStorageList([]); // 오류 시 빈 배열 설정
        });
    }, []);
    // // []은 디펜던시인데, setState()로 렌더링 될 때마다 싱행되면 안되고, 한 번만 실행하도록 빕배여ㅕ르ㅏㅏ

    return (
        <div>
            <Container>
                <div className='header logiHeader'>
                    창고 목록
                </div>
                <br />
                <Table height={400} data={storageList}>
                    <Table.Column width={100} align="center" fixed>
                        <Table.HeaderCell>창고 코드</Table.HeaderCell>
                        <Table.Cell dataKey="storage_code" />
                    </Table.Column>

                    <Table.Column width={200}>
                        <Table.HeaderCell>창고명</Table.HeaderCell>
                        <Table.Cell dataKey="storage" />
                    </Table.Column>

                    <Table.Column width={150}>
                        <Table.HeaderCell>주소</Table.HeaderCell>
                        <Table.Cell dataKey="storage_location" />
                    </Table.Column>

                    <Table.Column width={150} style={{padding:'6px'}}>
                        <Table.HeaderCell>창고 상세보기</Table.HeaderCell>
                        <Table.Cell dataKey="storage_code">
                        {(storageList) => (
                            <Link to={`/storageDetail/${storageList.storage_code}`} className="btn btn-primary area_fit wide_fit" >창고 상세</Link>
                        )}
                        </Table.Cell>
                    </Table.Column>
                </Table>
                <Link to={'/storageInsert'} className="btn btn-primary area_fit wide_fit">창고 등록</Link>
            </Container>
        </div>
    )
}

export default StockItems;