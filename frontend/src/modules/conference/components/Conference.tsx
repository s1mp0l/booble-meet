import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { RootState } from '../../../store/index';
import { Layout, Typography, Flex, Alert } from 'antd';
import { VideosLayout } from '../../../app/VideosLayout';
import { CommonControls } from '../../../app/CommonControls';
import { EffectsDrawer } from '../../visual-effects/components/EffectsDrawer/EffectsDrawer';

const { Header, Content } = Layout;
const { Title, Text } = Typography;

export const Conference: React.FC = () => {
    const { roomId } = useParams<{ roomId: string }>();
    const navigate = useNavigate();
    const { token, username, error, isConnected } = useSelector((state: RootState) => state.conference);

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
            <Header style={{ padding: '0 20px' }}>
                <Flex justify="space-between" align="center" style={{ height: '100%' }}>
                    <Title level={4} style={{ color: 'white', margin: 0 }}>
                        Booble Meet
                    </Title>
                    <Flex align="center" gap={16}>
                        {!isConnected && (
                            <Alert
                                message="Переподключение..."
                                type="warning"
                                showIcon
                            />
                        )}
                        {error && (
                          <Alert
                              message={error}
                              type="error"
                              showIcon
                          />
                        )}
                        <Text style={{ color: 'white' }}>
                            Участник: {username}
                        </Text>
                    </Flex>
                </Flex>
            </Header>

            <Content style={{ padding: 24 }}>
                <EffectsDrawer />

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