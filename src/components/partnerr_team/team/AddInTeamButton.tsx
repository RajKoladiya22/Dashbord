// import { useState } from "react";
// import { Button, Modal, Form, Input, Select, message } from "antd";
// import { PlusOutlined } from "@ant-design/icons";
// import { useSelector } from "react-redux";
// import { useAppDispatch } from "../../../hooks";
// import {
//   createTeamMember,
//   TeamMemberData,
// } from "../../../redux/slice/auth/teamRegisterSlice";
// import { RootState } from "../../../redux/store";

// const { Option } = Select;

// type FieldType = {
//   firstName: string;
//   email: string;
//   password: string;
//   cPassword: string;
//   department: string;
//   position: string;
// };

// export const AddInTeamButton = () => {
//   const [isModalVisible, setIsModalVisible] = useState(false);

//   const [form] = Form.useForm();

//   const showModal = () => {
//     setIsModalVisible(true);
//   };

//   const handleCancel = () => {
//     setIsModalVisible(false);
//     form.resetFields();
//   };

//   const dispatch = useAppDispatch();
//   const { loading } = useSelector((state: RootState) => state.team);
//   const onFinish = (values: FieldType) => {
//     // Check that password and confirm password match
//     if (values.password !== values.cPassword) {
//       message.error("Passwords do not match!");
//       return;
//     }

//     // Construct sign-up payload
//     // If address fields are not provided in the UI, you can set a default value.
//     const signupData: TeamMemberData = {
//       firstName: values.firstName,
//       email: values.email,
//       password: values.password,
//       department: values.department,
//       position: values.position,
//     };

//     // Dispatch the createTeamMember async thunk.
//     dispatch(createTeamMember(signupData))
//       .unwrap()
//       .then(() => {
//         message.success("Team member created successfully!");
//         form.resetFields();
//         setIsModalVisible(false);
//       })
//       .catch((error: any) => {
//         message.error("Failed to create team member.");
//       });
//   };

//   const onFinishFailed = (errorInfo: any) => {
//     console.log("Failed:", errorInfo);
//     message.error("Please complete all required fields correctly.");
//   };

//   return (
//     <>
//       <Button icon={<PlusOutlined />} onClick={showModal}>
//         Add in Team
//       </Button>
//       <Modal
//         title="Add Team Member"
//         open={isModalVisible}
//         onCancel={handleCancel}
//         footer={null}
//         destroyOnClose
//       >
//         <Form form={form} layout="vertical" onFinish={onFinish}
//         onFinishFailed={onFinishFailed}
//         >
//           <Form.Item
//             name="email"
//             label="Email"
//             rules={[
//               { required: true, message: "Please input the email!" },
//               { type: "email", message: "Please enter a valid email!" },
//             ]}
//           >
//             <Input />
//           </Form.Item>

//           <Form.Item
//             name="password"
//             label="Password"
//             rules={[{ required: true, message: "Please input the password!" }]}
//             hasFeedback
//           >
//             <Input.Password />
//           </Form.Item>

//           <Form.Item
//             name="confirmPassword"
//             label="Confirm Password"
//             dependencies={["password"]}
//             hasFeedback
//             rules={[
//               { required: true, message: "Please confirm the password!" },
//               ({ getFieldValue }) => ({
//                 validator(_, value) {
//                   if (!value || getFieldValue("password") === value) {
//                     return Promise.resolve();
//                   }
//                   return Promise.reject(new Error("Passwords do not match!"));
//                 },
//               }),
//             ]}
//           >
//             <Input.Password />
//           </Form.Item>

//           <Form.Item name="department" label="Department">
//             <Input />
//           </Form.Item>

//           <Form.Item
//             name="position"
//             label="Position"
//             rules={[{ required: true, message: "Please select the position!" }]}
//           >
//             <Select placeholder="Select a position">
//               <Option value="developer">Developer</Option>
//               <Option value="designer">Designer</Option>
//               <Option value="manager">Manager</Option>
//               {/* Add more options as needed */}
//             </Select>
//           </Form.Item>

//           <Form.Item>
//             <Button type="primary" htmlType="submit" loading={loading} block>
//               Create
//             </Button>
//           </Form.Item>
//         </Form>
//       </Modal>
//     </>
//   );
// };

import { useState } from "react";
import { Button, Modal, Form, Input, Select, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";
import { useAppDispatch } from "../../../hooks";
import {createTeamMember} from "../../../redux/slice/auth/teamRegisterSlice";
import { RootState } from "../../../redux/store";
import { fetchTeamMembers } from "../../../redux/slice/team/teamMemberSlice";
import { TeamMemberData } from "../../../redux/APITypes";

const { Option } = Select;

type FieldType = {
  firstName: string;
  email: string;
  password: string;
  confirmPassword: string;
  department: string;
  position: string;
};

export const AddInTeamButton = () => {
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

  const onFinish = (values: FieldType) => {
    if (values.password !== values.confirmPassword) {
      message.error("Passwords do not match!");
      return;
    }

    const signupData: TeamMemberData = {
      firstName: values.firstName,
      email: values.email,
      password: values.password,
      department: values.department,
      position: values.position,
    };

    dispatch(createTeamMember(signupData))
      .unwrap()
      .then(() => {
        dispatch(fetchTeamMembers())
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
        Add in Team
      </Button>
      <Modal
        title="Add Team Member"
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          onFinishFailed={() =>
            message.error("Please complete all required fields correctly.")
          }
        >
          <Form.Item
            name="firstName"
            label="Full Name"
            rules={[{ required: true, message: "Please enter full name!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: "Please input the email!" },
              { type: "email", message: "Please enter a valid email!" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="password"
            label="Password"
            rules={[{ required: true, message: "Please input the password!" }]}
            hasFeedback
          >
            <Input.Password />
          </Form.Item>

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
                  return Promise.reject(
                    new Error("Passwords do not match!")
                  );
                },
              }),
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item name="department" label="Department">
            <Input />
          </Form.Item>

          <Form.Item
            name="position"
            label="Position"
            rules={[{ required: true, message: "Please select the position!" }]}
          >
            <Select placeholder="Select a position">
              <Option value="developer">Developer</Option>
              <Option value="designer">Designer</Option>
              <Option value="manager">Manager</Option>
            </Select>
          </Form.Item>

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
