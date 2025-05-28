import React, { useEffect, useState } from 'react'
import { Plan } from '../../types/plan.type';
// import { useAppDispatch } from '../../hooks';
import { Button, Card, Col, DatePicker, Form, Input, InputNumber, message, Modal, Row, 
    // Select
 } from 'antd';
import { MinusCircleOutlined, 
    // PlusOutlined
 } from '@ant-design/icons'

interface EditPlanModalProps {
    visible: boolean;
    plan: Plan | null;
    onCancel: () => void;
}

export const EditPlanModel: React.FC<EditPlanModalProps> = ({
    visible,
    plan,
    onCancel,
}) => {
    const [form] = Form.useForm();
    // const dispatch = useAppDispatch();
    const [loading, 
        // setLoading
    ] = useState(false);

    useEffect(() => {
        if (plan) {
            console.log(plan);
            
            form.setFieldsValue({
                name: plan.name,
                duration: plan.duration + ' days',
                price: plan.price,
                offers: plan.offers?.map((offer: any) => ({
                    offerType: offer.offerType,
                    value: offer.value,
                    startsAt: offer.startDate,
                    endsAt: offer.endDate
                })) || [],
                // specs: plan.specifications?.map((spec: any) => ({
                //     specName: spec.specificationName,
                //     specValue: spec.specificationValue
                // })) || [],
                descriptions: plan.descriptions?.map((desc: any) => ({
                    content: desc.description
                })) || [],
            });
        } else {
            form.resetFields();
        }
    }, [plan, form]);

    return (
        <Modal
            title="Edit Plan"
            visible={visible}
            onCancel={onCancel}
            onOk={() => form.submit()}
            confirmLoading={loading}
            destroyOnClose
            width={800}
        >
            <Form
                form={form}
                layout='vertical'
                // onFinish={onFinish}
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
    )
}
