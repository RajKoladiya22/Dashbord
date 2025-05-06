// UpdateFieldModel.tsx
import React from "react";
import { Modal } from "antd";
import { EditOutlined } from "@ant-design/icons";
import { useAppDispatch } from "../../../hooks";
import { updateAdminCustomField } from "../../../redux/slice/customer/customfieldSlice";
import { UpdateFieldForm } from "../form";

export interface CustomerData {
  id: string;
  adminId: string;
  fieldName: string;
  fieldType: string;
  isRequired: boolean;
  options: string[];
  isMultiSelect: boolean;
  created_at: string;
  updated_at: string;
}

interface UpdateCustomerProps {
  adminId: string;
  id: string;
  open: boolean;
  onClose: () => void;
  updateField: CustomerData; // Field data to update.
}

export const UpdateFieldModel: React.FC<UpdateCustomerProps> = ({
  open,
  onClose,
  updateField,
}) => {
  const dispatch = useAppDispatch();

  const handleUpdate = async (updatedPayload: any) => {
    try {
      // Dispatch the update thunk with the payload.
      // console.log("updatedPayload---->", updatedPayload);
      
      await dispatch(updateAdminCustomField(updatedPayload)).unwrap();
      // Optionally, show a success message here.
    } catch (error) {
      console.error("Update failed:", error);
    } finally {
      onClose(); // Close modal on completion.
    }
  };

  return (
    <Modal
      title={
        <>
          <EditOutlined /> Update: {updateField.fieldName}
        </>
      }
      open={open}
      onCancel={onClose}
      footer={null}
      centered
      width={{
        xs: "90%",
        sm: "80%",
        md: "70%",
        lg: "60%",
        xl: "50%",
        xxl: "40%",
      }}
    >
      <UpdateFieldForm updateField={updateField} onUpdate={handleUpdate} />
    </Modal>
  );
};


