import { Form } from 'radix-ui'
const { Field, Label, Message, Control } = Form

export interface FieldInputCustomizable {
    label: string;
    messageMissing: string;
    messageMismatch: string;
}

export function FieldInputCustomizable({
    label,
    messageMissing,
    messageMismatch,
}: FieldInputCustomizable) {
    return (
        <Field className="mb-2.5 grid" name="email">
            <div className="flex items-baseline justify-between">
                <Label className="text-[15px] font-medium leading-[35px] text-white">
                    {label}
                </Label>
                <Message
                    className="text-[13px] text-white opacity-80"
                    match="valueMissing"
                >
                    {messageMissing}
                </Message>
                <Message
                    className="text-[13px] text-white opacity-80"
                    match="typeMismatch"
                >
                    {messageMismatch}
                </Message>
            </div>
            <Control asChild>
                <input
                    className="box-border inline-flex h-[35px] w-full appearance-none items-center justify-center rounded bg-blackA2 px-2.5 text-[15px] leading-none text-white shadow-[0_0_0_1px] shadow-blackA6 outline-none selection:bg-blackA6 selection:text-white hover:shadow-[0_0_0_1px_black] focus:shadow-[0_0_0_2px_black]"
                    type="email"
                    required
                />
            </Control>
        </Field>
    );
}
