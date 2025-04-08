// import React, { useRef, useState, useEffect } from "react";
// import {
//   SearchOutlined,
//   CloudUploadOutlined,
//   PlusOutlined,
//   CheckCircleOutlined,
//   CloseCircleOutlined,
//   EyeOutlined,
//   EditOutlined,
//   DeleteOutlined,
// } from "@ant-design/icons";
// import type { InputRef, TableColumnsType, TableColumnType } from "antd";
// import { Button, Input, Space, Table, Col, Card, Popconfirm } from "antd";
// import type { FilterDropdownProps } from "antd/es/table/interface";
// import Highlighter from "react-highlight-words";
// import { useFetchData } from "../../../hooks";
// import { UpdateCustomer, CustomerDetail } from "../model";

// interface Customer {
//   companyName: string;
//   contactPerson: string;
//   mobileNumber: string;
//   email: string;
//   remark: string;
//   prime: boolean;
//   blacklisted: boolean;
//   // add other fields if needed
// }

// interface CustomerRow {
//   key: string;
//   companyName: string;
//   contactPerson: string;
//   mobileNumber: string;
//   email: string;
//   remark: string;
//   status: string;
// }

// type DataIndex = keyof CustomerRow;

// const getColumnSearchProps = (
//   dataIndex: DataIndex,
//   searchText: string,
//   setSearchText: (text: string) => void,
//   searchedColumn: string,
//   setSearchedColumn: (col: string) => void,
//   searchInput: React.RefObject<InputRef | null>

// ): TableColumnType<CustomerRow> => ({
//   filterDropdown: ({
//     setSelectedKeys,
//     selectedKeys,
//     confirm,
//     clearFilters,
//     close,
//   }: FilterDropdownProps) => (
//     <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
//       <Input
//         ref={searchInput}
//         placeholder={`Search ${dataIndex}`}
//         value={selectedKeys[0]}
//         onChange={(e) =>
//           setSelectedKeys(e.target.value ? [e.target.value] : [])
//         }
//         onPressEnter={() => {
//           confirm();
//           setSearchText(selectedKeys[0] as string);
//           setSearchedColumn(dataIndex);
//         }}
//         style={{ marginBottom: 8, display: "block" }}
//       />
//       <Space>
//         <Button
//           type="primary"
//           onClick={() => {
//             confirm();
//             setSearchText(selectedKeys[0] as string);
//             setSearchedColumn(dataIndex);
//           }}
//           icon={<SearchOutlined />}
//           size="small"
//           style={{ width: 90 }}
//         >
//           Search
//         </Button>
//         <Button
//           onClick={() => {
//             clearFilters && clearFilters();
//             setSearchText("");
//           }}
//           size="small"
//           style={{ width: 90 }}
//         >
//           Reset
//         </Button>
//         <Button
//           type="link"
//           size="small"
//           onClick={() => {
//             confirm({ closeDropdown: false });
//             setSearchText(selectedKeys[0] as string);
//             setSearchedColumn(dataIndex);
//           }}
//         >
//           Filter
//         </Button>
//         <Button type="link" size="small" onClick={() => close()}>
//           Close
//         </Button>
//       </Space>
//     </div>
//   ),
//   filterIcon: (filtered: boolean) => (
//     <SearchOutlined style={{ color: filtered ? "#1677ff" : undefined }} />
//   ),
//   onFilter: (value, record) =>
//     record[dataIndex]
//       .toString()
//       .toLowerCase()
//       .includes((value as string).toLowerCase()),
//   filterDropdownProps: {
//     onOpenChange(open) {
//       if (open) {
//         setTimeout(() => searchInput.current?.select(), 100);
//       }
//     },
//   },
//   render: (text) =>
//     searchedColumn === dataIndex ? (
//       <Highlighter
//         highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
//         searchWords={[searchText]}
//         autoEscape
//         textToHighlight={text ? text.toString() : ""}
//       />
//     ) : (
//       text
//     ),
// });

// export const CustomerList: React.FC = () => {
//   // Fetch customer data from your mocks file
//   const { data: customersData } = useFetchData("../mocks/CustomerData.json");

//   // Local state for search
//   const [searchText, setSearchText] = useState("");
//   const [searchedColumn, setSearchedColumn] = useState("");
//   const searchInput = useRef<InputRef>(null);

//   // Map the raw fetched data to table rows
//   const [tableData, setTableData] = useState<CustomerRow[]>([]);

