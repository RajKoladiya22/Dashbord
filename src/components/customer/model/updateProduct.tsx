import React from "react";
import { Modal } from "antd";
import { EditOutlined } from "@ant-design/icons";
import UpdateCustomerProduct from "../form/updateCustomerProduct";


interface UpdateCustomerProps {
  customerId: string;
  ProductId: string;
  open: boolean;
  onClose: () => void;
  product: any; // Pass the full customer data for update
}

export const ProductUpdateModal: React.FC<UpdateCustomerProps> = ({
  customerId,
  ProductId,
  open,
  onClose,
  product, // Pass the full customer data for update
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
      <UpdateCustomerProduct product={product}  customerId={customerId} ProductId={ProductId} onUpdate={handleUpdate} />
    </Modal>
  );
};