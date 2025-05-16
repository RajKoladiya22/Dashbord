import React, { useEffect, useState } from "react";
import {
  Card,
  Avatar,
  Row,
  Col,
  Modal,
  Spin,
  Empty,
  Switch,
  Popconfirm,
  Tag,
  Divider,
  Descriptions,
  message,
} from "antd";
import {
  BankOutlined,
  CheckCircleOutlined,
  CheckCircleTwoTone,
  EditOutlined,
  // EllipsisOutlined,
  MailOutlined,
  // SettingOutlined,
  StopOutlined,
  StopTwoTone,
} from "@ant-design/icons";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { useAppDispatch } from "../../../hooks";
import {
  fetchTeamMembers,
  toggleTeamStatus,
} from "../../../redux/slice/team/teamMemberSlice";
import { TeamMemberData } from "../../../redux/APITypes";
import AutoDismissAlert from "../../Alert";
import dayjs from "dayjs";

const { Meta } = Card;

export const TeamList: React.FC = () => {
  const { teamMember, loading, error } = useSelector(
    (state: RootState) => state.teamMember || []
  );
  const members = teamMember as TeamMemberData[];
  const dispatch = useAppDispatch();
  const [filterStatus, setFilterStatus] = useState<boolean>(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedCard, setSelectedCard] = useState<number>(0);
  const [teamMemberData, setTeamMemberData] = useState<TeamMemberData | null>(
    null
  );
  console.log(selectedCard);

  useEffect(() => {
    dispatch(fetchTeamMembers({ status: filterStatus }));
  }, [dispatch, filterStatus]);

  const showModal = (team: TeamMemberData, cardIndex: number) => {
    setTeamMemberData(team);
    setSelectedCard(cardIndex);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setSelectedCard(0);
    setTeamMemberData(null);
  };

  const handleToggleStatus = (p: TeamMemberData, e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(toggleTeamStatus({ id: p.id, status: !p.status })).unwrap()
    message.success("Member Status Updated");
  };

  return (
    <Spin spinning={loading} tip="Loading team members...">
      <Switch
        checkedChildren="Active"
        unCheckedChildren="Inactive"
        checked={filterStatus}
        onChange={(checked) => setFilterStatus(checked)}
        style={{ marginBottom: 16 }}
      />
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
      {!loading && !error && members?.length === 0 ? (
        <Empty description="No team members found." />
      ) : (
        <Row gutter={[16, 16]} justify="center">
          {members?.map((team: TeamMemberData, index: number) => (
            <Col key={index} xs={24} sm={12} md={8} lg={6} xl={4}>
              <Card
                hoverable
                style={{ maxWidth: 300, margin: "auto" }}
                onClick={() => showModal(team, index)}
                cover={
                  <img
                    alt={`Team Member ${index + 1}`}
                    src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
                  />
                }
                actions={[
                  // toggle status icon
                  team.status ? (
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
                  ),
                  <span onClick={(e) => e.stopPropagation()}>
                    <Popconfirm
                      key="toggle"
                      title={`Are you sure you want to ${
                        team.status ? "deactivate" : "activate"
                      } this team?`}
                      onConfirm={(e: any) => {
                        e.stopPropagation(); // stop confirm click
                        handleToggleStatus(team, e);
                      }}
                      okText="Yes"
                      cancelText="No"
                      // onClick={(e:any) => e.stopPropagation()}  // stop click on the Popconfirm trigger itself
                    >
                      <EditOutlined
                        key="edit"
                        onClick={(e) => e.stopPropagation()} // stop click on the icon
                      />
                    </Popconfirm>
                  </span>,
                ]}
              >
                <Meta
                  avatar={
                    <Avatar
                      src={`https://api.dicebear.com/7.x/miniavs/svg?seed=${index}`}
                    />
                  }
                  title={team.firstName}
                  description={team.department}
                />
              </Card>
            </Col>
          ))}
        </Row>
      )}
      <Modal
        title={
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Avatar
              src={"https://example.com/default-logo.png"}
              size={40}
              style={{ backgroundColor: "#f0f2f5" }}
            />
            <span style={{ fontSize: 20, fontWeight: 600 }}>
              {teamMemberData?.firstName} {teamMemberData?.lastName}
            </span>
          </div>
        }
        open={isModalVisible}
        onCancel={handleCancel}
        centered
        destroyOnClose
        footer={null}
        width={600}
        styles={{
          header: { borderBottom: "1px solid #f0f0f0", paddingBottom: 16 },
          body: { padding: "24px 32px" },
        }}
      >
        <div style={{ display: "flex", gap: 24, marginBottom: 32 }}>
          <Avatar
            size={96}
            src={`https://api.dicebear.com/7.x/identicon/svg?seed=${teamMemberData?.email}`}
            style={{ border: "2px solid #e6f4ff" }}
          />
          <div style={{ flex: 1 }}>
            <h3
              style={{
                margin: 0,
                fontSize: 18,
                fontWeight: 600,
                color: "#1d1d1d",
              }}
            >
              {teamMemberData?.firstName} {teamMemberData?.lastName}
            </h3>
            <p style={{ margin: "4px 0", color: "#666" }}>
            {teamMemberData?.role === "team_member" ? "Team Member" : "Manager"}
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Tag
                color={teamMemberData?.status ? "success" : "error"}
                icon={
                  teamMemberData?.status ? (
                    <CheckCircleOutlined />
                  ) : (
                    <StopOutlined />
                  )
                }
              >
                {teamMemberData?.status ? "Active" : "Inactive"}
              </Tag>
              <span style={{ color: "#8c8c8c", fontSize: 12 }}>
                Joined: {dayjs(teamMemberData?.createdAt).format("MMM D, YYYY")}
              </span>
            </div>     
          </div>
        </div>

        <Divider style={{ margin: "16px 0" }} />

        <Descriptions column={1} colon={false} layout="vertical">
          <Descriptions.Item
            label={
              <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <MailOutlined style={{ color: "#597ef7" }} />
                <span>Contact Information</span>
              </span>
            }
          >
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <div>
                <strong>Email</strong>
                <div style={{ color: "#434343" }}>{teamMemberData?.email}</div>
              </div>
              <div>
                <strong>Phone</strong>
                <div style={{ color: "#434343" }}>
                  {
                    // teamMemberData?.contactInfo?.phone
                    "Not provided"
                  }
                </div>
              </div>
            </div>
          </Descriptions.Item>

          <Descriptions.Item
            label={
              <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <BankOutlined style={{ color: "#597ef7" }} />
                <span>Member Details</span>
              </span>
            }
          >
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <div>
                <strong>Department</strong>
                <div style={{ color: "#434343" }}>
                  {teamMemberData?.department || "Not specified"}
                </div>
              </div>
              <div>
                <strong>Position</strong>
                <div style={{ color: "#434343" }}>
                  {teamMemberData?.position || "Not specified"}
                </div>
              </div>
              <div>
                <strong>Address</strong>
                <div style={{ color: "#434343" }}>
                  {teamMemberData?.address || "Not provided"}
                </div>
              </div>
            </div>
          </Descriptions.Item>
        </Descriptions>

        <div
          style={{
            marginTop: 24,
            padding: 16,
            backgroundColor: "#fafafa",
            borderRadius: 8,
            border: "1px solid #f0f0f0",
          }}
        >
          <strong>Additional Notes</strong>
          <p style={{ margin: "8px 0 0", color: "#666" }}>
            {
              // teamMemberData?.notes ||
              "No additional notes provided"
            }
          </p>
        </div>
      </Modal>
    </Spin>
  );
};
