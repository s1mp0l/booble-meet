import React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigate} from 'react-router-dom';
import {AppDispatch, RootState} from '../../../store';
import {createConference} from '../store/conferenceSlice';
import {Button, Form, Input, Typography} from 'antd';
import {ConferenceFormLayout} from './ConferenceFormLayout';

const {Title} = Typography;

export const CreateConference: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const {error, isLoading} = useSelector((state: RootState) => state.conference);

  const onFinish = async (values: { username: string }) => {
    try {
      const result = await dispatch(createConference(values.username)).unwrap();
      navigate(`/conference/${result.roomId}`);
    } catch (err) {
      console.error('Failed to create conference:', err);
    }
  };

  return (
    <ConferenceFormLayout>
      <Title level={4} style={{textAlign: 'center', marginBottom: 24}}>
        Создать конференцию
      </Title>
      <Form
        name="create-conference"
        onFinish={onFinish}
        layout="vertical"
      >
        <Form.Item
          name="username"
          label="Ваше имя"
          rules={[
            {required: true, message: 'Пожалуйста, введите ваше имя'},
            {min: 2, message: 'Имя должно содержать минимум 2 символа'}
          ]}
          validateFirst
        >
          <Input
            placeholder="Введите ваше имя"
            disabled={isLoading}
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
            block
          >
            Создать конференцию
          </Button>
        </Form.Item>
      </Form>
    </ConferenceFormLayout>
  );
}; 