import React from "react";
import { useForm, useFieldArray, useWatch } from "react-hook-form";
import { DevTool } from "@hookform/devtools";
import { getValue } from "@testing-library/user-event/dist/utils";

let renderCount = 0;

let indexToWatch: number | undefined; // 定义一个变量用于存储要监听的索引

type formType = {
  username: string;
  email: string;
  channel: string;
  social: {
    twitter: string;
    facebook: string;
  };
  phoneNumbers: string[];
  phNumbers: {
    number: string;
    isShowError: boolean;
  }[]; // 我們不用 string[] 而是用 {}[]的原因是因為 useFieldArray works only object values
};

export const YoutubeForm = () => {
  const { register, control, handleSubmit, formState, setValue, getValues } =
    useForm<formType>({
      defaultValues: {
        username: "Batman",
        email: "",
        channel: "",
        social: {
          twitter: "",
          facebook: "",
        },
        phoneNumbers: ["", ""],
        phNumbers: [{ number: "", isShowError: true }],
      },

      // defaultValues: async () => {
      //   const response = await fetch(
      //     "https://jsonplaceholder.typicode.com/users/1"
      //   );
      //   const data = await response.json();
      //   return {
      //     username: "Batman",
      //     email: data.email,
      //     channel: "",
      //   };
      // },
    });
  const { errors } = formState;
  const { fields, append, remove } = useFieldArray({
    name: "phNumbers",
    control,
  });
  renderCount++;

  const onSubmit = (data: formType) => {
    console.log("Form Submit", data);
  };
  const handleBlur = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const { value } = e.target;
    const isOdd = parseInt(value) % 2 !== 0;
    setValue(`phNumbers.${index}.isShowError`, isOdd);
    indexToWatch = index; // 对变量进行赋值
  };

  const isErrorShown = useWatch({
    name:
      indexToWatch !== undefined
        ? `phNumbers.${indexToWatch}.isShowError`
        : "phNumbers.0.isShowError", // 使用默认的字段名称作为备用
    defaultValue: false,
    control: control, // 传递 control 对象
  });
  return (
    <div>
      <h1>Youtube Form ({renderCount / 2})</h1>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="form-control">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            {...register("username", { required: "Username is required" })}
          />
          <p className="error">{errors.username?.message}</p>
        </div>

        <div className="form-control">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            {...register("email", {
              pattern: {
                value: /^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/,
                message: "Invalid email format",
              },
            })}
          />
          <p className="error">{errors.email?.message}</p>
        </div>

        <div className="form-control">
          <label htmlFor="channel">Channel</label>
          <input
            type="text"
            id="channel"
            {...register("channel", { required: "Channel is required" })}
          />
          <p className="error">{errors.channel?.message}</p>
        </div>

        <div className="form-control">
          <label htmlFor="twitter">Twitter</label>
          <input type="text" id="twitter" {...register("social.twitter")} />
        </div>

        <div className="form-control">
          <label htmlFor="facebook">Channel</label>
          <input type="text" id="facebook" {...register("social.facebook")} />
        </div>

        <div className="form-control">
          <label htmlFor="primary-phone">Primary-Phone-Number</label>
          <input
            type="text"
            id="primary-phone"
            {...register("phoneNumbers.0")} // 指得是 phoneNumbers 的 index 0
          />
        </div>

        <div className="form-control">
          <label htmlFor="secondary-phone">Secondary-Phone-Number</label>
          <input
            type="text"
            id="secondary-phone"
            {...register("phoneNumbers.1")} // 指得是 phoneNumbers 的 index 1
          />
        </div>

        <div>
          <label>List of phone numbers</label>
          <div>
            {fields.map((item, index) => {
              return (
                <div className="form-control">
                  <input
                    type="text"
                    {...register(`phNumbers.${index}.number` as const)}
                    onBlur={(e) => handleBlur(e, index)}
                  />
                  {isErrorShown && <span>Show Fail</span>}

                  {/* {index > 0 && (
                    <button type="button" onClick={() => remove(index)}>
                      Remove
                    </button>
                  )} */}
                </div>
              );
            })}
            <button
              type="button"
              onClick={() => append({ number: "", isShowError: false })}
            >
              Add phone number
            </button>
          </div>
        </div>
        <button>Submit</button>
      </form>
      <DevTool control={control} />
    </div>
  );
};
