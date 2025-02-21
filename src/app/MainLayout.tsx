import React from 'react';
import {Alert, Flex, Layout, Typography} from 'antd';
import {useSelector} from 'react-redux';
import {RootState} from '../store';
import BmeetIcon from '/bmeet.svg';
import {Outlet, Link} from 'react-router-dom';

const {Header, Content} = Layout;
const {Title, Text} = Typography;

export const MainLayout: React.FC = () => {
  const {username, error, isConnected} = useSelector((state: RootState) => state.conference);

  return (
    <Layout style={{height: '100vh'}}>
      <Header style={{padding: '0 20px'}}>
        <Flex justify="space-between" align="center" style={{height: '100%'}}>
          <Flex align="center" gap={8}>
            <Link to="/" style={{display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none'}}>
              <img src={BmeetIcon} alt="Booble Meet Logo" style={{height: '32px'}} />
              <Title level={4} style={{color: 'white', margin: 0}}>
                Booble Meet
              </Title>
            </Link>
          </Flex>
          <Flex align="center" gap={16}>
            {username && !isConnected && (
              <Alert
                message="Переподключение..."
                type="warning"
                showIcon
              />
            )}
            {username && error && (
              <Alert
                message={error}
                type="error"
                showIcon
              />
            )}
            {username && (
              <Text style={{color: 'white'}}>
                Участник: {username}
              </Text>
            )}
          </Flex>
        </Flex>
      </Header>

      <Content style={{padding: 24}}>
        <Outlet />
      </Content>
    </Layout>
  );
}; 