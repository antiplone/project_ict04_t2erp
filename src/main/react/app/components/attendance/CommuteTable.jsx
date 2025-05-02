/* eslint-disable react/prop-types */
/* eslint-disable react/react-in-jsx-scope */
import { Loader, Placeholder, SelectPicker, Table, Tabs } from "rsuite";
import { useState, useEffect } from "react";
import CommuteUpdateModal from "./CommuteUpdateModal";
import RetireInsertTable from "#components/hr/RetiInsertTable.jsx";
import AppConfig from "#config/AppConfig.json";
import CommuteRequestModal from "./CommuteRequestModal";
import Btn from "./Btn";
import "#styles/holiday.css";
import "#styles/common.css";

const { Column, HeaderCell, Cell } = Table;

export default function CommuteTable({ loading, attURL, refresh, e_id }) {
  const fetchURL = AppConfig.fetch['mytest'];
  const hrURL = `${fetchURL.protocol}${fetchURL.url}/hr`;
  const hrCardURL = `${fetchURL.protocol}${fetchURL.url}/hrCard`;
  const [isLoading, setIsLoading] = useState(true);	// 데이터를 가져오는 중인지 표시 (true/false)

  const [record, setRecord] = useState([]);
  const [myData, setMyData] = useState([]);
  const [lateData, setLateData] = useState([]); // 지각 조회

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null); // 출퇴근 수정
  const [requestRow, setRequestdRow] = useState(null); // 출퇴근 정정요청
  const [employee, setEmployee] = useState(null);

  const [position, setPosition] = useState(null); // position 상태 생성
  const adminPositions = ["과장", "부장", "차장", "팀장", "이사", "관리"];

  const [activeKey, setActiveKey] = useState("1");
  const uniqueDates = Array.from(new Set(record.map(item => item.co_work_date)));
  const [selectedDate, setSelectedDate] = useState("전체");
  const filteredRecord = selectedDate === "전체"
    ? record
    : record.filter(item => item.co_work_date === selectedDate);

  // localStorage에서 position 불러오기
  useEffect(() => {
    const pos = localStorage.getItem("e_position")?.trim();
    setPosition(pos);
  }, []);

  useEffect(() => {
    // 전체 근태 리스트
    fetch(`${attURL}/attList`)
      .then((res) => res.json())
      .then((data) => {
        setRecord(data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("불러오기 실패:", err);
        setRecord([]);
        setIsLoading(false);
      });

    // 내 근태 리스트
    fetch(`${attURL}/myAttList/${e_id}`)
      .then((res) => {
        if (!res.ok) throw new Error(`서버 오류: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        setMyData(data)
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("불러오기 실패:", err);
        setMyData([]);
        setIsLoading(false);
      });
  }, [attURL, refresh]);

  useEffect(() => {
    if (!e_id) return;
    fetch(`${hrCardURL}/hrCardDetail/${e_id}`)
    .then((res) => res.json())
    .then((data) => {
      setEmployee(data);
      setIsLoading(false);
    })
    .catch((err) => {
      console.error("사원 정보 로딩 실패:", err);
      setIsLoading(false);
    });
  }, [e_id]);

  // position 로딩 전에는 null 처리 (안그러면 undefined 오류 나거나 조건 안 먹힘)
  if (position === null) return <div>로딩 중...</div>;
  if (isLoading) {
    return <div style={{ padding: 30, textAlign: 'center' }}>데이터를 불러오는 중입니다...</div>;
  }

  const attColumns = [
    { label: "사원명", dataKey: "e_name", width: 110 },
    { label: "오늘날짜", dataKey: "co_work_date", width: 120 },
    { label: "출근시간", dataKey: "co_start_time", width: 120 },
    { label: "퇴근시간", dataKey: "co_end_time", width: 110 },
    { label: "근무시간", dataKey: "co_total_work_time", width: 110 },
    { label: "상태", dataKey: "co_status", width: 140 },
    { label: "상태비고", dataKey: "co_status_note", width: 815 },
  ];

  return (
    <>
    <div style={{ display: "flex", gap: 40, alignItems: "flex-start" }}>
      <div style={{ flexGrow: 1 }}>
      {adminPositions.includes(position?.trim()) ? (
        <>
          {/* 관리자용 탭 + 날짜 필터 */}
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
            <Tabs activeKey={activeKey} onSelect={setActiveKey} appearance="pills">
              <Tabs.Tab eventKey="1" title="전체 출퇴근 조회" />
              <Tabs.Tab eventKey="2" title="내 출퇴근 조회" />
              {/* <Tabs.Tab eventKey="3" title="지각 조회" /> */}
            </Tabs>

            {activeKey === "1" && (
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span>날짜 선택:</span>
                <SelectPicker
                  data={[{ label: "전체", value: "전체" }, ...uniqueDates.map(date => ({ label: date, value: date }))]}
                  value={selectedDate}
                  onChange={setSelectedDate}
                  style={{ width: 200 }}
                  searchable={false}
                  cleanable={false}
                  placeholder="날짜 선택"
                />
              </div>
            )}
          </div>

          {activeKey === "1" && (
            <Table height={500} data={filteredRecord} cellBordered>
              {attColumns.map((col) => (
                <Column key={col.dataKey} width={col.width} className="text_center">
                  <HeaderCell style={{ backgroundColor: '#f8f9fa' }}>{col.label}</HeaderCell>
                  <Cell dataKey={col.dataKey} />
                </Column>
              ))}
              <Column width={90} fixed="right" className="text_center" style={{ lineHeight: "23px" }}>
                <HeaderCell style={{ backgroundColor: '#f8f9fa' }}>작업</HeaderCell>
                <Cell style={{ padding: '6px' }}>
                  {rowData => (
                    <Btn text="수정" color="blue" style={{ padding: "0 10px"}} onClick={() => { setSelectedRow(rowData); setModalOpen(true); }} />
                  )}
                </Cell>
              </Column>
            </Table>
          )}

          {activeKey === "2" && (
            <Table height={500} data={myData} cellBordered style={{ minWidth: 860 }}>
              {attColumns.map((col) => (
                <Column key={col.dataKey} width={col.width} className="text_center">
                  <HeaderCell style={{ backgroundColor: '#f8f9fa' }}>{col.label}</HeaderCell>
                  <Cell dataKey={col.dataKey} />
                </Column>
              ))}
              {/* <Column width={70} fixed="right" className="text_center">
                <HeaderCell style={{ backgroundColor: '#f8f9fa' }}>정정요청</HeaderCell>
                <Cell style={{ padding: '6px' }}>
                  {rowData => (
                    <Button appearance="link" onClick={() => { setRequestdRow(rowData); setModalOpen(true); }}>
                      요청
                    </Button>
                  )}
                </Cell>
              </Column> */}
            </Table>
          )}

          {/* {activeKey === "3" && (
            <Table height={500} data={lateData} cellBordered style={{ minWidth: 910 }}>
              {attColumns.map((col) => (
                <Column key={col.dataKey} width={col.width} className="text_center">
                  <HeaderCell style={{ backgroundColor: '#f8f9fa' }}>{col.label}</HeaderCell>
                  <Cell dataKey={col.dataKey} />
                </Column>
              ))}
              <Column width={70} fixed="right" className="text_center">
                <HeaderCell style={{ backgroundColor: '#f8f9fa' }}>작업</HeaderCell>
                <Cell style={{ padding: '6px' }}>
                  {rowData => (
                    <Btn text="수정" color="blue" style={{ padding: "0 10px"}} onClick={() => { setSelectedRow(rowData); setModalOpen(true); }} />
                  )}
                </Cell>
              </Column>
            </Table>
          )} */}

          <CommuteUpdateModal
            open={modalOpen}
            onClose={() => setModalOpen(false)}
            rowData={selectedRow}
            attURL={attURL}
            onRefresh={() => refresh && refresh()}
          />
        </>
      ) : (
        <>
          {/* 사원용 탭 + 날짜 필터 */}
          <div style={{ display: "flex", justifyContent: "space-between", minWidth: 980, marginBottom: 16 }}>
            <Tabs activeKey={activeKey} onSelect={setActiveKey} appearance="pills">
              <Tabs.Tab eventKey="1" title="내 출퇴근 조회" />
              {/* <Tabs.Tab eventKey="2" title="지각 조회" /> */}
              <Tabs.Tab eventKey="3" title="퇴직 신청" />
            </Tabs>
          </div>

          {activeKey === "1" && (
            <Table height={500} data={myData} cellBordered style={{ minWidth: 840 }}>
              {attColumns.map((col) => (
                <Column key={col.dataKey} width={col.width} className="text_center">
                  <HeaderCell style={{ backgroundColor: '#f8f9fa' }}>{col.label}</HeaderCell>
                  <Cell dataKey={col.dataKey} />
                </Column>
              ))}
              {/* <Column width={70} fixed="right" className="text_center">
                <HeaderCell style={{ backgroundColor: '#f8f9fa' }}>정정요청</HeaderCell>
                <Cell style={{ padding: '6px' }}>
                  {rowData => (
                    <Button appearance="link" onClick={() => { setRequestdRow(rowData); setModalOpen(true); }}>
                      요청
                    </Button>
                  )}
                </Cell>
              </Column> */}
            </Table>
          )}

          {/* {activeKey === "2" && (
            <Table height={500} data={lateData} cellBordered style={{ minWidth: 840 }}>
              {attColumns.map((col) => (
                <Column key={col.dataKey} width={col.width} className="text_center">
                  <HeaderCell style={{ backgroundColor: '#f8f9fa' }}>{col.label}</HeaderCell>
                  <Cell dataKey={col.dataKey} />
                </Column>
              ))}
              <Column width={70} fixed="right" className="text_center">
                <HeaderCell style={{ backgroundColor: '#f8f9fa' }}>정정요청</HeaderCell>
                <Cell style={{ padding: '6px' }}>
                  {rowData => (
                    <Button appearance="link" onClick={() => { setRequestdRow(rowData); setModalOpen(true); }}>
                      요청
                    </Button>
                  )}
                </Cell>
              </Column>
            </Table>
          )} */}

          {activeKey === "3" && employee && (
            <RetireInsertTable
              hrURL={hrURL}
              e_id={employee?.e_id}
              e_name={employee?.e_name}
              e_position={employee?.e_position}
              d_name={employee?.d_name}
            />
          )}
      
          <CommuteRequestModal
            open={modalOpen}
            onClose={() => setModalOpen(false)}
            rowData={requestRow}
            attURL={attURL}
            onRefresh={() => refresh && refresh()}
          />
        </>
      )}
      </div>
    </div>
    </>
  );
}
