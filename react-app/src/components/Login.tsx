import useUser from "../contexts/user/useUser";
import useForm from "../hooks/useForm";
import Input from "./Input";

const apiUrl = import.meta.env.VITE_API_BASE_URL;

const Login = () => {
    const email = useForm();
    const password = useForm();

    const { userLogin } = useUser();

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!email.validate() || !password.validate()) return;

        userLogin(email.value, password.value);
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <Input label="Email" type="text" name="email" {...email} />

                <Input
                    label="Password"
                    type="password"
                    name="password"
                    {...password}
                />

                <button>Enviar</button>
            </form>
        </div>
    );
};

export default Login;
