import React from 'react';
import { Checkbox, CheckboxGroup } from 'rsuite';
import PropTypes from 'prop-types';

export default function HrCheckboxGroup({ data, selected, onChange }) {
  const allChecked = (selected || []).length === data.length;
  const partiallyChecked = (selected || []).length > 0 && selected.length < data.length;

  const handleCheckAll = (value, checked) => {
    onChange(checked ? data.map(item => item.e_id) : []);
  };

  return (
    <div>
      <Checkbox
        indeterminate={partiallyChecked}
        checked={allChecked}
        onChange={(checked) => handleCheckAll(null, checked)}
      >
        전체 선택
      </Checkbox>

      <CheckboxGroup
        name="checkboxList"
        value={selected}
        onChange={onChange}
        style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '6px' }}
      >
        {data.map((item) => (
          <Checkbox key={item.e_id} value={item.e_id}>
            {item.e_name} ({item.e_position})
          </Checkbox>
        ))}
      </CheckboxGroup>
    </div>
  );
}

HrCheckboxGroup.propTypes = {
  data: PropTypes.array.isRequired,
  selected: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired,
};
