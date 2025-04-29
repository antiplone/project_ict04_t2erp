import React, { useState, useEffect, useMemo } from 'react';
import { Container, Placeholder, Loader } from "rsuite";
import AppConfig from "#config/AppConfig.json";
import "#styles/sell.css";

const SellInvoiceContent = ({ order_id, order_date, date_no }) => {
  const [data, setData] = useState([]);
  const [clientInfo, setClientInfo] = useState(null); // 거래처 정보는 화면에 1회만 불러오기 위해 별도 생성

  const fetchURL = AppConfig.fetch['mytest'];
  const [isLoading, setIsLoading] = useState(true);	// 로딩중일때

  // 데이터 불러오기
  useEffect(() => {
    fetch(`${fetchURL.protocol}${fetchURL.url}/sell/invocie/${order_id}`, {
      method: "GET"
    })
      .then(res => res.json())
      .then(res => {
        console.log("res 확인:", res);

        const result = Array.isArray(res) 
                    ? res   // 응답이 배열이면 그대로
                    : (res.data && Array.isArray(res.data) ? res.data : []);  // 아니면 data가 배열인지 체크
        setData(result);
        setIsLoading(false);

        if (result[0]) {
          const item = result[0];
          setClientInfo({
            client_name: item.client_name,
            c_tel: item.c_tel,
            sc_biz_num: item.sc_biz_num,
            c_ceo: item.c_ceo,
            address: `${item.c_base_address || ""} ${item.c_detail_address || ""}`
          });
        }
      })
      .catch(err => {
        console.error("데이터 요청 오류:", err);
        setData([]);
      });
  }, [order_id]);

  // 합계 계산. 
  // .reduce() : 배열 안의 값들을 하나의 결과값으로 / useMemo: 렌더링할 때마다 다시 계산하지 않도록 막는 훅.
  const totals = useMemo(() => {
    return data.reduce((acc, item) => {
      acc.quantity += item.quantity || 0;
      acc.supply += item.supply || 0;
      acc.vat += item.vat || 0;
      acc.total += (item.supply || 0) + (item.vat || 0);
      return acc;
    }, { quantity: 0, supply: 0, vat: 0, total: 0 });
  }, [data]);

  return (
    <>
      {/* 로딩 중일 때 */}
      {isLoading ? (
        <Container>
          <Placeholder.Paragraph rows={16} />
          <Loader center content="불러오는중..." />
        </Container>
      ) : (
        <>
      <div className="invocie_page">
        <div className="invoice-header">
          <div className="header-left">
            <div className="invoice-title">거래명세서</div>
            <div className="company-box">(주) {clientInfo?.client_name || ""}</div>
          </div>

          <div className="header-right">
            <table className="info-table">
              <tbody>
                <tr>
                  <th rowSpan={4}>공<br />급<br />자</th>
                  <td className="label">일련번호</td>
                  <td>{order_date}_{date_no}</td>
                  <td className="label">TEL</td>
                  <td>{clientInfo?.c_tel || ""}</td>
                </tr>
                <tr>
                  <td className="label">사업자등록번호</td>
                  <td>{clientInfo?.sc_biz_num || ""}</td>
                  <td className="label">성명</td>
                  <td>{clientInfo?.c_ceo || ""}</td>
                </tr>
                <tr>
                  <td className="label">상호</td>
                  <td colSpan={4}>(주) {clientInfo?.client_name || ""}</td>
                </tr>
                <tr>
                  <td className="label">주소</td>
                  <td colSpan={4}>{clientInfo?.address || ""}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="invoice-table-wrapper">
          <table className="invoice-table">
            <thead>
              <tr>
                <th>일자</th>
                <th>품목명[규격]</th>
                <th>수량</th>
                <th>단가</th>
                <th>공급가액</th>
                <th>부가세</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <tr key={index}>
                  <td>{item.order_date}</td>
                  <td>{item.item_name}[{item.item_standard}]</td>
                  <td>{item.quantity.toLocaleString()}</td>
                  <td>{item.price.toLocaleString()}</td>
                  <td>{item.supply.toLocaleString()}</td>
                  <td>{item.vat.toLocaleString()}</td>
                </tr>
              ))}
              {/* 빈 줄 추가 - data가 5보다 작을 때 최소 5줄 보이도록 나머지 빈 줄을 만들기 */}
              {Array.from({ length: 5 - data.length }).map((_, i) => (
                <tr key={`empty-${i}`}>
                  <td>&nbsp;</td>
                  <td>&nbsp;</td>
                  <td>&nbsp;</td>
                  <td>&nbsp;</td>
                  <td>&nbsp;</td>
                  <td>&nbsp;</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="invoice-table-bottom">
            <table className="invoice-table-total">
              <thead>
                <tr>
                  <th className="bold">수량</th>
                  <td className="bold">{totals.quantity.toLocaleString()}</td>
                  <th className="bold">공급가액</th>
                  <td className="bold">{totals.supply.toLocaleString()}</td>
                  <th className="bold">VAT</th>
                  <td className="bold">{totals.vat.toLocaleString()}</td>
                  <th className="bold">합계</th>
                  <td className="bold">{totals.total.toLocaleString()}</td>
                  <th className="bold">인수</th>
                  <td>인</td>
                </tr>
              </thead>
            </table>
          </div>
        </div>
      </div>

      <hr style={{ margin: '40px 0', border: '1px dashed #000' }} />
      </>
      )}
    </>
  );
};

export default SellInvoiceContent;