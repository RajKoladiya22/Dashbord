import { PageHeader, ReminderList } from "../../components";
import { Card, Col, Row, Space } from "antd";
import React from "react";
import { Helmet } from "react-helmet-async";

export const ReminderPage : React.FC = React.memo(() => {
  return (
    <div>
      <Helmet>
        <title>Reminder | CPM Dashboard</title>
      </Helmet>
      <PageHeader
        title="Reminders"
        breadcrumbs={[
          {
            title: (
              <>
                <span>Customer</span>
              </>
            ),
          },
          {
            title: "Reminder",
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
            title="Reminders List"
            extra={<Space>{/* <AddInTeamButton /> */}</Space>}
          >
            <ReminderList />
          </Card>
        </Col>
      </Row>
    </div>
  );
});
