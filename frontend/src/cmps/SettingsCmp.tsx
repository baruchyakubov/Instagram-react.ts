import { Props } from "../interfaces/props";

export function SettingsCmp({ DeletePost }: Props) {
    return (
        <section onClick={() => { if (DeletePost) DeletePost() }} className="settings">
            <div>Delete</div>
        </section>
    )
}