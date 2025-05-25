// src/components/Customer/UpdateCustomerForm.tsx
import React, { useEffect, useState, useMemo, useCallback } from "react";
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
  message,
  Slider,
  Spin,
  Empty,
} from "antd";

import { PlusOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { indianStates, indianCities } from "./data/indianLocations";
import { fetchAdminCustomFields } from "../../../redux/slice/customer/customfieldSlice";
import { fetchAllProducts } from "../../../redux/slice/products/productSlice";
import { fetchPartners } from "../../../redux/slice/partner/partnerMemberSlice";
import { useAppDispatch } from "../../../hooks";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { CustomFieldsModel } from "../model";
import {
  listCustomers,
  updateCustomer,
} from "../../../redux/slice/customer/addcustomerSlice";
import { Customer } from "../../../types/customer.type";
import { Partner } from "../../../types/partner.type";

const { Option } = Select;
const { TextArea } = Input;

const formItemLayout = {
  labelCol: { xs: { span: 24 }, sm: { span: 8 } },
  wrapperCol: { xs: { span: 24 }, sm: { span: 16 } },
};
const tailFormItemLayout = {
  wrapperCol: { xs: { span: 24, offset: 0 }, sm: { span: 16, offset: 8 } },
};

interface UpdateCustomerFormProps {
  customer: Customer;
  onUpdate: () => void;
}

export const UpdateCustomerForm: React.FC<UpdateCustomerFormProps> = ({
  customer,
  onUpdate,
}) => {
  // console.log("\n\ncustomer-->", customer);

  const [form] = Form.useForm();
  const dispatch = useAppDispatch();
  const [submitting, setSubmitting] = useState(false);

  const [selectedState, setSelectedState] = useState<string | undefined>(
    customer.address?.state
  );
  const [isModalVisible, setIsModalVisible] = useState(false);

  const {
    customFields,
    loading: cfLoading,
    error: cfError,
  } = useSelector((state: RootState) => state.customFields);
  const {
    products,
    error: productsError,
    loading: productsLoading,
  } = useSelector((state: RootState) => state.products);
  const {
    Partner,
    // loading: partnersLoading,
    // error: partnersError,
  } = useSelector((state: RootState) => state.partnerMember);

  // derive safe arrays
  const partnerMembers: Partner[] = useMemo(() => {
    if (Array.isArray(Partner)) return Partner;
    if (
      Partner &&
      typeof Partner === "object" &&
      Array.isArray((Partner as any).data)
    )
      return (Partner as any).data;
    return [];
  }, [Partner]);

  const productOptions = useMemo(
    () => products.map((p) => ({ value: p.id, label: p.productName })),
    [products]
  );

  // fetch lookups on mount
  useEffect(() => {
    dispatch(fetchAdminCustomFields());
    dispatch(fetchAllProducts({ status: true }));
    dispatch(fetchPartners({ status: true }));
  }, [dispatch]);

  // seed form values & dynamic list when `customer` arrives
  useEffect(() => {
    console.log("customer--------->", customer);

    form.setFieldsValue({
      company: customer.companyName,
      name: customer.contactPerson,
      phone: customer.mobileNumber,
      email: customer.email,
      serialNo: customer.serialNo,
      prime: customer.prime,
      blacklisted: customer.blacklisted,
      remark: customer.remark,
      state: customer.address?.state,
      city: customer.address?.city,
      area: customer.address?.area,
      address: customer.address?.street,
      adminCustomFields: customer.adminCustomFields || {},
      // product: Array.isArray(customer.product)
      //   ? customer.product.map((pr: any) => ({
      //       productId: pr.productId ?? pr.id,
      //       purchaseDate: dayjs(pr.purchaseDate),
      //       renewal: pr.renewal,
      //       renewPeriod: pr.renewPeriod,
      //       expiryDate: pr.expiryDate ? dayjs(pr.expiryDate) : undefined,
      //       renewalDate: pr.renewalDate ? dayjs(pr.renewalDate) : undefined,
      //       details: pr.details,
      //     }))
      //   : [],
    });
    setSelectedState(customer.address?.state);
  }, [customer, form]);

  // clear city when state changes
  const handleStateChange = useCallback(
    (val: string) => {
      setSelectedState(val);
      form.setFieldsValue({ city: undefined });
    },
    [form]
  );

  const handleStatusChange = useCallback(
    (val: boolean, field: "prime" | "blacklisted") => {
      if (val)
        form.setFieldsValue({
          [field === "prime" ? "blacklisted" : "prime"]: false,
        });
    },
    [form]
  );

  const onFinish = useCallback(
    async (vals: any) => {
      setSubmitting(true); // disable double‐submit
      try {
        const data: Partial<Customer> = {
          companyName: vals.company,
          contactPerson: vals.name,
          mobileNumber: vals.phone,
          email: vals.email,
          serialNo: vals.serialNo,
          prime: vals.prime,
          blacklisted: vals.blacklisted,
          remark: vals.remark,
          hasReference: vals.reference,
          partnerId: vals.reference ? vals.referenceChoice : null,
          address: {
            state: vals.state,
            city: vals.city,
            area: vals.area,
            street: vals.address,
          },
          joiningDate: vals.joiningDate?.toISOString(),
          product: vals.products?.map((pr: any) => ({
            productId: pr.productId,
            purchaseDate: pr.purchaseDate.toISOString(),
            renewal: pr.renewal,
            renewPeriod: pr.renewPeriod,
            expiryDate: pr.expiryDate?.toISOString(),
            renewalDate: pr.renewalDate?.toISOString(),
            details: pr.details,
          })),
          adminCustomFields: vals.adminCustomFields
            ? vals.adminCustomFields
            : {}, // ensure array
        };

        console.log("customer data--->", data);
        await dispatch(updateCustomer({ id: customer.id, data })).unwrap();
        dispatch(listCustomers({ status: true }));
        message.success("Customer updated successfully");
        onUpdate();
      } catch (e: any) {
        message.error(e.message || e || "Update failed");
      } finally {
        setSubmitting(false);
      }
    },
    [dispatch, form, customer.id, onUpdate]
  );

  return (
    <Form
      {...formItemLayout}
      form={form}
      onFinish={onFinish}
      scrollToFirstError
    >
      <Space direction="vertical" size="middle" style={{ display: "flex" }}>
        {/* Basic Info */}
        <Card title="Basic Information" bordered={false}>
          <Row gutter={24}>
            <Col xs={24} sm={12}>
              <Form.Item
                name="company"
                label="Company"
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                name="name"
                label="Contact Person"
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>
          {/* phone / email */}
          <Row gutter={24}>
            <Col xs={24} sm={12}>
              <Form.Item
                name="phone"
                label="Phone"
                rules={[{ required: true }]}
              >
                <Input
                  addonBefore={
                    <Select defaultValue="91">
                      <Option value="91">+91</Option>
                    </Select>
                  }
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item name="email" label="Email" rules={[{ type: "email" }]}>
                <Input />
              </Form.Item>
            </Col>
          </Row>
        </Card>

        {/* Address */}
        <Card title="Address Details" bordered={false}>
          <Row gutter={24}>
            <Col xs={24} sm={12}>
              <Form.Item name="state" label="State">
                <Select showSearch onChange={handleStateChange}>
                  {indianStates.map((s) => (
                    <Option key={s} value={s}>
                      {s}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item name="city" label="City">
                <Select disabled={!selectedState} showSearch>
                  {(selectedState ? indianCities[selectedState] : []).map(
                    (c) => (
                      <Option key={c} value={c}>
                        {c}
                      </Option>
                    )
                  )}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          {/* area / address */}
          <Row gutter={24}>
            <Col xs={24} sm={12}>
              <Form.Item name="area" label="Area">
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item name="address" label="Address">
                <TextArea rows={3} />
              </Form.Item>
            </Col>
          </Row>
          {/* <Row gutter={24}>
            <Col xs={24} sm={12}>
              <Form.Item
                name="joiningDate"
                label="Joining Date"
                rules={[{ required: true }]}
              >
                <DatePicker style={{ width: "100%" }} />
              </Form.Item>
            </Col>
          </Row> */}
        </Card>

        {/* Additional */}
        <Card title="Additional Info" bordered={false}>
          <Row gutter={24}>
            <Col xs={24} sm={12}>
              <Form.Item name="serialNo" label="Tally Serial No.">
                <Input maxLength={9} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item label="Status">
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
            </Col>
          </Row>
          {/* <Row gutter={24}>
            <Col span={24}>
              <Form.Item
                name="reference"
                label="Reference Partner"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>
            </Col>
          </Row> */}
          <Form.Item
            noStyle
            shouldUpdate={(prev, cur) => prev.reference !== cur.reference}
          >
            {({ getFieldValue }) =>
              getFieldValue("reference") && (
                <Form.Item
                  name="referenceChoice"
                  label="Select Partner"
                  rules={[{ required: true }]}
                >
                  <Select>
                    {partnerMembers.map((p) => (
                      <Option key={p.id} value={p.id}>
                        {p.firstName} {p.lastName}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              )
            }
          </Form.Item>
          <Form.Item name="remark" label="Remarks">
            <TextArea maxLength={100} showCount rows={2} />
          </Form.Item>
        </Card>

        {/* Custom Fields */}
        <Button icon={<PlusOutlined />} onClick={() => setIsModalVisible(true)}>
          Add Custom Fields
        </Button>
        <CustomFieldsModel
          visible={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          onSubmit={() => setIsModalVisible(false)}
        />
        <Card title="Custom Fields" bordered={false}>
          <Spin spinning={cfLoading} tip="Loading...">
            {cfError && <Alert type="error" message={cfError} showIcon />}
            {!cfLoading && !cfError && customFields.length === 0 && (
              <Empty description="No fields" />
            )}
            <Row gutter={24}>
              {customFields.map((f) => {
                let comp: React.ReactNode = <Input />;
                if (f.fieldType === "date")
                  comp = <DatePicker style={{ width: "100%" }} />;
                if (f.fieldType === "select")
                  comp = (
                    <Select mode={f.isMultiSelect ? "multiple" : undefined}>
                      {f.options?.map((o: any) => (
                        <Option key={o} value={o}>
                          {o}
                        </Option>
                      ))}
                    </Select>
                  );
                if (f.fieldType === "range") comp = <Slider tooltipVisible />;
                return (
                  <Col xs={12} sm={12} key={f.id}>
                    <Form.Item
                      name={["adminCustomFields", f.fieldName]}
                      label={f.fieldName}
                      rules={[{ required: f.isRequired }]}
                    >
                      {comp}
                    </Form.Item>
                  </Col>
                );
              })}
            </Row>
          </Spin>
        </Card>

        {/* Products */}
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
                          name={[field.name, "productId"]}
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

        {/* Submit */}
        <Form.Item {...tailFormItemLayout}>
          <Button
            type="primary"
            htmlType="submit"
            loading={submitting}
            style={{ width: "100%" }}
          >
            Update Customer
          </Button>
        </Form.Item>
      </Space>
    </Form>
  );
};

export default UpdateCustomerForm;
