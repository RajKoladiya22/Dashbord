// import { useState } from "react";
// import {
//   Button,
//   Modal,
//   Form,
//   Input,
//   Select,
//   message,

//   Row,
//   Col
// } from "antd";
// import { PlusOutlined } from "@ant-design/icons";
// import { MinusCircleOutlined } from '@ant-design/icons';

// const { Option } = Select;

// export const AddProductButton = () => {
//   const [isModalVisible, setIsModalVisible] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [form] = Form.useForm();

//   const showModal = () => setIsModalVisible(true);

//   const handleCancel = () => {
//     setIsModalVisible(false);
//     form.resetFields();
//   };

//   const onFinish = async (values: any) => {
//     setLoading(true);
//     try {
//       console.log("Product created:", values);
//       await new Promise((resolve) => setTimeout(resolve, 1000));
//       message.success("Product created successfully!");
//       form.resetFields();
//       setIsModalVisible(false);
//     } catch (error) {
//       message.error("Failed to create product.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <>
//       <Button icon={<PlusOutlined />} onClick={showModal}>
//         Add Product
//       </Button>
//       <Modal
//         title="Add Product"
//         open={isModalVisible}
//         onCancel={handleCancel}
//         footer={null}
//         destroyOnClose
//         width={800}
//       >
//         <Form form={form} layout="vertical" onFinish={onFinish}>
//           <Form.Item
//             name="productName"
//             label="Product Name"
//             rules={[{ required: true, message: "Please input the product name!" }]}
//           >
//             <Input placeholder="Product Name" />
//           </Form.Item>

//           <Form.Item
//             name="productCategory"
//             label="Product Category"
//             rules={[{ required: true, message: "Please select the category!" }]}
//           >
//             <Select placeholder="Select category">
//               <Option value="plugin">Plugin</Option>
//               <Option value="app">App</Option>
//               <Option value="finance">Finance</Option>
//               <Option value="marketing">Marketing</Option>
//               {/* Add more categories as needed */}
//             </Select>
//           </Form.Item>

//           <Form.Item
//             name="productPrice"
//             label="Product Price (including tax)"
//             rules={[{ required: true, message: "Please enter the price!" }]}
//           >
//             <Input prefix="₹" type="number" placeholder="Enter product price" />
//           </Form.Item>

//           <Form.Item name="description" label="Description">
//             <Input.TextArea rows={4} placeholder="Product description" />
//           </Form.Item>

//           <Form.Item name="link" label="Product Link">
//             <Input placeholder="https://example.com/product-link" />
//           </Form.Item>

//           <Form.Item name="tags" label="Tags">
//             <Select mode="tags" style={{ width: '100%' }} placeholder="Add tags" />
//           </Form.Item>

//           <Form.List name="specifications">
//             {(fields, { add, remove }) => (
//               <>
//                 <label>Specifications</label>
//                 {fields.map(({ key, name, ...restField }) => (
//                   <Row gutter={8} key={key} align="middle">
//                     <Col span={10}>
//                       <Form.Item
//                         {...restField}
//                         name={[name, 'title']}
//                         rules={[{ required: true, message: 'Enter title' }]}
//                       >
//                         <Input placeholder="Specification Title" />
//                       </Form.Item>
//                     </Col>
//                     <Col span={12}>
//                       <Form.Item
//                         {...restField}
//                         name={[name, 'value']}
//                         rules={[{ required: true, message: 'Enter value' }]}
//                       >
//                         <Input placeholder="Specification Value" />
//                       </Form.Item>
//                     </Col>
//                     <Col span={2}>
//                       <MinusCircleOutlined onClick={() => remove(name)} style={{ color: 'red' }} />
//                     </Col>
//                   </Row>
//                 ))}
//                 <Form.Item>
//                   <Button type="dashed" onClick={() => add()} block>
//                     + Add Specification
//                   </Button>
//                 </Form.Item>
//               </>
//             )}
//           </Form.List>

//           <Form.Item>
//             <Button type="primary" htmlType="submit" loading={loading} block>
//               Create
//             </Button>
//           </Form.Item>
//         </Form>
//       </Modal>
//     </>
//   );
// };

