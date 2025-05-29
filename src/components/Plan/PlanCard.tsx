import { Button, Card, Col, Descriptions, Empty, Input, message, Modal, Popconfirm, Row, Skeleton, Space, Switch, Tag, Typography } from 'antd'
import React, { useCallback, useEffect, useState } from 'react'
import { NewPlanButton } from './NewPlanButton'
import { useAppDispatch } from '../../hooks';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { deletePlan, fetchAllPlans, togglePlanStatus } from '../../redux/slice/plan/planSlice';
import { CheckCircleTwoTone, DeleteOutlined, EditOutlined, SearchOutlined, StopTwoTone } from '@ant-design/icons'
import AutoDismissAlert from '../Alert';
import { Plan } from '../../types/plan.type';
// import { EditPlanModel } from './EditPlanModel';
import dayjs from 'dayjs';

const { Text, Title } = Typography;
const { Meta } = Card;

export const PlanCard: React.FC = () => {
    const dispatch = useAppDispatch();
    const { plans, loading, error } = useSelector((state: RootState) => state.plans);
    const [filterStatus, setFilterStatus] = useState<boolean>(true);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
    const [editing, setEditing] = useState<Plan | null>(null);

    console.log(editing, "editing" );

    const showModal = useCallback((plan: Plan) => {
        setSelectedPlan(plan);
        setIsModalVisible(true);
    }, []);

    const handleCancel = useCallback(() => {
        setIsModalVisible(false);
        setSelectedPlan(null);
    }, []);

    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            // fetch all plans 
            dispatch(
                fetchAllPlans({
                    status: filterStatus,
                    page: 1,
                    limit: 100,
                })
            );
        }, 300);
        return () => clearTimeout(delayDebounce);
    }, [dispatch, filterStatus]);

    // delete plan
    const handleDelete = useCallback(
        async (id: string) => {
            try {
                await dispatch(deletePlan(id)).unwrap();
                message.success("Plan deleted successfully");
            } catch (err) {
                message.error("Failed to delete plan");
            }
        },
        [dispatch]
    );

    // change plan status
    const handleToggleStatus = (p: Plan, e: React.MouseEvent) => {
        e.stopPropagation();
        dispatch(togglePlanStatus({ id: p.id, status: !p.status })).unwrap();
        message.success("Plan Status Updated");
    };

    const PlanUICard = React.memo(
        ({
            plan,
            onView,
        }: // onEdit,
            // onDelete,
            {
                plan: Plan;
                onView: (p: Plan) => void;
                onEdit: (p: Plan) => void;
                onDelete: (p: Plan) => void;
            }) => (
            <Card
                hoverable
                style={{ maxWidth: 300, margin: "auto" }}
                onClick={() => onView(plan)}
                actions={[
                    // Edit icon
                    <EditOutlined
                        key="edit"
                        onClick={(e) => {
                            e.stopPropagation();
                            setEditing(plan);
                        }}
                    />,

                    // Delete icon — shown only if plan is inactive
                    !plan?.status && (
                        <DeleteOutlined
                            key="delete"
                            onClick={(e: any) => {
                                e.stopPropagation();
                                handleDelete(plan.id);
                            }}
                        />
                    ),

                    // Toggle status icon inside Popconfirm
                    <span onClick={(e) => e.stopPropagation()}>
                        <Popconfirm
                            key="toggle"
                            title={`Are you sure you want to ${plan.status ? "deactivate" : "activate"
                                } this plan?`}
                            onConfirm={(e: any) => {
                                e.stopPropagation();
                                handleToggleStatus(plan, e);
                            }}
                            okText="Yes"
                            cancelText="No"
                        >
                            {plan.status ? (
                                <CheckCircleTwoTone
                                    key="activate"
                                    twoToneColor="#52c41a"
                                    onClick={(e) => e.stopPropagation()}
                                />
                            ) : (
                                <StopTwoTone
                                    key="deactivate"
                                    twoToneColor="#ff4d4f"
                                    onClick={(e) => e.stopPropagation()}
                                />
                            )}
                        </Popconfirm>
                    </span>,
                ]}
            >
                <Meta
                    title={plan.name}
                    description={plan.price}
                />
            </Card>
        ),
        (prev, next) => prev.plan.id === next.plan.id
    );

    return (
        <>
            <Card
                title='Plan Management'
                extra={
                    <Space>
                        <NewPlanButton />
                    </Space>
                }
            >
                <div className="filter-bar" style={{ marginBottom: 24 }}>
                    <Space size="middle" wrap>
                        <div className="status-filter">
                            Status:
                            <Switch
                                checkedChildren="Active"
                                unCheckedChildren="Inactive"
                                checked={filterStatus}
                                onChange={setFilterStatus}
                                style={{ marginLeft: 8 }}
                            />
                        </div>
                        <Input
                            placeholder="Search plans..."
                            prefix={<SearchOutlined style={{ color: "rgba(0,0,0,.25)" }} />}
                            allowClear
                            // value={searchQuery}
                            // onChange={handleSearch}
                            style={{ width: 280 }}
                            size="large"
                        />
                    </Space>
                </div>

                {error && (
                    <AutoDismissAlert
                        message="Error"
                        description={error}
                        type="error"
                        showIcon
                        style={{ marginBottom: 16 }}
                        onClose={() => null}
                        durationMs={10000} // 10 seconds
                    />
                )}

                <Row gutter={[24, 24]} wrap >
                    {loading ? (
                        Array.from({ length: 8 }).map((_, idx) => (
                            <Col key={idx} xs={24} sm={12} md={8} lg={6} xl={6}>
                                <Card style={{ height: "100%" }} bodyStyle={{ padding: 16 }}>
                                    <Skeleton
                                        active
                                        // avatar={{ shape: "square", size: "large" }}
                                        paragraph={{ rows: 3 }}
                                    />
                                </Card>
                            </Col>
                        ))
                    ) : plans.length === 0 ? (
                        <Col span={24}>
                            <Empty
                                image={Empty.PRESENTED_IMAGE_SIMPLE}
                                description={
                                    <Text type="secondary">
                                        No plans found.{" "}
                                        {filterStatus && "Try adjusting your filters."}
                                    </Text>
                                }
                                style={{ margin: "40px 0" }}
                            >
                                <NewPlanButton />
                            </Empty>
                        </Col>
                    ) : (
                        plans?.map((plan, index) => (
                            <Col key={index} xs={24} sm={12} md={8} lg={6} xl={6}>
                                <PlanUICard
                                    key={index}
                                    plan={plan}
                                    onView={showModal}
                                    onEdit={(p) => console.log("Edit", p)}
                                    onDelete={(p) => console.log("Delete", p)}
                                />
                            </Col>
                        ))
                    )
                    
                    }
                </Row>

                {/* Plan Detail Modal */}
                <Modal
                    open={isModalVisible}
                    onCancel={handleCancel}
                    footer={null}
                    width={800}
                    centered
                    className="product-detail-modal"
                    bodyStyle={{ padding: 0 }}
                >
                    {selectedPlan && (
                        <div className="modal-content">
                            <div
                                className="modal-header"
                                style={{ padding: 24, borderBottom: "1px solid #f0f0f0" }}
                            >
                                <Space align="start">
                                    {/* <Avatar
                                        size={64}
                                        shape="square"
                                        src={
                                            selectedPlan.image ||
                                            `https://via.placeholder.com/150?text=${selectedPlan.productName[0]}`
                                        }
                                        className="product-image"
                                    /> */}
                                    <div>
                                        <Space align="center" size="small">
                                            <Title level={4} style={{ margin: 0 }}>
                                                {selectedPlan.name}
                                            </Title>
                                            <Tag color={selectedPlan.status ? "green" : "red"}>
                                                {selectedPlan.status ? "Active" : "Inactive"}
                                            </Tag>
                                        </Space>
                                        {/* <Text
                                            type="secondary"
                                            style={{ display: "block", marginTop: 4 }}
                                        >
                                            {selectedPlan.productCategory.join(" • ")}
                                        </Text> */}
                                    </div>
                                </Space>
                            </div>

                            <div className="modal-body" style={{ padding: 24 }}>
                                <Row gutter={24}>
                                    <Col span={24} md={12}>
                                        <Descriptions column={1} size="small">
                                            <Descriptions.Item label="Price">
                                                <Text strong style={{ fontSize: 18 }}>
                                                    ₹{selectedPlan.price}
                                                    <Text type="secondary" style={{ fontSize: 14 }}>
                                                        {/* /year */}
                                                    </Text>
                                                </Text>
                                            </Descriptions.Item>
                                            {/* <Descriptions.Item label="Tags">
                                                <Space wrap>
                                                    {selectedPlan.tags?.map((tag) => (
                                                        <Tag key={tag}>{tag}</Tag>
                                                    ))}
                                                </Space>
                                            </Descriptions.Item> */}
                                            {/* <Descriptions.Item label="Description">
                                                {selectedPlan.descriptions.map((desc, index) => {
                                                    `${index + 1}. ${desc.content}`
                                                }) || "No description available"}
                                            </Descriptions.Item> */}
                                        </Descriptions>
                                    </Col>

                                    <Col span={24} md={12}>
                                        <div className="specifications-section">
                                            <Title level={5} style={{ marginBottom: 16 }}>
                                                Specifications
                                            </Title>
                                            {/* <Row gutter={[8, 8]}>
                                                {
                                                    selectedPlan.spec.map(())
                                                }
                                                {Object.entries(
                                                    selectedPlan.specifications || {}
                                                ).map(([key, value]) => (
                                                    <Col span={12} key={key}>
                                                        <div className="spec-item">
                                                            <Text type="secondary">{key}:</Text>{" "}
                                                            <Text strong>{value}</Text>
                                                        </div>
                                                    </Col>
                                                ))}
                                            </Row> */}
                                        </div>
                                    </Col>
                                </Row>
                            </div>

                            <div
                                className="modal-footer"
                                style={{
                                    padding: 16,
                                    background: "#fafafa",
                                    borderTop: "1px solid #f0f0f0",
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                }}
                            >
                                <Text type="secondary">
                                    Created:{" "}
                                    {dayjs(selectedPlan.createdAt).format("MMM D, YYYY")}
                                </Text>
                                <Space>
                                    <Button onClick={handleCancel}>Close</Button>
                                </Space>
                            </div>
                        </div>
                    )}
                </Modal>

                {/* <EditPlanModel
                    visible={!!editing}
                    plan={editing}
                    onCancel={() => setEditing(null)}
                /> */}
            </Card >
        </>
    )
}