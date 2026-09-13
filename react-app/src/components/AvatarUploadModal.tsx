import { useState, type ChangeEvent, type SubmitEvent } from "react";
import CloseIcon from "./svgs/CloseIcon";
import useUser from "../contexts/user/useUser";

interface IAvatarUploadModalProps {
    open: boolean;
    onClose: () => void;
}

interface SelectedImage {
    preview: string | null;
    raw: File | null;
}

const imageDefaultValue = { preview: null, raw: null };

const AvatarUploadModal = ({ open, onClose }: IAvatarUploadModalProps) => {
    const [image, setImage] = useState<SelectedImage>(imageDefaultValue);

    const { uploadAvatar } = useUser();

    const handleSubmit = async (event: SubmitEvent) => {
        event.preventDefault();

        if (!image.raw) return;

        await uploadAvatar(image.raw);

        setImage(imageDefaultValue);
        onClose();
    };

    const handleImgChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];

        if (!file) return;

        setImage({
            preview: URL.createObjectURL(file),
            raw: file,
        });
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/60 p-4 backdrop-blur-sm">
            <div className="w-full max-w-lg overflow-hidden rounded-2xl border border-white/10 bg-white shadow-2xl">
                <header className="border-b border-slate-200 px-6 py-5">
                    <div className="flex justify-between">
                        <h2 className="text-lg font-semibold text-slate-900">
                            Alterar avatar
                        </h2>

                        <button
                            type="button"
                            onClick={onClose}
                            className="cursor-pointer"
                        >
                            <CloseIcon />
                        </button>
                    </div>

                    <p className="mt-1 text-sm text-slate-500">
                        Escolha uma imagem JPEG, PNG ou WebP.
                    </p>
                </header>

                <form
                    onSubmit={handleSubmit}
                    className="flex flex-col gap-6 p-6"
                >
                    <div className="flex flex-col items-center gap-5 sm:flex-row">
                        <div className="grid size-30 shrink-0 place-items-center overflow-hidden rounded-full bg-slate-100">
                            {image.preview ? (
                                <div
                                    className="size-full bg-cover bg-center"
                                    style={{
                                        backgroundImage: `url(${image.preview})`,
                                    }}
                                />
                            ) : (
                                <span className="px-3 text-center text-xs text-slate-400">
                                    Preview da imagem
                                </span>
                            )}
                        </div>

                        <div className="w-full">
                            <label className="mb-2 block text-sm font-medium text-slate-700">
                                Arquivo da imagem
                            </label>

                            <input
                                type="file"
                                accept="image/jpeg,image/png,image/webp"
                                onChange={handleImgChange}
                                className="block w-full cursor-pointer rounded-lg
                                    border border-slate-300 bg-slate-50
                                    text-sm text-slate-500
                                    file:mr-4 file:cursor-pointer file:border-0
                                    file:bg-slate-900 file:px-4 file:py-2.5
                                    file:text-sm file:font-medium file:text-white
                                    hover:file:bg-slate-700
                                    focus:outline-none focus:ring-2
                                    focus:ring-slate-400
                                "
                            />

                            <p className="mt-2 text-xs text-slate-400">
                                Tamanho máximo de 5mb.
                            </p>
                        </div>
                    </div>

                    <div className="flex justify-end border-t border-slate-200 pt-5">
                        <button
                            type="submit"
                            className="
                        rounded-lg bg-slate-900 px-5 py-2.5
                        text-sm font-semibold text-white shadow-sm
                        transition-colors
                        hover:bg-slate-700
                        focus:outline-none focus:ring-2
                        focus:ring-slate-500 focus:ring-offset-2
                        active:bg-slate-950
                    "
                        >
                            Enviar avatar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AvatarUploadModal;
