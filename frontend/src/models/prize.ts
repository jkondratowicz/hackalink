import MoralisType from 'moralis';
import { HackathonMetadata, HackathonPrize, HackathonSubmission } from './hackathon.types';
import moment from 'moment';
import * as HackaABI from '../contracts/Hacka.json';

export async function getAllPrizeSubmissions(Moralis: MoralisType, hackathonId: string, prizeId: string): Promise<any[]> {
  try {
    const HackathonSubmissionAddedPrize = Moralis.Object.extend("HackathonSubmissionAddedPrize");
    const HackathonSubmissionCreated = Moralis.Object.extend("HackathonSubmissionCreated");
    const query = new Moralis.Query(HackathonSubmissionAddedPrize);
    query.equalTo('hackathonId', hackathonId);
    query.equalTo('prizeId', prizeId);
    const results: any[] = await query.find();
    const submissionIds = results.map((row) => row.get('submissionId'));

    const submissions: HackathonSubmission[] = [];

    for (const submissionId of submissionIds) {
      const subquery = new Moralis.Query(HackathonSubmissionCreated);
      subquery.equalTo('hackathonId', hackathonId);
      subquery.equalTo('submissionId', submissionId);
      const submission = await subquery.first();
      if (!submission) {
        continue;
      }

      submissions.push(new HackathonSubmission(submissionId, [
        submission.get('participant'),
        submission.get('name'),
        submission.get('description'),
        submission.get('hackathonId'),
      ]));
    }

    return submissions;
  } catch (e) {
    // TODO def needs better error handling...
    console.error(e);
    return [];
  }
}
