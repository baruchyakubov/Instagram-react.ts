import { Props } from "../interfaces/props"
import { Story } from "../interfaces/story"
import { StoryPreview } from "./StoryPreview"

export function StoryList({ storys }: Props) {
    return (
        <section className="story-list">
            {
                storys?.map((story: Story, idx: number) => {
                    return <StoryPreview storyData={{ story, idx }} key={story._id}></StoryPreview>
                })
            }
        </section>
    )
}