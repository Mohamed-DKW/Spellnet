import { Link } from "react-router-dom"
interface CreateOrLoginProps {
    redirectionDes: string,
    redirection: string,
    isSignup: boolean
}

const CreateOrLogin = ({redirectionDes, redirection, isSignup} : CreateOrLoginProps) => {
    return (
        <>
            <div className="text-center pt-3 border-t border-amber-800/20">
                <p className="text-amber-400/70 text-sm inline">
                    {redirectionDes}{" "}
                </p>
                <Link
                    to={redirection}
                    className="text-amber-300 hover:text-amber-100 transition-colors duration-200 text-sm font-medium cincel"
                >
                    {isSignup ? "Inicia sesión" : "Crear cuenta"}
                </Link>
                <div className="flex justify-center items-center">
                </div>
            </div>
        </>
    )
}
export default CreateOrLogin;