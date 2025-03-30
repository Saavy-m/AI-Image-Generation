import { useId } from "react";
import clsx from "clsx";

const formClasses =
  "block w-full appearance-none rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:bg-gray-50 focus:outline-none focus:ring-blue-500 sm:text-sm";

export default function FloatingTextField({
  label,
  type = "text",
  className,
  name,
  multiline = false,
  prifix = null,
  margin = true,
  ...props
}) {
  let id = props.id ? props.id : name;
  let placeholder = props.placeholder ? props.placeholder : "";
  let error = props.error ? props.error : null;
  // dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:focus:border-blue-500

  // dark:text-gray-400 peer-focus:dark:text-blue-500
  return (
    <div className={`relative w-full ${margin?'mb-3':''}`}>
      <div
        className={`flex bg-input-background rounded-lg overflow-hidden ${className}`}>
        <span className="relative inline-flex items-center bg-transparent after:border-r after:absolute after:border-r-text a after:h-5 after:w-2 after:right-0 after:bottom-3.5">
          {prifix}
        </span>
        {multiline ? (
          <textarea
            {...props}
            type={type}
            id={id}
            name={name}
            className="block h-full min-h-16 px-4 pb-2.5 pt-7 w-full text-base text-input-text placeholder-transparent bg-input-background border-0 appearance-none  focus:outline-none focus:ring-0 focus:border-0 peer"
            placeholder={placeholder}>
            {props?.value}
          </textarea>
        ) : (
          <input
            {...props}
            type={type}
            maxLength={type === "tel" && 10}
            id={id}
            name={name}
            className="block h-16 px-4 pb-2.5 pt-7 w-full text-base text-input-text placeholder-transparent bg-input-background border-0 appearance-none  focus:outline-none focus:ring-0 focus:border-0 peer"
            placeholder={placeholder}
          />
        )}

        <label
          htmlFor={id}
          className="absolute text-base text-input-placeholder duration-300 transform -translate-y-4 scale-75 top-5 z-10 origin-[0] start-4 peer-focus:text-input-placeholder peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto">
          {label}
        </label>
      </div>

      {/* <input id={id} name={name} type={type} className={`block peer h-16 mb-1 pl-4 pr-4 w-full bg-input-background border-0 text-input-text placeholder-transparent rounded-xl focus:outline-none focus:border-0 focus:border-transparent focus:shadow-none focus:pt-6  ${ error ? 'border-error-text focus:ring-error-text' : null }`} placeholder={placeholder} {...props} />
      <label htmlFor={id} className="absolute left-4 top-5 text-input-placeholder text-sm transition-all peer-placeholder-shown:text-input-placeholder peer-placeholder-shown:text-input-placeholder peer-placeholder-shown:top-5 peer-focus:top-3 peer-focus:text-input-placeholder peer-focus:text-xs">{label?label:placeholder?placeholder:name}</label> */}
      {error && (
        <p className="text-sm font-medium w-full px-4 py-2.5 text-left text-error-text">
          {error}
        </p>
      )}
    </div>
  );
}
