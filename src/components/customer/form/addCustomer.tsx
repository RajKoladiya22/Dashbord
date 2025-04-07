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
// } from "antd";
// import { PlusOutlined } from "@ant-design/icons";
// import { indianStates, indianCities } from "./data/indianLocations"; // You'll need to import/define these

// const { Option } = Select;
// const { TextArea } = Input;

// const formItemLayout = {
//   labelCol: { xs: { span: 24 }, sm: { span: 8 } },
//   wrapperCol: { xs: { span: 24 }, sm: { span: 16 } },
// };

// const tailFormItemLayout = {
//   wrapperCol: { xs: { span: 24, offset: 0 }, sm: { span: 16, offset: 8 } },
// };

// // Dummy product options
// const productOptions = [
//   { value: "prod1", label: "Product 1" },
//   { value: "prod2", label: "Product 2" },
//   { value: "prod3", label: "Product 3" },
// ];

// export const AddCustomer: React.FC = () => {
//   const [form] = Form.useForm();
//   const [selectedState, setSelectedState] = useState<string | undefined>();

//   const onFinish = (values: any) => {
//     console.log("Received values of form: ", values);
//   };

//   const handlePrimeChange = (checked: boolean) => {
//     if (checked) form.setFieldsValue({ blacklisted: false });
//   };

//   const handleBlacklistChange = (checked: boolean) => {
//     if (checked) form.setFieldsValue({ prime: false });
//   };

//   return (
//     <Form
//       {...formItemLayout}
//       form={form}
//       name="register"
//       onFinish={onFinish}
//       style={{ maxWidth: "100%", margin: "0 auto", padding: "24px" }}
//       scrollToFirstError
//     >
//       <div style={{ display: "flex", flexWrap: "wrap", gap: "24px" }}>
//         {/* Basic Details Card */}
//         <Card title="Basic Information" style={{ flex: "1 1 100%" }}>
//           <Row gutter={24}>
//             <Col xs={24} sm={12}>
//               <Form.Item
//                 name="company"
//                 label="Company"
//                 rules={[{ required: true, message: "Company Name is required!" }]}
//               >
//                 <Input placeholder="Company Name" />
//               </Form.Item>
//             </Col>
//             <Col xs={24} sm={12}>
//               <Form.Item
//                 name="name"
//                 label="Contact Person"
//                 rules={[{ required: true, message: "Contact Person Name required!" }]}
//               >
//                 <Input placeholder="Contact Person Name" />
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
//                 />
//               </Form.Item>
//             </Col>
//             <Col xs={24} sm={12}>
//               <Form.Item
//                 name="email"
//                 label="Email"
//                 rules={[{ type: "email", message: "Invalid email!" }]}
//               >
//                 <Input placeholder="email@domain.com" />
//               </Form.Item>
//             </Col>
//           </Row>
//         </Card>

//         {/* Address Details Card */}
//         <Card title="Address Details" style={{ flex: "1 1 100%" }}>
//           <Row gutter={24}>
//             <Col xs={24} sm={12}>
//               <Form.Item name="state" label="State">
//                 <Select
//                   showSearch
//                   placeholder="Select State"
//                   onChange={(value) => setSelectedState(value)}
//                   filterOption={(input, option: any) =>
//                     option?.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
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
//                   filterOption={(input, option: any) =>
//                     option?.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
//                   }
//                 >
//                   {(selectedState ? indianCities[selectedState] : []).map((city) => (
//                     <Option key={city} value={city}>
//                       {city}
//                     </Option>
//                   ))}
//                 </Select>
//               </Form.Item>
//             </Col>
//           </Row>

//           <Row gutter={24}>
//             <Col xs={24} sm={12}>
//               <Form.Item name="area" label="Area">
//                 <Input placeholder="Type your area" />
//               </Form.Item>
//             </Col>
//             <Col xs={24} sm={12}>
//               <Form.Item name="address" label="Address">
//                 <TextArea placeholder="Full Address" rows={3} />
//               </Form.Item>
//             </Col>
//           </Row>
//           <Row gutter={24}>
//             <Col xs={24} sm={12}>
//               <Form.Item
//                 name="joiningDate"
//                 label="Joining Date"
//                 rules={[{ required: true, message: "Joining date is required!" }]}
//               >
//                 <DatePicker style={{ width: "100%" }} />
//               </Form.Item>
//             </Col>
//           </Row>
//         </Card>

//         {/* Additional Information Card */}
//         <Card title="Additional Information" style={{ flex: "1 1 100%" }}>
//           <Row gutter={24}>
//             <Col xs={24} sm={12}>
//               <Form.Item name="tallyNo" label="Tally Serial No.">
//                 <Input placeholder="9-digit number" maxLength={9} />
//               </Form.Item>
//             </Col>
//             <Col xs={24} sm={12}>
//               <Row gutter={16}>
//                 <Col span={12}>
//                   <Form.Item name="prime" label="Prime" valuePropName="checked">
//                     <Switch onChange={handlePrimeChange} />
//                   </Form.Item>
//                 </Col>
//                 <Col span={12}>
//                   <Form.Item name="blacklisted" label="Blacklisted" valuePropName="checked">
//                     <Switch onChange={handleBlacklistChange} />
//                   </Form.Item>
//                 </Col>
//               </Row>
//             </Col>
//           </Row>

