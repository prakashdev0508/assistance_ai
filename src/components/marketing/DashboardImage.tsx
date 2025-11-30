"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

export default function DashboardImage() {
  const [isVisible, setIsVisible] = useState(false);
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -100px 0px",
      }
    );

    if (imageRef.current) {
      observer.observe(imageRef.current);
    }

    return () => {
      if (imageRef.current) {
        observer.unobserve(imageRef.current);
      }
    };
  }, []);

  return (
    <section className="relative overflow-hidden bg-white py-12 md:-py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div
          ref={imageRef}
          className={`transition-all duration-1000 ease-out ${
            isVisible
              ? "translate-y-0 opacity-100"
              : "translate-y-12 opacity-0"
          }`}
        >
          <div className="relative mx-auto max-w-6xl rounded-2xl border border-black/10 bg-white p-4 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.3)] md:p-6">
            <div className="relative aspect-video w-full overflow-hidden rounded-xl">
              <Image
                src="/image.jpg"
                alt="Dashboard Preview"
                fill
                className="object-cover"
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1200px"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

