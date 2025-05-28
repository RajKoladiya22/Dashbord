// import {
//   Col,
//   Descriptions,
//   DescriptionsProps,
//   Image,
//   Row,
//   theme,
//   Typography,
// } from "antd";
// import { Card } from "../../components";
// import { useStylesContext } from "../../context";

// const { Link } = Typography;

// import "./styles.css";
// import {
//   useEffect,
// } from "react";
// import { useSelector } from "react-redux";
// import { RootState } from "../../redux/store";
// import { useAppDispatch } from "../../hooks";
// import { fetchUserProfile } from "../../redux/slice/user/userProfileSlice";

// export const UserAccountLayout = () => {
//   const {
//     token: { borderRadius },
//   } = theme.useToken();
//   const dispatch = useAppDispatch();
//   const { profile } = useSelector((state: RootState) => state.profile);
//   const stylesContext = useStylesContext();

//   const DESCRIPTION_ITEMS: DescriptionsProps["items"] = [
//     {
//       key: "first-name",
//       label: "First Name",
//       children: <span>{profile?.first_name}</span>,
//     },
//     {
//       key: "last-name",
//       label: "Last Name",
//       children: <span>{profile?.last_name}</span>,
//     },
//     {
//       key: "company_name",
//       label: "Company Name",
//       children: <span>{profile?.company_name}</span>,
//     },
//     {
//       key: "email",
//       label: "Email",
//       children: <Link href={`mailto:${profile?.email}`}>{profile?.email}</Link>,
//     },
//     {
//       key: "telephone",
//       label: "Phone",
//       children: (
//         <Link href={`tel:${profile?.contact_number}`}>
//           {profile?.contact_number}
//         </Link>
//       ),
//     },
//     {
//       key: "paln",
//       label: "Plan Status",
//       children: <span>{profile?.plan_status}</span>,
//     },
//     {
//       key: "street",
//       label: "street",
//       children: <span>{profile?.address?.street}</span>,
//     },
//     {
//       key: "city",
//       label: "City",
//       children: <span>{profile?.address?.city}</span>,
//     },
//     {
//       key: "state",
//       label: "State",
//       children: <span>{profile?.address?.state}</span>,
//     },
//   ];

//   useEffect(() => {
//     dispatch(fetchUserProfile());
//   }, [dispatch]);

//   return (
//     <>
//       <Card className="user-profile-card-nav card"  >
//         <Row {...stylesContext?.rowProps}>
//           <Col xs={24} sm={8} lg={4}>
//             <Image
//               src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dXNlcnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60"
//               alt="user profile image"
//               height="100%"
//               width="100%"
//               style={{ borderRadius }}
//             />
//           </Col>
//           <Col xs={24} sm={16} lg={20}>
//             <Descriptions
//               title="User Info"
//               items={DESCRIPTION_ITEMS}
//               column={{ xs: 1, sm: 2, md: 2, lg: 3, xl: 3, xxl: 4 }}
//             />
//           </Col>
//         </Row>
//       </Card>
//     </>
//   );
// };

