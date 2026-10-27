import DynamicForm from "../components/Forms/DynamicForm";
import API from "../services/api";

export default function Login() {
    const fields = ["Email", "Contraseña"];
    const url = `${API}/api/auth/login`;
    const title = "Iniciar sesión";
    const redirectionDes = "¿No tienes una cuenta?";

    return (
        <DynamicForm
            name={title}
            url={url}
            fields={fields}
            redirection="/signup"
            redirectionDes={redirectionDes}
        />
    );
}