interface IMediaDevices {
  videoDevices: MediaDeviceInfo[];
  audioOutputDevices: MediaDeviceInfo[];
  audioInputDevices: MediaDeviceInfo[];
}

const getDevices = async (): Promise<IMediaDevices> => {
  const devices = await navigator.mediaDevices.enumerateDevices()

  const videoDevices = devices.filter(d => d.kind === "videoinput");
  const audioOutputDevices = devices.filter(d => d.kind === "audiooutput");
  const audioInputDevices = devices.filter(d => d.kind === "audioinput");

  return {
    videoDevices,
    audioOutputDevices,
    audioInputDevices
  }
}

export {
  getDevices
}

export type {
  IMediaDevices,
}