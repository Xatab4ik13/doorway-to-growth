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

import kashirsky1 from "@/assets/kashirsky/kashirsky-showroom-1.webp";
import kashirsky2 from "@/assets/kashirsky/kashirsky-showroom-2.webp";
import kashirsky3 from "@/assets/kashirsky/kashirsky-showroom-3.webp";
import kashirsky4 from "@/assets/kashirsky/kashirsky-showroom-4.webp";
import kashirsky5 from "@/assets/kashirsky/kashirsky-showroom-5.webp";
import kashirskyBuilding from "@/assets/kashirsky/kashirsky-building.webp";
import kashirskyStaff from "@/assets/kashirsky/kashirsky-staff.webp";
import kashirskyTour from "@/assets/kashirsky/kashirsky-tour.mp4";
import kashirskyHero from "@/assets/kashirsky/kashirsky-hero.webp";

import dekorator1 from "@/assets/dekorator/dekorator-showroom-1.webp";
import dekorator2 from "@/assets/dekorator/dekorator-showroom-2.webp";
import dekorator3 from "@/assets/dekorator/dekorator-showroom-3.webp";
import dekorator4 from "@/assets/dekorator/dekorator-showroom-4.webp";
import dekoratorBuilding from "@/assets/dekorator/dekorator-building.webp";
import dekoratorStaff from "@/assets/dekorator/dekorator-staff.webp";
import dekoratorTour from "@/assets/dekorator/dekorator-tour.mp4";
import dekoratorHero from "@/assets/dekorator/dekorator-hero.webp";



export type SiteMedia = {
  gallery: Array<{ src: string; alt: string }>;
  staffPhoto: string;
  staffName?: string;
  staffPosition?: string;
  videoUrl?: string;
  videoPoster?: string;
  heroImage?: string;
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
    heroImage: roomerHero,
  },
  kashirsky: {
    gallery: [
      { src: kashirsky1, alt: "Вход в салон BRANDOORS в ТК Каширский двор" },
      { src: kashirsky2, alt: "Экспозиция входных дверей" },
      { src: kashirsky3, alt: "Межкомнатные двери в шоуруме" },
      { src: kashirsky4, alt: "Линейка дверей разных цветов" },
      { src: kashirsky5, alt: "Дизайнерские двери с фотопечатью" },
      { src: kashirskyBuilding, alt: "ТК Каширский двор, павильон 4-А40" },
    ],
    staffPhoto: kashirskyStaff,
    staffName: "Менеджер",
    staffPosition: "Салон BRANDOORS Каширский двор",
    videoUrl: kashirskyTour,
    videoPoster: kashirsky2,
    heroImage: kashirskyHero,
  },
};

export function getSiteMedia(slug?: string | null): SiteMedia {
  if (slug && MEDIA_BY_SLUG[slug]) return MEDIA_BY_SLUG[slug];
  return DEFAULT_MEDIA;
}
