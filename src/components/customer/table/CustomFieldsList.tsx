// CustomFieldsList.tsx
import React, { useEffect, useState, useRef } from "react";
import {
  Table,
  Card,
  Spin,
  Alert,
  Empty,
  Button,
  Space,
  message,
  Modal,
  Col,
} from "antd";
import type { TableColumnsType, 
  // InputRef 
} from "antd";
import {
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import { useAppDispatch } from "../../../hooks";
import { RootState } from "../../../redux/store";
import { useSelector } from "react-redux";
import {
  deleteAdminCustomField,
  fetchAdminCustomFields,
} from "../../../redux/slice/customer/customfieldSlice";
import {
  CustomFieldsModel,
  FieldDetailModal,
  UpdateFieldModel,
} from "../model";

// Define the interface for your custom field row.
export interface AdminCustomField {
  id: string;
  admin_id: string;
  field_name: string;
  field_type: string;
  is_required: boolean;
  options: string[];
  is_multi_select: boolean;
  created_at: string;
  updated_at: string;
}

type DataIndex = keyof AdminCustomField;

// State and functions to support column searching.
const getColumnSearchProps = (
  dataIndex: DataIndex,
  searchText: string,
  setSearchText: (text: string) => void,
  searchedColumn: string,
  setSearchedColumn: (col: string) => void,
  // searchInput: React.RefObject<InputRef | null>,
  searchInput: React.RefObject<HTMLInputElement | null>,
  suggestions: { value: string | null }[] | null
): TableColumnsType<AdminCustomField>[number] => ({
  filterDropdown: ({
    setSelectedKeys,
    selectedKeys,
    confirm,
    clearFilters,
    close,
  }) => (
    <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
      {/* You can use an input here directly if you don't want AutoComplete */}
      <input
      ref={searchInput}
        placeholder={`Search ${dataIndex}`}
        value={selectedKeys[0] as string}
        // options={suggestions}
        onChange={(e) =>
          setSelectedKeys(e.target.value ? [e.target.value] : [])
        }
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            confirm();
            setSearchText(selectedKeys[0] as string);
            setSearchedColumn(dataIndex);
          }
        }}
        
        style={{ marginBottom: 8, display: "block", width: "100%" }}
        // ref={searchInput as React.RefObject<HTMLInputElement>}
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
      ?.toString()
      .toLowerCase()
      .includes((value as string).toLowerCase()),
  render: (text: string) =>
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

export const CustomFieldsList: React.FC = () => {
  const dispatch = useAppDispatch();
  const { customFields, loading, error } = useSelector(
    (state: RootState) => state.customFields
  );
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  // const searchInput = useRef<InputRef | null>(null);
  const searchInput = useRef<HTMLInputElement | null>(null);

  // Local state for view/edit actions.
  const [viewField, setViewField] = useState<AdminCustomField | null>(null);
  const [updateField, setUpdateField] = useState<AdminCustomField | null>(null);

  const handleDelete = (record: AdminCustomField) => {
    Modal.confirm({
      title: "Are you sure you want to delete this field?",
      content: `Field Name: ${record.field_name}`,
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk: async () => {
        try {
          // Show a loading message while deleting.
          message.loading({ content: "Deleting...", key: "delete" });

          // Dispatch the delete action.
          await dispatch(deleteAdminCustomField(record.id)).unwrap();

          // Show success message.
          message.success({
            content: "Field deleted successfully!",
            key: "delete",
            duration: 2,
          });
        } catch (error: any) {
          // Show error message on failure.
          message.error({
            content: `Failed to delete field: ${error.message}`,
            key: "delete",
            duration: 2,
          });
        }
      },
    });
  };

  useEffect(() => {
    dispatch(fetchAdminCustomFields());
  }, [dispatch]);

  const getSuggestions = (dataIndex: DataIndex): { value: string }[] => {
    const uniqueValues = Array.from(
      new Set(customFields.map((item) => item[dataIndex]?.toString() || ""))
    );
    return uniqueValues.map((val) => ({ value: val }));
  };

  const columns: TableColumnsType<AdminCustomField> = [
    {
      title: "Field Name",
      dataIndex: "field_name",
      key: "field_name",
      ...getColumnSearchProps(
        "field_name",
        searchText,
        setSearchText,
        searchedColumn,
        setSearchedColumn,
        searchInput,
        getSuggestions("field_name")
      ),
    },
    {
      title: "Field Type",
      dataIndex: "field_type",
      key: "field_type",
    },
    {
      title: "Required",
      dataIndex: "is_required",
      key: "is_required",
      render: (val: boolean) => (val ? "Yes" : "No"),
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
              onClick={() => setViewField(record)}
            >
              View
            </Button>
            <Button
              color="gold"
              variant="outlined"
              icon={<EditOutlined />}
              onClick={() => setUpdateField(record)}
            >
              Edit
            </Button>
            <Button
              icon={<DeleteOutlined />}
              danger
              onClick={() => handleDelete(record)}
            >
              Delete
            </Button>
          </Space>
        </div>
      ),
    },
  ];
  const handleOpenModal = () => {
    setIsModalVisible(true);
  };

  const handleCancelModal = () => {
    setIsModalVisible(false);
  };

  const handleSubmitCustomFields = () => {
    setIsModalVisible(false);
    // You can now use `customFieldsData` in your payload
  };

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
          title="Custom Field List"
          extra={
            <Space>
              {/* <Button icon={<CloudUploadOutlined />}>Import</Button> */}
              <Button icon={<PlusOutlined />} onClick={handleOpenModal}>
                Add Custom Fields
              </Button>
            </Space>
          }
        >
          <CustomFieldsModel
            visible={isModalVisible}
            onCancel={handleCancelModal}
            onSubmit={handleSubmitCustomFields}
          />
          <Spin spinning={loading} tip="Loading custom fields...">
            {error && (
              <Alert
                message="Error"
                description={error}
                type="error"
                showIcon
                style={{ marginBottom: 16 }}
              />
            )}
            {!loading && !error && customFields.length === 0 ? (
              <Empty description="No Custom fields found." />
            ) : (
              <Table
                dataSource={customFields}
                columns={columns}
                rowKey="id"
                onRow={(record) => ({
                  onClick: () => setViewField(record),
                })}
                scroll={{ x: true }}
              />
            )}
          </Spin>
        </Card>
      </Col>
      {/* Example: Modals for viewing and updating */}
      {viewField && (
        <FieldDetailModal
          field={viewField}
          onClose={() => setViewField(null)}
        />
      )}
      {updateField && (
        <UpdateFieldModel
          updateField={updateField}
          open={true}
          onClose={() => setUpdateField(null)}
          adminId={""}
          id={updateField.id}
        />
      )}
    </>
  );
};
