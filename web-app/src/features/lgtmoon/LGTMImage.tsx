"use client";

import { ImageCover } from "@/features/lgtmoon/ImageCover";
import type { LGTMoonImage } from "@/features/lgtmoon/api/storage";
import { download } from "@/lib/download";
import { cn } from "@/utils/cn";
import { getFileExtension, getFileName } from "@/utils/file";
import { useEffect, useState } from "react";
import { useRef } from "react";
import { toast } from "sonner";

export function LGTMImage({
	image,
	onDelete,
}: { image: LGTMoonImage; onDelete: (id: string) => void }) {
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

	const onClickCopy = () => {
		if (!imgRef.current) return;

		try {
			const item = new ClipboardItem({
				// biome-ignore lint/suspicious/noAsyncPromiseExecutor: Safari でクリップボードにコピーするためには同期処理でなければいけない
				"image/png": new Promise(async (resolve) => {
					if (!imgRef.current) return;
					const buff = await fetch(imgRef.current.src).then((res) =>
						res.arrayBuffer(),
					);
					resolve(new Blob([buff], { type: "image/png" }));
				}),
			});
			navigator.clipboard.write([item]);
		} catch (error) {
			toast.error("Failed to copy to clipboard", {
				description: error instanceof Error ? error.message : "Unknown error",
			});
		}
	};

	const onClickDownload = async () => {
		if (!imgRef.current) return;

		const buff = await fetch(imgRef.current.src).then((res) =>
			res.arrayBuffer(),
		);
		await download(
			new Blob([buff], { type: "image/png" }),
			`${getFileName(image.name)}-lgtm.${getFileExtension(image.name)}`,
		);
	};

	const onClickDelete = async () => {
		setIsDeleted(true);
		onDelete(image.id);
	};

	return (
		<>
			{!isLoaded && (
				<div className="aspect-square w-full animate-pulse bg-gray-100" />
			)}
			{!isDeleted && (
				<ImageCover
					className="shadow-accent shadow-xs drop-shadow-xs transition-all hover:drop-shadow-2xl"
					onClickCopy={onClickCopy}
					onClickDownload={onClickDownload}
					onDelete={onClickDelete}
				>
					{/* eslint-disable-next-line @next/next/no-img-element */}
					<img
						ref={imgRef}
						className={cn(
							"block w-full rounded-sm",
							isLoaded ? "block" : "hidden",
						)}
						alt="LGTMoon"
					/>
				</ImageCover>
			)}
		</>
	);
}
