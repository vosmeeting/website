import ajl from './sponsor-logos/ajl.png';
import anVision from './sponsor-logos/an_vision.png';
import bl from './sponsor-logos/bl.png';
import ecfa from './sponsor-logos/ecfa.png';
import mst from './sponsor-logos/mst.png';
import dioptrix from './sponsor-logos/dioptrix.png';
import sentrx from './sponsor-logos/sentrx.png';
import xoran from './sponsor-logos/xoran.png';
import vosm1 from './vosm-images/vosm-1.png';
import vosm2 from './vosm-images/vosm-2.png';
import vosm3 from './vosm-images/vosm-3.png';
import vosm4 from './vosm-images/vosm-4.png';
import vosm5 from './vosm-images/vosm-5.png';
import vosm6 from './vosm-images/vosm-6.png';
import vosm7 from './vosm-images/vosm-7.png';
import vosm8 from './vosm-images/vosm-8.png';
import { groupBy } from 'lodash';

class Medal {
  constructor(public name: string, public value: number) {}
}

type Sponsor = {
  name: string;
  medal: Medal | null;
  staticImageData: StaticImageData | null;
};

let [Prime, Platinum, Gold, Silver, Bronze] = ['prime', 'platinum', 'gold', 'silver', 'bronze'].map(
  (name, index) => new Medal(name, index)
);

export class SponsorRepo {
  _sponsors: Sponsor[] = [
    { name: 'AJL', medal: Silver, staticImageData: ajl },
    { name: 'Animal Necessity', medal: null, staticImageData: null },
    { name: 'An-Vision', medal: Bronze, staticImageData: anVision },
    { name: 'B&L', medal: Prime, staticImageData: bl },
    { name: 'ECFA', medal: Silver, staticImageData: ecfa },
    { name: 'MST', medal: Platinum, staticImageData: mst },
    { name: 'DIOPTRIX', medal: Gold, staticImageData: dioptrix },
    { name: 'SENTRX', medal: Gold, staticImageData: sentrx },
    { name: 'XORAN TECHNOLOGIES', medal: Bronze, staticImageData: xoran }
  ];
  baseUrl = '/sponsor-logos';

  get sponsors() {
    return this._sponsors.filter((s) => s.medal);
  }

  get sponsorsGroupedByType() {
    const result = Object.entries(groupBy<Sponsor[]>(this.sponsors, 'medal.name'))
      .map(([medalName, sponsors]) => [(sponsors[0] as Sponsor).medal, sponsors])
      .sort(([medal], [medal2]) => (medal as Medal).value - (medal2 as Medal).value);

    return result as [Medal, Sponsor[]][];
  }
}

export const images = [
  { url: vosm1 },
  { url: vosm2 },
  { url: vosm3 },
  { url: vosm4 },
  { url: vosm5 },
  { url: vosm6 },
  { url: vosm7 },
  { url: vosm8 }
].map((data) => ({ url: data.url.src }));
