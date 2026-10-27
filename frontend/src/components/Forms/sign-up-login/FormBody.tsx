import FormFields from "../FormFileds"
import FormLogo from "../FormLogo"
import ContainerBtns from "./ContainerBtns"
import CreateOrLogin from "./CreateOrLogin"
import NameContainer from "./NameContainer"
interface FormBodyProps {
    name: string,
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>,
    fields: string[],
    isSignup: boolean,
    selectedPlan: string,
    setSelectedPlan: (planId: string) => void,
    redirectionDes: string,
    redirection: string
}

const FormBody = ({ name, onSubmit, fields, isSignup, selectedPlan, setSelectedPlan, redirectionDes, redirection }: FormBodyProps) => {
    return (
        <>
            <div className="min-h-screen flex items-center justify-center p-4 bg-cover bg-center cincel bg-[url('/img/login.png')]">
                <div className="absolute inset-0 bg-black/70" />

                <div className="relative z-10 w-full max-w-4xl flex items-center justify-center gap-8">
                    <FormLogo />

                    <div className="relative w-full max-w-md">
                        <div className="relative bg-gradient-to-br from-amber-950/40 to-black/70 backdrop-blur-sm border border-amber-700/40 rounded-xl p-6 shadow-xl">

                            <NameContainer name={name} />

                            <form onSubmit={onSubmit} className="space-y-4">
                                <FormFields fields={fields} isSignup={isSignup} selectedPlan={selectedPlan} setSelectedPlan={setSelectedPlan} />

                                <ContainerBtns isSignup={isSignup} />

                                <CreateOrLogin redirectionDes={redirectionDes} redirection={redirection} isSignup={isSignup} />
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
export default FormBody;