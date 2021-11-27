import { ByMoralis, useMoralis } from 'react-moralis';
import { Container } from 'semantic-ui-react';
import React from 'react';

export function HomePage() {
  const { isAuthenticated, user } = useMoralis();
  return (
    <Container>
      {isAuthenticated && user ? (
        <>
          <h1>Welcome back!</h1>
        </>
      ) : (
        <>
          <h1>Welcome!</h1>
          <p>Please sign in using the button in the top right to use the dApp.</p>
        </>
      )}
      <hr />
      <h3>What is Hacka.link?</h3>
      <p>
        In short, Hacka.link is a dApp for organizing hackathons. As any dApp, it runs on blockchain and ensures full automation, security, transparency and fairness.
      </p>
      <p>
        Hacka.link was built during Chainlink 2021 Fall Hackathon and is currently <strong>not</strong> production ready, so it should not be used on mainnet with actual resources. What you're seeing is a minimalistic, yet fully functional MVP. It's a solo project, so with limited time and resources this is the best I could do within the time constraints, but I'm very proud of it. It's been an awesome journey of learning for me.
      </p>
      <hr />
      <h3>How does it work?</h3>
      <p>
        There are three user types in Hacka.link. Each user is identified by a wallet, that is used to sign in (via Moralis). One user may of course have more than role, for example organize one hackathon and participate in another one. The three soles are:
      </p>
      <ol>
        <li><strong>Organizer</strong> creates a hackathon, sets up its rules, prizes and judges.</li>
        <li><strong>Judge</strong> is someone selected by the Organizer to judge project submitted for a given prize.</li>
        <li><strong>Participant</strong> is someone who decides to participate in the hackathon, submit a project and potentially win prizes.</li>
      </ol>
      <p>A typical lifecycle of a hackathon would be something like this:</p>
      <ol>
        <li>Organizer creates a hackathon, setting its name, description, date it starts and ends, length of the judging period.</li>
        <li>Organizer adds one or more prizes to the hackathon.</li>
        <li>For each prize, organizer adds one or more judge.</li>
        <li>Once the hackathon's start date comes, Chainlink Keepers kick it off. During this time participants may submit their project.</li>
        <li>Before the hackathon ends, participants submit their projects and choose which prizes they want to compete for.</li>
        <li>When the hackathon's end date comes, Chainlink Keepers close it for submissions and the judging period starts.</li>
        <li>During the judging period, judges review all submissions eligible for their respective prizes and score them between 0 and 5.</li>
        <li>When the judging period ends, Chainlink Keepers finalize the hackathon. Based on judges' scores, the winner is selected for each prize and it's paid out to the participant's address.</li>
      </ol>
      <hr />
      <h3>Future development</h3>
      <p>While Hacka.link is functional, it is far from being production ready. There are numerous things to be done like proper test coverage, any bugfixes necessary, audits etc. before it could go live. I also have a list of some really cool ideas for features that I just didn't have the time to implement. Here's a sample of those ideas:</p>
      <ul>
        <li>
          <strong>Project idea hub</strong> - some people come into hackathons with an awesome idea, but no technical skills to execute. Some come in with developer background, but don't know what to submit. Hacka.link could provide mechanisms for voting on best ideas submitted by the community and semi-automatic teambuilding, with incentives for both developers and people who suggested best project ideas.
        </li>
        <li>
          <strong>Sponsors</strong> - currently the organizer provides funds for all prizes, as well as determines judges. In the future, hackathons could be open for sponsors who could set up their own prizes.
        </li>
        <li>
          <strong>Different prize types</strong> - currently the prizes have a simple "winner takes all" rule. There could be different types of prizes, for example pooled prize where each eligible submission wins a portion of the pool; or a tiered prize where first place winner gets x%, 2nd place y% etc.
        </li>
        <li>
          <strong>Community prizes</strong> - participants would vote on their favorite submissions, selecting "community prize winners". Possibly this would require using our own token to prevent sybil attacks.
        </li>
        <li>
          <strong>Multi chain</strong> - currently the dApp is deployed to Eth Kovan testnet only. It would be great to run on many chains, especially considering Ethereum mainnet is currently not a viable environment for such a dApp due to huge fees.
        </li>
        <li>
          <strong>IPFS for storage</strong> - instead of just submitting a markdown file as a description, participants could actually submit all of their work (code, video explainer etc.) to IPFS.
        </li>
      </ul>
      <hr />
      <h3>Acknowledgements</h3>
      <p>
        This project would not exist without:
      </p>
      <ul>
        <li>Chainlink Labs, who are the organizers of this hackathon and provide incredible services like Keepers (which this project relies on).</li>
        <li>Lovely people, who provided awesome workshops during this hackathon, especially:
          <ul>
            <li>Patrick Collins</li>
            <li>Solange Gueiros</li>
            <li>Harry Papacharissiou</li>
            <li>Stephen Fluin</li>
          </ul>
        </li>
        <li>Moralis, who provide an awesome framework for web3 development (which this project heavy relies on). Also thanks for answering my multiple questions on Discord :)</li>
      </ul>
      <hr />
      <ByMoralis width={200} variant="dark" />
    </Container>
  );
}
