interface IActiveDevicesSelected {
  video: MediaDeviceInfo | null;
  audioInput: MediaDeviceInfo | null;
  audioOutput: MediaDeviceInfo | null;
}

const DEFAULT_CONSTRAINTS: MediaStreamConstraints = {
  audio: true,
  video: true,
}

const getConstraints = (devices: IActiveDevicesSelected, width?: number, height?: number): MediaStreamConstraints => ({
  audio: devices.audioInput
    ? {
      deviceId: {exact: devices.audioInput.deviceId}
    }
    : true,
  video: devices.video
    ? {
      width: width ?? 1920,
      height: height ?? 1080,
      deviceId: {exact: devices.video.deviceId}
    }
    : {
      width: width ?? 1920,
      height: height ?? 1080,
    },
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