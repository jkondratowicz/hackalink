import MoralisType from 'moralis';
import * as HackaABI from '../contracts/Hacka.json';
import { HackathonMetadata, HackathonPrize } from './hackathon.types';
import moment from 'moment';

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
    const HackathonPrizeCreated = Moralis.Object.extend("HackathonPrizeCreated");
    const HackathonPrizeJudgeAdded = Moralis.Object.extend("HackathonPrizeJudgeAdded");
    const query = new Moralis.Query(HackathonPrizeCreated);
    query.equalTo('hackathonId', hackathon.id);
    const results: any[] = await query.find();

    if (!hackathon.prizes) {
      hackathon.prizes = [];
    }

    for (const row of results) {
      const judgeQuery = new Moralis.Query(HackathonPrizeJudgeAdded);
      judgeQuery.equalTo('hackathonId', hackathon.id);
      judgeQuery.equalTo('prizeId', row.get('prizeId'));
      const judges = (await judgeQuery.find()).map((row) => row.get('judge'));

      hackathon.prizes.push(new HackathonPrize(row.get('prizeId'), [
        row.get('reward'),
        judges,
        row.get('name'),
        row.get('description'),
      ]));
    }

    return hackathon;
  } catch (e) {
    // TODO def needs better error handling...
    console.error(e);
    return hackathon;
  }
}

export async function getAllHackathons(Moralis: MoralisType): Promise<HackathonMetadata[]> {
  try {
    const HackathonMetadataMoralis = Moralis.Object.extend("HackathonMetadata");
    const query = new Moralis.Query(HackathonMetadataMoralis);
    const results: any[] = await query.find();
    const response = [];
    for (const row of results) {
      response.push(new HackathonMetadata(row.get('hackathonId'), [
        row.get('organizer'),
        moment(row.get('timestampStart')).unix(),
        moment(row.get('timestampEnd')).unix(),
        row.get('judgingPeriod'),
        row.get('stage'),
        row.get('name'),
        row.get('url'),
      ]));
    }

    return response;
  } catch (e) {
    // TODO def needs better error handling...
    console.error(e);
    return [];
  }
}

export async function getJudgesHackathons(Moralis: MoralisType, address: string): Promise<HackathonPrize[]> {
  try {
    const HackathonPrizeJudgeAdded = Moralis.Object.extend("HackathonPrizeJudgeAdded");
    const HackathonPrizeCreated = Moralis.Object.extend("HackathonPrizeCreated");
    const HackathonMetadataMoralis = Moralis.Object.extend("HackathonMetadata");
    const query = new Moralis.Query(HackathonPrizeJudgeAdded);
    query.equalTo('judge', address);
    const results: any[] = await query.find();
    const response: HackathonPrize[] = [];
    for (const row of results) {
      const queryHackathon = new Moralis.Query(HackathonMetadataMoralis);
      queryHackathon.equalTo('hackathonId', row.get('hackathonId'));
      const hackathon = await queryHackathon.first();
      if (!hackathon) {
        throw new Error('Hackathon not found');
      }

      const hackathonInstance = new HackathonMetadata(hackathon.get('hackathonId'), [
        hackathon.get('organizer'),
        moment(hackathon.get('timestampStart')).unix(),
        moment(hackathon.get('timestampEnd')).unix(),
        hackathon.get('judgingPeriod'),
        hackathon.get('stage'),
        hackathon.get('name'),
        hackathon.get('url'),
      ]);

      const queryPrize = new Moralis.Query(HackathonPrizeCreated);
      queryPrize.equalTo('hackathonId', row.get('hackathonId'));
      queryPrize.equalTo('prizeId', row.get('prizeId'));
      const prize = await queryPrize.first();
      if (!prize) {
        throw new Error('Prize not found');
      }
      const prizeInstance: HackathonPrize = new HackathonPrize(prize.get('prizeId'), [
        prize.get('reward'),
        [address],
        prize.get('name'),
        prize.get('description'),
      ]);
      prizeInstance.hackathon = hackathonInstance;
      response.push(prizeInstance);
    }

    return response;
  } catch (e) {
    // TODO def needs better error handling...
    console.error(e);
    return [];
  }
}
