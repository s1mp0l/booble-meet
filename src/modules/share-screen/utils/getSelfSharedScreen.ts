const DEFAULT_SHARED_SCREEN_OPTIONS = {
  video: true,
  audio: false,
  surfaceSwitching: 'include',
}

const getSelfSharedScreen = async (options?: DisplayMediaStreamOptions) => {
  try {
    const finalOptions = {
      ...DEFAULT_SHARED_SCREEN_OPTIONS,
      options
    };

    return await navigator.mediaDevices.getDisplayMedia(finalOptions)
  } catch (err) {
    console.log(err);
    return null;
  }
}

export {
  getSelfSharedScreen
}