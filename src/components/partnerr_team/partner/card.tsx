import { useEffect, useState } from "react";
import { Card, Avatar, Row, Col, Modal, Spin, Alert, Empty } from "antd";
import {
  EditOutlined,
  EllipsisOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { fetchPartners } from "../../../redux/slice/partner/partnerMemberSlice";
import { useAppDispatch } from "../../../hooks";
import { PartnerData } from "../../../redux/APITypes";

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
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedCard, setSelectedCard] = useState(0);
  const [teamMemberData, setTeamMemberData] = useState<PartnerData | null>(
    null
  );

  // console.log("patnerMembers----->", patnerMembers);

  useEffect(() => {
    dispatch(fetchPartners());
  }, [dispatch]);

  const showModal = (partner: PartnerData, cardIndex: any) => {
    setTeamMemberData(partner);
    setSelectedCard(cardIndex);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setSelectedCard(0);
  };

  return (
    <Spin spinning={loading} tip="Loading team members...">
      {error && (
        <Alert
          message="Error"
          description={error}
          type="error"
          showIcon
          style={{ marginBottom: 16 }}
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
                  <SettingOutlined
                    key="setting"
                    onClick={(e) => e.stopPropagation()}
                  />,
                  <EditOutlined
                    key="edit"
                    onClick={(e) => e.stopPropagation()}
                  />,
                  <EllipsisOutlined
                    key="ellipsis"
                    onClick={(e) => e.stopPropagation()}
                  />,
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
            title={`Details for Card ${selectedCard + 1}`}
            open={isModalVisible}
            onCancel={handleCancel}
            footer={null}
          >
            <h3> Partner Name: {teamMemberData?.firstName}</h3>
            <h3> Company Name: {teamMemberData?.companyName}</h3>
            <h3> Email: {teamMemberData?.email}</h3>
          </Modal>
        </Row>
      )}
    </Spin>
  );
};
