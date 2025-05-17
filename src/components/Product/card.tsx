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
  Divider,
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
const { Text } = Typography;

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
    <>
      <Switch
        checkedChildren="Active"
        unCheckedChildren="Inactive"
        checked={filterStatus}
        onChange={(checked) => setFilterStatus(checked)}
        style={{ marginBottom: 16 }}
      />

      <Input
        placeholder="Search..."
        prefix={<SearchOutlined />}
        allowClear
        aria-label="Search..."
        value={searchQuery}
        onChange={handleSearch}
        style={{ width: 300, marginBottom: 16 }}
      />
      {error && (
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
      <Row gutter={[16, 16]} justify="start">
        {loading ? (
          // Skeleton placeholders while loading
          Array.from({ length: 8 }).map((_, idx) => (
            <Col key={idx} xs={24} sm={12} md={8} lg={6} xl={4}>
              <Card style={{ maxWidth: 300, margin: "auto" }}>
                <Skeleton loading avatar active />
              </Card>
            </Col>
          ))
        ) : products.length === 0 ? (
          // Empty state when no products
          <Empty
            description="No products available"
            style={{ marginTop: 50, width: "100%" }}
          />
        ) : (
          // Render memoized cards
          products.map((product: any, index) => (
            <Col key={index} xs={24} sm={12} md={8} lg={6} xl={4}>
              <ProductCard
                product={product}
                onView={showModal}
                onEdit={(p) => console.log("Edit", p)}
                onDelete={(p) => console.log("Delete", p)}
              />
            </Col>
          ))
        )}
      </Row>
      <Modal
        title={
          <div className="modal-header">
            <span>{selectedProduct?.productName}</span>
            <Tag color={selectedProduct?.status ? "green" : "red"}>
              {selectedProduct?.status ? "Active" : "Inactive"}
            </Tag>
          </div>
        }
        open={isModalVisible}
        onCancel={handleCancel}
        footer={[
          <Button key="close" onClick={handleCancel}>
            Close
          </Button>,
          <Button
            key="visit"
            type="primary"
            icon={<GlobalOutlined />}
            onClick={() => window.open(selectedProduct?.productLink, "_blank")}
          >
            Visit Website
          </Button>,
        ]}
        width={800}
        className="product-detail-modal"
      >
        {selectedProduct && (
          <div className="product-content">
            <div className="product-media">
              <Avatar
                size={160}
                src={
                  selectedProduct.image ||
                  `https://via.placeholder.com/150?text=${selectedProduct.productName[0]}`
                }
                className="product-image"
              />
            </div>

            <Divider />

            <Descriptions bordered column={2}>
              <Descriptions.Item label="Price" span={2}>
                <div className="price-display">
                  ₹{selectedProduct.productPrice}
                  <span className="price-period">/year</span>
                </div>
              </Descriptions.Item>

              <Descriptions.Item label="Category">
                <Space wrap>
                  {selectedProduct.productCategory.map((cat: any) => (
                    <Tag color="blue" key={cat}>
                      {cat}
                    </Tag>
                  ))}
                </Space>
              </Descriptions.Item>

              <Descriptions.Item label="Tags">
                <Space wrap>
                  {selectedProduct.tags?.map((tag) => (
                    <Tag color="geekblue" key={tag}>
                      {tag}
                    </Tag>
                  ))}
                </Space>
              </Descriptions.Item>

              <Descriptions.Item label="Description" span={2}>
                <div className="product-description">
                  {selectedProduct.description}
                </div>
              </Descriptions.Item>

              <Descriptions.Item label="Specifications" span={2}>
                <div className="spec-grid">
                  {Object.entries(selectedProduct?.specifications ?? {}).map(
                    ([key, value]) => (
                      <div key={key} className="spec-item">
                        <div className="spec-key">{key}:</div>
                        <div className="spec-value">{value}</div>
                      </div>
                    )
                  )}
                </div>
              </Descriptions.Item>
            </Descriptions>

            <Divider />

            <div className="meta-info">
              <Space>
                <Text type="secondary">
                  Created:{" "}
                  {dayjs(selectedProduct.createdAt).format("MMM D, YYYY")}
                </Text>
                <Text type="secondary">
                  Last Updated:{" "}
                  {dayjs(selectedProduct.updatedAt).format("MMM D, YYYY")}
                </Text>
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
    </>
  );
};
