import React, { useEffect, useState } from 'react';
import { Card, Avatar, Row, Col, Modal, Spin, Alert, Empty } from 'antd';
import { EditOutlined, EllipsisOutlined, SettingOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import { useAppDispatch } from '../../../hooks';
import { fetchTeamMembers } from '../../../redux/slice/team/teamMemberSlice';
import { TeamMemberData } from '../../../redux/APITypes';

const { Meta } = Card;

export const TeamList: React.FC = () => {
  const { teamMember, loading, error } = useSelector((state: RootState) => state.teamMember || []);
  const members = teamMember as TeamMemberData[];
  const dispatch = useAppDispatch();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedCard, setSelectedCard] = useState<number>(0);
  const [teamMemberData, setTeamMemberData] = useState<TeamMemberData | null>(null);
  // console.log("teamMember--->", teamMember);
  
  useEffect(() => {
    dispatch(fetchTeamMembers());
  }, [dispatch]);

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
      {!loading && !error && members?.length === 0 ? (
        <Empty description="No team members found." />
      ) : (
        <Row gutter={[16, 16]} justify="center">
          {members?.map((team: TeamMemberData, index: number) => (
            <Col key={index} xs={24} sm={12} md={8} lg={6} xl={4}>
              <Card
                hoverable
                style={{ maxWidth: 300, margin: 'auto' }}
                onClick={() => showModal(team, index)}
                cover={
                  <img
                    alt={`Team Member ${index + 1}`}
                    src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
                  />
                }
                actions={[
                  <SettingOutlined key="setting" onClick={(e) => e.stopPropagation()} />,
                  <EditOutlined key="edit" onClick={(e) => e.stopPropagation()} />,
                  <EllipsisOutlined key="ellipsis" onClick={(e) => e.stopPropagation()} />,
                ]}
              >
                <Meta
                  avatar={<Avatar src={`https://api.dicebear.com/7.x/miniavs/svg?seed=${index}`} />}
                  title={team.firstName}
                  description={team.department}
                />
              </Card>
            </Col>
          ))}
        </Row>
      )}
      <Modal
        title={`Details for Team Member ${selectedCard + 1}`}
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        {teamMemberData && (
          <div>
            <h3>Name: {teamMemberData.firstName}</h3>
            <h3>Email: {teamMemberData.email}</h3>
            <h3>Department: {teamMemberData.department}</h3>
            <h3>Role: {teamMemberData.role}</h3>
          </div>
        )}
      </Modal>
    </Spin>
  );
};
