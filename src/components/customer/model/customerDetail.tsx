import React from "react";
import { Modal, Card, Row, Col } from "antd";

interface CustomerRow {
  key: string;
  companyName: string;
  contactPerson: string;
  mobileNumber: string;
  email: string;
  serialNo: string;
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
            <p><strong>Tally Serial No:</strong> {customer.serialNo}</p>
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
