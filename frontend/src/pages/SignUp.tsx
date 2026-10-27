import DynamicForm from "../components/Forms/DynamicForm";
import API from "../services/api";
export default function SignUp() {
    const fields = ["Nombre de usuario", "Email", "Contraseña", "Repite la contraseña", "Plan"];
    const url = `${API}/api/auth/register`;
    const title = "Crear cuenta";
    const redirectionDes = "¿Ya tienes una cuenta?";

    return (
        <DynamicForm
            name={title}
            url={url}
            fields={fields}
            redirection="/login"
            redirectionDes={redirectionDes}
        />
    );
}