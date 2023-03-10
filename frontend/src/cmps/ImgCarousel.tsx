import { Carousel } from "react-responsive-carousel"
import { Props } from "../interfaces/props"

export function ImgCarousel({ imgUrls }: Props) {
    return (
        <Carousel showStatus={false} showThumbs={false}>
            {imgUrls?.map((img, idx) => {
                return <img key={idx} className="story-img" src={img} alt="" />
            })}
        </Carousel>
    )
}