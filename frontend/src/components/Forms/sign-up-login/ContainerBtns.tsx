import { BtnOAuth } from "./BtnOAuth"

interface ContainerBtnsProps {
    isSignup: boolean
}

const ContainerBtns = ({ isSignup } : ContainerBtnsProps) => {
    return (
        <>
            <div className="pt-2 flex flex-col gap-3">
                <button
                    type="submit"
                    className="w-full py-2.5 bg-gradient-to-r from-amber-700 to-amber-800 text-amber-100 font-bold rounded border border-amber-600 hover:from-amber-600 hover:to-amber-700 transition-all duration-200 cincel"
                >

                    {isSignup ? "Comenzar Aventura" : "Iniciar Sesión"}
                </button>
                <BtnOAuth isSignup={isSignup} />
            </div>
        </>
    )
}
export default ContainerBtns