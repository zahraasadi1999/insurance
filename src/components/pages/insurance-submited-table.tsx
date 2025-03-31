import React, { useEffect, useState } from "react";
import { Table, Input, Button, Space } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { fetch_submitted_form } from "../../apis/global-api";

interface InsuranceRecord {
  id: string;
  "Full Name": string;
  Age: number;
  Gender: string;
  "Insurance Type": string;
  City: string;
}

interface InsuranceData {
  columns: any;
  data: any;
}

const InsuranceTable: React.FC<{ insuranceData: InsuranceData }> = ({
  insuranceData,
}) => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [searchText, setSearchText] = useState("");
  const [filteredData, setFilteredData] = useState<InsuranceRecord[]>(
    insuranceData.data
  );

  useEffect(() => {
    setFilteredData(insuranceData.data);
  }, [insuranceData.data]);

  const handleSearch = (value: string) => {
    setSearchText(value);
    if (value === "") {
      setFilteredData(insuranceData.data);
    } else {
      const filtered = insuranceData.data.filter(
        (record: { [s: string]: unknown } | ArrayLike<unknown>) =>
          Object.values(record).some(
            (val) =>
              val && val.toString().toLowerCase().includes(value.toLowerCase())
          )
      );
      setFilteredData(filtered);
    }
  };

  const getColumnSearchProps = (dataIndex: keyof InsuranceRecord) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }: any) => (
      <div style={{ padding: 8 }}>
        <Input
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => confirm()}
          style={{ marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => confirm()}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}>
            Search
          </Button>
          <Button
            onClick={() => clearFilters()}
            size="small"
            style={{ width: 90 }}>
            Reset
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered: boolean) => (
      <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
    ),
    onFilter: (value: string, record: InsuranceRecord) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
  });

  const columns: any = [
    {
      title: "Full Name",
      dataIndex: "Full Name",
      key: "Full Name",
      sorter: (a: any, b: any) => a["Full Name"].localeCompare(b["Full Name"]),
      ...getColumnSearchProps("Full Name"),
    },
    {
      title: "Age",
      dataIndex: "Age",
      key: "Age",
      sorter: (a: any, b: any) => a.Age - b.Age,
    },
    {
      title: "Gender",
      dataIndex: "Gender",
      key: "Gender",
      filters: [
        { text: "Male", value: "Male" },
        { text: "Female", value: "Female" },
      ],
      onFilter: (value: any, record: any) => record.Gender === value,
      sorter: (a: any, b: any) => a.Gender.localeCompare(b.Gender),
    },
    {
      title: "Insurance Type",
      dataIndex: "Insurance Type",
      key: "Insurance Type",
      filters: [
        { text: "Health", value: "Health" },
        { text: "Home", value: "Home" },
        { text: "Car", value: "Car" },
      ],
      onFilter: (value: any, record: any) => record["Insurance Type"] === value,
      sorter: (a: any, b: any) =>
        a["Insurance Type"].localeCompare(b["Insurance Type"]),
    },
    {
      title: "City",
      dataIndex: "City",
      key: "City",
      sorter: (a: any, b: any) => a.City.localeCompare(b.City),
      ...getColumnSearchProps("City"),
    },
  ];

  const rowSelection = {
    selectedRowKeys,
    onChange: (keys: React.Key[]) => setSelectedRowKeys(keys),
    selections: [
      Table.SELECTION_ALL,
      Table.SELECTION_INVERT,
      Table.SELECTION_NONE,
    ],
  };

  return (
    <Table
      columns={columns}
      dataSource={filteredData}
      rowKey="id"
      rowSelection={rowSelection}
      bordered
      pagination={{ pageSize: 10, showSizeChanger: true }}
      style={{ margin: "20px 0" }}
      title={() => (
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <h3>Insurance Applications</h3>
          <Input.Search
            placeholder="Search all columns"
            allowClear
            enterButton
            style={{ width: 300 }}
            value={searchText}
            onChange={(e) => handleSearch(e.target.value)}
            onSearch={handleSearch}
          />
        </div>
      )}
    />
  );
};

const InsuranceSubmittedTable: React.FC = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    fetch_submitted_form({ dispatch });
  }, [dispatch]);

  const insuranceData = useAppSelector((state) => state.insurance.submitted);

  return (
    <div style={{ padding: "24px" }}>
      <h2>Insurance Applications</h2>

      {insuranceData && insuranceData.data ? (
        <InsuranceTable insuranceData={insuranceData} />
      ) : (
        <div>Loading insurance data...</div>
      )}
    </div>
  );
};

export default InsuranceSubmittedTable;
