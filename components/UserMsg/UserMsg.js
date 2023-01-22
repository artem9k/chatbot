const UserMsg = (props) => {
    return (
    <div class="bg-[#067EFE] text-white self-end rounded-3xl px-5 py-2 flex flex-col gap-1 font-SF max-w-[80%]
         "><p class="text-sm md:text-md lg:text-lg leading-tight">{props.message}</p></div>
    )
}

export {UserMsg}