//   useEffect(() => {
//     if (customersData && Array.isArray(customersData)) {
//       const rows = customersData.map((item: any, index: number) => {
//         const customer: Customer = item.CustomerData.customer;
//         // Determine status based on prime and blacklisted values.
//         let status = "None";
//         if (customer.prime) {
//           status = "Prime";
//         } else if (customer.blacklisted) {
//           status = "Blacklisted";
//         }
//         return {
//           key: index.toString(),
//           companyName: customer.companyName,
//           contactPerson: customer.contactPerson,
//           mobileNumber: customer.mobileNumber,
//           email: customer.email,
//           remark: customer.remark,
//           status,
//         };
//       });
//       setTableData(rows);
//     }
//   }, [customersData]);

//   const columns: TableColumnsType<CustomerRow> = [
//     {
//       title: "Company Name",
//       dataIndex: "companyName",
//       key: "companyName",
//       ...getColumnSearchProps(
//         "companyName",
//         searchText,
//         setSearchText,
//         searchedColumn,
//         setSearchedColumn,
//         searchInput
//       ),
//     },
//     {
//       title: "Contact Person",
//       dataIndex: "contactPerson",
//       key: "contactPerson",
//       ...getColumnSearchProps(
//         "contactPerson",
//         searchText,
//         setSearchText,
//         searchedColumn,
//         setSearchedColumn,
//         searchInput
//       ),
//     },
//     {
//       title: "Mobile Number",
//       dataIndex: "mobileNumber",
//       key: "mobileNumber",
//       ...getColumnSearchProps(
//         "mobileNumber",
//         searchText,
//         setSearchText,
//         searchedColumn,
//         setSearchedColumn,
//         searchInput
//       ),
//     },
//     {
//       title: "Status",
//       dataIndex: "status",
//       key: "status",
//       render: (text: string) => {
//         let icon = null;
//         if (text === "Prime") {
//           icon = (
//             <CheckCircleOutlined style={{ color: "green", marginRight: 4 }} />
//           );
//         } else if (text === "Blacklisted") {
//           icon = (
//             <CloseCircleOutlined style={{ color: "red", marginRight: 4 }} />
//           );
//         }
//         return (
//           <span>
//             {icon}
//             {text}
//           </span>
//         );
//       },
//       ...getColumnSearchProps(
//         "status",
//         searchText,
//         setSearchText,
//         searchedColumn,
//         setSearchedColumn,
//         searchInput
//       ),
//     },
//     {
//       title: "Action",
//       key: "action",
//       render: (_, record) => (
//         <Space size="middle">
//           <CustomerDetail id={record.key} />
//           {/* <Button
//             // type="link"
//             color="primary"
//             variant="outlined"
//             icon={<EyeOutlined />}
//             onClick={() => alert(`View Customer ID: ${record.key}`)}
//           >
//             View
//           </Button> */}
//           {/* <Button
//             color="gold"
//             variant="outlined"
//             icon={<EditOutlined />}
//             onClick={() => alert(`Edit Customer ID: ${record.key}`)}
//           >
//             Edit
//           </Button> */}
//           <UpdateCustomer id={record.key} />
//           <Popconfirm
//             title="Delete the task"
//             description={`Are you sure to delete  ${record.companyName}?`}
//             okText="Yes"
//             cancelText="No"
//             onConfirm={() => alert(`Delete Customer ID: ${record.key}`)}
//           >
//             <Button
//               color="danger"
//               variant="outlined"
//               icon={<DeleteOutlined />}
//               // onClick={() => alert(`Delete Customer ID: ${record.key}`)}
//             >
//               Delete
//             </Button>
//           </Popconfirm>
//         </Space>
//       ),
//     },
//   ];

//   return (
//     <>
//       <Col span={24}>
//         <Card
//           title="Customer List"
//           extra={
//             <Space>
//               <Button icon={<CloudUploadOutlined />}>Import</Button>
//               <Button icon={<PlusOutlined />}>New Customer</Button>
//             </Space>
//           }
//         >
//           <Table<CustomerRow> columns={columns} dataSource={tableData} />
//         </Card>
//       </Col>
//     </>
//   );
// };

