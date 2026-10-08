"use client";

import Image from "next/image";
import Link from "next/link";
import { useI18n } from "@/i18n/provider";

export function PoppiCta() {
  const { t } = useI18n();
  return (
    <section className="rounded-[1.25rem] border border-accent/30 bg-[linear-gradient(135deg,rgba(255,255,255,0.08),rgba(217,54,66,0.07))] p-3 shadow-[0_14px_40px_rgba(0,0,0,0.26)] backdrop-blur-xl">
      <div className="flex items-center gap-3">
        <div className="relative h-[clamp(4.5rem,20vw,5rem)] w-[clamp(4rem,18vw,4.5rem)] shrink-0">
          <Image
            src="/assets/poppi.png"
            alt={t("common.poppiMascotAlt")}
            fill
            sizes="160px"
            className="scale-[2.3] object-contain"
          />
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="text-sm font-bold">{t("home.notFeelingPick")}</h2>
          <p className="mt-0.5 text-xs leading-4 text-text-secondary">
            {t("home.askDescription")}
          </p>
          <Link
            href="/poppi"
            className="poppi-control mt-2.5 flex min-h-10 w-full items-center justify-center gap-2 rounded-full bg-accent px-4 text-sm font-semibold text-white focus-visible:outline-white"
          >
            <span aria-hidden="true" className="text-lg">
              →
            </span>
            {t("home.askPoppi")}
          </Link>
        </div>
      </div>
    </section>
  );
}
