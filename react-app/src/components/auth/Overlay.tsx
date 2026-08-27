import type { Dispatch, SetStateAction } from "react";
import styles from "./Auth.module.css";

interface OverlayProps {
    setIsSignUp: Dispatch<SetStateAction<boolean>>;
}

const Overlay = ({ setIsSignUp }: OverlayProps) => {
    return (
        <div className={styles.overlayContainer}>
            <div className={styles.overlay}>
                <div className={`${styles.overlayPanel} ${styles.overlayLeft}`}>
                    <h1 className="font-serif text-4xl font-bold">
                        Welcome Back!
                    </h1>

                    <p className="max-w-xs text-center">
                        To keep connected with us please login with your
                        personal info
                    </p>

                    <button
                        className="py-3 px-16 bg-primary font-bold font-sans shadow border border-black rounded-lg"
                        onClick={() => setIsSignUp(false)}
                    >
                        SIGN IN
                    </button>
                </div>

                <div
                    className={`${styles.overlayPanel} ${styles.overlayRight} flex gap-10`}
                >
                    <h1 className="font-serif text-4xl font-bold">
                        Hello, Friend!
                    </h1>

                    <p className="max-w-xs text-center">
                        Enter your personal details and start journey with us
                    </p>

                    <button
                        className="py-3 px-16 bg-primary font-bold font-sans shadow border border-black rounded-lg"
                        onClick={() => setIsSignUp(true)}
                    >
                        SIGN UP
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Overlay;
