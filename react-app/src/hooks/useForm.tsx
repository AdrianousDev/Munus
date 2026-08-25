import { useState } from "react";

const types = {
    email: {
        regex: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        message: "Preencha um Email inválido",
    },
    password: {
        regex: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/,
        message:
            "A senha precisa ter pelo menos 1 caracter maiúsculo, 1 minúsculo e 1 dígito. Com no mínimo 8 caracteres.",
    },
    number: {
        regex: /^\d+$/,
        message: "Utilize números apenas",
    },
};

const useForm = (type) => {
    const [value, setValue] = useState("");
    const [error, setError] = useState("");

    const validate = (value) => {
        if (type === false) return true;

        if (!value.trim().length) {
            setError("Preencha um valor.");
            return false;
        } else if (types[type] && !types[type].regex.test(value)) {
            setError(types[type].message);
            return false;
        } else {
            setError(null);
            return true;
        }
    };

    const onChange = ({ target }) => {
        if (error) validate(target.value);
        setValue(target.value);
    };

    return {
        value,
        setValue,
        onChange,
        error,
        validate: () => validate(value),
        onBlur: () => validate(value),
    };
};

export default useForm;
