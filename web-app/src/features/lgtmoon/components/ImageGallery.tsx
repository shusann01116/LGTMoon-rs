import { LGTMImage } from "@/features/lgtmoon/components/LGTMImage";
import type { LGTMoonImage } from "@/features/lgtmoon/api/storage";

interface ImageGalleryProps {
	images: LGTMoonImage[];
	onDelete: (id: string) => Promise<void>;
}

export const ImageGallery = ({ images, onDelete }: ImageGalleryProps) => {
	return (
		<section className="-mb-4 columns-3xs gap-4 *:mb-4">
			{images.map((image) => (
				<LGTMImage key={image.id} image={image} onDelete={onDelete} />
			))}
		</section>
	);
};