import React, { useRef, useState, useEffect } from "react";
import {
  SearchOutlined,
  CloudUploadOutlined,
  PlusOutlined,
  EyeOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  DeleteOutlined,
  EditOutlined,
} from "@ant-design/icons";
import type { InputRef, TableColumnsType, TableColumnType } from "antd";
import {
  Button,
  AutoComplete,
  Space,
  Table,
  Col,
  Card,
  Popconfirm,
} from "antd";
import type { FilterDropdownProps } from "antd/es/table/interface";
import Highlighter from "react-highlight-words";
import { useFetchData } from "../../../hooks";
import { CustomerDetailModal, UpdateCustomerModel } from "../model";

interface Customer {
  adminId: string;
  companyName: string;
  contactPerson: string;
  mobileNumber: string;
  email: string;
  tallySerialNo: string;
  prime: boolean;
  blacklisted: boolean;
  remark: string;
  PartnerReferenceDetail?: {
    referenceId: string;
    Name: string;
    Contact: string;
    Company: string;
    email: string;
    adress: {
      street: string;
      city: string;
      state: string;
    };
    partnerType: string[];
    tallySerialNo: string;
    status: string;
    remark: string;
  };
}

interface CustomerRow {
  key: string;
  companyName: string;
  contactPerson: string;
  mobileNumber: string;
  email: string;
  tallySerialNo: string;
  remark: string;
  prime: boolean;
  blacklisted: boolean;
  status: string;
}

type DataIndex = keyof Pick<
  CustomerRow,
  | "companyName"
  | "contactPerson"
  | "mobileNumber"
  | "email"
  | "remark"
  | "status"
>;

