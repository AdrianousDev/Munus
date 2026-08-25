const Input = ({ label, type, name, value, onChange, error, onBlur }) => {
    return (
        <div className="">
            <label htmlFor={name} className="">
                {label}
            </label>
            <input
                id={name}
                name={name}
                className=""
                type={type}
                value={value}
                onChange={onChange}
                onBlur={onBlur}
            />
            {error && <p className="">{error}</p>}
        </div>
    );
};

export default Input;