//           <Form.Item name="reference" label="Reference" valuePropName="checked">
//             <Switch />
//           </Form.Item>

//           {/* Conditionally render Reference Selection when Reference is enabled */}
//           <Form.Item
//             shouldUpdate={(prevValues, currentValues) =>
//               prevValues.reference !== currentValues.reference
//             }
//           >
//             {({ getFieldValue }) =>
//               getFieldValue("reference") ? (
//                 <Form.Item
//                   name="referenceChoice"
//                   label="Select Partner"
//                   rules={[{ required: true, message: "Please select a reference!" }]}
//                 >
//                   <Select placeholder="Select Partner">
//                     <Option value="ref1">Mehul patel / Shivans infosys</Option>
//                     <Option value="ref2">Raj Koladiya / MagicallySoft</Option>
//                   </Select>
//                 </Form.Item>
//               ) : null
//             }
//           </Form.Item>

//           <Form.Item name="remark" label="Remark">
//             <TextArea showCount maxLength={100} placeholder="Additional remarks..." />
//           </Form.Item>
//         </Card>

//         {/* Products Section */}
//         <Card title="Products" style={{ flex: "1 1 100%" }}>
//           <Form.List name="products">
//             {(fields, { add, remove }) => (
//               <>
//                 {fields.map((field, index) => (
//                   <Card
//                     key={field.key}
//                     style={{ marginBottom: "24px", padding: "16px" }}
//                     type="inner"
//                     title={`Product #${index + 1}`}
//                     extra={
//                       <Button type="link" danger onClick={() => remove(field.name)}>
//                         Remove
//                       </Button>
//                     }
//                   >
//                     <Row gutter={24}>
//                       <Col xs={24} sm={12}>
//                         <Form.Item
//                           {...field}
//                           name={[field.name, "productDetailId"]}
//                           fieldKey={[field.fieldKey, "productDetailId"]}
//                           label="Product Detail"
//                           rules={[{ required: true, message: "Product detail is required" }]}
//                         >
//                           <Select placeholder="Select product detail">
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
//                           fieldKey={[field.fieldKey, "purchaseDate"]}
//                           label="Purchase Date"
//                           rules={[{ required: true, message: "Purchase date is required" }]}
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
//                           fieldKey={[field.fieldKey, "renewalDate"]}
//                           label="Renewal Date"
//                           rules={[{ required: true, message: "Renewal date is required" }]}
//                         >
//                           <DatePicker style={{ width: "100%" }} />
//                         </Form.Item>
//                       </Col>
//                       <Col xs={24} sm={12}>
//                         <Form.Item
//                           {...field}
//                           name={[field.name, "details"]}
//                           fieldKey={[field.fieldKey, "details"]}
//                           label="Details"
//                         >
//                           <Input placeholder="Enter details" />
//                         </Form.Item>
//                       </Col>
//                     </Row>
//                   </Card>
//                 ))}
//                 <Form.Item>
//                   <Button
//                     type="dashed"
//                     onClick={() => add()}
//                     block
//                     icon={<PlusOutlined />}
//                   >
//                     Add Product
//                   </Button>
//                 </Form.Item>
//               </>
//             )}
//           </Form.List>
//         </Card>
//       </div>

//       <Form.Item {...tailFormItemLayout} style={{ marginTop: "24px" }}>
//         <Button type="primary" htmlType="submit" block size="large">
//           Save Customer
//         </Button>
//       </Form.Item>
//     </Form>
//   );
// };


// ****************** //
//   //////////////
//   //  FINAL   //
//   //////////////
// ****************** //



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
//   Alert
// } from "antd";
// import { PlusOutlined } from "@ant-design/icons";
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

// export const AddCustomer: React.FC = () => {
//   const [form] = Form.useForm();
//   const [selectedState, setSelectedState] = useState<string | undefined>();

//   const onFinish = (values: any) => {
//     console.log("Received values of form: ", values);
//   };

//   const handleStatusChange = (changedValue: boolean, fieldName: 'prime' | 'blacklisted') => {
//     if (changedValue) {
//       form.setFieldsValue({ [fieldName === 'prime' ? 'blacklisted' : 'prime']: false });
//     }
//   };

