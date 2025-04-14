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

HrDropdown.propTypes = {
  title: PropTypes.string,
  items: PropTypes.array.isRequired,
  onSelect: PropTypes.func.isRequired,
  style: PropTypes.object
};
