// src/components/EditProductModal.tsx
import React, { useEffect, useState } from "react";
import { Modal, Form, Input, Select, Button, message } from "antd";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { useAppDispatch } from "../../hooks";
import { updateProduct } from "../../redux/slice/products/productSlice";
import { Product } from "../../types/product.type";



// const { Option } = Select;

interface EditProductModalProps {
  visible: boolean;
  product: Product | null;
  onCancel: () => void;
}

export const EditProductModal: React.FC<EditProductModalProps> = ({
  visible,
  product,
  onCancel,
}) => {
  const [form] = Form.useForm();
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);

  // When `product` changes, populate the form
  useEffect(() => {
    if (product) {
      form.setFieldsValue({
        productName: product.productName,
        productCategory: product.productCategory,
        productPrice: product.productPrice,
        description: product.description,
        link: product.productLink,
        tags: product.tags,
        specifications: Object.entries(product.specifications || {}).map(
          ([title, value]) => ({ title, value })
        ),
      });
    } else {
      form.resetFields();
    }
  }, [product, form]);

  const onFinish = async (vals: any) => {
    if (!product) return;
    setLoading(true);
    // Build the payload shape your API expects
    const payload : any= {
      ...Object.fromEntries(
        ["productName","productCategory","productPrice","description","link","tags"]
        .map((key) => [key, vals[key]])
      ),
      specifications: (vals.specifications || []).reduce(
        (acc: Record<string, any>, spec: any) => {
          acc[spec.title] = spec.value;
          return acc;
        },
        {}
      ),
    };
    try {
      await dispatch(
        updateProduct({ id: product.id, data: { 
          productName: payload.productName,
          productCategory: payload.productCategory,
          productPrice: payload.productPrice,
          description: payload.description,
          productLink: payload.productLink,
          tags: payload.tags,
          specifications: payload.specifications,
        }})
      ).unwrap();
      message.success("Product updated successfully");
      onCancel();
    } catch (err: any) {
      message.error("Update failed: " + err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Edit Product"
      visible={visible}
      onCancel={onCancel}
      onOk={() => form.submit()}                      /* see below :contentReference[oaicite:0]{index=0} */
      confirmLoading={loading}
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
          label="Product Categories"
          rules={[{ required: true }]}
        >
          <Select mode="tags" placeholder="Select or add categories" />
        </Form.Item>
        <Form.Item
          name="productPrice"
          label="Price (incl. tax)"
          rules={[{ required: true, message: "Enter product price" }]}
        >
          <Input prefix="₹" placeholder="e.g. 15,499" />
        </Form.Item>
        <Form.Item name="description" label="Description">
          <Input.TextArea rows={3} />
        </Form.Item>
        <Form.Item name="link" label="Product Link">
          <Input placeholder="https://..." />
        </Form.Item>
        <Form.Item name="tags" label="Tags">
          <Select mode="tags" placeholder="Add tags" />
        </Form.Item>

        {/* Specifications list */}
        <Form.List name="specifications">
          {(fields, { add, remove }) => (
            <>
              <label>Specifications</label> {/* simple header :contentReference[oaicite:1]{index=1} */}
              {fields.map(({ key, name, ...restField }) => (
                <div key={key} style={{ display: "flex", marginBottom: 8 }}>
                  <Form.Item
                    {...restField}
                    name={[name, "title"]}
                    rules={[{ required: true, message: "Enter title" }]}
                    style={{ flex: 1, marginRight: 8 }}
                  >
                    <Input placeholder="Title" />
                  </Form.Item>
                  <Form.Item
                    {...restField}
                    name={[name, "value"]}
                    rules={[{ required: true, message: "Enter value" }]}
                    style={{ flex: 1, marginRight: 8 }}
                  >
                    <Input placeholder="Value" />
                  </Form.Item>
                  <MinusCircleOutlined onClick={() => remove(name)} />
                </div>
              ))}
              <Button type="dashed" block onClick={() => add()} icon={<PlusOutlined />}>
                Add Specification
              </Button>
            </>
          )}
        </Form.List>
      </Form>
    </Modal>
  );
};
