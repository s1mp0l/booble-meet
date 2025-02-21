import React, {ReactNode} from 'react';
import {Card, Layout} from 'antd';
import {Content} from 'antd/es/layout/layout';
import {VideoGrid} from '../../layout/components/VideoGrid';
import {SelfVideo} from '../../webcam-video/components/SelfVideo';
import {useIsMobile} from '../../layout/hooks/useIsMobile';
import { CommonControls } from '../../../app/CommonControls';
import { EffectsDrawer } from '../../visual-effects/components/EffectsDrawer/EffectsDrawer';

interface ConferenceFormLayoutProps {
  children: ReactNode;
  cardWidth?: number;
}

export const ConferenceFormLayout: React.FC<ConferenceFormLayoutProps> = ({
  children,
  cardWidth = 400
}) => {
  const isMobile = useIsMobile();

  return (
    <>
      <EffectsDrawer/>
      
      <Layout style={{minHeight: '100vh'}}>
        <Content style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 16,
          flexDirection: isMobile ? 'column' : 'row'
        }}>
          <VideoGrid>
            <SelfVideo />

            <CommonControls/>
          </VideoGrid>

          <Card style={{width: '100%', maxWidth: cardWidth}}>
            {children}
          </Card>
        </Content>
      </Layout>
    </>
  );
}; 