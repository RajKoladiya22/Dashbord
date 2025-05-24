import { useCallback, useState } from 'react'
import { Button, Card, Col, DatePicker, Form, Input, InputNumber, message, Modal, Row } from 'antd'
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { RootState } from '../../redux/store';
import { useAppDispatch } from '../../hooks';
import { useSelector } from 'react-redux';
import { createPlan } from '../../redux/slice/plan/planSlice';

export const NewPlanButton = () => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [form] = Form.useForm();
    const dispatch = useAppDispatch();
    const { loading } = useSelector((state: RootState) => state.team);

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        form.resetFields();
    };

    const onFinish = useCallback(async (values: any) => {
        const payload = {
            name: values.name,
            duration: values.duration + ' days',
            price: values.price,
            offers: values.offers?.map((offer: any) => ({
                offerType: offer.offerType,
                value: offer.value,
                startsAt: offer.startDate,
                endsAt: offer.endDate
            })) || [],
            specs: values.specifications?.map((spec: any) => ({
                specName: spec.specificationName,
                specValue: spec.specificationValue
            })) || [],
            descriptions: values.descriptions?.map((desc: any) => ({
                content: desc.description
            })) || [],
        }
        try {
            await dispatch(createPlan(payload)).unwrap(); // dispatch thunk
            message.success("Plan created successfully!");
            form.resetFields();
            setIsModalVisible(false);
        } catch (err: any) {
            console.error(err);
            message.error("Failed to create new plan");
        }
    },
        [dispatch, form]
    );

    return (
        <>
            <Button icon={<PlusOutlined />} onClick={showModal}>
                New Plan
            </Button>
            <Modal
                title="New Plan"
                open={isModalVisible}
                onCancel={handleCancel}
                footer={null}
                destroyOnClose
            >
                <Form
                    form={form}
                    layout='vertical'
                    onFinish={onFinish}
                    onFinishFailed={() => message.error("Please complete all required fields correctly.")}
                >
                    <Form.Item
                        name="name"
                        label="Name"
                        rules={[{ required: true, message: "Please enter plan name!" }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="duration"
                        label="Duration"
                        rules={[{ required: true, message: "Please enter plan name!" }]}
                    >
                        <Input suffix="Days" />
                    </Form.Item>
                    <Form.Item
                        name="price"
                        label="Price"
                        rules={[{ required: true, message: "Please enter plan name!" }]}
                    >
                        <InputNumber prefix="₹" min={'0'} style={{ width: '100%' }} />
                    </Form.Item>
                    <Form.List name="offers">
                        {(fields, { add, remove }) => (
                            <>
                                <label>Offers</label>
                                {fields.map(({ key, name, ...restField }, index) => (
                                    <Card
                                        key={key}
                                        title={`Offer #${index + 1}`}
                                        type="inner"
                                        extra={
                                            <Button
                                                type="link"
                                                danger
                                                onClick={() => remove(name)}
                                            >
                                                Remove
                                            </Button>
                                        }
                                    >
                                        <Row gutter={8} key={key} align="middle">
                                            <Col span={15}>
                                                <Form.Item
                                                    {...restField}
                                                    name={[name, "offerType"]}
                                                    rules={[{ required: true, message: "Enter Offer Type" }]}
                                                >
                                                    <Input placeholder="Offer Type" />
                                                </Form.Item>
                                            </Col>
                                            <Col span={9}>
                                                <Form.Item
                                                    {...restField}
                                                    name={[name, "value"]}
                                                    rules={[{ required: true, message: "Enter value" }]}
                                                >
                                                    <InputNumber prefix="₹" min={'0'} placeholder="Value" style={{ width: '100%' }} />
                                                </Form.Item>
                                            </Col>
                                        </Row>
                                        {/* set offer date */}
                                        <Row gutter={8} key={key} align="middle">
                                            <Col span={12}>
                                                <Form.Item
                                                    {...restField}
                                                    name={[name, "startDate"]}
                                                    rules={[{ required: true, message: "Enter Offer Type" }]}
                                                >
                                                    <DatePicker placeholder="Start Date" style={{ width: "100%" }} />
                                                </Form.Item>
                                            </Col>
                                            <Col span={12}>
                                                <Form.Item
                                                    {...restField}
                                                    name={[name, "endDate"]}
                                                    rules={[{ required: true, message: "Enter value" }]}
                                                >
                                                    <DatePicker placeholder="End Date" style={{ width: "100%" }} />
                                                </Form.Item>
                                            </Col>
                                        </Row>
                                    </Card>
                                ))}
                                <Form.Item>
                                    <Button type="dashed" onClick={() => add()} block>
                                        + Add Offer
                                    </Button>
                                </Form.Item>
                            </>
                        )}
                    </Form.List>
                    <Form.List name="specifications">
                        {(fields, { add, remove }) => (
                            <>
                                <label>Specifications</label>
                                {fields.map(({ key, name, ...restField }) => (
                                    <Row gutter={8} key={key} align="middle">
                                        <Col span={10}>
                                            <Form.Item
                                                {...restField}
                                                name={[name, "specificationName"]}
                                                rules={[{ required: true, message: "Enter specification name" }]}
                                            >
                                                <Input placeholder="Specification Name" />
                                            </Form.Item>
                                        </Col>
                                        <Col span={12}>
                                            <Form.Item
                                                {...restField}
                                                name={[name, "specificationValue"]}
                                                rules={[{ required: true, message: "Enter specification value" }]}
                                            >
                                                <Input placeholder="Specification Value" />
                                            </Form.Item>
                                        </Col>
                                        <Col span={2}>
                                            <MinusCircleOutlined
                                                onClick={() => remove(name)}
                                                style={{ color: "red" }}
                                            />
                                        </Col>
                                    </Row>
                                ))}
                                <Form.Item>
                                    <Button type="dashed" onClick={() => add()} block>
                                        + Add Specification
                                    </Button>
                                </Form.Item>
                            </>
                        )}
                    </Form.List>
                    <Form.List name="descriptions">
                        {(fields, { add, remove }) => (
                            <>
                                <label>Descriptions</label>
                                {fields.map(({ key, name, ...restField }) => (
                                    <Row gutter={8} key={key} align="middle">
                                        <Col span={22}>
                                            <Form.Item
                                                {...restField}
                                                name={[name, "description"]}
                                                rules={[{ required: true, message: "Enter description" }]}
                                            >
                                                <Input placeholder="Description Content" />
                                            </Form.Item>
                                        </Col>
                                        <Col span={2}>
                                            <MinusCircleOutlined
                                                onClick={() => remove(name)}
                                                style={{ color: "red" }}
                                            />
                                        </Col>
                                    </Row>
                                ))}
                                <Form.Item>
                                    <Button type="dashed" onClick={() => add()} block>
                                        + Add Description
                                    </Button>
                                </Form.Item>
                            </>
                        )}
                    </Form.List>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" loading={loading} block>
                            Create
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    )
}
