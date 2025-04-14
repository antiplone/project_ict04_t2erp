// 구매팀 - 구매조회 페이지 
/* eslint-disable react/react-in-jsx-scope */
import AppConfig from "#config/AppConfig.json";
import { Container, Tabs, Message, InputGroup, Input, Badge, Button } from "rsuite";
import React, { useEffect, useState } from 'react';
import SearchIcon from '@rsuite/icons/Search';
import BuySelectTabAll from "#components/buy/BuySelectTabAll.jsx";
import "../styles/buy.css";
import BuySelectTabUnchk from "#components/buy/BuySelectTabUnchk.jsx";
import BuySelectTabCheck from "#components/buy/BuySelectTabCheck.jsx";
import BuySelectTabPaing from "#components/buy/BuySelectTabPaing.jsx";

// @Remix:모듈함수 - <html>의 <head>의 내용
export function meta() {
    return [
        { title: `${AppConfig.meta.title} : 구매조회` },
        { name: "description", content: "구매내역을 조회합니다." },
    ];
};

const styles = {
    backgroundColor: '#f8f9fa',
};

export default function BuySelect() {

    const [uncheckedCount, setUnCheckedCount] = useState(0);

    const fetchURL = AppConfig.fetch["mytest"];

    useEffect(() => {
        fetch(`${fetchURL.protocol}${fetchURL.url}/buy/buyOrderUnchkCount`, {
            method: "GET"
        })
        .then((res) => res.json())
        .then(res => {
            setUnCheckedCount(res);
        });
    },[]);

    return (
        <>
            <Container>

                <Message type="info" style={{ maxWidth: 1500 }}>
                    <strong>구매조회</strong>
                </Message>
                <br />

                {/* 검색바 */}
                <div style={{ display: 'flex', marginRight: 30 }}>
                    <div className="buy_search_bar">
                        <InputGroup >
                            <Input />
                            <InputGroup.Button>
                                <SearchIcon />
                            </InputGroup.Button>
                        </InputGroup>
                    </div>

                    <Badge content={uncheckedCount}>
                        <Button>미확인건</Button>
                    </Badge>

                </div>

                {/* 전체 / 결재중 /미확인 / 확인 탭 */}
                <Tabs defaultActiveKey="1" style={{ maxWidth: 1500 }}>
                    <Tabs.Tab eventKey="1" title="전체">
                        <Container>
                            <BuySelectTabAll />
                        </Container>
                    </Tabs.Tab>

                    <Tabs.Tab eventKey="2" title="결재중">
                        <Container>
                            <BuySelectTabPaing />
                        </Container>
                    </Tabs.Tab>

                    <Tabs.Tab eventKey="3" title="미확인">
                        <Container>
                            <BuySelectTabUnchk />
                        </Container>
                    </Tabs.Tab>

                    <Tabs.Tab eventKey="4" title="확인">
                        <Container>
                            <BuySelectTabCheck />
                        </Container>
                    </Tabs.Tab>
                </Tabs>

            </Container>
        </>
    );
};
