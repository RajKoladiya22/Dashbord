import {
  Button,
  Checkbox,
  Col,
  Divider,
  Flex,
  Form,
  Input,
  message,
  Row,
  theme,
  Typography,
} from "antd";
import {
  FacebookFilled,
  GoogleOutlined,
  TwitterOutlined,
} from "@ant-design/icons";
import { Logo } from "../../components";
import { useMediaQuery } from "react-responsive";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {useAppDispatch} from '../../hooks'
import { RootState } from "../../redux/store";
import { signupUser, SignUpData } from "../../redux/slice/auth/registerSlice"; // Adjust the path according to your folder structure

const { Title, Text } = Typography;

type FieldType = {
  firstName: string;
  lastName: string;
  email: string;
  contactNumber: string;
  companyName: string;
  password: string;
  cPassword: string;
  // Optionally, add address fields if you want the user to enter them
  street?: string;
  city?: string;
  state?: string;
  terms?: boolean;
};

export const SignUpPage = () => {
  const {
    token: { colorPrimary },
  } = theme.useToken();
  const isMobile = useMediaQuery({ maxWidth: 769 });
  const navigate = useNavigate();
  const dispatch =useAppDispatch();

  // Get loading state from the Redux store.
  const { loading } = useSelector((state: RootState) => state.auth);

  const onFinish = (values: FieldType) => {
    // Check that password and confirm password match
    if (values.password !== values.cPassword) {
      message.error("Passwords do not match!");
      return;
    }

    // Construct sign-up payload
    // If address fields are not provided in the UI, you can set a default value.
    const signupData: SignUpData = {
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
      password: values.password,
      contactNumber: values.contactNumber,
      companyName: values.companyName,
      address: {
        street: values.street || "Default Street",
        city: values.city || "Default City",
        state: values.state || "Default State",
      },
      planStatus: "free trial", // You can change this if needed
      role: "admin",
    };

    // Dispatch the signupUser async thunk.
    dispatch(signupUser(signupData))
      .unwrap()
      .then(() => {
        message.success("Account signup successful. Please sign in.");
        navigate("/auth/signin");
      })
      .catch((error: any) => {
        message.error("Signup failed: " + error);
      });
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
    message.error("Please complete all required fields correctly.");
  };

  return (
    <Row style={{ minHeight: isMobile ? "auto" : "100vh", overflow: "hidden" }}>
      <Col xs={24} lg={12}>
        <Flex
          vertical
          align="center"
          justify="center"
          className="text-center"
          style={{ background: colorPrimary, height: "100%", padding: "1rem" }}
        >
          <Logo color="white" />
          <Title level={2} className="text-white">
            Welcome to CPM Admin
          </Title>
          <Text className="text-white" style={{ fontSize: 18 }}>
            A powerful and flexible dashboard designed for seamless customer and
            partner management
          </Text>
        </Flex>
      </Col>
      <Col xs={24} lg={12}>
        <Flex
          vertical
          align={isMobile ? "center" : "flex-start"}
          justify="center"
          gap="middle"
          style={{ height: "100%", padding: "2rem" }}
        >
          <Title className="m-0">Create an account</Title>
          <Flex gap={4}>
            <Text>Already have an account?</Text>
            <Link to="/auth/signin">Sign in here</Link>
          </Flex>
          <Flex
            vertical={isMobile}
            gap="small"
            wrap="wrap"
            style={{ width: "100%" }}
          >
            <Button icon={<GoogleOutlined />}>Sign up with Google</Button>
            <Button icon={<FacebookFilled />}>Sign up with Facebook</Button>
            <Button icon={<TwitterOutlined />}>Sign up with Twitter</Button>
          </Flex>
          <Divider className="m-0">or</Divider>
          <Form
            name="sign-up-form"
            layout="vertical"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 24 }}
            initialValues={{ remember: true }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
            requiredMark={false}
          >
            <Row gutter={[8, 0]}>
              {/* First name & Last name */}
              <Col xs={24} lg={12}>
                <Form.Item<FieldType>
                  label="First name"
                  name="firstName"
                  rules={[
                    {
                      required: true,
                      message: "Please input your first name!",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col xs={24} lg={12}>
                <Form.Item<FieldType>
                  label="Last name"
                  name="lastName"
                  rules={[
                    { required: true, message: "Please input your last name!" },
                  ]}
                >
                  <Input />
                </Form.Item>
              </Col>
              {/* Email & Contact number */}
              <Col xs={24} lg={12}>
                <Form.Item<FieldType>
                  label="Email"
                  name="email"
                  rules={[
                    { required: true, message: "Please input your email!" },
                  ]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col xs={24} lg={12}>
                <Form.Item<FieldType>
                  label="Contact number"
                  name="contactNumber"
                  rules={[
                    {
                      required: true,
                      message: "Please input your contact number!",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
              </Col>
              {/* Company name */}
              <Col xs={24}>
                <Form.Item<FieldType>
                  label="Company name"
                  name="companyName"
                  rules={[
                    {
                      required: true,
                      message: "Please input your company name!",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
              </Col>
              {/* Optionally, add address fields */}
              <Col xs={24} lg={8}>
                <Form.Item<FieldType>
                  label="Street"
                  name="street"
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col xs={24} lg={8}>
                <Form.Item<FieldType>
                  label="City"
                  name="city"
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col xs={24} lg={8}>
                <Form.Item<FieldType>
                  label="State"
                  name="state"
                >
                  <Input />
                </Form.Item>
              </Col>
              {/* Password & Confirm Password */}
              <Col xs={24} lg={12}>
                <Form.Item<FieldType>
                  label="Password"
                  name="password"
                  rules={[
                    { required: true, message: "Please input your password!" },
                  ]}
                >
                  <Input.Password />
                </Form.Item>
              </Col>
              <Col xs={24} lg={12}>
                <Form.Item<FieldType>
                  label="Confirm password"
                  name="cPassword"
                  rules={[
                    {
                      required: true,
                      message: "Please confirm your password!",
                    },
                  ]}
                >
                  <Input.Password />
                </Form.Item>
              </Col>
              {/* Terms and conditions */}
              <Col xs={24}>
                <Form.Item<FieldType> name="terms" valuePropName="checked">
                  <Flex>
                    <Checkbox>I agree to</Checkbox>
                    <Link to="">terms and conditions</Link>
                  </Flex>
                </Form.Item>
              </Col>
            </Row>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                size="middle"
                loading={loading} // loading is now controlled by Redux auth slice
                disabled={loading} // button disabled while submitting
              >
                Submit
              </Button>
            </Form.Item>
          </Form>
        </Flex>
      </Col>
    </Row>
  );
};
