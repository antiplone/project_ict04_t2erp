// 구매팀 - 구매조회 페이지 
/* eslint-disable react/react-in-jsx-scope */
import AppConfig from "#config/AppConfig.json";
import { Container, Tabs, Placeholder, Loader } from "rsuite";
import React, { useEffect, useState } from 'react';
import BuySelectTabAll from "#components/buy/BuySelectTabAll.jsx";
import "../styles/buy.css";
import BuySelectTabCheck from "#components/buy/BuySelectTabCheck.jsx";
import BuySelectTabPaing from "#components/buy/BuySelectTabPaing.jsx";
import MessageBox from '../components/common/MessageBox';

// @Remix:모듈함수 - <html>의 <head>의 내용
export function meta() {
    return [
        { title: `${AppConfig.meta.title} : 구매조회` },
        { name: "description", content: "구매내역을 조회합니다." },
    ];
};

export default function BuySelect() {

    const fetchURL = AppConfig.fetch["mytest"];

    const [statusCounts, setStatusCounts] = useState({ total: 0, paying: 0, approved: 0 });

    const [loading, setLoading] = useState(true); // 페이지 로딩중

    // 주문상태별 건수 조회
    useEffect(() => {
        fetch(`${fetchURL.protocol}${fetchURL.url}/buy/buyOrderStatusCounts`)
            .then((res) => res.json())
            .then((data) => {
                console.log("진행상태별 건수:", data);
                setStatusCounts(data); // JSON 응답을 그대로 state에 저장
                setLoading(false); // 로딩완료
            })
            .catch((err) => {
                console.error("진행상태별 건수 조회 실패:", err);
                setLoading(false);  // 실패해도 로딩 종료 처리
            });
    }, []);

    return (
        <>
            <Container>
                <MessageBox type="info" text="구매조회" />
                <br />
                {loading ? (
                    <Container>
                        <Placeholder.Paragraph rows={15} />
                        <Loader center content="불러오는 중..." />
                    </Container>
                ) : (
                <Tabs defaultActiveKey="1">

                <Tabs.Tab eventKey="1" title={`전체 (${statusCounts.total})`}>
                    <Container>
                        <BuySelectTabAll />
                    </Container>
                </Tabs.Tab>

                <Tabs.Tab eventKey="2" title={`결재중 (${statusCounts.paying})`}>
                    <Container>
                        <BuySelectTabPaing />
                    </Container>
                </Tabs.Tab>
                {/* 판매팀 구매요청 프로세스 보류로 인해 주석처리
                    <Tabs.Tab eventKey="3" title="미확인">
                        <Container>
                            <BuySelectTabUnchk />
                        </Container>
                    </Tabs.Tab>
 */}
                <Tabs.Tab eventKey="3" title={`승인 (${statusCounts.approved})`}>
                    <Container>
                        <BuySelectTabCheck />
                    </Container>
                </Tabs.Tab>
            </Tabs>
)}
        </Container >
        </>
    );
};
