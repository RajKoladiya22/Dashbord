// import React, { useState } from "react";
// import {
//   Button,
//   DatePicker,
//   Form,
//   Input,
//   Row,
//   Col,
//   Select,
//   Switch,
//   Card,
//   Space,
//   Alert,
// } from "antd";
// import { PlusOutlined } from "@ant-design/icons";
// // import moment from "moment";
// import dayjs from "dayjs";
// import { indianStates, indianCities } from "./data/indianLocations";

// const { Option } = Select;
// const { TextArea } = Input;

// const formItemLayout = {
//   labelCol: { xs: { span: 24 }, sm: { span: 8 } },
//   wrapperCol: { xs: { span: 24 }, sm: { span: 16 } },
// };

// const tailFormItemLayout = {
//   wrapperCol: { xs: { span: 24, offset: 0 }, sm: { span: 16, offset: 8 } },
// };

// const productOptions = [
//   { value: "prod1", label: "Product 1" },
//   { value: "prod2", label: "Product 2" },
//   { value: "prod3", label: "Product 3" },
// ];

// interface CustomerData {
//   adminId: string;
//   companyName: string;
//   contactPerson: string;
//   mobileNumber: string;
//   email: string;
//   serialNo: string;
//   prime: boolean;
//   blacklisted: boolean;
//   remark: string;
//   state?: string;
//   city?: string;
//   area?: string;
//   address?: string;
//   joiningDate?: string; // ISO string format
//   // Other fields such as partner reference or products can be added here.
// }

// interface UpdateCustomerFormProps {
//   customer: CustomerData;
//   onUpdate: (updatedPayload: any) => void;
// }

// export const UpdateCustomerForm: React.FC<UpdateCustomerFormProps> = ({
//   customer,
//   onUpdate,
// }) => {
//   const [form] = Form.useForm();
//   const [selectedState, setSelectedState] = useState<string | undefined>(
//     customer.state
//   );

//   const onFinish = (values: any) => {
//     // Construct payload with updated customer details
//     const updatedPayload = {
//       CustomerData: {
//         customer: {
//           adminId: customer.adminId,
//           companyName: values.company,
//           contactPerson: values.name,
//           mobileNumber: values.phone,
//           email: values.email,
//           serialNo: values.serialNo,
//           prime: values.prime,
//           blacklisted: values.blacklisted,
//           remark: values.remark,
//           hasReference: values.reference,
//           partnerId: values.reference
//             ? {
//                 referenceId: values.referenceChoice,
//                 Name: values.referenceChoice,
//               }
//             : null,
//           state: values.state,
//           city: values.city,
//           area: values.area,
//           address: values.address,
//           joiningDate: values.joiningDate
//             ? dayjs(values.joiningDate).toISOString()
//             : undefined,
//         },
//         adminCustomFields: [],
//         products: values.products || [],
//         updatedAt: new Date().toISOString(),
//       },
//     };

//     // Pass the updated payload to the onUpdate callback
//     onUpdate(updatedPayload);
//   //  console.log("Updated customer data", updatedPayload);
//   };

//   const handleStatusChange = (
//     changedValue: boolean,
//     fieldName: "prime" | "blacklisted"
//   ) => {
//     if (changedValue) {
//       form.setFieldsValue({
//         [fieldName === "prime" ? "blacklisted" : "prime"]: false,
//       });
//     }
//   };

//   return (
//     <Form
//       {...formItemLayout}
//       form={form}
//       name="update_customer"
//       onFinish={onFinish}
//       initialValues={{
//         company: customer.companyName,
//         name: customer.contactPerson,
//         phone: customer.mobileNumber,
//         email: customer.email,
//         serialNo: customer.serialNo,
//         prime: customer.prime,
//         blacklisted: customer.blacklisted,
//         remark: customer.remark,
//         state: customer.state,
//         city: customer.city,
//         area: customer.area,
//         address: customer.address,
//         joiningDate: customer.joiningDate
//           ? dayjs(customer.joiningDate)
//           : undefined,
//       }}
//       style={{ maxWidth: "100%", margin: "0 auto" }}
//       scrollToFirstError
//     >
//       <Space direction="vertical" size="middle" style={{ display: "flex" }}>
//         {/* Basic Information Card */}
//         <Card title="Basic Information" bordered={false}>
//           <Row gutter={24}>
//             <Col xs={24} sm={12}>
//               <Form.Item
//                 name="company"
//                 label="Company Name"
//                 rules={[
//                   { required: true, message: "Company Name is required!" },
//                 ]}
//               >
//                 <Input placeholder="Enter company name" />
//               </Form.Item>
//             </Col>
//             <Col xs={24} sm={12}>
//               <Form.Item
//                 name="name"
//                 label="Contact Person"
//                 rules={[
//                   { required: true, message: "Contact Person Name required!" },
//                 ]}
//               >
//                 <Input placeholder="Enter contact person name" />
//               </Form.Item>
//             </Col>
//           </Row>

