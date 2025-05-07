/* eslint-disable react/react-in-jsx-scope */
import React, { useState, useEffect } from "react";
import { Container, Grid, Row, Col } from "rsuite";
import CurrentDateTime from "#components/attendance/CurrentDateTime.jsx";
import TodayCommuteInfo from "#components/attendance/TodayCommuteInfo";
import CommuteTable from "#components/attendance/CommuteTable";
import AppConfig from "#config/AppConfig.json";
import "#styles/attendance.css";
import WeatherInfo from "#components/api/weather/WeatherInfo.jsx";

export default function Management() {
  const fetchURL = AppConfig.fetch["mytest"];
  const attURL = `${fetchURL.protocol}${fetchURL.url}/attendance`;

  // 로그인 정보
  const raw_id = localStorage.getItem("e_id");
  const e_id = raw_id && !isNaN(Number(raw_id)) ? Number(raw_id) : null;
  const e_name = localStorage.getItem("e_name") || null;

  // 전체 리스트 + 로딩
  const [commuteList, setCommuteList] = useState([]);
  const [loadingList, setLoadingList] = useState(false);

  // 새로고침 토글
  const [refresh, setRefresh] = useState(false);
  const toggleRefresh = () => setRefresh((p) => !p);

  useEffect(() => {
    if (e_id == null) return;
    setLoadingList(true);
    fetch(`${attURL}/myAttList/${e_id}`)
      .then((res) => res.json())
      .then(({ items = [] }) => setCommuteList(items))
      .catch(console.error)
      .finally(() => setLoadingList(false));
  }, [e_id, refresh]);

  return (
    <Container style={{ padding: 20, display: "flex", flexDirection: "row" }}>
      <Container style={{ marginRight: 30, width: "240px" }}>
        <div style={{ marginBottom: 20, display: "flex", flexDirection: "column" }}>
          <CurrentDateTime />
          <TodayCommuteInfo
            e_id={e_id}
            e_name={e_name}
            attURL={attURL}
            onRefresh={toggleRefresh}
          />
        </div>

        <div style={{ marginTop: 30 }}>
          <WeatherInfo />
        </div>
      </Container>
      <Container style={{ width: 1920-240 }}>
        <CommuteTable
          e_id={e_id}
          loading={loadingList}
          attURL={attURL}
          refresh={refresh}
        />
      </Container>
      {/* <Grid fluid>
        <Row gutter={16}>
          <Col xs={24} md={8} lg={6}>
          </Col>

          <Col xs={24} md={16} lg={18}>
          </Col>
        </Row>
      </Grid> */}
    </Container>
  );
}
