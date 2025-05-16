import React, { useEffect, useState, useMemo, useCallback } from "react";
import {
  Button,
  DatePicker,
  InputNumber,
  Spin,
  Form,
  Input,
  Row,
  Col,
  Select,
  Switch,
  Card,
  Space,
  Alert,
  message,
  Slider,
  Empty,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { indianStates, indianCities } from "./data/indianLocations";
import { fetchAdminCustomFields } from "../../../redux/slice/customer/customfieldSlice";
import { useAppDispatch } from "../../../hooks";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { CustomFieldsModel } from "../model";
import { fetchAllProducts } from "../../../redux/slice/products/productSlice";
import { fetchPartners } from "../../../redux/slice/partner/partnerMemberSlice";
import { PartnerData } from "../../../redux/APITypes";
import { createCustomer } from "../../../redux/slice/customer/addcustomerSlice";
import { unwrapResult } from "@reduxjs/toolkit";

const { Option } = Select;
const { TextArea } = Input;

const formItemLayout = {
  labelCol: { xs: { span: 24 }, sm: { span: 8 } },
  wrapperCol: { xs: { span: 24 }, sm: { span: 16 } },
};

const tailFormItemLayout = {
  wrapperCol: { xs: { span: 24, offset: 0 }, sm: { span: 16, offset: 8 } },
};

export const AddCustomer: React.FC = () => {
  // Ant D message hook to avoid static context warning
  const [msgApi, msgContext] = message.useMessage();

  const dispatch = useAppDispatch();
  const [form] = Form.useForm();

  // Global loading for submit
  const [submitting, setSubmitting] = useState(false);

  // Local UI state
  const [selectedState, setSelectedState] = useState<string | undefined>();
  const [isModalVisible, setIsModalVisible] = useState(false);

  // Pull redux slices with explicit loading/error
  const {
    customFields,
    error: customFieldsError,
    loading: customFieldsLoading,
  } = useSelector((state: RootState) => state.customFields || []);
  const {
    products,
    error: productsError,
    loading: productsLoading,
  } = useSelector((state: RootState) => state.products);
  const {
    Partner,
    // error: partnerError,
    // loading: partnerLoading,
  } = useSelector((state: RootState) => state.partnerMember);

  // Batch-fetch on mount
  useEffect(() => {
    Promise.all([
      dispatch(fetchAdminCustomFields()),
      dispatch(fetchAllProducts({ status: true })),
      dispatch(fetchPartners({ status: true })),
    ]).catch((e) => {
      // handle global fetch error if desired
      console.error("Initial load failed", e);
    });
  }, [dispatch]);

  // Derived select options
  const productOptions = useMemo(
    () =>
      products.map((p) => ({
        value: p.id,
        label: p.productName,
      })),
    [products]
  );

  const partnerMembers: PartnerData[] = useMemo(() => {
    // If slice.Partner is already an array
    if (Array.isArray(Partner)) {
      return Partner;
    }
    // If slice.Partner has a `.data` field that’s an array
    if (
      Partner &&
      typeof Partner === "object" &&
      Array.isArray((Partner as any).data)
    ) {
      return (Partner as any).data;
    }
    // Otherwise, empty
    return [];
  }, [Partner]);

  const handleStateChange = useCallback(
    (value: string) => {
      setSelectedState(value);
      form.setFieldsValue({ city: undefined }); // reset city
    },
    [form]
  );

  // Reset city when state changes
  const onFinish = useCallback(
    async (values: any) => {
      setSubmitting(true);

      // Construct payload as per your sample structure
      const payload = {
        companyName: values.company,
        contactPerson: values.name,
        mobileNumber: values.phone,
        email: values.email,
        address: {
          state: values.state,
          city: values.city,
          area: values.area,
          street: values.address,
        },
        joiningDate: values.joiningDate.toISOString(),
        serialNo: values.serialNo,
        prime: values.prime,
        blacklisted: values.blacklisted,
        remark: values.remark,
        hasReference: values.reference,
        partnerId: values.reference ? values.referenceChoice : undefined,
        adminCustomFields: values.adminCustomFields || {},
        products: values.products || [],
      };

      try {
        // console.log("\n\n\npayload----->\n\n",payload);
        // console.log("\n\n\n<-------------------->\n\n\n");

        // Dispatch the thunk and unwrap for error handling
        const action = await dispatch(createCustomer(payload));
        const customer = unwrapResult(action);

        msgApi.success("Customer created: " + customer.companyName);
        form.resetFields();
      } catch (err: any) {
        msgApi.error(err || "Failed to create customer");
      } finally {
        setSubmitting(false);
      }
    },
    [dispatch, form]
  );

  const handleStatusChange = useCallback(
    (changedValue: boolean, fieldName: "prime" | "blacklisted") => {
      if (changedValue) {
        form.setFieldsValue({
          [fieldName === "prime" ? "blacklisted" : "prime"]: false,
        });
      }
    },
    [form]
  );

  const handleOpenModal = useCallback(() => setIsModalVisible(true), []);
  const handleCancelModal = useCallback(() => setIsModalVisible(false), []);
  const handleSubmitCustomFields = useCallback(
    () => setIsModalVisible(false),
    []
  );

  return (
    <>
      {msgContext}
      <Form
        {...formItemLayout}
        form={form}
        name="register"
        onFinish={onFinish}
        style={{ maxWidth: "100%", margin: "0 auto" }}
        scrollToFirstError
      >
        <Space
          direction="vertical"
          size="middle"
          style={{ display: "flex", margin: "0" }}
        >
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
                    {
                      required: true,
                      message: "Contact Person Name required!",
                    },
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
                  rules={[
                    { required: true, message: "Phone number required!" },
                  ]}
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
                    // onChange={setSelectedState}
                    onChange={handleStateChange}
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
                <Form.Item
                  name="serialNo"
                  label="Serial No."
                  rules={[
                    { required: true, message: "Serial number is required" },
                  ]}
                >
                  <Input placeholder="Enter serial number" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item label="Customer Status">
                  <Space>
                    <Form.Item name="prime" valuePropName="checked" noStyle>
                      <Switch
                        checkedChildren="&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Prime&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"
                        unCheckedChildren="Prime"
                        onChange={(checked) =>
                          handleStatusChange(checked, "prime")
                        }
                      />
                    </Form.Item>
                    <Form.Item
                      name="blacklisted"
                      valuePropName="checked"
                      noStyle
                    >
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
                {/* <Alert
                  message="Note: Customer can be either Prime or Blacklisted, not both"
                  type="info"
                  showIcon
                  style={{ marginTop: 16 }}
                /> */}
              </Col>
            </Row>

            <Row gutter={24}>
              <Col xs={24} sm={12}>
                <Form.Item
                  name="reference"
                  label="Reference Partner"
                  valuePropName="checked"
                  extra="Enable if customer was referred by a partner"
                >
                  <Switch />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
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
                        <Select
                          placeholder="Choose referring partner"
                          style={{ width: "100%" }}
                        >
                          {partnerMembers.map((p) => (
                            <Select.Option key={p.id} value={p.id}>
                              {p.firstName} {p.lastName} / {p.companyName}
                            </Select.Option>
                          ))}
                        </Select>
                      </Form.Item>
                    )
                  }
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={24}>
              <Col xs={24} sm={12}>
                <Form.Item name="remark" label="Remarks">
                  <TextArea
                    showCount
                    maxLength={100}
                    placeholder="Enter additional remarks..."
                    // style={{ minHeight: 100 }}
                  />
                </Form.Item>
              </Col>
            </Row>
          </Card>

          {/* Custom Fields Section */}
          <Button icon={<PlusOutlined />} onClick={handleOpenModal}>
            Add Custom Fields
          </Button>
          <CustomFieldsModel
            visible={isModalVisible}
            onCancel={handleCancelModal}
            onSubmit={handleSubmitCustomFields}
          />

          <Card title="Custom Fields" bordered={false}>
            <Spin spinning={customFieldsLoading} tip="Loading Custom Fields...">
              {customFieldsError && (
                <Alert
                  message="Error"
                  description={customFieldsError}
                  type="error"
                  showIcon
                  style={{ marginBottom: 16 }}
                />
              )}
              {!customFieldsLoading &&
              !customFieldsError &&
              customFields?.length === 0 ? (
                <Empty description="No Custom form field found." />
              ) : (
                <Row gutter={24}>
                  {customFields.map((field) => {
                    const fieldName = field.fieldName;
                    const isRequired = field.isRequired;
                    const fieldType = field.fieldType;
                    const options = field.options || [];
                    const isMultiSelect = field.isMultiSelect;

                    let inputComponent = null;

                    switch (fieldType) {
                      case "text":
                        inputComponent = (
                          <Input placeholder={`Enter ${fieldName}`} />
                        );
                        break;
                      case "number":
                        inputComponent = (
                          <InputNumber
                            style={{ width: "100%" }}
                            placeholder={`Enter ${fieldName}`}
                          />
                        );
                        break;
                      case "date":
                        inputComponent = (
                          <DatePicker
                            style={{ width: "100%" }}
                            placeholder={`Select ${fieldName}`}
                          />
                        );
                        break;
                      case "color":
                        inputComponent = <Input type="color" />;
                        break;
                      case "range":
                        // Using a slider here to represent a range input.
                        inputComponent = <Slider tooltipVisible />;
                        break;
                      case "select":
                        inputComponent = (
                          <Select
                            mode={isMultiSelect ? "multiple" : undefined}
                            placeholder={`Select ${fieldName}`}
                          >
                            {options.map((option) => (
                              <Option key={option} value={option}>
                                {option}
                              </Option>
                            ))}
                          </Select>
                        );
                        break;
                      // Default to a simple text input.
                      default:
                        inputComponent = (
                          <Input placeholder={`Enter ${fieldName}`} />
                        );
                    }

                    return (
                      <Col span={24} xs={12} sm={12} key={field.id}>
                        <Form.Item
                          name={["adminCustomFields", fieldName]}
                          label={fieldName}
                          rules={[
                            {
                              required: isRequired,
                              message: `${fieldName} is required!`,
                            },
                          ]}
                        >
                          {inputComponent}
                        </Form.Item>
                      </Col>
                    );
                  })}
                </Row>
              )}
            </Spin>
          </Card>

          {/* Products Section */}
          <Card title="Associated Products" bordered={false}>
            {productsLoading ? (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Spin />
              </div>
            ) : productsError ? (
              <Alert type="error" message={productsError.toString()} />
            ) : null}
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
                      {/* Renewal Switch */}
                      <Row gutter={24}>
                        <Col xs={24} sm={12}>
                          <Form.Item
                            {...field}
                            name={[field.name, "renewal"]}
                            label="Renewal"
                            valuePropName="checked"
                          >
                            <Switch />
                          </Form.Item>
                        </Col>
                      </Row>
                      {/* Conditionally show Expiry Date and Renewal Date based on renewal switch */}
                      <Form.Item
                        noStyle
                        shouldUpdate={(prevValues, currentValues) =>
                          prevValues.products?.[field.name]?.renewal !==
                          currentValues.products?.[field.name]?.renewal
                        }
                      >
                        {({ getFieldValue }) => {
                          const renewalValue = getFieldValue([
                            "products",
                            field.name,
                            "renewal",
                          ]);
                          return renewalValue ? (
                            <>
                              <Row gutter={24}>
                                <Col xs={24} sm={12}>
                                  <Form.Item
                                    {...field}
                                    name={[field.name, "renewPeriod"]}
                                    label="Renew Period"
                                    rules={[
                                      {
                                        required: true,
                                        message: "Renew Period is required",
                                      },
                                    ]}
                                  >
                                    <Select
                                      style={{ width: "100%" }}
                                      placeholder="Select renew period"
                                    >
                                      <Select.Option value="monthly">
                                        1 Month
                                      </Select.Option>
                                      <Select.Option value="quarterly">
                                        3 Months
                                      </Select.Option>
                                      <Select.Option value="half_yearly">
                                        6 Months
                                      </Select.Option>
                                      <Select.Option value="yearly">
                                        1 Year
                                      </Select.Option>
                                      <Select.Option value="custom">
                                        Custom
                                      </Select.Option>
                                      {/* Add more options as needed */}
                                    </Select>
                                  </Form.Item>
                                </Col>
                              </Row>
                              <Row gutter={24}>
                                <Form.Item
                                  shouldUpdate={(prevValues, curValues) => {
                                    const prev =
                                      prevValues.products?.[field.name]
                                        ?.renewPeriod;
                                    const cur =
                                      curValues.products?.[field.name]
                                        ?.renewPeriod;
                                    return prev !== cur;
                                  }}
                                  noStyle
                                >
                                  {({ getFieldValue }) =>
                                    getFieldValue([
                                      "products",
                                      field.name,
                                      "renewPeriod",
                                    ]) === "custom" ? (
                                      <>
                                        <Col xs={24} sm={12}>
                                          <Form.Item
                                            {...field}
                                            name={[field.name, "expiryDate"]}
                                            label="Expiry Date"
                                            rules={[
                                              {
                                                required: true,
                                                message:
                                                  "Expiry date is required",
                                              },
                                            ]}
                                          >
                                            <DatePicker
                                              style={{ width: "100%" }}
                                            />
                                          </Form.Item>
                                        </Col>
                                        <Col xs={24} sm={12}>
                                          <Form.Item
                                            {...field}
                                            name={[field.name, "renewalDate"]}
                                            label="Renewal Date"
                                            rules={[
                                              {
                                                required: true,
                                                message:
                                                  "Renewal date is required",
                                              },
                                            ]}
                                          >
                                            <DatePicker
                                              style={{ width: "100%" }}
                                            />
                                          </Form.Item>
                                        </Col>
                                      </>
                                    ) : null
                                  }
                                </Form.Item>
                              </Row>
                              {/* <Col xs={24} sm={12}>
                                <Form.Item
                                  {...field}
                                  name={[field.name, "expiryDate"]}
                                  label="Expiry Date"
                                  rules={[
                                    {
                                      required: true,
                                      message: "Expiry date is required",
                                    },
                                  ]}
                                >
                                  <DatePicker style={{ width: "100%" }} />
                                </Form.Item>
                              </Col>
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
                              </Col> */}
                            </>
                          ) : null;
                        }}
                      </Form.Item>
                      <Row gutter={24}>
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
              loading={submitting}
              style={{ width: "100%", maxWidth: "100%" }}
            >
              Save Customer
            </Button>
          </Form.Item>
        </Space>
      </Form>
    </>
  );
};

export default AddCustomer;

// // Create a Blob with JSON data and trigger download of CustomerData.json
// const blob = new Blob([JSON.stringify(payload, null, 2)], {
//   type: "application/json",
// });
// const url = URL.createObjectURL(blob);
// const a = document.createElement("a");
// a.href = url;
// a.download = "CustomerData.json";
// a.click();
// URL.revokeObjectURL(url);

// // Simulate a delay and then stop the loading state with a success message
// setTimeout(() => {
//   setLoading(false);
//   form.resetFields();
//   message.success("Customer saved successfully!");
// }, 1000);
