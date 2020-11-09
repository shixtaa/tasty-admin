import React from 'react';
/* antd */
import { DatePicker, Space } from 'antd';

const { RangePicker } = DatePicker;
export default function Order () {
  return (
    <div>
      <Space direction="vertical" size={ 20 }>
        <RangePicker style={{ width :'800px' }}/>
      </Space>
    </div>
  );
}
