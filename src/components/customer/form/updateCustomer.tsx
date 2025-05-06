import React, { useState } from "react";
import {
  Button,
  DatePicker,
  Form,
  Input,
  Row,
  Col,
  Select,
  Switch,
  Card,
  Space,
  Alert,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
// import moment from "moment";
import dayjs from "dayjs";
import { indianStates, indianCities } from "./data/indianLocations";

const { Option } = Select;
const { TextArea } = Input;

const formItemLayout = {
  labelCol: { xs: { span: 24 }, sm: { span: 8 } },
  wrapperCol: { xs: { span: 24 }, sm: { span: 16 } },
};

const tailFormItemLayout = {
  wrapperCol: { xs: { span: 24, offset: 0 }, sm: { span: 16, offset: 8 } },
};

const productOptions = [
  { value: "prod1", label: "Product 1" },
  { value: "prod2", label: "Product 2" },
  { value: "prod3", label: "Product 3" },
];

interface CustomerData {
  adminId: string;
  companyName: string;
  contactPerson: string;
  mobileNumber: string;
  email: string;
  tallySerialNo: string;
  prime: boolean;
  blacklisted: boolean;
  remark: string;
  state?: string;
  city?: string;
  area?: string;
  address?: string;
  joiningDate?: string; // ISO string format
  // Other fields such as partner reference or products can be added here.
}

interface UpdateCustomerFormProps {
  customer: CustomerData;
  onUpdate: (updatedPayload: any) => void;
}

export const UpdateCustomerForm: React.FC<UpdateCustomerFormProps> = ({
  customer,
  onUpdate,
}) => {
  const [form] = Form.useForm();
  const [selectedState, setSelectedState] = useState<string | undefined>(
    customer.state
  );

  const onFinish = (values: any) => {
    // Construct payload with updated customer details
    const updatedPayload = {
      CustomerData: {
        customer: {
          adminId: customer.adminId,
          companyName: values.company,
          contactPerson: values.name,
          mobileNumber: values.phone,
          email: values.email,
          tallySerialNo: values.tallyNo,
          prime: values.prime,
          blacklisted: values.blacklisted,
          remark: values.remark,
          hasPartnerReference: values.reference,
          PartnerReferenceDetail: values.reference
            ? {
                referenceId: values.referenceChoice,
                Name: values.referenceChoice,
              }
            : null,
          state: values.state,
          city: values.city,
          area: values.area,
          address: values.address,
          joiningDate: values.joiningDate
            ? dayjs(values.joiningDate).toISOString()
            : undefined,
        },
        adminCustomFields: [],
        products: values.products || [],
        updatedAt: new Date().toISOString(),
      },
    };

    // Pass the updated payload to the onUpdate callback
    onUpdate(updatedPayload);
  //  console.log("Updated customer data", updatedPayload);
  };

  const handleStatusChange = (
    changedValue: boolean,
    fieldName: "prime" | "blacklisted"
  ) => {
    if (changedValue) {
      form.setFieldsValue({
        [fieldName === "prime" ? "blacklisted" : "prime"]: false,
      });
    }
  };

  return (
    <Form
      {...formItemLayout}
      form={form}
      name="update_customer"
      onFinish={onFinish}
      initialValues={{
        company: customer.companyName,
        name: customer.contactPerson,
        phone: customer.mobileNumber,
        email: customer.email,
        tallyNo: customer.tallySerialNo,
        prime: customer.prime,
        blacklisted: customer.blacklisted,
        remark: customer.remark,
        state: customer.state,
        city: customer.city,
        area: customer.area,
        address: customer.address,
        joiningDate: customer.joiningDate
          ? dayjs(customer.joiningDate)
          : undefined,
      }}
      style={{ maxWidth: "100%", margin: "0 auto" }}
      scrollToFirstError
    >
      <Space direction="vertical" size="middle" style={{ display: "flex" }}>
        {/* Basic Information Card */}
        <Card title="Basic Information" bordered={false}>
          <Row gutter={24}>
            <Col xs={24} sm={12}>
              <Form.Item
                name="company"
                label="Company Name"
                rules={[
                  { required: true, message: "Company Name is required!" },
                ]}
              >
                <Input placeholder="Enter company name" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                name="name"
                label="Contact Person"
                rules={[
                  { required: true, message: "Contact Person Name required!" },
                ]}
              >
                <Input placeholder="Enter contact person name" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={24}>
            <Col xs={24} sm={12}>
              <Form.Item
                name="phone"
                label="Phone Number"
                rules={[{ required: true, message: "Phone number required!" }]}
              >
                <Input
                  addonBefore={
                    <Select defaultValue="91" style={{ width: 70 }}>
                      <Option value="91">+91</Option>
                    </Select>
                  }
                  placeholder="Enter phone number"
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                name="email"
                label="Email"
                rules={[{ type: "email", message: "Invalid email!" }]}
              >
                <Input placeholder="Enter email address" />
              </Form.Item>
            </Col>
          </Row>
        </Card>

        {/* Address Details Card */}
        <Card title="Address Details" bordered={false}>
          <Row gutter={24}>
            <Col xs={24} sm={12}>
              <Form.Item name="state" label="State">
                <Select
                  showSearch
                  placeholder="Select State"
                  onChange={setSelectedState}
                  optionFilterProp="children"
                  filterOption={(input, option: any) =>
                    (option?.children as string)
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                >
                  {indianStates.map((state) => (
                    <Option key={state} value={state}>
                      {state}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item name="city" label="City">
                <Select
                  showSearch
                  placeholder="Select City"
                  disabled={!selectedState}
                  optionFilterProp="children"
                  filterOption={(input, option: any) =>
                    (option?.children as string)
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                >
                  {(selectedState ? indianCities[selectedState] : []).map(
                    (city) => (
                      <Option key={city} value={city}>
                        {city}
                      </Option>
                    )
                  )}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={24}>
            <Col xs={24} sm={12}>
              <Form.Item name="area" label="Area">
                <Input placeholder="Enter area/locality" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item name="address" label="Full Address">
                <TextArea placeholder="Enter complete address" rows={3} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={24}>
            <Col xs={24} sm={12}>
              <Form.Item
                name="joiningDate"
                label="Joining Date"
                rules={[
                  { required: true, message: "Joining date is required!" },
                ]}
              >
                <DatePicker style={{ width: "100%" }} />
              </Form.Item>
            </Col>
          </Row>
        </Card>

        {/* Additional Information Card */}
        <Card title="Additional Information" bordered={false}>
          <Row gutter={24}>
            <Col xs={24} sm={12}>
              <Form.Item name="tallyNo" label="Tally Serial No.">
                <Input placeholder="Enter 9-digit number" maxLength={9} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item label="Customer Status">
                <Space>
                  <Form.Item name="prime" valuePropName="checked" noStyle>
                    <Switch
                      checkedChildren="Prime"
                      unCheckedChildren="Prime"
                      onChange={(checked) =>
                        handleStatusChange(checked, "prime")
                      }
                    />
                  </Form.Item>
                  <Form.Item name="blacklisted" valuePropName="checked" noStyle>
                    <Switch
                      checkedChildren="Blacklisted"
                      unCheckedChildren="Blacklisted"
                      onChange={(checked) =>
                        handleStatusChange(checked, "blacklisted")
                      }
                    />
                  </Form.Item>
                </Space>
              </Form.Item>
              <Alert
                message="Note: Customer can be either Prime or Blacklisted, not both"
                type="info"
                showIcon
                style={{ marginTop: 16 }}
              />
            </Col>
          </Row>

          <Row gutter={24}>
            <Col span={24}>
              <Form.Item
                name="reference"
                label="Reference Partner"
                valuePropName="checked"
                extra="Enable if customer was referred by a partner"
              >
                <Switch />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            noStyle
            shouldUpdate={(prevValues, currentValues) =>
              prevValues.reference !== currentValues.reference
            }
          >
            {({ getFieldValue }) =>
              getFieldValue("reference") && (
                <Form.Item
                  name="referenceChoice"
                  label="Select Partner"
                  rules={[
                    {
                      required: true,
                      message: "Please select a reference partner",
                    },
                  ]}
                >
                  <Select placeholder="Choose referring partner">
                    <Option value="ref1">Mehul Patel / Shivans Infosys</Option>
                    <Option value="ref2">Raj Koladiya / MagicallySoft</Option>
                  </Select>
                </Form.Item>
              )
            }
          </Form.Item>

          <Form.Item name="remark" label="Remarks">
            <TextArea
              showCount
              maxLength={100}
              placeholder="Enter additional remarks..."
              style={{ minHeight: 100 }}
            />
          </Form.Item>
        </Card>

        {/* Products Section */}
        <Card title="Associated Products" bordered={false}>
          <Form.List name="products">
            {(fields, { add, remove }) => (
              <div
                style={{ display: "flex", flexDirection: "column", gap: 24 }}
              >
                {fields.map((field, index) => (
                  <Card
                    key={field.key}
                    title={`Product #${index + 1}`}
                    type="inner"
                    extra={
                      <Button
                        type="link"
                        danger
                        onClick={() => remove(field.name)}
                      >
                        Remove
                      </Button>
                    }
                  >
                    <Row gutter={24}>
                      <Col xs={24} sm={12}>
                        <Form.Item
                          {...field}
                          name={[field.name, "productDetailId"]}
                          label="Product Details"
                          rules={[
                            {
                              required: true,
                              message: "Product detail is required",
                            },
                          ]}
                        >
                          <Select placeholder="Select product">
                            {productOptions.map((option) => (
                              <Option key={option.value} value={option.value}>
                                {option.label}
                              </Option>
                            ))}
                          </Select>
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={12}>
                        <Form.Item
                          {...field}
                          name={[field.name, "purchaseDate"]}
                          label="Purchase Date"
                          rules={[
                            {
                              required: true,
                              message: "Purchase date is required",
                            },
                          ]}
                        >
                          <DatePicker style={{ width: "100%" }} />
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row gutter={24}>
                      <Col xs={24} sm={12}>
                        <Form.Item
                          {...field}
                          name={[field.name, "renewalDate"]}
                          label="Renewal Date"
                          rules={[
                            {
                              required: true,
                              message: "Renewal date is required",
                            },
                          ]}
                        >
                          <DatePicker style={{ width: "100%" }} />
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={12}>
                        <Form.Item
                          {...field}
                          name={[field.name, "details"]}
                          label="Additional Details"
                        >
                          <Input placeholder="Enter product details" />
                        </Form.Item>
                      </Col>
                    </Row>
                  </Card>
                ))}
                <Button
                  type="dashed"
                  onClick={() => add()}
                  block
                  icon={<PlusOutlined />}
                  style={{ marginTop: 16 }}
                >
                  Add Product
                </Button>
              </div>
            )}
          </Form.List>
        </Card>

        <Form.Item {...tailFormItemLayout}>
          <Button
            type="primary"
            htmlType="submit"
            size="large"
            style={{ width: "100%", maxWidth: 400, margin: "0 auto" }}
          >
            Update Customer
          </Button>
        </Form.Item>
      </Space>
    </Form>
  );
};
