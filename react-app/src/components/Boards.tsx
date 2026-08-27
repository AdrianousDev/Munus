import useUser from "../contexts/user/useUser";

const Boards = () => {
    const { userLogout } = useUser();

    return (
        <div>
            <p>Boards</p>
            <button onClick={userLogout}>LOGOUT</button>
        </div>
    );
};

export default Boards;