//           <Row gutter={24}>
//             <Col xs={24} sm={12}>
//               <Form.Item
//                 name="phone"
//                 label="Phone Number"
//                 rules={[{ required: true, message: "Phone number required!" }]}
//               >
//                 <Input
//                   addonBefore={
//                     <Select defaultValue="91" style={{ width: 70 }}>
//                       <Option value="91">+91</Option>
//                     </Select>
//                   }
//                   placeholder="Enter phone number"
//                 />
//               </Form.Item>
//             </Col>
//             <Col xs={24} sm={12}>
//               <Form.Item
//                 name="email"
//                 label="Email"
//                 rules={[{ type: "email", message: "Invalid email!" }]}
//               >
//                 <Input placeholder="Enter email address" />
//               </Form.Item>
//             </Col>
//           </Row>
//         </Card>

//         {/* Address Details Card */}
//         <Card title="Address Details" bordered={false}>
//           <Row gutter={24}>
//             <Col xs={24} sm={12}>
//               <Form.Item name="state" label="State">
//                 <Select
//                   showSearch
//                   placeholder="Select State"
//                   onChange={setSelectedState}
//                   optionFilterProp="children"
//                   filterOption={(input, option: any) =>
//                     (option?.children as string)
//                       .toLowerCase()
//                       .includes(input.toLowerCase())
//                   }
//                 >
//                   {indianStates.map((state) => (
//                     <Option key={state} value={state}>
//                       {state}
//                     </Option>
//                   ))}
//                 </Select>
//               </Form.Item>
//             </Col>
//             <Col xs={24} sm={12}>
//               <Form.Item name="city" label="City">
//                 <Select
//                   showSearch
//                   placeholder="Select City"
//                   disabled={!selectedState}
//                   optionFilterProp="children"
//                   filterOption={(input, option: any) =>
//                     (option?.children as string)
//                       .toLowerCase()
//                       .includes(input.toLowerCase())
//                   }
//                 >
//                   {(selectedState ? indianCities[selectedState] : []).map(
//                     (city) => (
//                       <Option key={city} value={city}>
//                         {city}
//                       </Option>
//                     )
//                   )}
//                 </Select>
//               </Form.Item>
//             </Col>
//           </Row>

//           <Row gutter={24}>
//             <Col xs={24} sm={12}>
//               <Form.Item name="area" label="Area">
//                 <Input placeholder="Enter area/locality" />
//               </Form.Item>
//             </Col>
//             <Col xs={24} sm={12}>
//               <Form.Item name="address" label="Full Address">
//                 <TextArea placeholder="Enter complete address" rows={3} />
//               </Form.Item>
//             </Col>
//           </Row>

//           <Row gutter={24}>
//             <Col xs={24} sm={12}>
//               <Form.Item
//                 name="joiningDate"
//                 label="Joining Date"
//                 rules={[
//                   { required: true, message: "Joining date is required!" },
//                 ]}
//               >
//                 <DatePicker style={{ width: "100%" }} />
//               </Form.Item>
//             </Col>
//           </Row>
//         </Card>

