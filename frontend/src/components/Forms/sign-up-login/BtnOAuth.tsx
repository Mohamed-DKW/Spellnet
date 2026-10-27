import API from "../../../services/api";
interface OAuthButtonProps {
    isSignup: boolean;
}
const loginWithGoogle = () => {
    const backendUrl = API && API !== 'undefined' ? API : 'http://localhost:3001';
    window.location.href = `${backendUrl}/api/auth/google`;
};

const BtnOAuth = ({isSignup} : OAuthButtonProps) => {
    return <button onClick={loginWithGoogle} className="w-full py-2.5 bg-white font-bold rounded border border-amber-600 hover:from-amber-600 hover:to-amber-700 transition-all duration-200 cincel flex justify-center items-center gap-3"><span>{`${isSignup ? 'Crear cuenta con google': 'Iniciar sessión con google'}`}</span><img src="/img/img-google.png" alt="google-icon" className="w-7" /></button>
}

export { BtnOAuth };