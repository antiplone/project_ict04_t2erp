/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable react/prop-types */
import brand from "#images/common/brand.png";
import mainIcon from "#images/common/main.png";
import logout from "#images/common/logout.png";
import arrow from "#images/common/arrow.png";

import AppConfig from "#config/AppConfig.json"

import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "@remix-run/react";
import { Image, Breadcrumb, Header, Nav, Navbar, Loader } from "rsuite";

import ToImage from "#components/res/ToImage";

const HeaderMenu = () => {

	const location = useLocation();
	let crumbs = location.pathname.split('/');
	let prevPage = "";
	crumbs.shift();

	const navigate = useNavigate();

	// 로그인 시 저장해둔 사용자 직위를 가져오고, 관리자급 직위로만 다시 나누기
	const position = localStorage.getItem("e_position");  // 예: '관리자' 또는 '사원'
	const adminPositions = ["대리", "과장", "부장", "차장", "팀장", "이사", "관리"];

	const [myInfo, setMyInfo] = useState("");

	useEffect(() => {

		if (myInfo === "") {

			const fetchURL = AppConfig.fetch['mytest'];
			fetch(`${fetchURL.protocol}${fetchURL.url}/hrCard/hrCardDetail/${localStorage.getItem('e_id')}`, {
				method: "GET",
				mode: "cors",
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json'
				}
			})
				.then((res) => {

					if (res.ok) {

						let entity = res.json();
						entity.then(
							res => {

								localStorage.setItem('e_name', res.e_name);
								localStorage.setItem('e_position', res.e_position);
								setMyInfo(localStorage.getItem('e_name') + ' ' + localStorage.getItem('e_position') + '님');
								console.log("Promise 완료:", res);
							}
						);
					}
				})
				.finally(() => { // 통신실패시 예외처리

				});
		}
	}, [myInfo]);

	const handleLogout = () => {
		localStorage.clear();
		console.log("세션만료.");
		navigate("/", { replace: true });
	};

	if (crumbs.length > 0)
		prevPage = crumbs.shift();

	return (
		<Header>
			<Navbar style={{ fontSize: "large", backgroundColor: "#22284C" }}>
				<Nav>
					<Nav.Item style={{ padding: 0 }} icon={<ToImage style={{ margin: 0 }} src={brand} fbText="Logo" width={60} height={60} />} />
					<Nav.Menu title="관리운영">
						<Nav.Item onSelect={() => { navigate("basic_client") }}>거래처등록</Nav.Item>
						<Nav.Item onSelect={() => { navigate("basic_item") }}>상품등록</Nav.Item>
					</Nav.Menu>
					<Nav.Menu title="인사관리">
						<Nav.Item onSelect={() => { navigate("hr_emp_card") }}>인사카드관리</Nav.Item>
						<Nav.Item onSelect={() => { navigate("hr_appointment") }}>거래처등록</Nav.Item>
						<Nav.Item onSelect={() => { navigate("hr_department") }}>상품등록</Nav.Item>
						<Nav.Item onSelect={() => { navigate("hr-retirement") }}>퇴직관리</Nav.Item>
					</Nav.Menu>
					{adminPositions.includes(position?.trim()) ? (
					// === : 값과 타입 모두 비교. position이 문자열일 때 .trim()을 적용
					<Nav.Menu title="근태관리">
						<Nav.Item onSelect={() => navigate("att-regVacaItems")}>휴가항목등록</Nav.Item>
						<Nav.Item onSelect={() => navigate("att-regAttItems")}>근태항목등록</Nav.Item>
						<Nav.Item onSelect={() => navigate("att-management")}>근태관리</Nav.Item>
						<Nav.Item onSelect={() => navigate("att-schedule")}>일정관리</Nav.Item>
					</Nav.Menu>
					) : (
						<Nav.Menu title="근태관리">
							<Nav.Item onSelect={() => navigate("att-management")}>근태관리</Nav.Item>
						</Nav.Menu>
					)}
					<Nav.Menu title="구매관리">
						<Nav.Item onSelect={() => { navigate("buy-select") }}>구매조회</Nav.Item>
						<Nav.Item onSelect={() => { navigate("buy-insert") }}>구매입력</Nav.Item>
						<Nav.Item onSelect={() => { navigate("buy-status-select") }}>구매현황</Nav.Item>
						<Nav.Item onSelect={() => { navigate("buy-stock-status") }}>입고현황</Nav.Item>
					</Nav.Menu>
					<Nav.Menu title="판매관리">
						<Nav.Item onSelect={() => { navigate("sell_search_item") }}>판매물품 검색</Nav.Item>
						<Nav.Item onSelect={() => { navigate("sell_all_list") }}>판매조회</Nav.Item>
						<Nav.Item onSelect={() => { navigate("sell_insert") }}>판매입력</Nav.Item>
						<Nav.Item onSelect={() => { navigate("sell_status_select") }}>판매현황</Nav.Item>
						<Nav.Item onSelect={() => { navigate("sell_request_client_list") }}>거래처 관리</Nav.Item>
					</Nav.Menu>
					<Nav.Menu
						title="물류"
					>
						<Nav.Item onSelect={() => { navigate("logis-income-list") }}>입고관리</Nav.Item>
						<Nav.Item onSelect={() => { navigate("logis-outgoing-list") }}>출고관리</Nav.Item>
						<Nav.Item onSelect={() => { navigate("logis-stock") }}>재고관리</Nav.Item>
						<Nav.Item onSelect={() => { navigate("logis-warehouse") }}>창고관리</Nav.Item>
					</Nav.Menu>
					<Nav.Menu
						title="회계"
					>
						<Nav.Item onSelect={() => { navigate("finance_main") }}>회계메인</Nav.Item>
						<Nav.Item onSelect={() => { navigate("finance_sales_resume") }}>매출매입거래</Nav.Item>
						<Nav.Item onSelect={() => { navigate("finance_invoice") }}>전자계산서</Nav.Item>
						<Nav.Item onSelect={() => { navigate("finance_voucher") }}>전표관리</Nav.Item>
					</Nav.Menu>
					<Nav.Menu noCaret title="1:1 채팅" onSelect={() => { navigate("buy-chat") }} />
				</Nav>
				<Nav pullRight>
					<Nav.Item style={{ fontSize: "large" }}>{myInfo !== "" ? myInfo : <Loader />}</Nav.Item>
					{myInfo != "" ? <Nav.Item icon={<ToImage src={logout} width={32} height={32} />} onSelect={handleLogout}>로그아웃</Nav.Item> : null}
					{/*<Nav.Item icon={<ToImage src={settingIcon} width={20} height={20} />}>설정</Nav.Item>*/}
				</Nav>
			</Navbar>

			<Breadcrumb style={{ margin: 8 }} separator={arrow ? <Image width={12} height={12} src={arrow} /> : ">"}>
				<Breadcrumb.Item href="/main" ><ToImage src={mainIcon} fbtext="Main" width={16} height={16} /></Breadcrumb.Item>
				{crumbs[0] != null && crumbs[0].length > 0 ? crumbs.map((value, index) =>
					<Breadcrumb.Item key={index} href={value}>{value}</Breadcrumb.Item>
				) : null}
			</Breadcrumb>
		</Header>
	);
};

export default HeaderMenu;
