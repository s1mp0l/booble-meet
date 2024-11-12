interface IActiveDevicesSelected {
  video: MediaDeviceInfo | null;
  audioInput: MediaDeviceInfo | null;
  audioOutput: MediaDeviceInfo | null;
}

const DEFAULT_CONSTRAINTS: MediaStreamConstraints = {
  audio: true,
  video: true,
}

const getConstraints = (devices: IActiveDevicesSelected): MediaStreamConstraints => ({
  ...DEFAULT_CONSTRAINTS,
  audio: devices.audioInput
    ? {
      deviceId: {exact: devices.audioInput.deviceId}
    }
    : true,
  video: devices.video
    ? {
      width: 1280,
      height: 720,
      deviceId: {exact: devices.video.deviceId}
    }
    : true,
});

const getUserMedia = async (constraints?: MediaStreamConstraints) => {
  try {
    const finalConstraints = {
      ...DEFAULT_CONSTRAINTS,
      constraints
    };

    return await navigator.mediaDevices.getUserMedia(finalConstraints);
  } catch (err) {
    console.log(err);
    return null;
  }
}

export {
  getConstraints,
  getUserMedia
}