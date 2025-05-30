import React, { useCallback } from "react";
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
import {
  //  PATH_AUTH,
  PATH_DASHBOARD,
} from "../../constants";
import { Link, useNavigate } from "react-router-dom";
// import { useState } from "react";



import {useAppDispatch} from '../../hooks'
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { loginUser } from "../../redux/slice/auth/authSlice";
// import { useBreakpoint } from "antd/es/grid/hooks";

const { Title, Text } = Typography;

type FieldType = {
  email?: string;
  password?: string;
  remember?: boolean;
};

export const SignInPage: React.FC = React.memo(() =>  {
  const {
    token: { colorPrimary },
  } = theme.useToken();
  // const screens = useBreakpoint();
  // const isMobile = !!screens.xs && !screens.sm;
  const isMobile = useMediaQuery({ maxWidth: 769 });
  const navigate = useNavigate();
  const dispatch =useAppDispatch();
  const authLoading = useSelector((state: RootState) => state.auth.loading);

  const onFinish = useCallback(async (values: FieldType) => {
    // console.log("Login request:", values);
    // setLoading(true);

    try {
      // Dispatch the loginUser async thunk.
      // Using email as the identifier; adapt if you allow usernames as well.
      await dispatch(
        loginUser({
          identifier: values.email as string,
          password: values.password as string,
        })
      ).unwrap();

      message.success("Login successful");
      // Navigate to the dashboard after successful login.
      navigate(PATH_DASHBOARD.home); 
    } catch (error: any) {
      // console.log(error);
      
      message.error(`${error}`);
    } finally {
      // setLoading(false);
    }
  }, [dispatch, navigate] );

  const onFinishFailed = useCallback((errorInfo: any) => {
    console.warn("Sign-in failed:", errorInfo);
  }, []);

  // const onFinish = (values: any) => {
  //   console.log('Success:', values);
  //   setLoading(true);

  //   message.open({
  //     type: 'success',
  //     content: 'Login successful',
  //   });

  //   setTimeout(() => {
  //     navigate(PATH_DASHBOARD.home);
  //   }, 5000);
  // };

  // const onFinishFailed = (errorInfo: any) => {
  //   console.log('Failed:', errorInfo);
  // };

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
            Welcome back to CPM Admin
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
          <Title className="m-0">Login</Title>
          <Flex gap={4}>
            <Text>Don't have an account?</Text>
            {/* <Link href={PATH_AUTH.signup}>Create an account here</Link> */}
            <Link to="/auth/signup">Create an account here</Link>
          </Flex>
          <Form
            name="sign-up-form"
            layout="vertical"
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
            // initialValues={{
            //   email: 'demo@email.com',
            //   password: 'demo123',
            //   remember: true,
            // }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
            requiredMark={false}
          >
            <Row gutter={[8, 0]}>
              <Col xs={24}>
                <Form.Item<FieldType>
                  label="Email/Username"
                  name="email"
                  rules={[
                    {
                      required: true,
                      message: "Please input your email or username",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col xs={24}>
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
              <Col xs={24}>
                <Form.Item<FieldType> name="remember" valuePropName="checked">
                  <Checkbox>Remember me</Checkbox>
                </Form.Item>
              </Col>
            </Row>
            <Form.Item>
              <Flex align="center" justify="space-between">
                <Button
                  type="primary"
                  htmlType="submit"
                  size="middle"
                  loading={authLoading}
                >
                  Continue
                </Button>
                <Link to="/">Forgot password?</Link>
                {/* <Link href={PATH_AUTH.passwordReset}>Forgot password?</Link> */}
              </Flex>
            </Form.Item>
          </Form>
          <Divider className="m-0">or</Divider>
          <Flex
            vertical={isMobile}
            gap="small"
            wrap="wrap"
            style={{ width: "100%" }}
          >
            <Button icon={<GoogleOutlined />}>Sign in with Google</Button>
            <Button icon={<FacebookFilled />}>Sign in with Facebook</Button>
            <Button icon={<TwitterOutlined />}>Sign in with Twitter</Button>
          </Flex>
        </Flex>
      </Col>
    </Row>
  );
});
