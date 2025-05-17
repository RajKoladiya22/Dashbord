import React from "react";
import { Modal } from "antd";
import { EditOutlined } from "@ant-design/icons";
import { UpdateCustomerForm } from "../form"; 
import { Customer } from "../../../types/customer.type";


interface UpdateCustomerProps {
  adminId: string;
  id: string;
  open: boolean;
  onClose: () => void;
  customer: Customer; // Pass the full customer data for update
}

export const UpdateCustomerModel: React.FC<UpdateCustomerProps> = ({
  // id,
  // adminId,
  open,
  onClose,
  customer,
}) => {
  const handleUpdate = () => {
  //  console.log("Updated payload:", updatedPayload);
    // You can add additional logic here, like API calls, then close the modal.
    onClose();
  };

  return (
    <Modal
      title={
        <>
          <EditOutlined /> Update Customer
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
      <UpdateCustomerForm customer={customer} onUpdate={handleUpdate} />
    </Modal>
  );
};