// src/components/AddProductButton.tsx
import React, { useState, useCallback } from "react";
import { Button, Modal, Form, Input, Select, message, Row, Col } from "antd";
import { PlusOutlined, MinusCircleOutlined } from "@ant-design/icons";
import { useAppDispatch } from "../../hooks";
import { createProduct  } from "../../redux/slice/products/productSlice";

const { Option } = Select;

export const AddProductButton: React.FC = React.memo(() => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const dispatch = useAppDispatch();

  // Handlers wrapped in useCallback to avoid re-creating on every render :contentReference[oaicite:0]{index=0}
  const showModal = useCallback(() => {
    setIsModalVisible(true);
  }, []);

  

  const handleCancel = useCallback(() => {
    setIsModalVisible(false);
    form.resetFields();
  }, [form]);



  // Memoize payload builder so it's only re-created when `values` change :contentReference[oaicite:1]{index=1}
  const buildPayload = useCallback((values: any) => ({
    product_name: values.productName,
    product_category: Array.isArray(values.productCategory)
      ? values.productCategory
      : [values.productCategory],
    product_price: values.productPrice,
    description: values.description,
    product_link: values.link,
    tags: values.tags || [],
    specifications:
      values.specifications?.reduce((acc: any, spec: any) => {
        acc[spec.title] = spec.value;
        return acc;
      }, {}) || {},
  }), []);

  // onFinish wrapped in useCallback to keep referential integrity :contentReference[oaicite:2]{index=2}
  const onFinish = useCallback(
    async (values: any) => {
      setLoading(true);
      const payload = buildPayload(values);
      try {
        await dispatch(createProduct(payload)).unwrap(); // dispatch thunk
        message.success("Product created successfully!");
        form.resetFields();
        setIsModalVisible(false);
      } catch (err: any) {
        console.error(err);
        message.error("Failed to add product");
      } finally {
        setLoading(false);
      }
    },
    [dispatch, buildPayload, form]
  );

  return (
    <>
      <Button icon={<PlusOutlined />} onClick={showModal}>
        Add Product
      </Button>
      <Modal
        title="Add Product"
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        destroyOnClose
        width={800}
      >
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item
            name="productName"
            label="Product Name"
            rules={[{ required: true, message: "Please input the product name!" }]}
          >
            <Input placeholder="Product Name" />
          </Form.Item>

          <Form.Item
            name="productCategory"
            label="Product Category"
            rules={[{ required: true, message: "Please select the category!" }]}
          >
            <Select mode="tags" placeholder="Select or type categories">
              <Option value="Electronics">Electronics</Option>
              <Option value="Audio">Audio</Option>
              <Option value="Automobile">Automobile</Option>
              {/* add your own options */}
            </Select>
          </Form.Item>

          <Form.Item
            name="productPrice"
            label="Product Price (incl. tax)"
            rules={[{ required: true, message: "Please enter the price!" }]}
          >
            <Input prefix="₹" placeholder="Enter product price" />
          </Form.Item>

          <Form.Item name="description" label="Description">
            <Input.TextArea rows={4} placeholder="Product description" />
          </Form.Item>

          <Form.Item name="link" label="Product Link">
            <Input placeholder="https://example.com/product-link" />
          </Form.Item>

          <Form.Item name="tags" label="Tags">
            <Select mode="tags" style={{ width: "100%" }} placeholder="Add tags" />
          </Form.Item>

          <Form.List name="specifications">
            {(fields, { add, remove }) => (
              <>
                <label>Specifications</label>
                {fields.map(({ key, name, ...restField }) => (
                  <Row gutter={8} key={key} align="middle">
                    <Col span={10}>
                      <Form.Item
                        {...restField}
                        name={[name, "title"]}
                        rules={[{ required: true, message: "Enter title" }]}
                      >
                        <Input placeholder="Specification Title" />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        {...restField}
                        name={[name, "value"]}
                        rules={[{ required: true, message: "Enter value" }]}
                      >
                        <Input placeholder="Specification Value" />
                      </Form.Item>
                    </Col>
                    <Col span={2}>
                      <MinusCircleOutlined
                        onClick={() => remove(name)}
                        style={{ color: "red" }}
                      />
                    </Col>
                  </Row>
                ))}
                <Form.Item>
                  <Button type="dashed" onClick={() => add()} block>
                    + Add Specification
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
              Create
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
});