//         {/* Additional Information Card */}
//         <Card title="Additional Information" bordered={false}>
//           <Row gutter={24}>
//             <Col xs={24} sm={12}>
//               <Form.Item name="serialNo" label="Tally Serial No.">
//                 <Input placeholder="Enter 9-digit number" maxLength={9} />
//               </Form.Item>
//             </Col>
//             <Col xs={24} sm={12}>
//               <Form.Item label="Customer Status">
//                 <Space>
//                   <Form.Item name="prime" valuePropName="checked" noStyle>
//                     <Switch
//                       checkedChildren="Prime"
//                       unCheckedChildren="Prime"
//                       onChange={(checked) =>
//                         handleStatusChange(checked, "prime")
//                       }
//                     />
//                   </Form.Item>
//                   <Form.Item name="blacklisted" valuePropName="checked" noStyle>
//                     <Switch
//                       checkedChildren="Blacklisted"
//                       unCheckedChildren="Blacklisted"
//                       onChange={(checked) =>
//                         handleStatusChange(checked, "blacklisted")
//                       }
//                     />
//                   </Form.Item>
//                 </Space>
//               </Form.Item>
//               <Alert
//                 message="Note: Customer can be either Prime or Blacklisted, not both"
//                 type="info"
//                 showIcon
//                 style={{ marginTop: 16 }}
//               />
//             </Col>
//           </Row>

//           <Row gutter={24}>
//             <Col span={24}>
//               <Form.Item
//                 name="reference"
//                 label="Reference Partner"
//                 valuePropName="checked"
//                 extra="Enable if customer was referred by a partner"
//               >
//                 <Switch />
//               </Form.Item>
//             </Col>
//           </Row>

//           <Form.Item
//             noStyle
//             shouldUpdate={(prevValues, currentValues) =>
//               prevValues.reference !== currentValues.reference
//             }
//           >
//             {({ getFieldValue }) =>
//               getFieldValue("reference") && (
//                 <Form.Item
//                   name="referenceChoice"
//                   label="Select Partner"
//                   rules={[
//                     {
//                       required: true,
//                       message: "Please select a reference partner",
//                     },
//                   ]}
//                 >
//                   <Select placeholder="Choose referring partner">
//                     <Option value="ref1">Mehul Patel / Shivans Infosys</Option>
//                     <Option value="ref2">Raj Koladiya / MagicallySoft</Option>
//                   </Select>
//                 </Form.Item>
//               )
//             }
//           </Form.Item>

//           <Form.Item name="remark" label="Remarks">
//             <TextArea
//               showCount
//               maxLength={100}
//               placeholder="Enter additional remarks..."
//               style={{ minHeight: 100 }}
//             />
//           </Form.Item>
//         </Card>

//         {/* Products Section */}
//         <Card title="Associated Products" bordered={false}>
//           <Form.List name="products">
//             {(fields, { add, remove }) => (
//               <div
//                 style={{ display: "flex", flexDirection: "column", gap: 24 }}
//               >
//                 {fields.map((field, index) => (
//                   <Card
//                     key={field.key}
//                     title={`Product #${index + 1}`}
//                     type="inner"
//                     extra={
//                       <Button
//                         type="link"
//                         danger
//                         onClick={() => remove(field.name)}
//                       >
//                         Remove
//                       </Button>
//                     }
//                   >
//                     <Row gutter={24}>
//                       <Col xs={24} sm={12}>
//                         <Form.Item
//                           {...field}
//                           name={[field.name, "productDetailId"]}
//                           label="Product Details"
//                           rules={[
//                             {
//                               required: true,
//                               message: "Product detail is required",
//                             },
//                           ]}
//                         >
//                           <Select placeholder="Select product">
//                             {productOptions.map((option) => (
//                               <Option key={option.value} value={option.value}>
//                                 {option.label}
//                               </Option>
//                             ))}
//                           </Select>
//                         </Form.Item>
//                       </Col>
//                       <Col xs={24} sm={12}>
//                         <Form.Item
//                           {...field}
//                           name={[field.name, "purchaseDate"]}
//                           label="Purchase Date"
//                           rules={[
//                             {
//                               required: true,
//                               message: "Purchase date is required",
//                             },
//                           ]}
//                         >
//                           <DatePicker style={{ width: "100%" }} />
//                         </Form.Item>
//                       </Col>
//                     </Row>
//                     <Row gutter={24}>
//                       <Col xs={24} sm={12}>
//                         <Form.Item
//                           {...field}
//                           name={[field.name, "renewalDate"]}
//                           label="Renewal Date"
//                           rules={[
//                             {
//                               required: true,
//                               message: "Renewal date is required",
//                             },
//                           ]}
//                         >
//                           <DatePicker style={{ width: "100%" }} />
//                         </Form.Item>
//                       </Col>
//                       <Col xs={24} sm={12}>
//                         <Form.Item
//                           {...field}
//                           name={[field.name, "details"]}
//                           label="Additional Details"
//                         >
//                           <Input placeholder="Enter product details" />
//                         </Form.Item>
//                       </Col>
//                     </Row>
//                   </Card>
//                 ))}
//                 <Button
//                   type="dashed"
//                   onClick={() => add()}
//                   block
//                   icon={<PlusOutlined />}
//                   style={{ marginTop: 16 }}
//                 >
//                   Add Product
//                 </Button>
//               </div>
//             )}
//           </Form.List>
//         </Card>

