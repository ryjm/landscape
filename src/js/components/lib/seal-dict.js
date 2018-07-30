import Seals from '/vendor/seals-0.1.1';

export class SealDict {
  constructor() {
    this.dict = {};
  }

  getSeal(patp, size) {
    let key = `${patp}+${size}`;

    if (!this.dict[key]) {
      this.dict[key] = Seals.pourReact(patp, size)
    }

    return this.dict[key];
  }
}

const sealDict = new SealDict;
export { sealDict }
