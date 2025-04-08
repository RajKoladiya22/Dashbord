import { Row } from 'antd';
import {
  PageHeader,
  AddCustomer
} from '../../components';

// import {addCustomer} from '../../components/Form/index'
// import { HomeOutlined } from '@ant-design/icons';
import { Helmet } from 'react-helmet-async';


export const AddCustomerPage = () => {


  return (
    <div>
      <Helmet>
        <title>Customer | CPM Dashboard</title>
      </Helmet>
      <PageHeader
        title="Add New Customer"
        breadcrumbs={[
          // {
          //   title: (
          //     <>
          //       <HomeOutlined />
          //       <span>home</span>
          //     </>
          //   ),
          //   path: '/',
          // },
          {
            title: (
              <>
                {/* <PieChartOutlined /> */}
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
        <AddCustomer />
      </Row>
    </div>
  );
};
