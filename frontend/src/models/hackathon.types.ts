import BigNumber from 'bignumber.js';

export enum HackathonStage {
  NEW,
  STARTED,
  JUDGING,
  FINALIZED,
}

export class HackathonPrize {
  id: BigNumber;
  reward: BigNumber;
  judges: string[];
  name: string;
  description: string;
  // submissions;
  // winner: string;

  constructor(id: number, prizeData: any[]) {
    this.id = new BigNumber(id);
    this.reward = new BigNumber(prizeData[0]);
    this.judges = prizeData[1];
    this.name = prizeData[2];
    this.description = prizeData[3];
    // this.submissions = prizeData[4];
    // this.winner = prizeData[5];
  }
}

export class HackathonMetadata {
  id: BigNumber;
  organizer: string;
  timestampStart: number;
  timestampEnd: number;
  judgingPeriod: number;
  stage: HackathonStage;
  name: string;
  url: string;
  balance: BigNumber;

  prizes?: HackathonPrize[];

  constructor(hackathonId: string, metadata: string[]) {
    this.id = new BigNumber(hackathonId);
    this.organizer = metadata[0];
    this.timestampStart = parseInt(metadata[1], 10);
    this.timestampEnd = parseInt(metadata[2], 10);
    this.judgingPeriod = parseInt(metadata[3], 10);
    this.stage = parseInt(metadata[4], 10) as HackathonStage;
    this.name = metadata[5];
    this.url = metadata[6];
    this.balance = new BigNumber(metadata[7]);
  }
}

export interface CreateHackathonData {
  timestampStart: number;
  timestampEnd: number;
  judgingPeriod: number;
  name: string;
  url: string;
}
