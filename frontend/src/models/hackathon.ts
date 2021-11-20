import MoralisType from "moralis";
import BigNumber from "bignumber.js";
import * as HackaABI from '../contracts/Hacka.json';

export enum HackathonStage {
  NEW,
  STARTED,
  JUDGING,
  FINALIZED
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

  constructor(hackathonId: string, metadata: string[]) {
    this.id = new BigNumber(hackathonId);
    this.organizer = metadata[0];
    this.timestampStart = parseInt(metadata[1], 10);
    this.timestampEnd = parseInt(metadata[2], 10);
    this.judgingPeriod = parseInt(metadata[3], 10);
    this.stage = parseInt(metadata[4], 10) as HackathonStage;
    this.name = metadata[5];
    this.url = metadata[6]
    this.balance = new BigNumber(metadata[7]);
  }
}

export async function getHackathonsByOrganizer(Moralis: MoralisType, organizer: string): Promise<any[]> {
  try {
    const options = {
      chain: process.env.REACT_APP_CHAIN_ID,
      address: HackaABI.address,
      function_name: "getHackathonsByOrganizer",
      abi: HackaABI.abi,
      params: {
        _organizer: organizer,
      }
    };
    // @ts-ignore
    const hackathonIds = (await Moralis.Web3API.native.runContractFunction(options));
    if (!hackathonIds.length) {
      return [];
    }

    const results = [];
    for (const hackathonId of hackathonIds) {
      const optionsHackathonMetadata = {
        chain: process.env.REACT_APP_CHAIN_ID,
        address: HackaABI.address,
        function_name: "getHackathonMetadata",
        abi: HackaABI.abi,
        params: {
          _hackathonId: hackathonId,
        }
      };
      // @ts-ignore
      const hackathonMetaData = await Moralis.Web3API.native.runContractFunction(optionsHackathonMetadata);
      if (!Array.isArray(hackathonMetaData) || hackathonMetaData.length !== 8) {
        continue;
      }
      results.push(new HackathonMetadata(hackathonId, hackathonMetaData));
    }
    results.sort((a, b) => {
      if (a.stage !== b.stage) {
        return a.stage - b.stage;
      }

      return a.timestampStart - b.timestampStart;
    })
    return results;
  } catch(e) {
    // TODO def needs better error handling...
    console.error(e);
    return [];
  }
}
