import { useState } from "react";
import styles from "./Auth.module.css";
import SignIn from "./SignIn";
import SignUp from "./SignUp";
import Overlay from "./Overlay";
import Footer from "../Footer";
import ReturnIcon from "../svgs/ReturnIcon";

export const Auth = () => {
    const [isSignUp, setIsSignUp] = useState(false);

    return (
        <main className="min-h-screen flex flex-col items-center justify-between">
            <div className="self-start mt-2 ml-5">
                <a href="/">
                    <ReturnIcon />
                </a>
            </div>

            <div
                className={`${styles.container} ${
                    isSignUp ? styles.signUpActive : ""
                }`}
            >
                <SignIn />

                <SignUp />

                <Overlay setIsSignUp={setIsSignUp} />
            </div>

            <Footer />
        </main>
    );
};
