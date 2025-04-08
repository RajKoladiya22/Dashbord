// import React, { useState } from "react";
// import { Button, Flex, Modal } from "antd";
// import {
//   SearchOutlined,
//   CloudUploadOutlined,
//   PlusOutlined,
//   CheckCircleOutlined,
//   CloseCircleOutlined,
//   EyeOutlined,
//   EditOutlined,
//   DeleteOutlined,
// } from "@ant-design/icons";

// interface UpdateCustomerProps {
//     id: string;
//     onClose: () => void;
//   }

// export const UpdateCustomerModel: React.FC<UpdateCustomerProps> = ({id, onClose}) => {
//   const [openResponsive, setOpenResponsive] = useState(false);

//   return (
//     <Flex vertical gap="middle" align="flex-start">
//       {/* Responsive */}
//       <Button
//         color="gold"
//         variant="outlined"
//         icon={<EditOutlined />}
//         onClick={() => setOpenResponsive(true)}
//       >
//         Edit
//       </Button>
//       <Modal
//         title="Modal responsive width"
//         centered
//         open={openResponsive}
//         onOk={() => setOpenResponsive(false)}
//         onCancel={() => setOpenResponsive(false)}
//         width={{
//           xs: "90%",
//           sm: "80%",
//           md: "70%",
//           lg: "60%",
//           xl: "50%",
//           xxl: "40%",
//         }}
//       >
//         <h1>UPDATE</h1>
//         <h2>ID {id}</h2>
//         <p>some contents...</p>
//         <p>some contents...</p>
//         <p>some contents...</p>
//         <p>some contents...</p>
//         <p>some contents...</p>
//         <p>some contents...</p>
//         <p>some contents...</p>
//         <p>some contents...</p>
//         <p>some contents...</p>
//         <p>some contents...</p>
//         <p>some contents...</p>
//         <p>some contents...</p>
//         <p>some contents...</p>
//         <p>some contents...</p>
//         <p>some contents...</p>
//         <p>some contents...</p>
//         <p>some contents...</p>
//       </Modal>
//     </Flex>
//   );
// };


import React from "react";
import { Modal } from "antd";
import { EditOutlined } from "@ant-design/icons";
import { UpdateCustomerForm } from "../form"; // Import your update form component

export interface CustomerData {
  adminId: string;
  companyName: string;
  contactPerson: string;
  mobileNumber: string;
  email: string;
  tallySerialNo: string;
  prime: boolean;
  blacklisted: boolean;
  remark: string;
  state?: string;
  city?: string;
  area?: string;
  address?: string;
  joiningDate?: string;
  // Add any additional fields if needed.
}

interface UpdateCustomerProps {
  adminId: string;
  id: string;
  open: boolean;
  onClose: () => void;
  customer: CustomerData; // Pass the full customer data for update
}

export const UpdateCustomerModel: React.FC<UpdateCustomerProps> = ({
  // id,
  // adminId,
  open,
  onClose,
  customer,
}) => {
  const handleUpdate = (updatedPayload: any) => {
    console.log("Updated payload:", updatedPayload);
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
