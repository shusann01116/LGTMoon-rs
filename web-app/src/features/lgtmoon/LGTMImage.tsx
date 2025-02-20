"use client";

import { ImageCover } from "@/features/lgtmoon/ImageCover";
import type { LGTMoonImage } from "@/features/lgtmoon/api/storage";
import { cn } from "@/utils/cn";
import { download } from "@/lib/download";
import { useEffect, useState } from "react";
import { useRef } from "react";
import { getFileExtension, getFileName } from "@/utils/file";

export function LGTMImage({ image, onDelete }: { image: LGTMoonImage, onDelete: (id: string) => void }) {
	const imgRef = useRef<HTMLImageElement>(null);
	const [isLoaded, setIsLoaded] = useState(false);
	const [isDeleted, setIsDeleted] = useState(false);

	useEffect(() => {
		if (!imgRef.current) return;
		imgRef.current.src = URL.createObjectURL(
			new Blob([image.buffer], { type: image.type }),
		);
		imgRef.current.onload = () => {
			setIsLoaded(true);
		};
	}, [image]);

	const onClickCopy = async () => {
		if (!imgRef.current) return;

		const buff = await fetch(imgRef.current.src).then((res) =>
			res.arrayBuffer(),
		);
		await navigator.clipboard.write([
			new ClipboardItem({
				"image/png": new Blob([buff], { type: "image/png" }),
			}),
		]);
	};

	const onClickDownload = async () => {
		if (!imgRef.current) return;

		const buff = await fetch(imgRef.current.src).then((res) =>
			res.arrayBuffer(),
		);
		await download(new Blob([buff], { type: "image/png" }), `${getFileName(image.name)}-lgtm.${getFileExtension(image.name)}`);
	};

	const onClickDelete = async () => {
		setIsDeleted(true);
		onDelete(image.id);
	};

	return (
		<>
			{!isLoaded && <div className="aspect-square w-full bg-gray-100 animate-pulse" />}
			{!isDeleted &&
				<ImageCover onClickCopy={onClickCopy} onClickDownload={onClickDownload} onDelete={onClickDelete}>
					{/* eslint-disable-next-line @next/next/no-img-element */}
					<img
						ref={imgRef}
						className={cn("rounded-sm w-full block", isLoaded ? "block" : "hidden")}
						alt="LGTMoon"
					/>
				</ImageCover>
			}
		</>
	);
}
