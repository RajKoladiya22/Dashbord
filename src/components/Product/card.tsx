import React, { useEffect, useState, useCallback } from "react";
import {
  Card,
  Avatar,
  Row,
  Col,
  Modal,
  Skeleton,
  Empty,
  message,
  Popconfirm,
  Switch,
  Tag,
  Button,
  // Divider,
  Descriptions,
  Space,
  Typography,
  Input,
} from "antd";
import {
  EditOutlined,
  // EyeOutlined,
  // DeleteOutlined,
  CheckCircleTwoTone,
  StopTwoTone,
  GlobalOutlined,
  DeleteOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { useAppDispatch } from "../../hooks";
import {
  fetchAllProducts,
  deleteProduct,
  toggleProductStatus,
} from "../../redux/slice/products/productSlice";
import { EditProductModal } from "./EditProductModal";
import AutoDismissAlert from "../Alert";
import dayjs from "dayjs";
import { Product } from "../../types/product.type";
import { AddProductButton } from "./AddProductButton";
const { Text, Title } = Typography;

const { Meta } = Card;

// Memoized Product Card to prevent unnecessary re-renders

export const ProductList: React.FC = () => {
  const dispatch = useAppDispatch();
  const { products, loading, error } = useSelector(
    (state: RootState) => state.products
  );
  const [filterStatus, setFilterStatus] = useState<boolean>(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [editing, setEditing] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      dispatch(
        fetchAllProducts({
          status: filterStatus,
          q: searchQuery,
          page: 1,
          limit: 100, // or use a local state
        })
      );
    }, 300); // debounce to reduce calls

    return () => clearTimeout(delayDebounce);
  }, [dispatch, filterStatus, searchQuery]);  

  // console.log("products-->", products);

  const handleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
  }, []);

  // Stable handlers for modal actions
  const showModal = useCallback((product: Product) => {
    setSelectedProduct(product);
    setIsModalVisible(true);
  }, []);

  const handleCancel = useCallback(() => {
    setIsModalVisible(false);
    setSelectedProduct(null);
  }, []);

  const handleDelete = useCallback(
    async (id: string) => {
      try {
        await dispatch(deleteProduct(id)).unwrap();
        message.success("Product deleted successfully");
      } catch (err) {
        message.error("Failed to delete product");
      }
    },
    [dispatch]
  );
  const handleToggleStatus = (p: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(toggleProductStatus({ id: p.id, status: !p.status })).unwrap();
    message.success("Product Status Updated");
  };

  const ProductCard = React.memo(
    ({
      product,
      onView,
    }: // onEdit,
    // onDelete,
    {
      product: Product;
      onView: (p: Product) => void;
      onEdit: (p: Product) => void;
      onDelete: (p: Product) => void;
    }) => (
      <Card
        hoverable
        style={{ maxWidth: 300, margin: "auto" }}
        onClick={() => onView(product)}
        cover={
          <img
            alt={product.productName}
            src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
          />
        }
        actions={[
          // Edit icon
          <EditOutlined
            key="edit"
            onClick={(e) => {
              e.stopPropagation();
              setEditing(product);
            }}
          />,

          // Delete icon — shown only if product is inactive
          !product.status && (
            <DeleteOutlined
              key="delete"
              onClick={(e: any) => {
                e.stopPropagation();
                handleDelete(product.id);
              }}
            />
          ),

          // Toggle status icon inside Popconfirm
          <span onClick={(e) => e.stopPropagation()}>
            <Popconfirm
              key="toggle"
              title={`Are you sure you want to ${
                product.status ? "deactivate" : "activate"
              } this product?`}
              onConfirm={(e: any) => {
                e.stopPropagation();
                handleToggleStatus(product, e);
              }}
              okText="Yes"
              cancelText="No"
            >
              {product.status ? (
                <CheckCircleTwoTone
                  key="activate"
                  twoToneColor="#52c41a"
                  onClick={(e) => e.stopPropagation()}
                />
              ) : (
                <StopTwoTone
                  key="deactivate"
                  twoToneColor="#ff4d4f"
                  onClick={(e) => e.stopPropagation()}
                />
              )}
            </Popconfirm>
          </span>,
        ]}
      >
        <Meta
          avatar={
            <Avatar
              src={`https://api.dicebear.com/7.x/miniavs/svg?seed=${product.id}`}
            />
          }
          title={product.productName}
          description={product.description}
        />
      </Card>
    ),
    (prev, next) => prev.product.id === next.product.id
  );

  return (
    <Col span={24}>
      <Card
        title={
          <div className="card-header">
            <Space align="center">
              <Title level={4} style={{ margin: 0 }}>
                Products Management
              </Title>
              <Tag color="blue">{products.length} items</Tag>
            </Space>
          </div>
        }
        extra={
          <Space>
            <AddProductButton />
          </Space>
        }
        bodyStyle={{ padding: "24px 16px" }}
      >
        <div className="filter-bar" style={{ marginBottom: 24 }}>
          <Space size="middle" wrap>
            <div className="status-filter">
              <Text strong style={{ marginRight: 8 }}>
                Status:
              </Text>
              <Switch
                checkedChildren="Active"
                unCheckedChildren="Inactive"
                checked={filterStatus}
                onChange={setFilterStatus}
              />
            </div>

            <Input
              placeholder="Search products..."
              prefix={<SearchOutlined style={{ color: "rgba(0,0,0,.25)" }} />}
              allowClear
              value={searchQuery}
              onChange={handleSearch}
              style={{ width: 280 }}
              size="large"
            />
          </Space>
        </div>

        {error && (
          // <Alert
          //   message="Error"
          //   description={error}
          //   type="error"
          //   showIcon
          //   closable
          //   style={{ marginBottom: 24 }}
          // />

          <AutoDismissAlert
            message="Error"
            description={error}
            type="error"
            showIcon
            style={{ marginBottom: 16 }}
            onClose={() => null}
            durationMs={10000} // 10 seconds
          />
        )}

        <Row gutter={[24, 24]} wrap >
          {loading ? (
            Array.from({ length: 8 }).map((_, idx) => (
              <Col key={idx} xs={24} sm={12} md={8} lg={6} xl={6}>
                <Card style={{ height: "100%" }} bodyStyle={{ padding: 16 }}>
                  <Skeleton
                    active
                    avatar={{ shape: "square", size: "large" }}
                    paragraph={{ rows: 3 }}
                  />
                </Card>
              </Col>
            ))
          ) : products.length === 0 ? (
            <Col span={24}>
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={
                  <Text type="secondary">
                    No products found.{" "}
                    {filterStatus && "Try adjusting your filters."}
                  </Text>
                }
                style={{ margin: "40px 0" }}
              >
                <AddProductButton />
              </Empty>
            </Col>
          ) : (
            products.map((product, index) => (
              <Col key={product.id} xs={24} sm={12} md={8} lg={6} xl={6}>
                <ProductCard
                  key={index}
                  product={product}
                  onView={showModal}
                  onEdit={(p) => console.log("Edit", p)}
                  onDelete={(p) => console.log("Delete", p)}
                />
              </Col>
            ))
          )}
        </Row>

        {/* Product Detail Modal */}
        <Modal
          open={isModalVisible}
          onCancel={handleCancel}
          footer={null}
          width={800}
          centered
          className="product-detail-modal"
          bodyStyle={{ padding: 0 }}
        >
          {selectedProduct && (
            <div className="modal-content">
              <div
                className="modal-header"
                style={{ padding: 24, borderBottom: "1px solid #f0f0f0" }}
              >
                <Space align="start">
                  <Avatar
                    size={64}
                    shape="square"
                    src={
                      selectedProduct.image ||
                      `https://via.placeholder.com/150?text=${selectedProduct.productName[0]}`
                    }
                    className="product-image"
                  />
                  <div>
                    <Space align="center" size="small">
                      <Title level={4} style={{ margin: 0 }}>
                        {selectedProduct.productName}
                      </Title>
                      <Tag color={selectedProduct.status ? "green" : "red"}>
                        {selectedProduct.status ? "Active" : "Inactive"}
                      </Tag>
                    </Space>
                    <Text
                      type="secondary"
                      style={{ display: "block", marginTop: 4 }}
                    >
                      {selectedProduct.productCategory.join(" • ")}
                    </Text>
                  </div>
                </Space>
              </div>

              <div className="modal-body" style={{ padding: 24 }}>
                <Row gutter={24}>
                  <Col span={24} md={12}>
                    <Descriptions column={1} size="small">
                      <Descriptions.Item label="Price">
                        <Text strong style={{ fontSize: 18 }}>
                          ₹{selectedProduct.productPrice}
                          <Text type="secondary" style={{ fontSize: 14 }}>
                            {/* /year */}
                          </Text>
                        </Text>
                      </Descriptions.Item>
                      <Descriptions.Item label="Tags">
                        <Space wrap>
                          {selectedProduct.tags?.map((tag) => (
                            <Tag key={tag}>{tag}</Tag>
                          ))}
                        </Space>
                      </Descriptions.Item>
                      <Descriptions.Item label="Description">
                        <Text type="secondary">
                          {selectedProduct.description ||
                            "No description available"}
                        </Text>
                      </Descriptions.Item>
                    </Descriptions>
                  </Col>

                  <Col span={24} md={12}>
                    <div className="specifications-section">
                      <Title level={5} style={{ marginBottom: 16 }}>
                        Specifications
                      </Title>
                      <Row gutter={[8, 8]}>
                        {Object.entries(
                          selectedProduct.specifications || {}
                        ).map(([key, value]) => (
                          <Col span={12} key={key}>
                            <div className="spec-item">
                              <Text type="secondary">{key}:</Text>{" "}
                              <Text strong>{value}</Text>
                            </div>
                          </Col>
                        ))}
                      </Row>
                    </div>
                  </Col>
                </Row>
              </div>

              <div
                className="modal-footer"
                style={{
                  padding: 16,
                  background: "#fafafa",
                  borderTop: "1px solid #f0f0f0",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Text type="secondary">
                  Created:{" "}
                  {dayjs(selectedProduct.createdAt).format("MMM D, YYYY")}
                </Text>
                <Space>
                  <Button onClick={handleCancel}>Close</Button>
                  <Button
                    type="primary"
                    icon={<GlobalOutlined />}
                    onClick={() =>
                      window.open(selectedProduct.productLink, "_blank")
                    }
                  >
                    Visit Website
                  </Button>
                </Space>
              </div>
            </div>
          )}
        </Modal>

        <EditProductModal
          visible={!!editing}
          product={editing}
          onCancel={() => setEditing(null)}
        />
      </Card>
    </Col>
  );
};
