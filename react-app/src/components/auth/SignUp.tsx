import useUser from "../../contexts/user/useUser";
import useForm from "../../hooks/useForm";
import Input from "../form/Input";
import styles from "./Auth.module.css";

const SignUp = () => {
    const username = useForm("");
    const email = useForm("");
    const password = useForm("");

    const { userRegister } = useUser();

    const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!username.validate || !email.validate() || !password.validate())
            return;

        userRegister(username.value, email.value, password.value);
    };

    return (
        <div className={`${styles.formContainer} ${styles.signUpContainer}`}>
            <form
                className="flex h-full flex-col items-center justify-center gap-10 px-12"
                onSubmit={handleSubmit}
            >
                <h1 className="font-serif text-5xl font-bold">Sign Up</h1>

                <Input
                    type="name"
                    name="name"
                    placeholder="Name"
                    {...username}
                />

                <Input
                    type="email"
                    name="email"
                    placeholder="Email"
                    {...email}
                />

                <Input
                    type="password"
                    name="password"
                    placeholder="Password"
                    {...password}
                />

                <button className="py-3 px-16 bg-primary rounded-lg font-bold font-sans shadow">
                    SIGN UP
                </button>
            </form>
        </div>
    );
};

export default SignUp;
