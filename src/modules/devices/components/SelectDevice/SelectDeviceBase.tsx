import {memo} from "react";
import {useAppDispatch, useAppSelector} from "../../../../store/hooks.ts";
import {Select} from "antd";
import {ActionCreatorWithPayload} from "@reduxjs/toolkit";
import {RootState} from "../../../../store";

interface ISelectDeviceBase {
  optionsSelector: (state: RootState) => MediaDeviceInfo[];
  activeOptionSelector: (state: RootState) => MediaDeviceInfo | null;
  setActiveDeviceActionCreator: ActionCreatorWithPayload<string>;
}

interface ISelectOption {
  value: string;
  label: string;
}

const optionsMapper = (it: MediaDeviceInfo): ISelectOption => ({
  value: it.deviceId,
  label: it.label
});

const SelectDeviceBase = memo<ISelectDeviceBase>(({
                                                    optionsSelector,
                                                    activeOptionSelector,
                                                    setActiveDeviceActionCreator,
                                                  }) => {
  const optionsRaw = useAppSelector(optionsSelector);
  const options: ISelectOption[] = optionsRaw.map(optionsMapper);

  const activeOptionRaw = useAppSelector(activeOptionSelector);
  const activeOption = activeOptionRaw ? optionsMapper(activeOptionRaw) : null;

  const dispatch = useAppDispatch();

  // Если нет устройств, то не рисуем компонент
  if (options.length === 0) {
    return null;
  }

  const onChange = (value: string) => {
    dispatch(setActiveDeviceActionCreator(value));
  }

  const defaultOption = options[0]?.value ?? null;
  const value = activeOption?.value ?? defaultOption

  return (
    <Select
      style={{
        minWidth: 100,
        maxWidth: 200
      }}
      value={value}
      options={options}
      onChange={onChange}
    />
  )
})
SelectDeviceBase.displayName = "SelectDeviceBase";

export {
  SelectDeviceBase
}