import React from 'react';
import { Dropdown } from 'rsuite';
import PropTypes from 'prop-types';

export default function HrDropdown({ title, items, onSelect, style = {} }) {
  return (
    <Dropdown
      title={title}
      onSelect={onSelect}
      style={{ width: '100%', ...style }}           // 버튼 영역 너비 조절
      menuStyle={{ minWidth: 200 }}                 // 펼쳐지는 메뉴 너비 조절
    >
      {items.map((item, idx) => (
        <Dropdown.Item key={idx} eventKey={item}>
          {item}
        </Dropdown.Item>
      ))}
    </Dropdown>
  );
}

HrDropdown.propTypes = {                // value props를 사용하고 있는데 어떤 타입인지 명시해주지 않으면 
  title: PropTypes.string,              // 경고가 뜰 수 있기 때문에 PropTypes 선언
  items: PropTypes.array.isRequired,
  onSelect: PropTypes.func.isRequired,
  style: PropTypes.object
};
