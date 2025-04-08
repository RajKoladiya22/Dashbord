import  { useState } from 'react';
import { Card, Avatar, Row, Col, Modal } from 'antd';
import { EditOutlined, EllipsisOutlined, SettingOutlined } from '@ant-design/icons';

const { Meta } = Card;

export const ProductList = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedCard, setSelectedCard] = useState(0);

  const showModal = (cardIndex : any) => {
    setSelectedCard(cardIndex);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setSelectedCard(0);
  };

  return (
    <Row gutter={[16, 16]} justify="center">
      {[...Array(6)].map((_, index) => (
        <Col key={index} xs={24} sm={12} md={8} lg={6} xl={4}>
          <Card
            hoverable
            style={{ maxWidth: 300, margin: 'auto' }}
            onClick={() => showModal(index)}
            cover={
              <img
                alt={`example ${index + 1}`}
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
              title={`Card title ${index + 1}`}
              description="This is the description"
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
        <p>More information about Card {selectedCard + 1}.</p>
      </Modal>
    </Row>
  );
};


