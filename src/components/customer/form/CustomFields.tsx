import React, { useImperativeHandle, useState } from "react";
import { Form, Input, Select, Checkbox, Button } from "antd";
import { AdminCustomField } from "../../../types/customField.type";

const { Option } = Select;

export interface CustomFieldsFormProps {
  onCancel: () => void;
  onSubmit: (values: AdminCustomField) => void;
}

// Use React.forwardRef to expose the submit method to the parent.
export const CustomFieldsForm = React.forwardRef<any, CustomFieldsFormProps>(
  ({ onSubmit }, ref) => {
    const [form] = Form.useForm<AdminCustomField>();
    const [submitting, setSubmitting] = useState(false);

    // Expose the submit function to the parent via ref.
    useImperativeHandle(ref, () => ({
      submit: () => {
        form.submit();
      },
    }));

    const onFinish = async (values: AdminCustomField) => {
      setSubmitting(true);
      try {
        // Await onSubmit if it returns a promise.
        await onSubmit!(values);
      } catch (error) {
        console.error("Submission error:", error);
      } finally {
        form.resetFields();
        setSubmitting(false);
      }
    };

    return (
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item
          name="fieldName"
          label="Field Name"
          rules={[{ required: true, message: "Please enter the field name" }]}
        >
          <Input placeholder="Enter field name" />
        </Form.Item>

        <Form.Item
          name="fieldType"
          label="Field Type"
          rules={[{ required: true, message: "Please select the field type" }]}
        >
          <Select placeholder="Select field type">
            <Option value="text">Text</Option>
            <Option value="number">Number</Option>
            <Option value="date">Date</Option>
            <Option value="color">Color</Option>
            <Option value="range">Range</Option>
            <Option value="select">Select</Option>
          </Select>
        </Form.Item>

        <Form.Item name="isRequired" valuePropName="checked">
          <Checkbox>Required</Checkbox>
        </Form.Item>

        {/* Conditionally render options and multi select only when fieldType is "select" */}
        <Form.Item
          shouldUpdate={(prevValues, curValues) =>
            prevValues.fieldType !== curValues.fieldType
          }
        >
          {({ getFieldValue }) => {
            const fieldType = getFieldValue("fieldType");
            if (fieldType === "select") {
              return (
                <>
                  <Form.Item
                    name="options"
                    label="Options (comma separated)"
                    rules={[
                      {
                        required: true,
                        message: "Please enter options for select field",
                      },
                    ]}
                  >
                    <Input placeholder="Enter options separated by commas" />
                  </Form.Item>
                  <Form.Item name="isMultiSelect" valuePropName="checked">
                    <Checkbox>Allow multiple selections</Checkbox>
                  </Form.Item>
                </>
              );
            }
            return null;
          }}
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={submitting}
            disabled={submitting}
          >
            Submit
          </Button>
        </Form.Item>
      </Form>
    );
  }
);

export default CustomFieldsForm;
