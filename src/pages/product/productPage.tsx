import { Card, Col, Row, Space } from "antd";
import { PageHeader, ProductList, AddProductButton } from "../../components";

import { Helmet } from "react-helmet-async";

export const ProductPage = () => {
  return (
    <div>
      <Helmet>
        <title>Product | CPM Dashboard</title>
      </Helmet>
      <PageHeader
        title="Our Products"
        breadcrumbs={[
          {
            title: (
              <>
                <span>Product</span>
              </>
            ),
          },
          {
            title: "Product",
          },
        ]}
      />
      <Row
        gutter={[
          { xs: 8, sm: 16, md: 24, lg: 32 },
          { xs: 8, sm: 16, md: 24, lg: 32 },
        ]}
      >
        <Col span={24}>
          <Card
            title="Products List"
            extra={
              <Space>
                <AddProductButton />
              </Space>
            }
          >
            <ProductList />
          </Card>
        </Col>
      </Row>
    </div>
  );
};