//   return (
//     <Form
//       {...formItemLayout}
//       form={form}
//       name="register"
//       onFinish={onFinish}
//       style={{ maxWidth: "100%", margin: "0 auto"}}
//       scrollToFirstError
//     >
//       <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
//         {/* Basic Information Card */}
//         <Card title="Basic Information" bordered={false}>
//           <Row gutter={24}>
//             <Col xs={24} sm={12}>
//               <Form.Item
//                 name="company"
//                 label="Company Name"
//                 rules={[{ required: true, message: "Company Name is required!" }]}
//               >
//                 <Input placeholder="Enter company name" />
//               </Form.Item>
//             </Col>
//             <Col xs={24} sm={12}>
//               <Form.Item
//                 name="name"
//                 label="Contact Person"
//                 rules={[{ required: true, message: "Contact Person Name required!" }]}
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
//                   filterOption={(input, option : any) =>
//                     (option?.children as string).toLowerCase().includes(input.toLowerCase())
//                   }
//                 >
//                   {indianStates.map((state) => (
//                     <Option key={state} value={state}>{state}</Option>
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
//                     (option?.children as string).toLowerCase().includes(input.toLowerCase())
//                   }
//                 >
//                   {(selectedState ? indianCities[selectedState] : []).map((city) => (
//                     <Option key={city} value={city}>{city}</Option>
//                   ))}
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
//                 rules={[{ required: true, message: "Joining date is required!" }]}
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
//               <Form.Item name="tallyNo" label="Tally Serial No.">
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
//                       onChange={(checked) => handleStatusChange(checked, 'prime')}
//                     />
//                   </Form.Item>
//                   <Form.Item name="blacklisted" valuePropName="checked" noStyle>
//                     <Switch
//                       checkedChildren="Blacklisted"
//                       unCheckedChildren="Blacklisted"
//                       onChange={(checked) => handleStatusChange(checked, 'blacklisted')}
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
//               getFieldValue('reference') && (
//                 <Form.Item
//                   name="referenceChoice"
//                   label="Select Partner"
//                   rules={[{ required: true, message: "Please select a reference partner" }]}
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
//               <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
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
//                           rules={[{ required: true }]}
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
//                           rules={[{ required: true }]}
//                         >
//                           <DatePicker style={{ width: '100%' }} />
//                         </Form.Item>
//                       </Col>
//                     </Row>
//                     <Row gutter={24}>
//                       <Col xs={24} sm={12}>
//                         <Form.Item
//                           {...field}
//                           name={[field.name, "renewalDate"]}
//                           label="Renewal Date"
//                           rules={[{ required: true }]}
//                         >
//                           <DatePicker style={{ width: '100%' }} />
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
//             style={{ width: '100%', maxWidth: 400, margin: '0 auto' }}
//           >
//             Save Customer
//           </Button>
//         </Form.Item>
//       </Space>
//     </Form>
//   );
// };


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
  Alert
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
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

export const AddCustomer: React.FC = () => {
  const [form] = Form.useForm();
  const [selectedState, setSelectedState] = useState<string | undefined>();

  const onFinish = (values: any) => {
    // Construct payload as per your sample structure
    const payload = {
      CustomerData: {
        customer: {
          // You can adjust these fields as required
          adminId: "dummy-admin-id",
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
                referenceId: values.referenceChoice, // using selected reference as id
                Name: values.referenceChoice,
                // Additional partner details can be added as needed
              }
            : null,
        },
        adminCustomFields: [], // Add your custom fields here
        products: values.products || [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    };

    // Create a Blob with JSON data and trigger download of CustomerData.json
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "CustomerData.json";
    a.click();
    URL.revokeObjectURL(url);

    console.log("Customer data saved", payload);
  };

  const handleStatusChange = (changedValue: boolean, fieldName: "prime" | "blacklisted") => {
    if (changedValue) {
      form.setFieldsValue({ [fieldName === "prime" ? "blacklisted" : "prime"]: false });
    }
  };

  return (
    <Form
      {...formItemLayout}
      form={form}
      name="register"
      onFinish={onFinish}
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
                rules={[{ required: true, message: "Company Name is required!" }]}
              >
                <Input placeholder="Enter company name" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                name="name"
                label="Contact Person"
                rules={[{ required: true, message: "Contact Person Name required!" }]}
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
                    (option?.children as string).toLowerCase().includes(input.toLowerCase())
                  }
                >
                  {indianStates.map((state) => (
                    <Option key={state} value={state}>{state}</Option>
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
                    (option?.children as string).toLowerCase().includes(input.toLowerCase())
                  }
                >
                  {(selectedState ? indianCities[selectedState] : []).map((city) => (
                    <Option key={city} value={city}>{city}</Option>
                  ))}
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
                rules={[{ required: true, message: "Joining date is required!" }]}
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
                      onChange={(checked) => handleStatusChange(checked, "prime")}
                    />
                  </Form.Item>
                  <Form.Item name="blacklisted" valuePropName="checked" noStyle>
                    <Switch
                      checkedChildren="Blacklisted"
                      unCheckedChildren="Blacklisted"
                      onChange={(checked) => handleStatusChange(checked, "blacklisted")}
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
                  rules={[{ required: true, message: "Please select a reference partner" }]}
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
              <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
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
                          rules={[{ required: true, message: "Product detail is required" }]}
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
                          rules={[{ required: true, message: "Purchase date is required" }]}
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
                          rules={[{ required: true, message: "Renewal date is required" }]}
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
            Save Customer
          </Button>
        </Form.Item>
      </Space>
    </Form>
  );
};
