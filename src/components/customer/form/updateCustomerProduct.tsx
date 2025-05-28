// src/components/Customer/UpdateCustomerForm.tsx
import React, { useEffect, useState, useCallback } from "react";
import {
  Button,
  DatePicker,
  Form,
  Input,
  Select,
  Switch,
  Card,
  Space,
  message,
} from "antd";

import dayjs from "dayjs";
import { useAppDispatch } from "../../../hooks";
import {
  listCustomers,
  updateSingleProduct,
} from "../../../redux/slice/customer/addcustomerSlice";

const { Option } = Select;

const formItemLayout = {
  labelCol: { xs: { span: 24 }, sm: { span: 8 } },
  wrapperCol: { xs: { span: 24 }, sm: { span: 16 } },
};
const tailFormItemLayout = {
  wrapperCol: { xs: { span: 24, offset: 0 }, sm: { span: 16, offset: 8 } },
};

interface UpdateCustomerFormProps {
  customerId: string;
  ProductId: string;
  product: any;
  onUpdate: () => void;
}

export const UpdateCustomerProduct: React.FC<UpdateCustomerFormProps> = ({
  product,
  customerId,
  ProductId,
  onUpdate,
}) => {
  //   console.log("\n\ncustomerId-->", customerId);
  //   console.log("\n\n ProductId-->", ProductId);

  const [form] = Form.useForm();
  const dispatch = useAppDispatch();
  const [submitting, setSubmitting] = useState(false);

  // seed form values & dynamic list when `customer` arrives
  useEffect(() => {
    // console.log("customer in update form--->",product);

    form.setFieldsValue({
      productId: product.product.productId,
      purchaseDate: dayjs(product.product.purchaseDate),
      renewal: product.product.renewal,
      renewPeriod: product.product.renewPeriod,
      expiryDate: product.product.expiryDate
        ? dayjs(product.product.expiryDate)
        : undefined,
      renewalDate: product.product.renewalDate
        ? dayjs(product.product.renewalDate)
        : undefined,
      details: product.product.details,
    });
  }, [product, form]);

  //   const onFinish = useCallback(
  //     async (vals: any) => {
  //       setSubmitting(true); // disable double‐submit

  //       try {
  //         const data: Partial<Customer> = {
  //           product: vals.products?.map((pr: any) => ({
  //             productId: pr.productId,
  //             purchaseDate: pr.purchaseDate.toISOString(),
  //             renewal: pr.renewal,
  //             renewPeriod: pr.renewPeriod,
  //             expiryDate: pr.expiryDate?.toISOString(),
  //             renewalDate: pr.renewalDate?.toISOString(),
  //             details: pr.details,
  //           })),
  //           adminCustomFields: vals.adminCustomFields
  //             ? vals.adminCustomFields
  //             : {}, // ensure array
  //         };

  //         console.log("customer data--->", data);
  //         await dispatch(updateCustomerProduct({ customerId: customer.id, ProductId: customer.id, data })).unwrap();
  //         dispatch(listCustomers({ status: true }));
  //         message.success("Customer updated successfully");
  //         onUpdate();
  //       } catch (e: any) {
  //         message.error(e.message || e || "Update failed");
  //       } finally {
  //         setSubmitting(false);
  //       }
  //     },
  //     [dispatch, form, customer.id, onUpdate]
  //   );
  const onFinish = useCallback(
    async (vals: any) => {
      setSubmitting(true);

      try {
        const updatedPayload = {
          productId: product.productId,
          purchaseDate: vals.purchaseDate.toISOString(),
          renewal: vals.renewal,
          renewPeriod: vals.renewPeriod,
          expiryDate: vals.expiryDate?.toISOString(),
          renewalDate: vals.renewalDate?.toISOString(),
          details: vals.details,
        };

        console.log("\n\n ProductId-->", ProductId);
        await dispatch(
          updateSingleProduct({
            customerId,
            ProductId,
            data: updatedPayload,
          })
        ).unwrap();
        await dispatch(listCustomers({ status: true }));
        message.success("Product updated successfully");
        onUpdate();
      } catch (err: any) {
        message.error(err.message || "Failed to update product");
      } finally {
        setSubmitting(false);
      }
    },
    [dispatch, customerId, product.id, onUpdate]
  );

  return (
    <>
      {/* <Form
      {...formItemLayout}
      form={form}
      onFinish={onFinish}
      scrollToFirstError
    >
      <Space direction="vertical" size="middle" style={{ display: "flex" }}>
        <Card
          title={product.product.productDetails?.productName}
          bordered={false}
        >
          <Form.Item
            name="purchaseDate"
            label="Purchase Date"
            // rules={[{ required: true, message: "Purchase Date is required" }]}
          >
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item
            name="renewal"
            label="Auto Renewal"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>

          <Form.Item
            name="renewPeriod"
            label="Renewal Period"
            // rules={[{ required: true, message: "Renewal Period is required" }]}
          >
            <Select>
              <Option value="monthly">Monthly</Option>
              <Option value="quarterly">Quarterly</Option>
              <Option value="yearly">Yearly</Option>
            </Select>
          </Form.Item>

          <Form.Item name="expiryDate" label="Expiry Date">
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item name="renewalDate" label="Next Renewal Date">
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item name="details" label="Product Notes">
            <Input.TextArea rows={3} />
          </Form.Item>
        </Card>

        {/* Submit */}
      {/* <Form.Item {...tailFormItemLayout}>
          <Button
            type="primary"
            htmlType="submit"
            loading={submitting}
            style={{ width: "100%" }}
          >
            Update Product
          </Button>
        </Form.Item>
      </Space>
    </Form> 
     */}

      <Form
        {...formItemLayout}
        form={form}
        onFinish={onFinish}
        scrollToFirstError
      >
        <Space direction="vertical" size="middle" style={{ display: "flex" }}>
          <Card
            title={product.product.productDetails?.productName}
            bordered={false}
          >
            <Form.Item
              name="purchaseDate"
              label="Purchase Date"
              rules={[{ required: true, message: "Purchase Date is required" }]}
            >
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>

            <Form.Item
              name="renewal"
              label="Auto Renewal"
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>

            {/* Conditional Rendering Based on 'renewal' */}
            <Form.Item
              shouldUpdate={(prevValues, currentValues) =>
                prevValues.renewal !== currentValues.renewal
              }
            >
              {({ getFieldValue }) =>
                getFieldValue("renewal") ? (
                  <>
                    <Form.Item
                      name="renewPeriod"
                      label="Renewal Period"
                      rules={[
                        {
                          required: true,
                          message: "Renewal Period is required",
                        },
                      ]}
                    >
                      <Select placeholder="Select Renewal Period">
                        <Option value="monthly">Monthly</Option>
                        <Option value="quarterly">Quarterly</Option>
                        <Option value="yearly">Yearly</Option>
                        <Option value="custom">Custom</Option>
                      </Select>
                    </Form.Item>

                    {/* Conditional Rendering Based on 'renewPeriod' */}
                    <Form.Item
                      shouldUpdate={(prevValues, currentValues) =>
                        prevValues.renewPeriod !== currentValues.renewPeriod
                      }
                    >
                      {({ getFieldValue }) =>
                        getFieldValue("renewPeriod") === "custom" ? (
                          <>
                            <Form.Item
                              name="expiryDate"
                              label="Expiry Date"
                              rules={[
                                {
                                  required: true,
                                  message: "Expiry Date is required",
                                },
                              ]}
                            >
                              <DatePicker style={{ width: "100%" }} />
                            </Form.Item>

                            <Form.Item
                              name="renewalDate"
                              label="Next Renewal Date"
                              rules={[
                                {
                                  required: true,
                                  message: "Next Renewal Date is required",
                                },
                              ]}
                            >
                              <DatePicker style={{ width: "100%" }} />
                            </Form.Item>
                          </>
                        ) : null
                      }
                    </Form.Item>
                  </>
                ) : null
              }
            </Form.Item>

            <Form.Item name="details" label="Product Notes">
              <Input.TextArea rows={3} />
            </Form.Item>
          </Card>

          {/* Submit */}
          <Form.Item {...tailFormItemLayout}>
            <Button
              type="primary"
              htmlType="submit"
              loading={submitting}
              style={{ width: "100%" }}
            >
              Update Product
            </Button>
          </Form.Item>
        </Space>
      </Form>
    </>
  );
};

export default UpdateCustomerProduct;
