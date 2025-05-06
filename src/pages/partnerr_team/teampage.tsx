import { Card, Col, Row, Space } from "antd";
import { Helmet } from "react-helmet-async";
import { PageHeader, TeamList, AddInTeamButton } from "../../components";
import React from "react";

export const TeamPage: React.FC = React.memo(() => {
  return (
    <div>
      <Helmet>
        <title>Team | CPM Dashboard</title>
      </Helmet>
      <PageHeader
        title="My Team"
        breadcrumbs={[
          {
            title: <span>Partner-Team</span>,
          },
          {
            title: "Team",
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
            title="Team Members"
            extra={
              <Space>
                <AddInTeamButton />
              </Space>
            }
          >
            <TeamList />
          </Card>
        </Col>
      </Row>
    </div>
  );
});
