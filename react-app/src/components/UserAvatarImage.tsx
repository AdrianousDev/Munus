import { useState } from "react";
import defaultAvatar from "../assets/default-avatar.svg";
import useUser from "../contexts/user/useUser";

interface UserAvatarImageProps {
    className?: string;
}

const UserAvatarImage = ({ className = "" }: UserAvatarImageProps) => {
    const { avatarUrl } = useUser();

    const [failedUrl, setFailedUrl] = useState<string | null>(null);

    const failed = failedUrl === avatarUrl;

    return (
        <img
            className={className}
            src={failed ? defaultAvatar : avatarUrl}
            alt="Avatar do usuário"
            onError={() => {
                if (!failed) setFailedUrl(avatarUrl);
            }}
        />
    );
};

export default UserAvatarImage;
