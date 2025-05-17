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
} from "antd";
import {
  EditOutlined,
  EnvironmentOutlined,
  MailOutlined,
  ShoppingOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
// import { PartnerData, Product } from "../../../redux/APITypes";
import { Customer } from "../../../types/customer.type";
const { Text } = Typography;
// import './style.css'

interface CustomerDetailModalProps {
  customer: Customer;
  onClose: () => void;
}

export const CustomerDetailModal: React.FC<CustomerDetailModalProps> = ({
  customer,
  onClose,
}) => {
  // console.log("customer------>", customer);

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
            {customer.companyName[0]}
          </Avatar>
          <div>
            <h2 style={{ margin: 0 }}>{customer.companyName}</h2>
            <Space>
              <Tag color={customer.status ? "green" : "red"}>
                {customer.status ? "Active" : "Inactive"}
              </Tag>
              {customer.prime && <Tag color="gold">Prime Customer</Tag>}
              {customer.blacklisted && <Tag color="volcano">Blacklisted</Tag>}
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
        {/* Customer Information Tab */}
        <Tabs.TabPane tab="Customer Information" key="1">
          <Row gutter={[24, 16]}>
            {/* Basic Details */}
            <Col span={24}>
              <Card title="Basic Details" bordered={false}>
                <Descriptions column={2}>
                  <Descriptions.Item label="Contact Person">
                    <Text strong>{customer.contactPerson}</Text>
                  </Descriptions.Item>
                  <Descriptions.Item label="Mobile Number">
                    <a href={`tel:${customer.mobileNumber}`}>
                      {customer.mobileNumber}
                    </a>
                  </Descriptions.Item>
                  <Descriptions.Item label="Email">
                    <a href={`mailto:${customer.email}`}>{customer.email}</a>
                  </Descriptions.Item>
                  <Descriptions.Item label="Tally Serial No">
                    {customer.serialNo}
                  </Descriptions.Item>
                  <Descriptions.Item label="Joining Date">
                    {dayjs(customer.joiningDate).format("MMM D, YYYY")}
                  </Descriptions.Item>
                </Descriptions>
              </Card>
            </Col>

            {/* Address Section */}
            <Col span={12}>
              <Card title="Address" bordered={false}>
                <Space direction="vertical">
                  <div>
                    <EnvironmentOutlined /> {customer.address.street}
                  </div>
                  <div>
                    {customer.address.city}, {customer.address.state}
                  </div>
                </Space>
              </Card>
            </Col>

            {/* Partner Details */}
            {customer.partner && (
              <Col span={12}>
                <Card
                  title={
                    <Space>
                      <TeamOutlined />
                      <span>Partner Details</span>
                    </Space>
                  }
                  bordered={false}
                >
                  <Descriptions column={1}>
                    <Descriptions.Item label="Company">
                      {customer.partner.companyName}
                    </Descriptions.Item>
                    <Descriptions.Item label="Contact">
                      {customer.partner.firstName} {customer.partner.lastName}
                    </Descriptions.Item>
                    <Descriptions.Item label="Email">
                      <a href={`mailto:${customer.partner.email}`}>
                        {customer.partner.email}
                      </a>
                    </Descriptions.Item>
                    <Descriptions.Item label="Status">
                      <Tag color={customer.partner.status ? "green" : "red"}>
                        {customer.partner.status ? "Active" : "Inactive"}
                      </Tag>
                    </Descriptions.Item>
                  </Descriptions>
                </Card>
              </Col>
            )}

            {/* Remarks */}
            <Col span={24}>
              <Card title="Remarks" bordered={false}>
                {customer.remark || (
                  <Text type="secondary">No remarks available</Text>
                )}
              </Card>
            </Col>
          </Row>
        </Tabs.TabPane>

        {/* Products Tab */}
        <Tabs.TabPane tab="Products & Services" key="2">
          <Row gutter={[16, 16]}>
            {(Array.isArray(customer.product)
              ? customer.product
              : [customer.product]
            )
              .filter(Boolean)
              .map((product: any, index: any) => (
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
                                  {dayjs(entry.expiryDate).format(
                                    "MMM D, YYYY"
                                  )}
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
                  </Card>
                </Col>
              ))}
          </Row>
        </Tabs.TabPane>
      </Tabs>
    </Modal>
  );
};
