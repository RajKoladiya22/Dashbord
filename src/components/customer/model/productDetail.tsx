import React, { useState } from "react";
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
  // Collapse,
} from "antd";
import {
  EditOutlined,
  // EnvironmentOutlined,
  MailOutlined,
  ShoppingOutlined,
  // TeamOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import { Customer } from "../../../types/customer.type";
import { ProductUpdateModal } from "./updateProduct";
import { Product } from "../../../types/product.type";
// const { Panel } = Collapse;
const { Text } = Typography;

interface productDetailModalProps {
  customer: Customer;
  onClose: () => void;
}

export const ProductDetailModal: React.FC<productDetailModalProps> = ({
  customer,
  onClose,
}) => {
  // console.log("products------>", products);
  const [viewProducts, setViewProducts] = useState<Record<string, any> | null>(
    null
  );

  return (
    <>
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
                          <Text strong>
                            {product.productDetails.productName}
                          </Text>
                          <Tag color={product.status ? "green" : "red"}>
                            {product.status ? "Active" : "Inactive"}
                          </Tag>
                        </Space>
                      }
                      extra={
                        <>
                          <Text strong>
                            ₹{product.productDetails.productPrice}
                          </Text>
                          <Button
                            type="primary"
                            icon={<EditOutlined />}
                            style={{ marginLeft: "10px" }}
                            onClick={() => {
                              setViewProducts({
                                customerId: customer.id,
                                product,
                              });
                            }}
                          >
                            Edit Product
                          </Button>
                        </>
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
                                    {dayjs(entry.expiryDate).format(
                                      "MMM D, YYYY"
                                    )}
                                  </Text>
                                  <Text type="secondary">
                                    Renewed At{" "}
                                    {dayjs(entry.createdAt).format(
                                      "MMM D, YYYY"
                                    )}
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
      {viewProducts && (
        <ProductUpdateModal
          product={viewProducts}
          open={true}
          // onClose={() => setUpdateCustomer(null)}
          onClose={() => setViewProducts(null)}
          customerId={viewProducts.customerId}
          ProductId={viewProducts.product.id}
        />
      )}
    </>
  );
};
