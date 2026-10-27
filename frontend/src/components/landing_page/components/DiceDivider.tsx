export default function DiceDivider() {
    return (
        <div
            className="w-full relative flex items-center justify-center h-[31.75mm] -mt-[15.87mm] bg-gradient-to-b from-transparent to-black z-20"
        >
            <div
                className="flex-1 max-w-md h-px bg-gradient-to-r from-transparent to-[#fbbb2499]"
            ></div>
            <div className="mx-8 relative z-30">
                <div className="dice-container">
                    <div className="dice">
                        <div className="dice-face front">
                            <div className="dice-dots-container">
                                <div></div>
                                <div></div>
                                <div></div>
                                <div></div>
                                <div className="dice-dot"></div>
                                <div></div>
                                <div></div>
                                <div></div>
                                <div></div>
                            </div>
                        </div>

                        <div className="dice-face right">
                            <div className="dice-dots-container">
                                <div className="dice-dot"></div>
                                <div></div>
                                <div></div>
                                <div></div>
                                <div></div>
                                <div></div>
                                <div></div>
                                <div></div>
                                <div className="dice-dot"></div>
                            </div>
                        </div>

                        <div className="dice-face top">
                            <div className="dice-dots-container">
                                <div className="dice-dot"></div>
                                <div></div>
                                <div></div>
                                <div></div>
                                <div className="dice-dot"></div>
                                <div></div>
                                <div></div>
                                <div></div>
                                <div className="dice-dot"></div>
                            </div>
                        </div>

                        <div className="dice-face left">
                            <div className="dice-dots-container">
                                <div className="dice-dot"></div>
                                <div></div>
                                <div className="dice-dot"></div>
                                <div></div>
                                <div></div>
                                <div></div>
                                <div className="dice-dot"></div>
                                <div></div>
                                <div className="dice-dot"></div>
                            </div>
                        </div>

                        <div className="dice-face bottom">
                            <div className="dice-dots-container">
                                <div className="dice-dot"></div>
                                <div></div>
                                <div className="dice-dot"></div>
                                <div></div>
                                <div className="dice-dot"></div>
                                <div></div>
                                <div className="dice-dot"></div>
                                <div></div>
                                <div className="dice-dot"></div>
                            </div>
                        </div>

                        <div className="dice-face back">
                            <div className="dice-dots-container">
                                <div className="dice-dot"></div>
                                <div></div>
                                <div className="dice-dot"></div>
                                <div className="dice-dot"></div>
                                <div></div>
                                <div className="dice-dot"></div>
                                <div className="dice-dot"></div>
                                <div></div>
                                <div className="dice-dot"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div
                className="flex-1 max-w-md h-px bg-gradient-to-l from-transparent to-[#fbbb2499]"
            ></div>
        </div>
    )
}