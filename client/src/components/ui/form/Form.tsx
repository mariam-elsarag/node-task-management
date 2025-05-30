import { Control, Controller, FieldError } from "react-hook-form";
import Password from "./Password";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { InputOtp } from "primereact/inputotp";
import Input_Calendar from "./Input_Calendar";
import Input_Dropdown from "./Input_Dropdown";
import Upload_Image from "./Upload_Image";

interface FormItemType {
  id?: string;
  formType?:
    | "input"
    | "textarea"
    | "password"
    | "otp"
    | "calendar"
    | "dropdown"
    | "image";
  fieldName: string;
  validator?: any;
  label?: string;
  placeholder?: string;
  type?: string;
  name?: string | undefined;
  className?: string;
  groupWith?: number;
  isGrouped?: boolean;
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  style?: string;
  title?: string;
  optionList?: [];
}

interface FormProps {
  formList: FormItemType[];
  control: Control<any>;
  errors: Record<string, FieldError | undefined>;
  loading: boolean;
  setError?: (name: string, error: { type: string; message: string }) => void;
}

const Form: React.FC<FormProps> = ({
  formList,
  control,
  errors,
  loading,
  setError,
}) => {
  const [focusedField, setFocusedField] = useState(null);
  const renderField = (
    item: FormItemType,
    field: { value: any; onChange: (e: any) => void },
    error?: FieldError
  ) => {
    const isFocused = focusedField === item.id;
    const errorClass = error ? "border-red-500" : "border-blue-800";

    switch (item.formType) {
      case "input":
        return (
          <div
            className={`  ${
              errors[item?.fieldName] || error
                ? "border-error-800"
                : isFocused
                ? "border-gray-500"
                : " border-grey-100"
            } flex items-center gap-2 border px-3 py-3  h-[48px] ${
              item?.style ? item?.style : "rounded-lg"
            } `}
          >
            {item?.icon}
            <input
              id={item.id}
              type={item.type || "text"}
              name={item.name || ""}
              value={field.value ?? ""}
              onChange={field.onChange}
              className={`w-full h-full outline-0 shadow-none text-grey-300 placeholder:text-sm`}
              placeholder={item.placeholder}
              onFocus={() => setFocusedField(item?.id)}
              onBlur={() => setFocusedField(null)}
            />
          </div>
        );
      case "password":
        return (
          <div
            className={` ${
              errors[item?.fieldName] || error
                ? "border-error-800"
                : isFocused
                ? "border-gray-500"
                : " border-grey-100"
            } flex items-center gap-2 border px-3 py-3  h-[48px] ${
              item?.style ? item?.style : "rounded-lg"
            }  `}
          >
            {item?.icon}
            <Password
              id={item.id}
              name={item.name || ""}
              value={field.value ?? ""}
              handleChange={field.onChange}
              placeholder={item.placeholder}
              handleFocus={() => setFocusedField(item?.id)}
              handleBlur={() => setFocusedField(null)}
            />
          </div>
        );
      case "otp":
        return (
          <InputOtp
            value={field?.value}
            onChange={(e) => {
              field.onChange(e.value);
            }}
            disabled={item?.disabled || loading}
            integerOnly
            className="otp"
            length={6}
          />
        );
      case "calendar":
        return (
          <Input_Calendar
            id={item.id || 0}
            value={field.value || ""}
            handleChange={field.onChange}
            placeholder={item.placeholder || ""}
            loading={loading}
            disabled={item?.disabled}
            error={errors[item?.fieldName] || error}
          />
        );
      case "image":
        return (
          <Upload_Image
            value={field.value || ""}
            fieldName={item.fieldName}
            loading={loading}
            disabled={item?.disabled}
            handleChange={field.onChange}
            error={errors[item.fieldName] || error}
            setError={setError}
          />
        );
      case "dropdown":
        return (
          <Input_Dropdown
            id={item.id || 0}
            value={field.value || ""}
            handleChange={field.onChange}
            placeholder={item.placeholder || ""}
            loading={loading}
            disabled={item?.disabled}
            error={errors[item?.fieldName] || error}
            optionList={item.optionList}
          />
        );
      case "textarea":
        return (
          <div
            className={` ${
              errors[item?.fieldName] || error
                ? "border-error-800"
                : isFocused
                ? "border-gray-500"
                : " border-grey-100"
            } flex items-center gap-2 border px-3 py-3  ${
              item?.style ? item?.style : "rounded-lg"
            }  `}
          >
            {item?.icon}
            <textarea
              id={item.id}
              name={item.name || ""}
              value={field.value ?? ""}
              onChange={field.onChange}
              className={`flex-1 outline-0 shadow-none  resize-none !h-auto !min-h-[100px] `}
              placeholder={item.placeholder}
              onFocus={() => setFocusedField(item?.id)}
              onBlur={() => setFocusedField(null)}
            />
          </div>
        );
      default:
        return <></>;
    }
  };

  return (
    <>
      {formList.map((item, index) => {
        const isGrouped = item?.isGrouped && formList[index + 1];
        if (isGrouped) {
          return (
            <div className={`  ${item?.className} `} key={item.id}>
              {[item, formList[index + 1]].map((fieldItem) => (
                <fieldset
                  className={`flex flex-col  gap-2  text-base capitalize `}
                  key={fieldItem.id}
                >
                  <label
                    className="text-grey-300 text-sm font-[500]"
                    htmlFor={fieldItem?.id}
                  >
                    {fieldItem?.label}
                  </label>
                  <Controller
                    name={fieldItem?.fieldName}
                    control={control}
                    rules={fieldItem.validator}
                    render={({ field, fieldState: { error } }) =>
                      renderField(fieldItem, field, error)
                    }
                  />
                  {errors[fieldItem?.fieldName] && (
                    <p className="text-error-800 text-xs">
                      {errors[fieldItem?.fieldName]?.message}
                    </p>
                  )}
                </fieldset>
              ))}
            </div>
          );
        } else if (item && !item?.isGrouped && !item?.groupWith) {
          return (
            <fieldset
              className={`grid gap-2 text-base capitalize ${item?.className} col-span-2`}
              key={item.id}
            >
              <label
                className="text-grey-300 text-sm font-[500]"
                htmlFor={item?.id}
              >
                {item?.label}
              </label>
              <Controller
                name={item?.fieldName}
                control={control}
                rules={item?.validator}
                render={({ field, fieldState: { error } }) =>
                  renderField(item, field, error)
                }
              />
              <div
                className={`flex gap-2 ${
                  errors[item?.fieldName] ? "justify-between" : "justify-end"
                } `}
              >
                {errors[item?.fieldName] && (
                  <p className="text-error-800 text-xs">
                    {errors[item?.fieldName]?.message}
                  </p>
                )}

                {item?.hasForgetPassword && (
                  <Link
                    to="/forget-password"
                    className="text-grey-300 text-end text-xs "
                  >
                    Forget password?
                  </Link>
                )}
              </div>
            </fieldset>
          );
        } else {
          return null;
        }
      })}
    </>
  );
};

export default Form;
