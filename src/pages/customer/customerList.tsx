import { Row } from 'antd';
import {
  PageHeader,
  CustomerList
} from '../../components';
import { Helmet } from 'react-helmet-async';


export const CustomerListPage = () => {


  return (
    <div>
      <Helmet>
        <title>Customer | CPM Dashboard</title>
      </Helmet>
      <PageHeader
        title="Add New Customer"
        breadcrumbs={[

          {
            title: (
              <>
                <span>Customer</span>
              </>
            ),
          
          },
          {
            title: 'Add Customer',
          },
        ]}
      />
      <Row
        gutter={[
          { xs: 8, sm: 16, md: 24, lg: 32 },
          { xs: 8, sm: 16, md: 24, lg: 32 },
        ]}
      >
        <CustomerList />
      </Row>
    </div>
  );
};
