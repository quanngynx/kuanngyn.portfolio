"use client";

import { useActionState, useEffect } from "react";
import { Control, Field, Label, Message, Root, Submit } from "@radix-ui/react-form";
import { toast } from "sonner";
import { sendDiscordMessage } from "@/app/actions";

import { TextAreaCustomizable } from "../../molecules/textArea";
import { ButtonSubmitCustomizable } from "../../atoms/button";

// interface FormState {}

// interface FormAction {}

// interface IsPending {}

export function CustomizableFormContact() {
    const [formState, formAction, isPending]
    // : [
    //     FormState,
    //     FormAction,
    //     IsPending
    // ] 
    = useActionState(
        sendDiscordMessage,
        null
    ); 

    useEffect (() => {
        if (formState?.success) {
          toast.success(formState?.message);
        } else if (formState?.success === false) {
          toast.error(formState?.message);
        }
    },[formState?.success, formState?.message])

    return (
        <Root className="w-[60%]" action={formAction}>
            <Field className="w-full mb-2.5 grid" name="fullname">
                <div className="flex items-baseline justify-between">
                    <Label className="text-[15px] font-medium leading-[35px]">
                        Fullname
                    </Label>
                    <Message
                        className="text-[13px] opacity-80"
                        match="valueMissing"
                    >
                        Please enter your name
                    </Message>
                    <Message
                        className="text-[13px] opacity-80"
                        match="typeMismatch"
                    >
                        Please provide a valid name
                    </Message>
                </div>
                <Control asChild>
                    <input
                        className="box-border inline-flex h-[35px] w-full appearance-none items-center justify-center rounded bg-blackA2 px-2.5 text-[15px] leading-none shadow-[0_0_0_1px] shadow-blackA6 outline-none selection:bg-blackA6 selection:text-white hover:shadow-[0_0_0_1px_black] focus:shadow-[0_0_0_2px_black]"
                        type="name"
                        required
                    />
                </Control>
            </Field>

            <div className="flex gap-4">
                {/* <FieldInputCustomizable
                label="Email"
                messageMissing="Please enter your email"
                messageMismatch="Please provide a valid email"
            /> */}
                <Field className="w-full mb-2.5 grid" name="email">
                    <div className="flex items-baseline justify-between">
                        <Label className="text-[15px] font-medium leading-[35px]">
                            Email
                        </Label>
                        <Message
                            className="text-[13px] opacity-80"
                            match="valueMissing"
                        >
                            Please enter your email
                        </Message>
                        <Message
                            className="text-[13px] opacity-80"
                            match="typeMismatch"
                        >
                            Please provide a valid email
                        </Message>
                    </div>
                    <Control asChild>
                        <input
                            className="box-border inline-flex h-[35px] w-full appearance-none items-center justify-center rounded bg-blackA2 px-2.5 text-[15px] leading-none shadow-[0_0_0_1px] shadow-blackA6 outline-none selection:bg-blackA6 selection:text-white hover:shadow-[0_0_0_1px_black] focus:shadow-[0_0_0_2px_black]"
                            type="email"
                            required
                        />
                    </Control>
                </Field>

                {/* <FieldInputCustomizable
                label="Phone"
                messageMissing="Please enter your phone number"
                messageMismatch="Please provide a valid phone number"
            /> */}
                <Field className="w-full mb-2.5 grid" name="phoneNumber">
                    <div className="flex items-baseline justify-between">
                        <Label className="text-[15px] font-medium leading-[35px]">
                            Phone
                        </Label>
                        <Message
                            className="text-[13px] opacity-80"
                            match="valueMissing"
                        >
                            Please enter your phone number
                        </Message>
                        <Message
                            className="text-[13px] opacity-80"
                            match="typeMismatch"
                        >
                            Please provide a valid phone number
                        </Message>
                    </div>
                    <Control asChild>
                        <input
                            className="box-border inline-flex h-[35px] w-full appearance-none items-center justify-center rounded bg-blackA2 px-2.5 text-[15px] leading-none shadow-[0_0_0_1px] shadow-blackA6 outline-none selection:bg-blackA6 selection:text-white hover:shadow-[0_0_0_1px_black] focus:shadow-[0_0_0_2px_black]"
                            type="number"
                            required
                        />
                    </Control>
                </Field>
            </div>

            <TextAreaCustomizable
                label="Question"
                messageMissing="Please enter a question"
            />

            <Submit asChild>
                <ButtonSubmitCustomizable name={isPending ? "Sending..." : "Send for me!"} />
            </Submit>
        </Root>
    );
}