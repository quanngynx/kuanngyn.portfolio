import { Form } from 'radix-ui'
const { Field, Label, Message, Control } = Form

export interface TextAreaCustomizable {
    label: string;
    messageMissing: string;
}
export function TextAreaCustomizable({
    label,
    messageMissing
}: TextAreaCustomizable) {
    return (
        <Field className="mb-2.5 grid" name="message">
            <div className="flex items-baseline justify-between">
                <Label className="text-[15px] font-medium leading-[35px]">
                    {label}
                </Label>
                <Message
                    className="text-[13px] opacity-80"
                    match="valueMissing"
                >
                    {messageMissing}
                </Message>
            </div>
            <Control asChild>
                <textarea
                    className="h-[132px] box-border inline-flex w-full resize-none appearance-none items-center justify-center rounded bg-blackA2 p-2.5 text-[15px] leading-none shadow-[0_0_0_1px] shadow-blackA6 outline-none selection:bg-blackA6 selection hover:shadow-[0_0_0_1px_black] focus:shadow-[0_0_0_2px_black]"
                    required
                />
            </Control>
        </Field>
    );
}
