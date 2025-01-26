import { ASPECT_RATIO } from "../../layout/model/constants";

interface IActiveDevicesSelected {
  video: MediaDeviceInfo | null;
  audioInput: MediaDeviceInfo | null;
  audioOutput: MediaDeviceInfo | null;
}

const getConstraints = (devices: IActiveDevicesSelected): MediaStreamConstraints => {  
  return {
    audio: devices.audioInput ? {
      deviceId: { exact: devices.audioInput.deviceId }
    } : true,
    video: {
      ...(devices.video ? {
        deviceId: { exact: devices.video.deviceId }
      } : {}),
      aspectRatio: { ideal: ASPECT_RATIO }
    }
  };
};

const getUserMedia = async (constraints: MediaStreamConstraints) => {
  try {
    return await navigator.mediaDevices.getUserMedia(constraints);
  } catch (error) {
    console.error('Error getting user media:', error);
    return null;
  }
};

export {
  getConstraints,
  getUserMedia
}