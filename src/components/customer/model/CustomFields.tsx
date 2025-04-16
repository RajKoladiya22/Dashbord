// CustomFieldsModel.tsx
import React, { useRef } from "react";
import { Modal, message } from "antd";
import { CustomFieldsForm } from "../form";
import { CustomFieldsFormValues } from "../form/CustomFields";
import { useAppDispatch } from "../../../hooks";
import { addAdminCustomField } from "../../../redux/slice/customer/customfieldSlice";

interface CustomFieldsModelProps {
  visible: boolean;
  onCancel: () => void;
  // Optionally, a callback to update the parent UI with the new field.
  onSubmit? : any
}

export const CustomFieldsModel: React.FC<CustomFieldsModelProps> = ({
  visible,
  onCancel,
  onSubmit,
}) => {
  const formRef = useRef<any>(null);
  const dispatch = useAppDispatch();
  // Handler to submit custom field data using the Fetch API.
  const handleSubmitCustomFields = async (values: CustomFieldsFormValues) => {
    // Prepare payload. For the "options" field, split comma-separated string into an array.
    // console.log("values----->\v", values);
    

    const payload = {
      fieldName: values.fieldName,
      fieldType: values.fieldType,
      is_required: values.isRequired || false,
      // Convert options string to array if defined and field type is 'select'
      options:
        values.fieldType === "select" && values.options
          ? values.options.split(",").map((opt: string) => opt.trim())
          : [],
      isMultiSelect: values.fieldType === "select" ? (values.isMultiSelect || false) : false,
    };


    // console.log("payload----->\v", payload);
    try {
      // Dispatch the addAdminCustomField async thunk.
      await dispatch(addAdminCustomField(payload)).unwrap();
      message.success("Custom field added successfully!");
      onSubmit();
    } catch (err: any) {
      console.error(err);
      message.error("Failed to add custom field");
    }
  };

  const handleOk = () => {
    if (formRef.current) {
      formRef.current.submit();
    }
  };

  return (
    <Modal
      visible={visible}
      title="Add Custom Field"
      onCancel={onCancel}
      onOk={handleOk}
      footer={null}
      destroyOnClose
    >
      <CustomFieldsForm
        ref={formRef}
        onCancel={onCancel}
        onSubmit={handleSubmitCustomFields}
        // visible={visible}
      />
    </Modal>
  );
};

 
