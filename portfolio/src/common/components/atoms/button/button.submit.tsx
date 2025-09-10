
export interface ButtonSubmitCustomizable {
    name: string;
}
export function ButtonSubmitCustomizable({
    name
}: ButtonSubmitCustomizable) {
    return (
        <button
            className="mt-2.5 box-border inline-flex h-[35px] w-full items-center justify-center rounded bg-white px-[15px] font-medium leading-none text-violet11 shadow-[0_2px_10px] shadow-blackA4 hover:bg-mauve3 focus:shadow-[0_0_0_2px] focus:shadow-black focus:outline-none"
        >
            {name}
        </button>
    );
}
