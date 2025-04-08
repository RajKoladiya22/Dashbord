import {  Card, Col, Row, Space } from 'antd';
import {
  PageHeader,
  PartnerList,
  AddPartnerButton
} from '../../components';

import { Helmet } from 'react-helmet-async';


export const PartnerPage = () => {


  return (
    <div>
      <Helmet>
        <title>Partner | CPM Dashboard</title>
      </Helmet>
      <PageHeader
        title="Our Partners"
        breadcrumbs={[

          {
            title: (
              <>
                <span>Partner-Team</span>
              </>
            ),
          
          },
          {
            title: 'Partner',
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
                  title="Partner Members"
                  extra={
                    <Space>
                      {/* <Button icon={<CloudUploadOutlined />}>Import</Button> */}
                      <AddPartnerButton />
                    </Space>
                  }
                >
                     <PartnerList />
                </Card>
              </Col>
      </Row>
    </div>
  );
};
