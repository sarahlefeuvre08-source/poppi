import Image from "next/image";
import Link from "next/link";

export function PoppiCta() {
  return (
    <section className="rounded-[1.25rem] border border-accent/30 bg-[linear-gradient(135deg,rgba(255,255,255,0.08),rgba(217,54,66,0.07))] p-3 shadow-[0_14px_40px_rgba(0,0,0,0.26)] backdrop-blur-xl">
      <div className="flex items-center gap-3">
        <div className="relative h-[clamp(4.5rem,20vw,5rem)] w-[clamp(4rem,18vw,4.5rem)] shrink-0">
          <Image
            src="/assets/poppi.png"
            alt="Poppi mascot"
            fill
            sizes="160px"
            className="scale-[2.3] object-contain"
          />
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="text-sm font-bold">Not feeling today&apos;s pick?</h2>
          <p className="mt-0.5 text-xs leading-4 text-text-secondary">
            Tell Poppi what you&apos;re in the mood for.
          </p>
          <Link
            href="/poppi"
            className="poppi-control mt-2.5 flex min-h-10 w-full items-center justify-center gap-2 rounded-full bg-accent px-4 text-sm font-semibold text-white focus-visible:outline-white"
          >
            <span aria-hidden="true" className="text-lg">
              →
            </span>
            Ask Poppi
          </Link>
        </div>
      </div>
    </section>
  );
}
