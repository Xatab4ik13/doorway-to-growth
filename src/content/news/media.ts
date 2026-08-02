/**
 * Реестр изображений для статей.
 * Только уже существующие в проекте ассеты — никакой генерации.
 */

import estetica from "@/assets/collections/estetica.webp";
import esteticaEmale from "@/assets/collections/estetica-emale.webp";
import ghost from "@/assets/collections/ghost.webp";
import heavy from "@/assets/collections/heavy.webp";
import maze from "@/assets/collections/maze.webp";
import prime from "@/assets/collections/prime.webp";
import kvartirnye from "@/assets/collections/kvartirnye.webp";
import ulichnye from "@/assets/collections/ulichnye.webp";

import doorEstetica from "@/assets/doors/interior-estetica.webp";
import doorGhost from "@/assets/doors/interior-ghost.webp";
import doorPrime from "@/assets/doors/interior-prime.webp";
import doorReflect from "@/assets/doors/interior-reflect.webp";
import doorArtdeco from "@/assets/doors/artdeco.webp";
import doorBauhaus from "@/assets/doors/bauhaus.webp";
import doorCapsule from "@/assets/doors/capsule.webp";
import doorHorizon from "@/assets/doors/horizon.webp";
import doorLines from "@/assets/doors/lines.webp";
import doorSmart from "@/assets/doors/smart.webp";

import coatingEnamel from "@/assets/materials/coating-enamel.jpg";
import coatingMetal from "@/assets/materials/coating-metal.jpg";
import coatingSofttouch from "@/assets/materials/coating-softtouch.jpg";
import coatingWood from "@/assets/materials/coating-wood.jpg";
import glassFrosted from "@/assets/materials/glass-frosted.jpg";
import glassLacobel from "@/assets/materials/glass-lacobel.jpg";
import glassMirror from "@/assets/materials/glass-mirror.jpg";

import handleMorelli from "@/assets/accessories/handle-morelli.png";
import handleRenz from "@/assets/accessories/handle-renz.png";
import hingesConcealed from "@/assets/accessories/hinges-concealed.png";
import lockMagnetic from "@/assets/accessories/lock-magnetic.png";
import lockBathroom from "@/assets/accessories/lock-bathroom.png";
import trimTelescopic from "@/assets/accessories/trim-casing-telescopic.png";
import trimStraight from "@/assets/accessories/trim-casing-straight.png";
import extenderTelescopic from "@/assets/accessories/trim-extender-telescopic.png";

import catEntrance from "@/assets/categories/entrance-doors.png";
import catInterior from "@/assets/categories/interior-doors.png";
import catFurnitura from "@/assets/categories/furnitura.png";
import catPogonazh from "@/assets/categories/pogonazh.png";

import showroom1 from "@/assets/showroom/showroom-1.webp";
import showroom2 from "@/assets/showroom/showroom-2.webp";
import showroom3 from "@/assets/showroom/showroom-3.webp";
import showroom4 from "@/assets/showroom/showroom-4.webp";
import showroom5 from "@/assets/showroom/showroom-5.webp";
import showroom6 from "@/assets/showroom/showroom-6.webp";

import kashirskyShowroom1 from "@/assets/kashirsky/kashirsky-showroom-1.webp";
import kashirskyShowroom2 from "@/assets/kashirsky/kashirsky-showroom-2.webp";
import kashirskyShowroom3 from "@/assets/kashirsky/kashirsky-showroom-3.webp";
import kashirskyShowroom4 from "@/assets/kashirsky/kashirsky-showroom-4.webp";
import roomerShowroom1 from "@/assets/roomer/roomer-showroom-1.webp";
import roomerShowroom2 from "@/assets/roomer/roomer-showroom-2.webp";
import roomerShowroom3 from "@/assets/roomer/roomer-showroom-3.webp";
import roomerShowroom4 from "@/assets/roomer/roomer-showroom-4.webp";
import dekoratorShowroom1 from "@/assets/dekorator/dekorator-showroom-1.webp";
import dekoratorShowroom2 from "@/assets/dekorator/dekorator-showroom-2.webp";
import dekoratorShowroom3 from "@/assets/dekorator/dekorator-showroom-3.webp";
import dekoratorShowroom4 from "@/assets/dekorator/dekorator-showroom-4.webp";
import m2Showroom1 from "@/assets/m2/m2-showroom-1.webp";
import m2Showroom2 from "@/assets/m2/m2-showroom-2.webp";
import m2Showroom3 from "@/assets/m2/m2-showroom-3.webp";

export const NEWS_MEDIA: Record<string, string> = {
  "collection-estetica": estetica,
  "collection-estetica-emale": esteticaEmale,
  "collection-ghost": ghost,
  "collection-heavy": heavy,
  "collection-maze": maze,
  "collection-prime": prime,
  "collection-kvartirnye": kvartirnye,
  "collection-ulichnye": ulichnye,

  "door-estetica": doorEstetica,
  "door-ghost": doorGhost,
  "door-prime": doorPrime,
  "door-reflect": doorReflect,
  "door-artdeco": doorArtdeco,
  "door-bauhaus": doorBauhaus,
  "door-capsule": doorCapsule,
  "door-horizon": doorHorizon,
  "door-lines": doorLines,
  "door-smart": doorSmart,

  "coating-enamel": coatingEnamel,
  "coating-metal": coatingMetal,
  "coating-softtouch": coatingSofttouch,
  "coating-wood": coatingWood,
  "glass-frosted": glassFrosted,
  "glass-lacobel": glassLacobel,
  "glass-mirror": glassMirror,

  "handle-morelli": handleMorelli,
  "handle-renz": handleRenz,
  "hinges-concealed": hingesConcealed,
  "lock-magnetic": lockMagnetic,
  "lock-bathroom": lockBathroom,
  "trim-telescopic": trimTelescopic,
  "trim-straight": trimStraight,
  "extender-telescopic": extenderTelescopic,

  "category-entrance": catEntrance,
  "category-interior": catInterior,
  "category-furnitura": catFurnitura,
  "category-pogonazh": catPogonazh,

  "showroom-1": showroom1,
  "showroom-2": showroom2,
  "showroom-3": showroom3,
  "showroom-4": showroom4,
  "showroom-5": showroom5,
  "showroom-6": showroom6,

  "kashirsky-1": kashirskyShowroom1,
  "kashirsky-2": kashirskyShowroom2,
  "kashirsky-3": kashirskyShowroom3,
  "kashirsky-4": kashirskyShowroom4,
  "roomer-1": roomerShowroom1,
  "roomer-2": roomerShowroom2,
  "roomer-3": roomerShowroom3,
  "roomer-4": roomerShowroom4,
  "dekorator-1": dekoratorShowroom1,
  "dekorator-2": dekoratorShowroom2,
  "dekorator-3": dekoratorShowroom3,
  "dekorator-4": dekoratorShowroom4,
  "m2-1": m2Showroom1,
  "m2-2": m2Showroom2,
  "m2-3": m2Showroom3,
};

export function newsImage(key: string | undefined): string | undefined {
  if (!key) return undefined;
  return NEWS_MEDIA[key];
}