const getColumnSearchProps = (
  dataIndex: DataIndex,
  searchText: string,
  setSearchText: (text: string) => void,
  searchedColumn: string,
  setSearchedColumn: (col: string) => void,
  searchInput: React.RefObject<InputRef | null>
,
  suggestions: { value: string }[]
): TableColumnType<CustomerRow> => ({
  filterDropdown: ({
    setSelectedKeys,
    selectedKeys,
    confirm,
    clearFilters,
    close,
  }: FilterDropdownProps) => (
    <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
      <AutoComplete
        ref={searchInput}
        placeholder={`Search ${dataIndex}`}
        value={selectedKeys[0]}
        options={suggestions}
        onChange={(value) => setSelectedKeys(value ? [value] : [])}
        onPressEnter={() => {
          confirm();
          setSearchText(selectedKeys[0] as string);
          setSearchedColumn(dataIndex);
        }}
        style={{ marginBottom: 8, display: "block" }}
      />
      <Space>
        <Button
          type="primary"
          onClick={() => {
            confirm();
            setSearchText(selectedKeys[0] as string);
            setSearchedColumn(dataIndex);
          }}
          icon={<SearchOutlined />}
          size="small"
          style={{ width: 90 }}
        >
          Search
        </Button>
        <Button
          onClick={() => {
            clearFilters && clearFilters();
            setSearchText("");
          }}
          size="small"
          style={{ width: 90 }}
        >
          Reset
        </Button>
        <Button
          type="link"
          size="small"
          onClick={() => {
            confirm({ closeDropdown: false });
            setSearchText(selectedKeys[0] as string);
            setSearchedColumn(dataIndex);
          }}
        >
          Filter
        </Button>
        <Button type="link" size="small" onClick={() => close()}>
          Close
        </Button>
      </Space>
    </div>
  ),
  filterIcon: (filtered: boolean) => (
    <SearchOutlined style={{ color: filtered ? "#1677ff" : undefined }} />
  ),
  onFilter: (value, record) =>
    record[dataIndex]
      .toString()
      .toLowerCase()
      .includes((value as string).toLowerCase()),
  filterDropdownProps: {
    onOpenChange(open) {
      if (open) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
  },
  render: (text) =>
    searchedColumn === dataIndex ? (
      <Highlighter
        highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
        searchWords={[searchText]}
        autoEscape
        textToHighlight={text ? text.toString() : ""}
      />
    ) : (
      text
    ),
});

export const CustomerList: React.FC = () => {
  const { data: customersData } = useFetchData("../mocks/CustomerData.json");

  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef<InputRef>(null); 
  

  const [tableData, setTableData] = useState<CustomerRow[]>([]);
  const [viewCustomer, setViewCustomer] = useState<CustomerRow | null>(null);
  const [updateCustomer, setUpdateCustomer] = useState<CustomerRow | null>(null);

  useEffect(() => {
    if (customersData && Array.isArray(customersData)) {
      const rows = customersData.map((item: any, index: number) => {
        const customer: Customer = item.CustomerData.customer;
        return {
          key: index.toString(),
          companyName: customer.companyName,
          contactPerson: customer.contactPerson,
          mobileNumber: customer.mobileNumber,
          email: customer.email,
          tallySerialNo: customer.tallySerialNo,
          remark: customer.remark,
          prime: customer.prime,
          blacklisted: customer.blacklisted,
          status: customer.prime
            ? "Prime"
            : customer.blacklisted
            ? "Blacklisted"
            : "-",
        };
      });
      setTableData(rows);
    }
  }, [customersData]);

  const getSuggestions = (dataIndex: DataIndex): { value: string }[] => {
    const uniqueValues = Array.from(
      new Set(tableData.map((item) => item[dataIndex]?.toString()))
    );
    return uniqueValues.map((val) => ({ value: val }));
  };

  const columns: TableColumnsType<CustomerRow> = [
    {
      title: "Company Name",
      dataIndex: "companyName",
      key: "companyName",
      ...getColumnSearchProps(
        "companyName",
        searchText,
        setSearchText,
        searchedColumn,
        setSearchedColumn,
        searchInput,
        getSuggestions("companyName")
      ),
    },
    {
      title: "Contact Person",
      dataIndex: "contactPerson",
      key: "contactPerson",
      ...getColumnSearchProps(
        "contactPerson",
        searchText,
        setSearchText,
        searchedColumn,
        setSearchedColumn,
        searchInput,
        getSuggestions("contactPerson")
      ),
    },
    {
      title: "Mobile Number",
      dataIndex: "mobileNumber",
      key: "mobileNumber",
      ...getColumnSearchProps(
        "mobileNumber",
        searchText,
        setSearchText,
        searchedColumn,
        setSearchedColumn,
        searchInput,
        getSuggestions("mobileNumber")
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (text: string) => {
        let icon = null;
        if (text === "Prime") {
          icon = (
            <CheckCircleOutlined style={{ color: "green", marginRight: 4 }} />
          );
        } else if (text === "Blacklisted") {
          icon = (
            <CloseCircleOutlined style={{ color: "red", marginRight: 4 }} />
          );
        }
        return (
          <span>
            {icon}
            {text}
          </span>
        );
      },
      ...getColumnSearchProps(
        "status",
        searchText,
        setSearchText,
        searchedColumn,
        setSearchedColumn,
        searchInput,
        getSuggestions("status")
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <div onClick={(e) => e.stopPropagation()}>
          <Space size="middle">
            <Button
              color="geekblue"
              variant="outlined"
              icon={<EyeOutlined />}
              onClick={() => setViewCustomer(record)}
            >
              View
            </Button>
            <Button
            color="gold"
              variant="outlined"
              icon={<EditOutlined />}
              onClick={() => setUpdateCustomer(record)}
            >
              Edit
            </Button>
            <Popconfirm
              title="Delete the task"
              description={`Are you sure to delete ${record.companyName}?`}
              okText="Yes"
              cancelText="No"
            >
              <Button color="volcano"
              variant="outlined"
              icon={<DeleteOutlined />}>Delete</Button>
            </Popconfirm>
          </Space>
        </div>
      ),
    },
  ];

  return (
    <>
      <style>
        {`
          .prime-row {
            background-color: #d4f7d4 !important;
            color: #000000 !important;
          }
          .blacklisted-row {
            background-color: #f7d4d4 !important;
            color: #000000 !important;
          }
          .ant-table-tbody > tr {
            cursor: pointer;
          }
        `}
      </style>
      <Col span={24}>
        <Card
          title="Customer List"
          extra={
            <Space>
              <Button icon={<CloudUploadOutlined />}>Import</Button>
              <Button icon={<PlusOutlined />}>New Customer</Button>
            </Space>
          }
        >
          <Table<CustomerRow>
            columns={columns}
            dataSource={tableData}
            onRow={(record) => ({
              onClick: () => setViewCustomer(record),
            })}
            rowClassName={(record) => {
              if (record.status === "Prime") return "prime-row";
              if (record.status === "Blacklisted") return "blacklisted-row";
              return "";
            }}
            scroll={{ x: true }}
          />
        </Card>
      </Col>
      {viewCustomer && (
        <CustomerDetailModal
          customer={viewCustomer}
          onClose={() => setViewCustomer(null)}
        />
      )}
      {updateCustomer && (
        <UpdateCustomerModel
          customer={updateCustomer}
          open={true}
          onClose={() => setUpdateCustomer(null)}
        />
      )}
    </>
  );
};
