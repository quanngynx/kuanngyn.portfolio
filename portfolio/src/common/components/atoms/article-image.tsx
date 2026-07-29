import Image, { type ImageProps } from "next/image";

export function ArticleImage({ alt, ...props }: ImageProps) {
  return (
    <figure className="my-10">
      <Image
        {...props}
        alt={alt}
        className="h-auto w-full rounded-xl border border-border"
        sizes="(max-width: 768px) 100vw, 720px"
      />
    </figure>
  );
}
