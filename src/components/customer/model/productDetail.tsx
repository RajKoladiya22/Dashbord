import React from "react";
import {
  Modal,
  Card,
  Row,
  Col,
  Tag,
  Avatar,
  Button,
  Tabs,
  Descriptions,
  Space,
  Divider,
  Timeline,
  Typography,
  Collapse,
} from "antd";
import {
  EditOutlined,
  EnvironmentOutlined,
  MailOutlined,
  ShoppingOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import { PartnerData, Product } from "../../../redux/APITypes";
const { Panel } = Collapse;
const { Text } = Typography;

interface CustomerRow {
  id: string;
  adminId: string;
  partnerId?: string;
  companyName: string;
  contactPerson: string;
  mobileNumber: string;
  email: string;
  serialNo: string;
  prime: boolean;
  blacklisted: boolean;
  remark?: string;
  adminCustomFields: Record<string, any>[];
  address: Record<string, any>;
  joiningDate: string; // ISO timestamp
  hasReference: boolean;
  status: boolean;
  product: Product[];
  createdAt: string; // ISO timestamp
  updatedAt: string;
  partner: PartnerData;
}

interface productDetailModalProps {
  products: CustomerRow;
  onClose: () => void;
}

export const ProductDetailModal: React.FC<productDetailModalProps> = ({
  products,
  onClose,
}) => {
  console.log("products------>", products);

  return (
    <Modal
      title={
        <div
          className="modal-header"
          style={{ display: "flex", alignItems: "center" }}
        >
          <Avatar
            size={40}
            style={{ backgroundColor: "#1890ff", marginRight: "15px" }}
          >
            {products.companyName[0]}
          </Avatar>
          <div>
            <h2 style={{ margin: 0 }}>{products.companyName}</h2>
            <Space>
              <Tag color={products.status ? "green" : "red"}>
                {products.status ? "Active" : "Inactive"}
              </Tag>
              {products.prime && <Tag color="gold">Prime Customer</Tag>}
              {products.blacklisted && <Tag color="volcano">Blacklisted</Tag>}
            </Space>
          </div>
        </div>
      }
      visible={true}
      onCancel={onClose}
      footer={[
        <Button key="edit" icon={<EditOutlined />}>
          Edit Details
        </Button>,
        <Button key="email" icon={<MailOutlined />}>
          Send Email
        </Button>,
        <Button key="close" onClick={onClose}>
          Close
        </Button>,
      ]}
      centered
      width="90%"
      className="customer-detail-modal"
    >
      <Tabs defaultActiveKey="1">
        {/* Products Tab */}
        <Tabs.TabPane tab="Products & Services" key="2">
          <Row gutter={[16, 16]}>
            {products.product?.map((product: any, index: any) => (
              <Col span={24} key={product.id}>
                <Card
                  key={index}
                  title={
                    <Space>
                      <ShoppingOutlined />
                      <Text strong>{product.productDetails.productName}</Text>
                      <Tag color={product.status ? "green" : "red"}>
                        {product.status ? "Active" : "Inactive"}
                      </Tag>
                    </Space>
                  }
                  extra={
                    <Text strong>₹{product.productDetails.productPrice}</Text>
                  }
                >
                  <Descriptions column={2}>
                    <Descriptions.Item label="Purchase Date">
                      {dayjs(product.purchaseDate).format("MMM D, YYYY")}
                    </Descriptions.Item>
                    <Descriptions.Item label="Renewal Period">
                      {product.renewPeriod.replace("_", " ").toUpperCase()}
                    </Descriptions.Item>
                    <Descriptions.Item label="Expiry Date">
                      {product.expiryDate
                        ? dayjs(product.expiryDate).format("MMM D, YYYY")
                        : "N/A"}
                    </Descriptions.Item>
                    <Descriptions.Item label="Auto Renewal">
                      <Tag color={product.renewal ? "green" : "volcano"}>
                        {product.renewal ? "Enabled" : "Disabled"}
                      </Tag>
                    </Descriptions.Item>
                  </Descriptions>
                  {/* history Line */}
                  
                  {product.history.length > 0 && (
                    <>
                      <Divider />
                      <Timeline mode="left">
                        {product.history.map((entry: any) => (
                          <Timeline.Item
                            key={entry.id}
                            color={entry.expiryDate ? "green" : "gray"}
                          >
                            <Space direction="vertical">
                              <Text strong>
                                {dayjs(entry.purchaseDate).format(
                                  "MMM D, YYYY"
                                )}{" "}
                                {"Expired"}{" "}
                                {dayjs(entry.expiryDate).format("MMM D, YYYY")}
                              </Text>
                              <Text type="secondary">
                                Renewed At{" "}
                                {dayjs(entry.createdAt).format("MMM D, YYYY")}
                              </Text>
                            </Space>
                          </Timeline.Item>
                        ))}
                      </Timeline>
                    </>
                  )}


                  <Collapse accordion>
  {product.history.map((entry:any) => (
    <Panel
      key={entry.id}
      header={
        <Space>
          <Text>
            {dayjs(entry.purchaseDate).format('MMM D, YYYY')} →{' '}
            {dayjs(entry.expiryDate).format('MMM D, YYYY')}
          </Text>
        </Space>
      }
    >
      <Space direction="vertical">
        <Text strong>Purchased: {dayjs(entry.purchaseDate).format('LL')}</Text>
        <Text type="secondary">
          Renewed on {dayjs(entry.createdAt).format('LL')}
        </Text>
      </Space>
    </Panel>
  ))}
</Collapse>
                </Card>
              </Col>
            ))}
          </Row>
        </Tabs.TabPane>
      </Tabs>
    </Modal>
  );
};
