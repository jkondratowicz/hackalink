import MoralisType from 'moralis';
import * as HackaABI from '../contracts/Hacka.json';
import { HackathonMetadata, HackathonPrize } from './hackathon.types';

export async function getHackathonsByOrganizer(Moralis: MoralisType, organizer: string): Promise<HackathonMetadata[]> {
  try {
    const options = {
      chain: process.env.REACT_APP_CHAIN_ID,
      address: HackaABI.address,
      function_name: 'getHackathonsByOrganizer',
      abi: HackaABI.abi,
      params: {
        _organizer: organizer,
      },
    };
    // @ts-ignore
    const hackathonIds = await Moralis.Web3API.native.runContractFunction(options);
    if (!hackathonIds.length) {
      return [];
    }

    const results = [];
    for (const hackathonId of hackathonIds) {
      const optionsHackathonMetadata = {
        chain: process.env.REACT_APP_CHAIN_ID,
        address: HackaABI.address,
        function_name: 'getHackathonMetadata',
        abi: HackaABI.abi,
        params: {
          _hackathonId: hackathonId,
        },
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
    });
    return results;
  } catch (e) {
    // TODO def needs better error handling...
    console.error(e);
    return [];
  }
}

export async function getHackathonPrizes(Moralis: MoralisType, hackathon: HackathonMetadata): Promise<HackathonMetadata> {
  try {
    const options = {
      chain: process.env.REACT_APP_CHAIN_ID,
      address: HackaABI.address,
      function_name: 'getHackathonPrizes',
      abi: HackaABI.abi,
      params: {
        _hackathonId: hackathon.id,
      },
    };
    // @ts-ignore
    const prizes = await Moralis.Web3API.native.runContractFunction(options);
    if (!prizes.length) {
      return hackathon;
    }

    hackathon.prizes = [];

    for (let i = 0; i < prizes.length; i++) {
      const prize = prizes[i];
      if (!Array.isArray(prize) || prize.length !== 6) {
        continue;
      }
      hackathon.prizes.push(new HackathonPrize(i, prize));
    }

    return hackathon;
  } catch (e) {
    // TODO def needs better error handling...
    console.error(e);
    return hackathon;
  }
}
