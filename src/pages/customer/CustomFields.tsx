import { Row } from 'antd';
import {
  PageHeader,
  CustomFieldsList
} from '../../components';
import { Helmet } from 'react-helmet-async';


export const CustomFieldsListPage = () => {


  return (
    <div>
      <Helmet>
        <title>CustomFields | CPM Dashboard</title>
      </Helmet>
      <PageHeader
        title="Custom Fields"
        breadcrumbs={[
          {
            title: 'Custom Fields',
            
          },
        ]}
      />
      <Row
        gutter={[
          { xs: 8, sm: 16, md: 24, lg: 32 },
          { xs: 8, sm: 16, md: 24, lg: 32 },
        ]}
      >
        <CustomFieldsList />
      </Row>
    </div>
  );
};
