"use client";

import {
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";

type BottomSheetProps = {
  ariaLabelledBy: string;
  children: ReactNode;
  className?: string;
  closeLabel: string;
  onClose: () => void;
};

const transitionDuration = 200;
const dismissDistance = 96;
const dismissVelocity = 0.55;

export function BottomSheet({
  ariaLabelledBy,
  children,
  className = "",
  closeLabel,
  onClose,
}: BottomSheetProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isClosingRef = useRef(false);
  const onCloseRef = useRef(onClose);
  const sheetRef = useRef<HTMLElement>(null);
  const dragRef = useRef<{
    pointerId: number;
    startY: number;
    lastY: number;
    lastTime: number;
    velocity: number;
  } | null>(null);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  const close = useCallback(() => {
    if (isClosingRef.current) return;
    isClosingRef.current = true;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      onCloseRef.current();
      return;
    }

    setIsVisible(false);
    closeTimerRef.current = setTimeout(
      () => onCloseRef.current(),
      transitionDuration,
    );
  }, []);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    const animationFrame = window.requestAnimationFrame(() => setIsVisible(true));
    document.body.style.overflow = "hidden";

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") close();
    }

    window.addEventListener("keydown", handleEscape);
    return () => {
      window.cancelAnimationFrame(animationFrame);
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleEscape);
    };
  }, [close]);

  function beginDrag(event: ReactPointerEvent<HTMLElement>) {
    if (
      !(event.target instanceof Element) ||
      !event.target.closest("[data-bottom-sheet-drag-region]") ||
      event.target.closest("button, a, input, select, textarea")
    ) {
      return;
    }

    const now = performance.now();
    dragRef.current = {
      pointerId: event.pointerId,
      startY: event.clientY,
      lastY: event.clientY,
      lastTime: now,
      velocity: 0,
    };
    setIsDragging(true);
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function moveDrag(event: ReactPointerEvent<HTMLElement>) {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;

    event.preventDefault();
    const now = performance.now();
    const elapsed = Math.max(now - drag.lastTime, 1);
    drag.velocity = (event.clientY - drag.lastY) / elapsed;
    drag.lastY = event.clientY;
    drag.lastTime = now;
    setDragOffset(Math.max(0, event.clientY - drag.startY));
  }

  function endDrag(event: ReactPointerEvent<HTMLElement>) {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;

    const recentVelocity =
      performance.now() - drag.lastTime < 100 ? drag.velocity : 0;
    const distanceThreshold = Math.min(
      dismissDistance,
      (sheetRef.current?.getBoundingClientRect().height ?? 480) * 0.2,
    );
    const shouldDismiss =
      dragOffset >= distanceThreshold ||
      (dragOffset >= 20 && recentVelocity >= dismissVelocity);

    dragRef.current = null;
    setIsDragging(false);

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    if (shouldDismiss) {
      close();
    } else {
      setDragOffset(0);
    }
  }

  const backdropOpacity = isVisible
    ? Math.max(0.55, 1 - dragOffset / 500)
    : 0;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-end justify-center">
      <button
        type="button"
        aria-label={closeLabel}
        onClick={close}
        style={{ opacity: backdropOpacity }}
        className="absolute inset-0 bg-black/70 transition-opacity duration-200 ease-out motion-reduce:transition-none"
      />
      <section
        ref={sheetRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={ariaLabelledBy}
        style={{
          transform: isVisible
            ? `translateY(${dragOffset}px)`
            : "translateY(100%)",
        }}
        onPointerDown={beginDrag}
        onPointerMove={moveDrag}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onClick={(event) => {
          if (
            event.target instanceof Element &&
            event.target.closest("[data-bottom-sheet-close]")
          ) {
            close();
          }
        }}
        className={`relative z-10 w-full max-w-[var(--content-width)] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${isDragging ? "transition-none" : "transition-transform"} ${className}`}
      >
        {children}
      </section>
    </div>,
    document.body,
  );
}
