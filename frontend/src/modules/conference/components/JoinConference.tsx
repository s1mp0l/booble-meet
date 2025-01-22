import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { AppDispatch, RootState } from '../../../store/index';
import { joinConference } from '../store/conferenceSlice';
import { Form, Input, Button, Card, Layout, Typography } from 'antd';
import { Content } from 'antd/es/layout/layout';

const { Title } = Typography;

export const JoinConference: React.FC = () => {
    const { roomId } = useParams<{ roomId: string }>();
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const { error, isLoading } = useSelector((state: RootState) => state.conference);

    const onFinish = async (values: { username: string }) => {
        if (!roomId) return;

        try {
            await dispatch(joinConference({ roomId, username: values.username })).unwrap();
            navigate(`/conference/${roomId}`);
        } catch (err) {
            console.error('Failed to join conference:', err);
        }
    };

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Content style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Card style={{ width: 400 }}>
                    <Title level={2} style={{ textAlign: 'center', marginBottom: 24 }}>
                        Присоединиться к конференции
                    </Title>
                    <Form
                        name="join-conference"
                        onFinish={onFinish}
                        layout="vertical"
                    >
                        <Form.Item
                            name="username"
                            label="Ваше имя"
                            rules={[
                                { required: true, message: 'Пожалуйста, введите ваше имя' },
                                { min: 2, message: 'Имя должно содержать минимум 2 символа' }
                            ]}
                            validateFirst
                        >
                            <Input 
                                placeholder="Введите ваше имя"
                                disabled={isLoading}
                            />
                        </Form.Item>

                        <Form.Item label="ID Комнаты">
                            <Input 
                                value={roomId}
                                disabled
                            />
                        </Form.Item>

                        {error && (
                            <Form.Item>
                                <Typography.Text type="danger">{error}</Typography.Text>
                            </Form.Item>
                        )}

                        <Form.Item>
                            <Button
                                type="primary"
                                htmlType="submit"
                                loading={isLoading}
                                disabled={!roomId}
                                block
                            >
                                Присоединиться
                            </Button>
                        </Form.Item>
                    </Form>
                </Card>
            </Content>
        </Layout>
    );
}; 