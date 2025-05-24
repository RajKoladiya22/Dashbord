import React, { useState, useEffect, useRef } from "react";
import {
  SearchOutlined,
  ProductOutlined,
  DeleteOutlined,
  EditOutlined,
  // CheckCircleOutlined,
  InfoCircleOutlined,
  PlusOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import type { TableColumnsType } from "antd";
import {
  Button,
  Space,
  Table,
  Col,
  Card,
  Popconfirm,
  message,
  Switch,
  Input,
  Tooltip,
  Typography,
  Upload,
} from "antd";

import { useAppDispatch } from "../../../hooks";
import {
  CustomerDetailModal,
  ProductDetailModal,
  UpdateCustomerModel,
} from "../model";
import {
  deleteCustomer,
  listCustomers,
  toggleCustomerStatus,
} from "../../../redux/slice/customer/addcustomerSlice";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import AutoDismissAlert from "../../Alert";
import { Customer } from "../../../types/customer.type";
import { Link } from "react-router-dom";
const { Text } = Typography;

export const CustomerList: React.FC = () => {
  const dispatch = useAppDispatch();
  const { customers, meta, loading, error } = useSelector(
    (state: RootState) => state.customer
  );
  console.log("customers----->", customers);
  console.log("meta----->", meta);
  console.log("loading----->", loading);
  console.log("error----->", error);
  

  const customersData = customers;

  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [q, setQ] = useState<string>("");
  const [status, setStatus] = useState<boolean>(true);
  // const [sortBy, setSortBy] = useState<string>("companyName");
  // const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const [tableData, setTableData] = useState<Customer[]>([]);
  const [viewCustomer, setViewCustomer] = useState<Customer | null>(null);
  const [viewProducts, setViewProducts] = useState<Customer | null>(null);
  const [updateCustomer, setUpdateCustomer] = useState<Customer | null>(null);

  // debounce search
  const searchRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    clearTimeout(searchRef.current);
    searchRef.current = setTimeout(() => setQ(val.trim()), 300);
  };

  useEffect(() => {
    if (customersData && Array.isArray(customersData)) {
      const rows = customersData.map((customer: any, index: number) => {
        index++;

        return {
          key: index.toString(),
          // Add adminId so the type matches CustomerData requirements.
          id: customer.id,
          adminId: customer.adminId,
          companyName: customer.companyName,
          contactPerson: customer.contactPerson,
          mobileNumber: customer.mobileNumber,
          email: customer.email,
          serialNo: customer.serialNo,
          remark: customer.remark,
          prime: customer.prime,
          blacklisted: customer.blacklisted,
          address: customer.address,
          adminCustomFields: customer.adminCustomFields,
          joiningDate: customer.joiningDate,
          product: customer.product,
          partner: customer.partner,
          status: customer.status,
          hasReference: customer.hasReference,
          createdAt: customer.createdAt,
          updatedAt: customer.updatedAt,
        };
      });
      setTableData(rows);
    }
  }, [customersData]);

  // delete onli Inactive cutomer
  const handleDelete = (id: string) => {
    dispatch(deleteCustomer(id)).unwrap();
    message.success("Customer Deleted successfully");
  };

  const handleToggleStatus = (p: Customer) => {
    dispatch(toggleCustomerStatus({ id: p.id, status: !p.status })).unwrap();
    message.success("Customer Status Updated");
  };

  const columns: TableColumnsType<Customer> = [
    {
      title: "#",
      dataIndex: "number",
      render: (_, __, index) => (meta.page - 1) * meta.limit + index + 1,
    },
    {
      title: "Company Name",
      dataIndex: "companyName",
      key: "companyName",
    },
    {
      title: "Contact Person",
      dataIndex: "contactPerson",
      key: "contactPerson",
    },
    {
      title: "Mobile Number",
      dataIndex: "mobileNumber",
      key: "mobileNumber",
    },
    {
      title: "Seriol Number",
      dataIndex: "serialNo",
      key: "sserialNor",
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <div onClick={(e) => e.stopPropagation()}>
          <Space size="middle">
            {record.status ? (
              <>
                <Button
                  color="geekblue"
                  variant="outlined"
                  icon={<ProductOutlined />}
                  onClick={() => setViewProducts(record)}
                >
                  Products
                </Button>
                <Button
                  color="gold"
                  variant="outlined"
                  icon={<EditOutlined />}
                  onClick={() => setUpdateCustomer(record)}
                >
                  Edit
                </Button>
              </>
            ) : (
              ""
            )}

            <Popconfirm
              title={`Change status to ${record.status ? "Inactive" : "Active"
                }?`}
              // description={`Are you sure to Inactive ${record.companyName}?`}
              onConfirm={() => handleToggleStatus(record)}
              okText="Confirm"
              cancelText="Cancel"
            >
              <Button
                // icon={<DeleteOutlined />}
                // icon={record.status ? <DeleteOutlined /> : <CheckCircleOutlined />}
                // color="volcano"
                variant="outlined" //deleteCustomer
                danger={record.status}
                type="default"
              >
                {record.status ? "Inactive" : "Active"}
              </Button>
            </Popconfirm>
            {!record.status ? (
              <Popconfirm
                title="Delete the Customer"
                description={`Are you sure to delete ${record.companyName}?`}
                onConfirm={() => handleDelete(record.id)}
                okText="Yes"
                cancelText="No"
              >
                <Button
                  color="volcano"
                  variant="outlined"
                  icon={<DeleteOutlined />}
                >
                  Delete
                </Button>
              </Popconfirm>
            ) : (
              ""
            )}
          </Space>
        </div>
      ),
    },
  ];

  useEffect(() => {
    dispatch(listCustomers({ page, limit, q, status }));
  }, [dispatch, page, limit, q, status]);

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
          .ant-table-tbody > tr:hover td {
            background: rgba(0,0,0,0.02) !important;
          }
          .responsive-search {
            width: 100%;
            max-width: 400px;
            transition: all 0.3s;
          }  
        `}
      </style>
      <Col span={24}>
        <Card
          title="Customer Management"
          extra={
            <Space wrap style={{ width: "100%", justifyContent: "flex-end" }}>
              <Link to="/customer/addcustomer">
                <Button icon={<PlusOutlined />}>New Customer</Button>
              </Link>
              {/* <Form.Item label="Upload" valuePropName="fileList" getValueFromEvent={normFile}> */}
              <Upload action="/upload.do" listType="picture">
                <Button icon={<UploadOutlined />}>
                  CSV or XL File
                </Button>
              </Upload>
              {/* </Form.Item> */}
            </Space>
          }
          bordered={false}
        //  headStyle={{ borderBottom: '1px solid #f0f0f0' }}
        >
          <div className="filter-bar" style={{ marginBottom: 24 }}>
            <Space size="middle" wrap>
              <div className="status-filter">
                <Text strong style={{ marginRight: 8 }}>
                  Status:
                </Text>
                <Switch
                  checkedChildren="Active"
                  unCheckedChildren="Inactive"
                  checked={status}
                  onChange={setStatus}
                />
              </div>

              <Input
                placeholder="Search..."
                prefix={<SearchOutlined />}
                allowClear
                onChange={handleSearchChange}
                aria-label="Search..."
                // style={{ width: 200 }}
                className="responsive-search"
                suffix={
                  <Tooltip title="Search by name, seriol number, or phone">
                    <InfoCircleOutlined style={{ color: "rgba(0,0,0,0.45)" }} />
                  </Tooltip>
                }
              />
            </Space>
          </div>
          {error && (
            <AutoDismissAlert
              message="Error"
              description={error}
              type="error"
              showIcon
              style={{ marginBottom: 16 }}
              onClose={() => null}
              durationMs={10000} // 10 seconds
            />
          )}
          <Table<Customer>
            columns={columns}
            dataSource={tableData}
            rowKey="id"
            loading={loading}
            pagination={{
              current: meta.page,
              pageSize: meta.limit,
              total: meta.total,
              showSizeChanger: true,
              showTotal: (total) => `Total ${total} customers`,
              pageSizeOptions: ["10", "25", "50", "100"],
              responsive: true,
              onChange: (p, size) => {
                setPage(p);
                setLimit(size);
              },
            }}
            onRow={(record) => ({
              onClick: () => setViewCustomer(record),
            })}
            rowClassName={(record) => {
              if (record.prime) return "prime-row";
              if (record.blacklisted) return "blacklisted-row";
              return "";
            }}
            scroll={{ x: true }}
            sticky
          />
        </Card>
      </Col>
      {viewCustomer && (
        <CustomerDetailModal
          customer={viewCustomer}
          onClose={() => setViewCustomer(null)}
        />
      )}
      {viewProducts && (
        <ProductDetailModal
          customer={viewProducts}
          onClose={() => setViewProducts(null)}
        />
      )}
      {updateCustomer && (
        <UpdateCustomerModel
          customer={updateCustomer}
          open={true}
          onClose={() => setUpdateCustomer(null)}
          adminId={""}
          id={""}
        />
      )}
    </>
  );
};
