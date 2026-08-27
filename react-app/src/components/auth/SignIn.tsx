import type { SubmitEvent } from "react";
import useUser from "../../contexts/user/useUser";
import useForm from "../../hooks/useForm";
import Input from "../form/Input";
import styles from "./Auth.module.css";

const SignIn = () => {
    const email = useForm("");
    const password = useForm("");

    const { userLogin } = useUser();

    const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!email.validate() || !password.validate()) return;

        userLogin(email.value, password.value);
    };

    return (
        <div className={`${styles.formContainer} ${styles.signInContainer}`}>
            <form
                onSubmit={handleSubmit}
                className="flex h-full flex-col items-center justify-center gap-10 px-12"
            >
                <h1 className="font-serif text-5xl font-bold">Sign In</h1>

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
                    SIGN IN
                </button>
            </form>
        </div>
    );
};

export default SignIn;
