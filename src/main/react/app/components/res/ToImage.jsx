/* eslint-disable react/prop-types */
import React from "react";
import { Image, Placeholder } from "rsuite";

/**
 * 이미지를 불러옵니다. 불러오지못했을때는 fallback을 보여줍니다.
 * 
 * @param {*} src 이미지주소 또는 import된 이미지
 * @param {*} fbText 입력하면 텍스트를 보여주고 없으면, 크기를 보여줍니다.
 * @param {*} width 이미지의 넓이
 * @param {*} height 이미지의 높이
 * @param props rsuite의 기본Props를 사용하기위해서 넣었습니다.
 * 
 * @author YD.전
 */
const ToImage = ( props, ...{ fbText, width, height } ) => {

	let text = "";
	if (fbText != null)
		text = `text=${fbText}&`;
	const bgColor = "ffffff";
	const fontColor = "B99";

	const fallback = `https://placehold.co/${width}x${height}/${bgColor}/${fontColor}?${text}font=noto-sans.png`;

	return (
		<Image
			fallbackSrc={fallback}
			placeholder={<Placeholder.Graph active />}
			alt={fbText}
			{...props}
		/>
	);
};

export default ToImage;
