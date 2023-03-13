import { ChangeEvent, DragEvent, SyntheticEvent, useState } from "react";
import { Props } from "../interfaces/props";
import { uploadService } from "../services/upload.service";
import { UploadIcon } from "../svg-cmps/UploadIcon";

export function UploadUserImg({ imgUrl, setImgUrl }: Props) {
    const [isDragover, setIsDragover] = useState(false)

    const handleFileChange = (ev: ChangeEvent<HTMLInputElement>): void => {
        if (!ev.target.files) return;
        let file = ev.target.files[0]
        onUploadFile(file)
    }

    const handleFileDrop = (ev: DragEvent<HTMLInputElement>): void => {
        ev.preventDefault()
        let file = ev.dataTransfer.files[0]
        onUploadFile(file)
    }

    const onUploadFile = async (file: File): Promise<void> => {
        const res = await uploadService.uploadImg(file)
        if (setImgUrl) setImgUrl(res.url)
    }

    if (imgUrl) return <img className="profile-img" src={imgUrl} alt="" />

    return (
        <section
            className={`upload-userImg-container ${isDragover ? 'drag-zone' : ''}`
            }
            onDrop={handleFileDrop}
            onDragOver={(ev: DragEvent<HTMLElement>) => {
                ev.preventDefault()
                setIsDragover(true)
            }}
            onDragLeave={(ev: DragEvent<HTMLElement>) => {
                ev.preventDefault()
                setIsDragover(false)
            }}
        >
            <label className={`${isDragover ? 'drag' : ''}`}>
                <p>Click or drag image from your computer</p>
                <UploadIcon />
                <input onChange={handleFileChange} type="file" hidden />
            </label>
        </section >
    )
}