import React from "react";
import { Modal, Card, Row, Col } from "antd";

interface FieldRow {
  //   key: string;
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

interface FieldDetailModalProps {
  field: FieldRow;
  onClose: () => void;
}

export const FieldDetailModal: React.FC<FieldDetailModalProps> = ({
  field,
  onClose,
}) => {
  return (
    <Modal
      title="Field Details"
      visible={true}
      onCancel={onClose}
      onOk={onClose}
      footer={null}
      centered
      width="40%"
    >
      <Card title="Customer Information" bordered={false}>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12}>
            <p>
              <strong>Field Name:</strong> {field.field_name}
            </p>
          </Col>
          <Col xs={24} sm={12}>
            <p>
              <strong>Field Type:</strong> {field.field_type}
            </p>
          </Col>
          <Col xs={24} sm={12}>
            <p>
              <strong>Required:</strong> {field.is_required ? "Yes" : "No"}
            </p>
          </Col>
          <Col xs={24} sm={12}>
            <p>
              <strong>Multi-select:</strong>{" "}
              {field.is_multi_select ? "Yes" : "No"}
            </p>
          </Col>
          {Array.isArray(field.options) && field.options.length > 0 && (
            <Col xs={24}>
              <p>
                <strong>Options:</strong>
              </p>
              <ul style={{ paddingLeft: 20 }}>
                {field.options.map((val: string, index) => (
                  <li key={index}>{val}</li>
                ))}
              </ul>
            </Col>
          )}
        </Row>
      </Card>
      {/* Additional Cards or sections for partner reference details, products, etc. can be added here */}
    </Modal>
  );
};
