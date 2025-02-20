"use client";

import { ImageCover } from "@/features/lgtmoon/ImageCover";
import { deleteImage, useLGTMoonDB, type LGTMoonImage } from "@/features/lgtmoon/api/storage";
import { cn } from "@/utils/cn";
import { useEffect, useState } from "react";
import { useRef } from "react";

export function LGTMImage({ image }: { image: LGTMoonImage }) {
	const imgRef = useRef<HTMLImageElement>(null);
	const [isLoaded, setIsLoaded] = useState(false);
	const [isDeleted, setIsDeleted] = useState(false);
	const db = useLGTMoonDB();

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
		const url = URL.createObjectURL(new Blob([buff], { type: "image/png" }));
		const a = document.createElement("a");
		a.href = url;
		a.download = "lgtmoon.png";
		a.click();
		URL.revokeObjectURL(url);
	};

	const onClickDelete = async () => {
		if (!db.current) return;
		await deleteImage(db.current, image.id);
		setIsDeleted(true);
	};

	return (
		<>
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
