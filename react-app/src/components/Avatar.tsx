import { useState } from "react";
import AvatarUploadModal from "./AvatarUploadModal";
import UserAvatarImage from "./UserAvatarImage";

const Avatar = () => {
    const [open, setOpen] = useState(false);

    const onOpen = () => {
        setOpen(true);
    };

    const onClose = () => {
        setOpen(false);
    };

    return (
        <>
            <button
                type="button"
                onClick={onOpen}
                aria-label="Alterar imagem do perfil"
                className="
                    group relative size-30 cursor-pointer
                    overflow-hidden rounded-full
                    focus-visible:outline-2 focus-visible:outline-offset-2
                    focus-visible:outline-blue-600
                "
            >
                <UserAvatarImage className="size-full object-cover" />

                <span
                    className="
                        absolute inset-0 grid place-items-center
                        bg-black/60 text-sm font-medium text-white
                        opacity-0 transition-opacity duration-200
                        group-hover:opacity-100
                        group-focus-visible:opacity-100
                    "
                >
                    Alterar imagem
                </span>
            </button>

            <AvatarUploadModal open={open} onClose={onClose} />
        </>
    );
};

export default Avatar;
