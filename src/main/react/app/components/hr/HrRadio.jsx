import React from 'react';
import { Radio, RadioGroup } from 'rsuite';

export default function HrRadio({ value, onChange, options = [] }) {        // value props를 사용하고 있는데 어떤 타입인지 명시해주지 않으면 
  return (                                                                  // 경고가 뜰 수 있지만 에러는 아님 PropTypes 선언해주면 에러 사라짐
    <RadioGroup name="entry-radio" inline value={value} onChange={onChange}>
      {options.map((opt, idx) => (
        <Radio key={idx} value={opt}>{opt}</Radio>
      ))}
    </RadioGroup>
  );
}