// UpdateFieldForm.tsx
import React, { useState, useEffect } from "react";
import { Button, Form, Input, Select, Checkbox } from "antd";

const { Option } = Select;

export interface FieldData {
  id: string;
  admin_id: string;
  field_name: string;
  field_type: string;
  is_required: boolean;
  options: string[];
  is_multi_select: boolean;
  created_at: string;
  updated_at: string;
}

interface UpdateFieldFormProps {
  updateField?: FieldData;
  // onUpdate callback should return a promise if it does asynchronous work.
  onUpdate: (updatedPayload: {
    id: string;
    fieldName: string;
    fieldType: string;
    isRequired: boolean;
    options: string[];
    isMultiSelect: boolean;
  }) => Promise<any> | void;
}

export const UpdateFieldForm: React.FC<UpdateFieldFormProps> = ({
  updateField,
  onUpdate,
}) => {
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);

  // Pre-populate form values when updateField prop changes.
  useEffect(() => {
    if (updateField) {
      form.setFieldsValue({
        fieldName: updateField.field_name,
        fieldType: updateField.field_type,
        isRequired: updateField.is_required,
        // Convert options array to comma-separated string.
        options: updateField.options.join(", "),
        isMultiSelect: updateField.is_multi_select,
      });
    }
  }, [updateField, form]);

  const onFinish = async (values: any) => {
    // Build the payload for the update API. Ensure the field id is included.
    const payload = {
      id: updateField?.id || "",
      fieldName: values.fieldName,
      fieldType: values.fieldType,
      isRequired: values.isRequired || false,
      // Only process options if fieldType is "select"
      options:
        values.fieldType === "select" && values.options
          ? values.options.split(",").map((opt: string) => opt.trim())
          : [],
      isMultiSelect:
        values.fieldType === "select" ? (values.isMultiSelect || false) : false,
    };

    setSubmitting(true);
    try {
      // Call onUpdate with the payload. This function should perform the API call (e.g., dispatch a thunk).
      await onUpdate(payload);
    } catch (error) {
      console.error("Update failed:", error);
    } finally {
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

      {/* Conditionally render options and multi-select only when fieldType is "select" */}
      <Form.Item shouldUpdate={(prevValues, curValues) => prevValues.fieldType !== curValues.fieldType}>
        {({ getFieldValue }) => {
          const fieldType = getFieldValue("fieldType");
          if (fieldType === "select") {
            return (
              <>
                <Form.Item
                  name="options"
                  label="Options (comma separated)"
                  rules={[{ required: true, message: "Please enter options for select field" }]}
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
        <Button type="primary" htmlType="submit" loading={submitting} disabled={submitting}>
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};


