import { Row } from "antd";
import { PageHeader, ProductList } from "../../components";

import { Helmet } from "react-helmet-async";
import React from "react";

export const ProductPage: React.FC = React.memo(() => {
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
        <ProductList />
      </Row>
    </div>
  );
});