//         <Form.Item {...tailFormItemLayout}>
//           <Button
//             type="primary"
//             htmlType="submit"
//             size="large"
//             style={{ width: "100%", maxWidth: 400, margin: "0 auto" }}
//           >
//             Update Customer
//           </Button>
//         </Form.Item>
//       </Space>
//     </Form>
//   );
// };

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
import { PartnerData, Customer } from "../../../redux/APITypes";
import { updateCustomer } from "../../../redux/slice/customer/addcustomerSlice";

const { Option } = Select;
const { TextArea } = Input;

const formItemLayout = {
  labelCol: { xs: { span: 24 }, sm: { span: 8 } },
  wrapperCol: { xs: { span: 24 }, sm: { span: 16 } },
};
const tailFormItemLayout = {
  wrapperCol: { xs: { span: 24, offset: 0 }, sm: { span: 16, offset: 8 } },
};

export interface CustomerData {
  adminId: string;
  companyName: string;
  contactPerson: string;
  mobileNumber: string;
  email: string;
  serialNo: string;
  prime: boolean;
  blacklisted: boolean;
  remark: string;
  state?: string;
  city?: string;
  area?: string;
  address?: string;
  joiningDate?: string;
  hasReference?: boolean;
  partnerId?: { referenceId: string; Name: string } | null;
  products?: Array<{
    productDetailId: string;
    purchaseDate: string;
    renewal?: boolean;
    expiryDate?: string;
    renewalDate?: string;
    details?: string;
  }>;
  adminCustomFields?: Record<string, any>[];
}

interface UpdateCustomerFormProps {
  customer: CustomerData;
  onUpdate: () => void;
}

