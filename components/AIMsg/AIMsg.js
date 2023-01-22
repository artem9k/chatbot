const AIMsg = (props) => {
    return(
    <div class="flex flex-col items-start transition-all ">
        <div class="flex flex-row items-end pt-1 ">
            <img 
            alt="robot" 
            src="/robot.png" 
            width="75" 
            height="75" 
            decoding="async" 
            data-nimg="1" 
            class="block pr-2 animate-pop animate-fade-in-down w-[35px] sm:w-[40px]"
            loading="lazy" 
            />
            <div class="bg-[#F2F2F2] rounded-3xl px-5 py-2 flex flex-col gap-1 font-SF max-w-[80%]">
                <p class="text-sm md:text-md lg:text-lg leading-tight">
                    <span>{props.message.slice(4)}</span>
                </p>
            </div>
        </div>
    </div>
    )
}

export {AIMsg};