import {
  Col,
  // ConfigProvider,
  Descriptions,
  DescriptionsProps,
  Image,
  Row,
  Form,
  Input,
  Button,
  message,
  theme,
  Typography,
  Space,
  Modal,
} from "antd";
import { EditOutlined } from "@ant-design/icons";
import { Card } from "../../components";
import { useStylesContext } from "../../context";
import React, { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { useAppDispatch } from "../../hooks";
import {
  changePassword,
  fetchUserProfile,
  updateUserProfile,
} from "../../redux/slice/user/userProfileSlice";

const { Link } = Typography;

import "./styles.css";

type ChangePassword = {
  currentPassword: string,
  newPassword: string
}

export const UserAccountLayout: React.FC = React.memo(() => {
  const {
    token: { borderRadius },
  } = theme.useToken();
  const dispatch = useAppDispatch();
  const { profile, loading,
    // error
  } = useSelector(
    (state: RootState) => state.profile || {}
  );
  const stylesContext = useStylesContext();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isPasswordRight, setIsPasswordRight] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [form] = Form.useForm();
  console.log(isPasswordRight, "isPasswordRight");

  // Handlers wrapped in useCallback to avoid re-creating on every render 
  const showModal = useCallback(() => {
    setIsModalVisible(true);
  }, []);

  const handleCancel = useCallback(() => {
    setIsModalVisible(false);
    setIsPasswordRight(false);
    form.resetFields();
  }, [form]);

  useEffect(() => {
    if (!profile) {
      dispatch(fetchUserProfile());
    } else {
      form.setFieldsValue(profile);
    }
  }, [dispatch, profile, form]);


  const DESCRIPTION_ITEMS: DescriptionsProps["items"] = [
    {
      key: "first-name",
      label: "First Name",
      children: <span>{profile?.firstName}</span>,
    },
    {
      key: "last-name",
      label: "Last Name",
      children: <span>{profile?.lastName}</span>,
    },
    {
      key: "company_name",
      label: "Company Name",
      children: <span>{profile?.companyName}</span>,
    },
    {
      key: "email",
      label: "Email",
      children: <Link href={`mailto:${profile?.email}`}>{profile?.email}</Link>,
    },
    {
      key: "telephone",
      label: "Phone",
      children: (
        <Link href={`tel:${profile?.contactInfo?.contactNumber}`}>
          {profile?.contactInfo?.contactNumber}
        </Link>
      ),
    },
    {
      key: "plan",
      label: "Plan Status",
      children: <span>{profile?.status}</span>,
    },
    {
      key: "street",
      label: "Street",
      children: <span>{profile?.address?.street}</span>,
    },
    {
      key: "city",
      label: "City",
      children: <span>{profile?.address?.city}</span>,
    },
    {
      key: "state",
      label: "State",
      children: <span>{profile?.address?.state}</span>,
    },
  ];

  const toggleEditMode = () => {
    setIsEditMode((prev) => !prev);
    if (!isEditMode) {
      form.setFieldsValue(profile);
    }
  };

  const handleSubmit = async (values: any) => {
    try {
      await dispatch(updateUserProfile(values));
      message.success("Profile updated successfully!");
      setIsEditMode(false);
    } catch (err) {
      message.error("Failed to update profile");
    }
  };

  // handleChangePassword wrapped in useCallback to keep referential integrity 
  const handleChangePassword = useCallback(
    async (values: ChangePassword) => {
      const payload = {
        oldPassword: values.currentPassword,
        newPassword: values.newPassword
      }
      // console.log('payload ---------> ' + payload);
      try {
        await dispatch(changePassword(payload)).unwrap(); // dispatch thunk
        message.success("Password Changed successfully!");
        form.resetFields();
        setIsModalVisible(false);
      } catch (err: any) {
        console.error(err);
        message.error("Failed to Change Password");
      }
    },
    [dispatch, form]
  );

  return (
    <Card className="user-profile-card-nav card"
      actions={[
        <div style={{ padding: "5px", textAlign: "end" }}>
          <Typography.Text type="danger" strong>
            delete account?
          </Typography.Text>
          {/* <Button
          type="default"
          danger
          // onClick={handleDelete}
          style={{ marginLeft: 8 }}
        >
          Delete
        </Button> */}
        </div>
      ]
      }
    >
      <Row {...stylesContext?.rowProps}>
        <Col xs={24} sm={8} lg={4}>
          <Image
            src={
              "https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dXNlcnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60"
            }
            alt="user profile image"
            height="250"
            width="100%"
            style={{ borderRadius }}
          />
        </Col>
        <Col xs={24} sm={16} lg={20}>
          {isEditMode ? (
            <Form
              form={form}
              layout="vertical"
              // initialValues={profile}
              onFinish={handleSubmit}
            >
              <Form.Item name="firstName" label="First Name" rules={[{ required: true, message: 'Please input the First Name' }]}>
                <Input />
              </Form.Item>
              <Form.Item name="lastName" label="Last Name" rules={[{ required: true, message: 'Please input the Last Name' }]}>
                <Input />
              </Form.Item>
              <Form.Item name="companyName" label="Company Name" rules={[{ required: true, message: 'Please input the Company Name' }]}>
                <Input />
              </Form.Item>
              <Form.Item name="email" label="Email" rules={[{ required: true, message: 'Please input the Email' }]}>
                <Input />
              </Form.Item>
              <Form.Item name={["contactInfo", "contactNumber"]} label="Phone" rules={[{ required: true, message: 'Please input the Phone Number' }]}>
                <Input />
              </Form.Item>
              <Form.Item
                name="planStatus"
                label="Plan Status (ONLY AT TESTING MODE)"
              >
                <Input />
              </Form.Item>
              <Form.Item name={["address", "street"]} label="Street">
                <Input />
              </Form.Item>
              <Form.Item name={["address", "city"]} label="City">
                <Input />
              </Form.Item>
              <Form.Item name={["address", "state"]} label="State">
                <Input />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit" loading={loading}>
                  Save Changes
                </Button>
                <Button
                  style={{ marginLeft: 8 }}
                  onClick={toggleEditMode}
                  disabled={loading}
                >
                  Cancel
                </Button>
              </Form.Item>
            </Form>
          ) : (
            <>
              <Descriptions
                title="User Info"
                items={DESCRIPTION_ITEMS}
                column={{ xs: 1, sm: 2, md: 2, lg: 3, xl: 3, xxl: 4 }}
                extra={
                  <Space>
                    <Button
                      color="gold"
                      variant="outlined"
                      icon={<EditOutlined />}
                      onClick={toggleEditMode}
                      loading={loading}
                    >
                      Edit Profile
                    </Button>
                    <Button
                      color="orange"
                      variant="outlined"
                      icon={<EditOutlined />}
                      onClick={showModal}
                      loading={loading}
                    >
                      Change Password
                    </Button>
                    <Modal
                      title="Change Password"
                      open={isModalVisible}
                      onCancel={handleCancel}
                      footer={null}
                      destroyOnClose
                      width={500}
                    >
                      {/* <Form
                        form={form}
                        layout="vertical"
                        onFinish={checkCurrentPassword}
                        autoComplete="off"
                        requiredMark={false}
                      >
                        <Form.Item
                          label="Current Password"
                          name="currentPassword"
                          rules={[{ required: true, message: "Please input the Current Password!" }]}
                        >
                          <Input.Password placeholder="Current Password" disabled={isPasswordRight ? true : false} />
                        </Form.Item>
                        {!isPasswordRight && (
                          <Form.Item>
                            <Button type="primary" htmlType="submit" loading={loading} block>
                              Check Password
                            </Button>
                          </Form.Item>
                        )}
                      </Form>
                      {isPasswordRight && (
                        <>
                          <Form
                            form={form}
                            layout="vertical"
                            // onFinish={updatePassword}
                            autoComplete="off"
                            requiredMark={false}
                          >
                            <Form.Item
                              label="New Password"
                              name="newPassword"
                              rules={[{ required: true, message: "Please input the New Password!" }]}
                              hasFeedback
                            >
                              <Input.Password placeholder="New Password" />
                            </Form.Item>
                            <Form.Item
                              label="Confirm Password"
                              name="confirmPassword"
                              rules={[
                                { required: true, message: "Please input the Confirm Password!" },
                                ({ getFieldValue }) => ({
                                  validator(_, value) {
                                    if (!value || getFieldValue("newPassword") === value) {
                                      return Promise.resolve();
                                    }
                                    return Promise.reject(
                                      new Error('Passwords do not match!')
                                    )
                                  }
                                })
                              ]}
                              hasFeedback
                            >
                              <Input.Password placeholder="Confirm Password" />
                            </Form.Item>
                            <Button
                              type="primary"
                              htmlType="submit"
                              loading={loading}
                              block
                            >
                              Update Password
                            </Button>
                          </Form>
                        </>
                      )} */}
                      <Form
                        form={form}
                        layout="vertical"
                        onFinish={handleChangePassword}
                        autoComplete="off"
                        requiredMark={false}
                      >
                        <Form.Item
                          label="Current Password"
                          name="currentPassword"
                          rules={[{ required: true, message: "Please input the Current Password!" }]}
                        >
                          <Input.Password placeholder="Current Password" />
                        </Form.Item>
                        <Form.Item
                          label="New Password"
                          name="newPassword"
                          rules={[{ required: true, message: "Please input the New Password!" }]}
                          hasFeedback
                        >
                          <Input.Password placeholder="New Password" />
                        </Form.Item>
                        <Form.Item
                          label="Confirm Password"
                          name="confirmPassword"
                          rules={[
                            { required: true, message: "Please input the Confirm Password!" },
                            ({ getFieldValue }) => ({
                              validator(_, value) {
                                if (!value || getFieldValue("newPassword") === value) {
                                  return Promise.resolve();
                                }
                                return Promise.reject(
                                  new Error('Passwords do not match!')
                                )
                              }
                            })
                          ]}
                          hasFeedback
                        >
                          <Input.Password placeholder="Confirm Password" />
                        </Form.Item>
                        <Button
                          type="primary"
                          htmlType="submit"
                          loading={loading}
                          block
                        >
                          Change Password
                        </Button>
                      </Form>
                    </Modal>
                  </Space>
                }

              />
            </>
          )}
        </Col>
      </Row>
    </Card >
  );
});

export default React.memo(UserAccountLayout);
