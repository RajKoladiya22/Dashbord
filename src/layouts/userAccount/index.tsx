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
} from "antd";
import { EditOutlined } from "@ant-design/icons";
import { Card } from "../../components";
import { useStylesContext } from "../../context";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { useAppDispatch } from "../../hooks";
import {
  fetchUserProfile,
  updateUserProfile,
} from "../../redux/slice/user/userProfileSlice";

const { Link } = Typography;

import "./styles.css";

export const UserAccountLayout : React.FC = React.memo(() => {
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
  const [isEditMode, setIsEditMode] = useState(false);
  const [form] = Form.useForm();

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
      children: <span>{profile?.first_name}</span>,
    },
    {
      key: "last-name",
      label: "Last Name",
      children: <span>{profile?.last_name}</span>,
    },
    {
      key: "company_name",
      label: "Company Name",
      children: <span>{profile?.company_name}</span>,
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
        <Link href={`tel:${profile?.contact_number}`}>
          {profile?.contact_number}
        </Link>
      ),
    },
    {
      key: "plan",
      label: "Plan Status",
      children: <span>{profile?.plan_status}</span>,
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
              <Form.Item name="first_name" label="First Name">
                <Input />
              </Form.Item>
              <Form.Item name="last_name" label="Last Name">
                <Input />
              </Form.Item>
              <Form.Item name="company_name" label="Company Name">
                <Input />
              </Form.Item>
              <Form.Item name="email" label="Email">
                <Input />
              </Form.Item>
              <Form.Item name="contact_number" label="Phone">
                <Input />
              </Form.Item>
              <Form.Item
                name="plan_status"
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
                  <Button
                    color="gold"
                    variant="outlined"
                    icon={<EditOutlined />}
                    onClick={toggleEditMode}
                    loading={loading}
                  >
                    Edit Profile
                  </Button>
                }
                
              />
            </>
          )}
        </Col>
      </Row>
    </Card>
  );
});

export default React.memo(UserAccountLayout);
