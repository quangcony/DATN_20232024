import React, { useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import AddUser from './AddUser';

const Header = ({ category, title }) => {
  const [mutationAddUserModal, setMutationAddUserModal] = useState(false)

  const handleClick = () => {
    setMutationAddUserModal(true)
  }

  return (
  <div className=" mb-10 flex flex-row items-center justify-between">
    <div>

      <p className="text-lg text-gray-400">{category}</p>
      <p className="text-3xl font-extrabold tracking-tight text-slate-900">
        {title}
      </p>
    </div>
    <Button onClick={handleClick} type="primary" style={{backgroundColor: 'green'}} icon={<PlusOutlined />} size="large">
        Add
    </Button>
    {
      mutationAddUserModal && <AddUser visible={mutationAddUserModal} setVisible={setMutationAddUserModal} onCreate={""}/>
    }
  </div>
  )
};

export default Header;
