/* eslint-disable react/react-in-jsx-scope */
import React, { useState, useEffect, useMemo } from "react";
import { Container, Grid, Row, Col, Pagination } from "rsuite";
import MessageBox from "#components/common/MessageBox";
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

  // 페이징
  const [limit, setLimit] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

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

  // 페이징 적용
  const pagedData = useMemo(() => {
    const start = (currentPage - 1) * limit;
    return commuteList.slice(start, start + limit);
  }, [commuteList, currentPage, limit]);

  return (
    <Container style={{ padding: 20 }}>

      <Grid fluid>
        <Row gutter={16}>
          {/* 왼쪽: 시간 + 버튼 영역 */}
          <Col xs={24} md={8} lg={6}>
            {/* 세로로 쌓기 */}
            <div style={{ marginBottom: 20 }}>
              <CurrentDateTime />
            </div>
            <TodayCommuteInfo
              e_id={e_id}
              e_name={e_name}
              attURL={attURL}
              onRefresh={toggleRefresh}
            />
            <div style={{ marginTop: 30 }}>
              <WeatherInfo />
            </div>
          </Col>

          {/* 오른쪽: 테이블 + 페이징 */}
          <Col xs={24} md={16} lg={18}>
            <CommuteTable
              e_id={e_id}
              data={pagedData}
              loading={loadingList}
              attURL={attURL}
              refresh={refresh}
            />
          </Col>
        </Row>
      </Grid>
    </Container>
  );
}
