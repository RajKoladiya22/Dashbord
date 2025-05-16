import { useEffect, useState } from "react";
import {
  Card,
  Avatar,
  Row,
  Col,
  Modal,
  Spin,
  Empty,
  Popconfirm,
  Switch,
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
  MailOutlined,
  StopOutlined,
  StopTwoTone,
} from "@ant-design/icons";
import dayjs from 'dayjs';
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import {
  fetchPartners,
  togglePartnerStatus,
} from "../../../redux/slice/partner/partnerMemberSlice";
import { useAppDispatch } from "../../../hooks";
import { PartnerData } from "../../../redux/APITypes";
import AutoDismissAlert from "../../Alert";

const { Meta } = Card;

export const PartnerList = () => {
  // const rawPartnerData = useSelector((state: RootState) => state.partnerMember?.Partner);
  const { Partner, loading, error } = useSelector(
    (state: RootState) => state.partnerMember
  );
  // console.log("Partner", Partner);
  // console.log("error", error);

  const patnerMembers: PartnerData[] = Array.isArray(Partner)
    ? Partner
    : Partner && "data" in Partner && Array.isArray(Partner)
    ? Partner
    : [];
  const dispatch = useAppDispatch();
  const [filterStatus, setFilterStatus] = useState<boolean>(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedCard, setSelectedCard] = useState(0);
  const [partnerData, setPartnerData] = useState<PartnerData | null>(null);

  console.log(selectedCard);

  useEffect(() => {
    dispatch(fetchPartners({ status: filterStatus }));
  }, [dispatch, filterStatus]);

  const showModal = (partner: PartnerData, cardIndex: any) => {
    setPartnerData(partner);
    setSelectedCard(cardIndex);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setSelectedCard(0);
  };

  const handleToggleStatus = (p: PartnerData, e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(togglePartnerStatus({ id: p.id, status: !p.status })).unwrap();
    message.success("Partner Status Updated");
  };

  return (
    <Spin spinning={loading} tip="Loading team members...">
      {/* <Space style={{ marginBottom: 16 }}>
        <Button
          type={filterStatus ? "primary" : "default"}
          onClick={() => setFilterStatus(true)}
        >
          Active
        </Button>
        <Button
          type={!filterStatus ? "primary" : "default"}
          onClick={() => setFilterStatus(false)}
        >
          Inactive
        </Button>
      </Space> */}
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
      {!loading && !error && patnerMembers?.length === 0 ? (
        <Empty description="No partner members found." />
      ) : (
        <Row gutter={[16, 16]} justify="center">
          {patnerMembers?.map((partner: PartnerData, index: number) => (
            <Col key={index} xs={24} sm={12} md={8} lg={6} xl={4}>
              <Card
                hoverable
                style={{ maxWidth: 300, margin: "auto" }}
                onClick={() => showModal(partner, index)}
                cover={
                  <img
                    alt={`example ${index + 1}`}
                    src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
                  />
                }
                actions={[
                  // toggle status icon
                  partner.status ? (
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
                        partner.status ? "deactivate" : "activate"
                      } this partner?`}
                      onConfirm={(e: any) => {
                        e.stopPropagation(); // stop confirm click
                        handleToggleStatus(partner, e);
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
                  title={`${partner.firstName}`}
                  description={`${partner.companyName}`}
                />
              </Card>
            </Col>
          ))}
          <Modal
            title={
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <Avatar
                  src={"https://example.com/default-logo.png"
                  }
                  size={40}
                  style={{ backgroundColor: "#f0f2f5" }}
                />
                <span style={{ fontSize: 20, fontWeight: 600 }}>
                  {partnerData?.companyName}
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
                src={`https://api.dicebear.com/7.x/identicon/svg?seed=${partnerData?.email}`}
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
                  {partnerData?.firstName} {partnerData?.lastName}
                </h3>
                <p style={{ margin: "4px 0", color: "#666" }}>
                  {partnerData?.role}
                </p>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <Tag
                    color={partnerData?.status ? "success" : "error"}
                    icon={
                      partnerData?.status ? (
                        <CheckCircleOutlined />
                      ) : (
                        <StopOutlined />
                      )
                    }
                  >
                    {partnerData?.status ? "Active" : "Inactive"}
                  </Tag>
                  <span style={{ color: "#8c8c8c", fontSize: 12 }}>
                    Joined:{" "}
                    {dayjs(partnerData?.createdAt).format("MMM D, YYYY")}
                  </span>
                </div>
              </div>
            </div>

            <Divider style={{ margin: "16px 0" }} />

            <Descriptions column={1} colon={false} layout="vertical">
              <Descriptions.Item
                label={
                  <span
                    style={{ display: "flex", alignItems: "center", gap: 8 }}
                  >
                    <MailOutlined style={{ color: "#597ef7" }} />
                    <span>Contact Information</span>
                  </span>
                }
              >
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 8 }}
                >
                  <div>
                    <strong>Email</strong>
                    <div style={{ color: "#434343" }}>{partnerData?.email}</div>
                  </div>
                  <div>
                    <strong>Phone</strong>
                    <div style={{ color: "#434343" }}>
                      {
                      // partnerData?.contactInfo?.phone 
                     "Not provided"}
                    </div>
                  </div>
                </div>
              </Descriptions.Item>

              <Descriptions.Item
                label={
                  <span
                    style={{ display: "flex", alignItems: "center", gap: 8 }}
                  >
                    <BankOutlined style={{ color: "#597ef7" }} />
                    <span>Company Details</span>
                  </span>
                }
              >
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 8 }}
                >
                  <div>
                    <strong>Industry</strong>
                    <div style={{ color: "#434343" }}>
                      {
                      // partnerData?.industry || 
                      "Not specified"}
                    </div>
                  </div>
                  <div>
                    <strong>Address</strong>
                    <div style={{ color: "#434343" }}>
                      {partnerData?.address || "Not provided"}
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
                // partnerData?.notes || 
                "No additional notes provided"}
              </p>
            </div>
          </Modal>
        </Row>
      )}
    </Spin>
  );
};
