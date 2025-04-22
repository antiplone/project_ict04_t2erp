// components/common/ExcelDownloadButton.jsx

import React from 'react';
import { Button } from 'rsuite';
import SaveIcon from '@rsuite/icons/legacy/Save';
import Appconfig from "#config/AppConfig.json";

const ExcelDownloadButton = ({
	apiPath,
	params = {},
	label = "엑셀 다운로드",
	...buttonProps
}) => {
	const fetchURL = Appconfig.fetch['mytest']
	const handleDownload = () => {
		console.log("Download button clicked");  // 버튼 클릭 확인용 로그 추가

		const cleanedParams = Object.fromEntries(
			Object.entries(params)
				.map(([key, value]) => {
					if (
						key.toLowerCase().includes("date") &&
						value &&
						Array.isArray(value) &&
						value.length === 2
					) {
						// 날짜는 별도 처리
						return [
							["start_date", value[0].toLocaleDateString("sv-SE")],
							["end_date", value[1].toLocaleDateString("sv-SE")],
						];
					}
					// 그 외 값은 null이면 빈 문자열 처리
					return [[key, value === null ? '' : value]];
				})
				.flat()
			// null / 빈 값 필터링은 선택사항 (서버에서 빈 문자열도 허용되면 생략 가능)
			// .filter(([_, v]) => v !== null && v !== "")
		);

		const query = new URLSearchParams(cleanedParams).toString();
		console.log("Query:", query);  // 쿼리 확인

		const fullUrl = `${fetchURL.protocol}${fetchURL.url}${apiPath}?${query}`;
		console.log("Full URL:", fullUrl);  // 최종 URL 확인

		window.open(fullUrl, "_blank");
	};

	return (
		<Button appearance="ghost" color="green" onClick={handleDownload} {...buttonProps}>
			<SaveIcon style={{ marginRight: 6 }} />
			{label}
		</Button>
	);
};

export default ExcelDownloadButton;