export const UpdateCustomerForm: React.FC<UpdateCustomerFormProps> = ({
  customer,
  onUpdate,
}) => {
  const [form] = Form.useForm();
  const dispatch = useAppDispatch();
  const [submitting, setSubmitting] = useState(false);
  const [selectedState, setSelectedState] = useState<string | undefined>(
    customer.state
  );
  const [isModalVisible, setIsModalVisible] = useState(false);

  const {
    customFields,
    loading: cfLoading,
    error: cfError,
  } = useSelector((state: RootState) => state.customFields);
  const {
    products,
    loading: pLoading,
    error: pError,
  } = useSelector((state: RootState) => state.products);
  const {
    Partner,
    // loading: pmLoading,
    // error: pmError,
  } = useSelector((state: RootState) => state.partnerMember);

  // derive safe arrays
  const partnerMembers: PartnerData[] = useMemo(() => {
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
    dispatch(fetchAllProducts());
    dispatch(fetchPartners());
  }, [dispatch]);

  // seed form values & dynamic list when `customer` arrives
  useEffect(() => {
    form.setFieldsValue({
      company: customer.companyName,
      name: customer.contactPerson,
      phone: customer.mobileNumber,
      email: customer.email,
      serialNo: customer.serialNo,
      prime: customer.prime,
      blacklisted: customer.blacklisted,
      remark: customer.remark,
      reference: Boolean(customer.hasReference),
      partnerId: customer.partnerId?.referenceId,
      state: customer.state,
      city: customer.city,
      area: customer.area,
      address: customer.address,
      joiningDate: customer.joiningDate
        ? dayjs(customer.joiningDate)
        : undefined,
      adminCustomFields: {}, // placeholder object
      products: customer.products?.map((pr) => ({
        // seed Form.List :contentReference[oaicite:10]{index=10}
        productDetailId: pr.productDetailId,
        purchaseDate: dayjs(pr.purchaseDate),
        renewal: pr.renewal,
        expiryDate: pr.expiryDate ? dayjs(pr.expiryDate) : undefined,
        renewalDate: pr.renewalDate ? dayjs(pr.renewalDate) : undefined,
        details: pr.details,
      })),
    });
  }, [customer, form]);

  // clear city when state changes
  const handleStateChange = useCallback(
    (val: string) => {
      setSelectedState(val);
      form.setFieldsValue({ city: undefined }); // avoid stale city :contentReference[oaicite:11]{index=11}
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
          products: vals.products?.map((pr: any) => ({
            productDetailId: pr.productDetailId,
            purchaseDate: pr.purchaseDate.toISOString(),
            renewal: pr.renewal,
            expiryDate: pr.expiryDate?.toISOString(),
            renewalDate: pr.renewalDate?.toISOString(),
            details: pr.details,
          })),
          adminCustomFields: Array.isArray(vals.adminCustomFields)
            ? vals.adminCustomFields
            : [], // ensure array
        };
        await dispatch(updateCustomer({ id: customer.adminId, data })).unwrap();
        message.success("Customer updated");
        onUpdate();
      } catch (e: any) {
        message.error(e.message || "Update failed");
      } finally {
        setSubmitting(false);
      }
    },
    [dispatch, form, customer.adminId, onUpdate]
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
          <Row gutter={24}>
            <Col xs={24} sm={12}>
              <Form.Item
                name="joiningDate"
                label="Joining Date"
                rules={[{ required: true }]}
              >
                <DatePicker style={{ width: "100%" }} />
              </Form.Item>
            </Col>
          </Row>
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
                      onChange={(v) => handleStatusChange(v, "prime")}
                      checkedChildren="Prime"
                    />
                  </Form.Item>
                  <Form.Item name="blacklisted" valuePropName="checked" noStyle>
                    <Switch
                      onChange={(v) => handleStatusChange(v, "blacklisted")}
                      checkedChildren="Blacklisted"
                    />
                  </Form.Item>
                </Space>
                <Alert
                  message="Either Prime or Blacklisted"
                  type="info"
                  showIcon
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span={24}>
              <Form.Item
                name="reference"
                label="Reference Partner"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>
            </Col>
          </Row>
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
                      {f.options?.map((o) => (
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
          {pLoading && <Spin />}
          {pError && <Alert type="error" message={pError} showIcon />}
          <Form.List name="products">
            {(fields, { add, remove }) => (
              <>
                {fields.map((field, idx) => (
                  <Card
                    key={field.key}
                    title={`Product #${idx + 1}`}
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
                          label="Product"
                          rules={[{ required: true }]}
                        >
                          <Select>
                            {productOptions.map((o) => (
                              <Option key={o.value} value={o.value}>
                                {o.label}
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
                          rules={[{ required: true }]}
                        >
                          <DatePicker style={{ width: "100%" }} />
                        </Form.Item>
                      </Col>
                    </Row>
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
                    <Form.Item
                      noStyle
                      shouldUpdate={(prev, cur) =>
                        prev.products?.[field.name]?.renewal !==
                        cur.products?.[field.name]?.renewal
                      }
                    >
                      {({ getFieldValue }) =>
                        getFieldValue(["products", field.name, "renewal"]) && (
                          <Row gutter={24}>
                            <Col xs={24} sm={12}>
                              <Form.Item
                                {...field}
                                name={[field.name, "expiryDate"]}
                                label="Expiry Date"
                                rules={[{ required: true }]}
                              >
                                <DatePicker style={{ width: "100%" }} />
                              </Form.Item>
                            </Col>
                            <Col xs={24} sm={12}>
                              <Form.Item
                                {...field}
                                name={[field.name, "renewalDate"]}
                                label="Renewal Date"
                                rules={[{ required: true }]}
                              >
                                <DatePicker style={{ width: "100%" }} />
                              </Form.Item>
                            </Col>
                          </Row>
                        )
                      }
                    </Form.Item>
                    <Row gutter={24}>
                      <Col xs={24} sm={12}>
                        <Form.Item
                          {...field}
                          name={[field.name, "details"]}
                          label="Details"
                        >
                          <Input />
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
                >
                  Add Product
                </Button>
              </>
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
