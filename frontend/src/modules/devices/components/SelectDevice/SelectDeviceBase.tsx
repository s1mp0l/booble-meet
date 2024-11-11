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

  const onChange = (value: string) => {
    dispatch(setActiveDeviceActionCreator(value));
  }

  return (
    <Select
      style={{
        minWidth: 200
      }}
      value={activeOption?.value}
      options={options}
      onChange={onChange}
    />
  )
})
SelectDeviceBase.displayName = "SelectDeviceBase";

export {
  SelectDeviceBase
}