// src/pages/AddCustomerPage.tsx
import React, { Suspense } from 'react';
import { Row, Col, Skeleton } from 'antd';
import { Helmet } from 'react-helmet-async';
import {  PageHeader,AddCustomer } from '../../components';
// import './AddCustomerPage.css';

// const AddCustomer = React.lazy(() => import('../../components/customer/form/addCustomer'));

export const AddCustomerPage: React.FC = React.memo(() => {
  // No props, so this will never re-render unless parent context forces it.

  // Callback for any nav or breadcrumb clicks (example stub)
  // const handleBreadcrumbClick = useCallback((path: string) => {
  //   // navigate(path);
  // }, []);

  return (
    <div className="add-customer-page">
      <Helmet>
        <title>Add New Customer | CPM Dashboard</title>
      </Helmet>

      <PageHeader
        title="Add New Customer"
        breadcrumbs={[
          { title: 'Customer', 
            // path: '/customer'
           },
          { title: 'Add Customer' },
        ]}
        // onBreadcrumbClick={handleBreadcrumbClick}
      />

      <Row
        gutter={[
          { xs: 8, sm: 16, md: 24, lg: 32 },
          { xs: 8, sm: 16, md: 24, lg: 32 },
        ]}
        justify="center"
      >
        <Col xs={24} lg={20} xl={16}>
          <Suspense fallback={<Skeleton active paragraph={{ rows: 8 }} />}>
            <AddCustomer />
          </Suspense>
        </Col>
      </Row>
    </div>
  );
});

export default AddCustomerPage;
