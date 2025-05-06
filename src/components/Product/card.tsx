// import  { useEffect, useState } from 'react';
// import { Card, Avatar, Row, Col, Modal } from 'antd';
// import { EditOutlined, EllipsisOutlined, EyeOutlined, SettingOutlined } from '@ant-design/icons';
// import { useSelector } from 'react-redux';
// import { RootState } from '../../redux/store';
// import { useAppDispatch } from '../../hooks';
// import { fetchAllProducts } from '../../redux/slice/products/productSlice';

// const { Meta } = Card;

// export const ProductList = () => {
//     const { products, loading, error } = useSelector(
//       (state: RootState) => state.products
//     );
//   const dispatch = useAppDispatch();
//   const [isModalVisible, setIsModalVisible] = useState(false);
//   const [selectedCard, setSelectedCard] = useState({});

//   console.log("Products--->", products);
//   console.log("loading--->", loading);
//   console.log("error--->", error);

//   const showModal = (product : any) => {
//     setSelectedCard(product);
//     setIsModalVisible(true);
//   };

//   const handleCancel = () => {
//     setIsModalVisible(false);
//     setSelectedCard(0);
//   };

//   useEffect(()=>{
//     dispatch(fetchAllProducts())
//   },[])

//   return (
//     <Row gutter={[16, 16]} justify="center">
//       {products.map((product, index) => (
//         <Col key={index} xs={24} sm={12} md={8} lg={6} xl={4}>
//           <Card
//             hoverable
//             style={{ maxWidth: 300, margin: 'auto' }}
//             onClick={() => showModal(product)}
//             cover={
//               <img
//                 alt={`example ${index + 1}`}
//                 src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
//               />
//             }
//             actions={[
//               <EyeOutlined  key="view"  />,
//               <EditOutlined key="edit" onClick={(e) => e.stopPropagation()} />,
//             ]}
//           >
//             <Meta
//               avatar={<Avatar src={`https://api.dicebear.com/7.x/miniavs/svg?seed=${index}`} />}
//               title={product.product_name}
//               description={product.description}
//             />
//           </Card>
//         </Col>
//       ))}
//       <Modal
//         title={`Details for Card ${selectedCard?.product_name}`}
//         open={isModalVisible}
//         onCancel={handleCancel}
//         footer={null}
//       >
//         <p>More information about Card {selectedCard}.</p>
//       </Modal>
//     </Row>
//   );
// };

import React, { useEffect, useState, useCallback } from "react";
import {
  Card,
  Avatar,
  Row,
  Col,
  Modal,
  Skeleton,
  Alert,
  Empty,
  message,
  Popconfirm,
} from "antd";
import { EditOutlined, EyeOutlined, DeleteOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { useAppDispatch } from "../../hooks";
import {
  fetchAllProducts,
  deleteProduct,
} from "../../redux/slice/products/productSlice";
import { EditProductModal } from "./EditProductModal";
import { Product } from "../../redux/APITypes";

const { Meta } = Card;

// Memoized Product Card to prevent unnecessary re-renders

// export interface Product {
//   id: string;
//   product_name: string;
//   product_category: string[];
//   product_price: string;
//   description?: string;
//   product_link?: string;
//   tags?: string[];
//   specifications?: Record<string, any>;
//   admin_id: string;
//   created_at: string;
//   updated_at: string;
// }

export const ProductList: React.FC = () => {
  const dispatch = useAppDispatch();
  const { products, loading, error } = useSelector(
    (state: RootState) => state.products
  );
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [editing, setEditing] = useState<Product | null>(null);

  // Fetch products once on mount
  useEffect(() => {
    dispatch(fetchAllProducts());
  }, [dispatch]);

  // console.log("products-->", products);
  

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

  const ProductCard = React.memo(
    ({
      product,
      onView,
      // onEdit,
      // onDelete,
    }: {
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
          <EyeOutlined
            key="view"
            onClick={(e) => {
              e.stopPropagation();
              onView(product);
            }}
          />,
          <EditOutlined
            key="edit"
            onClick={(e) => {
              e.stopPropagation();
              setEditing(product);
            }}
          />,
          <Popconfirm
            key="delete"
            title="Are you sure to delete this product?"
            onConfirm={(e) => {
              e?.stopPropagation();
              handleDelete(product.id);
            }}
            onCancel={(e) => e?.stopPropagation()}
            okText="Yes"
            cancelText="No"
          >
            <DeleteOutlined onClick={(e) => e.stopPropagation()} />
          </Popconfirm>,
          // <DeleteOutlined
          //   key="delete"
          //   onClick={(e) => {
          //     e.stopPropagation();
          //     onDelete(product);
          //   }}
          // />,
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
      {error && (
        <Alert
          message="Error"
          description={error}
          type="error"
          showIcon
          style={{ marginBottom: 16 }}
        />
      )}
      <Row gutter={[16, 16]} justify="center">
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
        title={selectedProduct?.productName}
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        {selectedProduct ? (
          <>
            <p>
              <strong>Category:</strong>{" "}
              {selectedProduct.productCategory.join(", ")}
            </p>
            <p>
              <strong>Price:</strong> ₹{selectedProduct.productPrice}
            </p>
            <p>
              <strong>Description:</strong> {selectedProduct.description}
            </p>
            {/* Additional product details */}
          </>
        ) : null}
      </Modal>

        <EditProductModal
          visible={!!editing}
          product={editing}
          onCancel={() => setEditing(null)}
        />
    </>
  );
};
