import { useState } from "react";
import { Button, Modal, Form, Input, 
  // Select,
   message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { createPartner } from "../../../redux/slice/auth/partnerRegisterSlice";
import { useAppDispatch } from "../../../hooks";
import { fetchPartners } from "../../../redux/slice/partner/partnerMemberSlice";
import { PartnerData } from "../../../redux/APITypes";

// const { Option } = Select;

export const AddPartnerButton = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, 
    // setLoading
  ] = useState(false);
  const [form] = Form.useForm();
  const dispatch = useAppDispatch();

  const showModal = () => setIsModalVisible(true);

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const onFinish = (values: PartnerData) => {
    if (values.password !== values.confirmPassword) {
      message.error("Passwords do not match!");
      return;
    }
    // console.log("values----->", values);
    
    const signupData: PartnerData = {
      firstName: values.firstName,
      companyName: values.companyName,
      email: values.email,
      password: values.password,
    };
    // console.log("signupData---->", signupData);
    

    dispatch(createPartner(signupData))
      .unwrap()
      .then(() => {
        dispatch(fetchPartners())
        message.success("Team member created successfully!");
        form.resetFields();
        setIsModalVisible(false);
      })
      .catch((error) => {
        
        message.error(error);
      });
  };

  return (
    <>
      <Button icon={<PlusOutlined />} onClick={showModal}>
        Add Partner
      </Button>
      <Modal
        title="Add Partner"
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        destroyOnClose
      >
        <Form form={form} layout="vertical" onFinish={onFinish}>
          {/* companyName */}
          <Form.Item
            name="companyName"
            label="Company Name"
            rules={[
              { required: true, message: "Please input the company name!" },
            ]}
          >
            <Input placeholder="Company Name"/>
          </Form.Item>
          {/* Partner Name */}
          <Form.Item
            name="firstName"
            label="Partner Name"
            rules={[
              { required: true, message: "Please input the partner name!" },
            ]}
          >
            <Input placeholder="Partner Name"/>
          </Form.Item>
          {/* contactNumber */}
          {/* <Form.Item
            name="contactNumber"
            label="Contact Number"
            rules={[
              {
                pattern: /^[0-9]{10}$/,
                message: "Please enter a valid 10-digit number",
              },
            ]}
          >
            <Input placeholder="Optional" />
          </Form.Item> */}
          {/* email */}
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: "Please input the email!" },
              { type: "email", message: "Please enter a valid email!" },
            ]}
          >
            <Input placeholder="Email"/>
          </Form.Item>
          {/* password */}
          <Form.Item
            name="password"
            label="Password"
            rules={[{ required: true, message: "Please input the password!" }]}
            hasFeedback
          >
            <Input.Password />
          </Form.Item>
          {/* confirmPassword */}
          <Form.Item
            name="confirmPassword"
            label="Confirm Password"
            dependencies={["password"]}
            hasFeedback
            rules={[
              { required: true, message: "Please confirm the password!" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("Passwords do not match!"));
                },
              }),
            ]}
          >
            <Input.Password />
          </Form.Item>
          {/* partnerType */}
          {/* <Form.Item
            name="partnerType"
            label="Partner Type"
            rules={[
              { required: true, message: "Please select the partner type!" },
            ]}
          >
            <Select placeholder="Select a partner type">
              <Option value="vendor">Vendor</Option>
              <Option value="reseller">Reseller</Option>
              <Option value="affiliate">Affiliate</Option>
          
            </Select>
          </Form.Item> */}

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
              Create
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
