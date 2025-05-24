import React from 'react'
import { Helmet } from 'react-helmet-async';
import { PageHeader } from '../../components';
import { Col, Row } from 'antd';
import { PlanCard } from '../../components/Plan/PlanCard';

export const PlanLayout: React.FC = React.memo(() => {
    return (
        <div>
            <Helmet>
                <title>PlanPage | CPM Dashboard</title>
            </Helmet>
            <PageHeader
                title="Plan"
                breadcrumbs={[
                    {
                        title: 'Plan',

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
                    <PlanCard />
                </Col>
            </Row>
        </div>
    )
})

export default React.memo(PlanLayout);