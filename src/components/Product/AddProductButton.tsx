import { useState } from "react";
import {
  Button,
  Modal,
  Form,
  Input,
  Select,
  message,

  Row,
  Col
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { MinusCircleOutlined } from '@ant-design/icons';

const { Option } = Select;

export const AddProductButton = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const showModal = () => setIsModalVisible(true);

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      console.log("Product created:", values);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      message.success("Product created successfully!");
      form.resetFields();
      setIsModalVisible(false);
    } catch (error) {
      message.error("Failed to create product.");
    } finally {
      setLoading(false);
    }
  };

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
            <Select placeholder="Select category">
              <Option value="plugin">Plugin</Option>
              <Option value="app">App</Option>
              <Option value="finance">Finance</Option>
              <Option value="marketing">Marketing</Option>
              {/* Add more categories as needed */}
            </Select>
          </Form.Item>

          <Form.Item
            name="productPrice"
            label="Product Price (including tax)"
            rules={[{ required: true, message: "Please enter the price!" }]}
          >
            <Input prefix="₹" type="number" placeholder="Enter product price" />
          </Form.Item>

          <Form.Item name="description" label="Description">
            <Input.TextArea rows={4} placeholder="Product description" />
          </Form.Item>

          <Form.Item name="link" label="Product Link">
            <Input placeholder="https://example.com/product-link" />
          </Form.Item>

          <Form.Item name="tags" label="Tags">
            <Select mode="tags" style={{ width: '100%' }} placeholder="Add tags" />
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
                        name={[name, 'title']}
                        rules={[{ required: true, message: 'Enter title' }]}
                      >
                        <Input placeholder="Specification Title" />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        {...restField}
                        name={[name, 'value']}
                        rules={[{ required: true, message: 'Enter value' }]}
                      >
                        <Input placeholder="Specification Value" />
                      </Form.Item>
                    </Col>
                    <Col span={2}>
                      <MinusCircleOutlined onClick={() => remove(name)} style={{ color: 'red' }} />
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
};
