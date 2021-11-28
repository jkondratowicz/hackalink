import MoralisType from 'moralis';
import { HackathonSubmission } from './hackathon.types';

export async function getAllPrizeSubmissions(Moralis: MoralisType, hackathonId: string, prizeId: string): Promise<HackathonSubmission[]> {
  try {
    const HackathonSubmissionAddedPrize = Moralis.Object.extend('HackathonSubmissionAddedPrize');
    const HackathonSubmissionCreated = Moralis.Object.extend('HackathonSubmissionCreated');
    const query = new Moralis.Query(HackathonSubmissionAddedPrize);
    query.equalTo('hackathonId', hackathonId);
    query.equalTo('prizeId', prizeId);
    const results: any[] = await query.find();
    const submissionIds = results.map((row) => row.get('submissionId'));

    const submissions: HackathonSubmission[] = [];
    console.log(submissionIds);
    for (const submissionId of submissionIds) {
      const subquery = new Moralis.Query(HackathonSubmissionCreated);
      subquery.equalTo('hackathonId', hackathonId);
      subquery.equalTo('submissionId', submissionId);
      const submission = await subquery.first();
      if (!submission) {
        continue;
      }

      let descriptionContent;
      try {
        descriptionContent = await getDescriptionFromIPFS(submission.get('description'));
      } catch(e) {
        console.log('Could not find file in IPFS');
        descriptionContent = submission.get('description');
      }

      submissions.push(
        new HackathonSubmission(submissionId, [submission.get('participant'), submission.get('name'), descriptionContent, submission.get('hackathonId')])
      );
    }

    return submissions;
  } catch (e) {
    // TODO def needs better error handling...
    console.error(e);
    return [];
  }
}

export const getDescriptionFromIPFS = async (cid: string): Promise<string> => {
  console.log(`Fetching ${cid} from IPFS`);
  const res = await fetch(`https://${cid}.ipfs.dweb.link`);
  if (!res || !res.ok) {
    throw new Error(`Error getting cid ${cid}: [${res?.status}] ${res?.statusText}`);
  }
  return res.json();
};
