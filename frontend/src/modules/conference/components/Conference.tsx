import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { RootState } from '../../../store/index';
import { Layout, Typography, Flex, Alert } from 'antd';
import { VideosLayout } from '../../../app/VideosLayout';
import { CommonControls } from '../../../app/CommonControls';
import { useWebSocket } from '../hooks/useWebSocket';

const { Header, Content } = Layout;
const { Title, Text } = Typography;

export const Conference: React.FC = () => {
    const { roomId } = useParams<{ roomId: string }>();
    const navigate = useNavigate();
    const { token, username } = useSelector((state: RootState) => state.conference);
    const { isConnected, error: wsError } = useWebSocket(token);

    useEffect(() => {
        // Если нет токена или имени пользователя, перенаправляем на страницу присоединения
        if (!token || !username) {
            navigate(`/conference/${roomId}/join`);
        }
    }, [token, username, roomId, navigate]);

    if (!token || !username) {
        return null;
    }

    return (
        <Layout style={{ height: '100vh' }}>
            <Header style={{ 
                padding: '0 24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: '#fff',
                borderBottom: '1px solid #f0f0f0'
            }}>
                <Title level={4} style={{ margin: 0 }}>
                    Конференция: {roomId}
                </Title>
                <Flex align="center" gap={16}>
                    {!isConnected && (
                        <Alert
                            message="Переподключение..."
                            type="warning"
                            showIcon
                        />
                    )}
                    {wsError && (
                      <Alert
                          message={wsError}
                          type="error"
                          showIcon
                      />
                    )}
                    <Text type="secondary">
                        Участник: {username}
                    </Text>
                </Flex>
            </Header>

            <Content style={{ padding: 24 }}>
                <Flex
                    vertical
                    style={{ height: '100%' }}
                    align="center"
                    justify="center"
                    gap={16}
                >
                    <VideosLayout />
                    <CommonControls />
                </Flex>
            </Content>
        </Layout>
    );
}; 