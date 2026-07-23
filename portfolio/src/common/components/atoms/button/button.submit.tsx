export interface ButtonSubmitCustomizable {
  name: string
}

export function ButtonSubmitCustomizable({
  name
}: ButtonSubmitCustomizable) {
  return (
    <button
      type='submit'
      className='mt-2.5 box-border inline-flex h-[35px] w-full items-center justify-center rounded bg-[#00d2ff] px-[15px] font-medium leading-none text-[#051424] shadow-[0_2px_10px_rgba(0,210,255,0.15)] hover:bg-[#00daf3] focus:shadow-[0_0_0_2px_#00d2ff] focus:outline-none transition-all duration-200 cursor-pointer font-sans'
    >
      {name}
    </button>
  )
}
