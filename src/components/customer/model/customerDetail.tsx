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
//   }

// export const CustomerDetail: React.FC<UpdateCustomerProps> = ({id}) => {
//   const [openResponsive, setOpenResponsive] = useState(false);

//   return (
//     <Flex vertical gap="middle" align="flex-start">
//       {/* Responsive */}
//       <Button
//         color="primary"
//         variant="outlined"
//         icon={<EyeOutlined />}
//         onClick={() => setOpenResponsive(true)}
//       >
//         View
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
//         <h1>VIEW</h1>
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
import { Modal, Card, Row, Col } from "antd";

interface CustomerRow {
  key: string;
  companyName: string;
  contactPerson: string;
  mobileNumber: string;
  email: string;
  tallySerialNo: string;
  remark: string;
  prime: boolean;
  blacklisted: boolean;
  status: string;
}

interface CustomerDetailModalProps {
  customer: CustomerRow;
  onClose: () => void;
}

export const CustomerDetailModal: React.FC<CustomerDetailModalProps> = ({ customer, onClose }) => {
  return (
    <Modal
      title="Customer Details"
      visible={true}
      onCancel={onClose}
      onOk={onClose}
      footer={null}
      centered
      width="80%"
    >
      <Card title="Customer Information" bordered={false}>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12}>
            <p><strong>Company Name:</strong> {customer.companyName}</p>
          </Col>
          <Col xs={24} sm={12}>
            <p><strong>Contact Person:</strong> {customer.contactPerson}</p>
          </Col>
          <Col xs={24} sm={12}>
            <p><strong>Mobile Number:</strong> {customer.mobileNumber}</p>
          </Col>
          <Col xs={24} sm={12}>
            <p><strong>Email:</strong> {customer.email}</p>
          </Col>
          <Col xs={24} sm={12}>
            <p><strong>Tally Serial No:</strong> {customer.tallySerialNo}</p>
          </Col>
          <Col xs={24} sm={12}>
            <p><strong>Status:</strong> {customer.status}</p>
          </Col>
          <Col span={24}>
            <p><strong>Remark:</strong> {customer.remark}</p>
          </Col>
        </Row>
      </Card>
      {/* Additional Cards or sections for partner reference details, products, etc. can be added here */}
    </Modal>
  );
};
