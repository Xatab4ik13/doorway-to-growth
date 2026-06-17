// Per-site media (showroom gallery, staff photo, video tour).
// Fallback used for any site without an explicit entry — the original BRANDOORS showroom.

import showroom1 from "@/assets/showroom/showroom-1.webp";
import showroom2 from "@/assets/showroom/showroom-2.webp";
import showroom3 from "@/assets/showroom/showroom-3.webp";
import showroom4 from "@/assets/showroom/showroom-4.webp";
import showroom5 from "@/assets/showroom/showroom-5.webp";
import showroom6 from "@/assets/showroom/showroom-6.webp";
import staffDefault from "@/assets/showroom/staff.webp";

import roomer1 from "@/assets/roomer/roomer-showroom-1.webp";
import roomer2 from "@/assets/roomer/roomer-showroom-2.webp";
import roomer3 from "@/assets/roomer/roomer-showroom-3.webp";
import roomer4 from "@/assets/roomer/roomer-showroom-4.webp";
import roomer5 from "@/assets/roomer/roomer-showroom-5.webp";
import roomerBuilding from "@/assets/roomer/roomer-building.webp";
import roomerStaff from "@/assets/roomer/roomer-staff.webp";
import roomerTour from "@/assets/roomer/roomer-tour.mp4";
import roomerHero from "@/assets/roomer/roomer-hero.webp";

export type SiteMedia = {
  gallery: Array<{ src: string; alt: string }>;
  staffPhoto: string;
  staffName?: string;
  staffPosition?: string;
  videoUrl?: string;
  videoPoster?: string;
};

const DEFAULT_MEDIA: SiteMedia = {
  gallery: [
    { src: showroom2, alt: "Зона консультации" },
    { src: showroom3, alt: "Экспозиция дверей BRANDOORS" },
    { src: showroom4, alt: "Коридор входных дверей" },
    { src: showroom5, alt: "Межкомнатные двери в шоуруме" },
    { src: showroom6, alt: "Основной зал шоурума" },
  ],
  staffPhoto: staffDefault,
  staffName: "Светлана",
  staffPosition: "Менеджер салона",
  videoUrl: "/showroom-video.mp4",
  videoPoster: showroom3,
};

const MEDIA_BY_SLUG: Record<string, SiteMedia> = {
  roomer: {
    gallery: [
      { src: roomer1, alt: "Вход в салон BRANDOORS в ТЦ ROOMER" },
      { src: roomer2, alt: "Зона консультации" },
      { src: roomer3, alt: "Межкомнатные двери в экспозиции" },
      { src: roomer4, alt: "Входная дверь BRANDOORS" },
      { src: roomer5, alt: "Классические двери в шоуруме" },
      { src: roomerBuilding, alt: "ТЦ ROOMER, Ленинская слобода" },
    ],
    staffPhoto: roomerStaff,
    staffName: "Менеджер",
    staffPosition: "Салон BRANDOORS в ROOMER",
    videoUrl: roomerTour,
    videoPoster: roomer3,
  },
};

export function getSiteMedia(slug?: string | null): SiteMedia {
  if (slug && MEDIA_BY_SLUG[slug]) return MEDIA_BY_SLUG[slug];
  return DEFAULT_MEDIA;
}
