import Image from "next/image";

type MoviePosterProps = {
  title: string;
  src: string;
  priority?: boolean;
  compact?: boolean;
  landscape?: boolean;
  sizes?: string;
};

export function MoviePoster({
  title,
  src,
  priority = false,
  compact = false,
  landscape = false,
  sizes,
}: MoviePosterProps) {
  return (
    <div
      className={`relative w-full overflow-hidden ${landscape ? "aspect-[4/3]" : compact ? "aspect-[3/4]" : "aspect-[1000/1482]"}`}
    >
      <Image
        src={src}
        alt={`${title} poster`}
        fill
        priority={priority}
        sizes={
          sizes ??
          (priority
            ? "(max-width: 480px) calc(100vw - 2rem), 448px"
            : "(max-width: 480px) calc((100vw - 4rem) / 3), 138px")
        }
        className={`object-cover ${landscape ? "object-[47%_32%]" : "object-center"}`}
      />
    </div>
  );
}
