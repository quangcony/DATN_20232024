import React, { useEffect, useState } from "react";
import { Select, Space } from "antd";
import axiosClient from "../api/axiosClient";

const Coordinate = ({ handleChange }) => {
  const [proviceName, setProviceName] = useState("");

  const [provinceData, setProviceData] = useState([]);
  const [districtData, setDistrictData] = useState([]);

  const [selectedDistrict, setSelectedDistrict] = useState("");

  useEffect(() => {
    const fetchProvices = async () => {
      const res = await axiosClient.get("https://provinces.open-api.vn/api/");
      if (res) {
        const provices = res.map((a) => ({
          value: a.code,
          label: a.name,
        }));

        setProviceData(provices);
      }
    };
    fetchProvices();
  }, []);

  const handleProvinceChange = async (value) => {
    if(value) {
      console.log("value::", value)
      try {
        const res = await axiosClient.get(
          `https://provinces.open-api.vn/api/p/${value}?depth=2`
        );
        if (res) {
          // const data = res.find((c) => c.name === value);
          const districts = res.districts.map((a) => ({
            value: a.code,
            label: a.name,
          }));
  
          setDistrictData(districts);
          setProviceName(value);
          setSelectedDistrict("");
        }
      } catch (error) {}
    }
  };
  const onDistrictChange = (value) => {
    setSelectedDistrict(value);
    const loc = value + ", " + proviceName;

    handleChange(loc);
  };
  return (
    <Space wrap>
      <Select
        showSearch
        style={{
          width: 180,
        }}
        placeholder={"Chọn Tỉnh/TP"}
        onChange={handleProvinceChange}
        options={provinceData}
      />
      <Select
        showSearch
        style={{
          width: 150,
        }}
        value={selectedDistrict}
        placeholder={"Chọn Quận/Huyện"}
        onChange={onDistrictChange}
        options={districtData}
      />
    </Space>
  );
};

export default Coordinate;
