import React, {useEffect} from 'react';
import {useSelector} from 'react-redux';
import {useNavigate, useParams} from 'react-router-dom';
import {RootState} from '../../../store';
import {Flex} from 'antd';
import {VideosLayout} from '../../../app/VideosLayout';
import {CommonControls} from '../../../app/CommonControls';
import {EffectsDrawer} from '../../visual-effects/components/EffectsDrawer/EffectsDrawer';

export const Conference: React.FC = () => {
  const {roomId} = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const {token, username} = useSelector((state: RootState) => state.conference);

  useEffect(() => {
    if (!token || !username) {
      navigate(`/conference/${roomId}/join`);
    }
  }, [token, username, roomId, navigate]);

  if (!token || !username) {
    return null;
  }

  return (
    <>
      <EffectsDrawer/>
      <Flex
        vertical
        style={{height: '100%'}}
        align="center"
        justify="center"
        gap={16}
      >
        <VideosLayout/>
        <CommonControls inConference />
      </Flex>
    </>
  );
}; 