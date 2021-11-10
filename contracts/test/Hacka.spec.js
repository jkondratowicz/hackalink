const { expect } = require('chai');
const chai = require('chai');
const BN = require('bn.js');
const moment = require('moment');
require('mocha-skip-if');
const { ethers } = require('hardhat');
chai.use(require('chai-bn')(BN));
const { deployments, getChainId } = require('hardhat');
const { developmentChains } = require('../helper-hardhat-config');
const {
  constants: { ZERO_ADDRESS },
} = require('@openzeppelin/test-helpers');
const { setTimeout } = require('timers/promises');
const HackathonMetadata = require('./fixtures/HackathonMetadata');

skip
  .if(!developmentChains.includes(network.name))
  .describe('Hacka Unit Tests', async function () {
    let contract, accounts;

    beforeEach(async () => {
      await deployments.fixture(['mocks', 'hacka']);
      const Hacka = await deployments.get('Hacka');
      contract = await ethers.getContractAt('Hacka', Hacka.address);
      accounts = await ethers.getSigners();
    });

    it('should create hackathons', async () => {
      // given
      const organizer1 = accounts[0];
      const organizer2 = accounts[1];

      let hackathon = await contract.s_hackathons(0);
      expect(hackathon[0]).to.equal(ZERO_ADDRESS);

      const h1MetaData = new HackathonMetadata(
        organizer1,
        moment().add(2, 'days').unix(),
        moment().add(12, 'days').unix(),
        3,
        'Hackathon Name',
        'https://fake.url.hacka.link'
      );

      const h2MetaData = new HackathonMetadata(
        organizer2,
        moment().add(3, 'days').unix(),
        moment().add(13, 'days').unix(),
        4,
        'Hackathon Name 2',
        'https://more.fake.url.hacka.link'
      );

      // when
      const h1tx = await contract
        .connect(h1MetaData.organizer)
        .createHackathon(
          h1MetaData.timestampStart,
          h1MetaData.timestampEnd,
          h1MetaData.name,
          h1MetaData.url,
          h1MetaData.judgingPeriod
        );
      const h1r = await h1tx.wait();

      const h2tx = await contract
        .connect(h2MetaData.organizer)
        .createHackathon(
          h2MetaData.timestampStart,
          h2MetaData.timestampEnd,
          h2MetaData.name,
          h2MetaData.url,
          h2MetaData.judgingPeriod
        );
      const h2r = await h2tx.wait();

      // then for hackathon 1
      expect(h1r?.events?.length).to.equal(1);
      expect(h1r.events[0].event).to.equal('HackathonCreated');
      expect(h1r.events[0].args?.[0].toNumber()).to.equal(0);
      expect(h1r.events[0].args?.[1]).to.equal(h1MetaData.organizer.address);
      expect(h1r.events[0].args?.[2]).to.equal(h1MetaData.name);
      expect(h1r.events[0].args?.[3]).to.equal(h1MetaData.url);
      expect(h1r.events[0].args?.[4].toNumber()).to.equal(h1MetaData.timestampStart);

      hackathon = await contract.s_hackathons(0);
      expect(hackathon?.organizer).to.equal(h1MetaData.organizer.address);
      expect(hackathon?.timestampStart).to.equal(h1MetaData.timestampStart);
      expect(hackathon?.timestampEnd).to.equal(h1MetaData.timestampEnd);
      expect(hackathon?.judgingPeriod).to.equal(h1MetaData.judgingPeriod);
      expect(hackathon?.stage).to.equal(0); // NEW
      expect(hackathon?.name).to.equal(h1MetaData.name);
      expect(hackathon?.url).to.equal(h1MetaData.url);
      expect(hackathon?.balance).to.equal(0);

      // then for hackathon 2
      expect(h2r?.events?.length).to.equal(1);
      expect(h2r.events[0].event).to.equal('HackathonCreated');
      expect(h2r.events[0].args?.[0].toNumber()).to.equal(1);
      expect(h2r.events[0].args?.[1]).to.equal(h2MetaData.organizer.address);
      expect(h2r.events[0].args?.[2]).to.equal(h2MetaData.name);
      expect(h2r.events[0].args?.[3]).to.equal(h2MetaData.url);
      expect(h2r.events[0].args?.[4].toNumber()).to.equal(h2MetaData.timestampStart);

      hackathon = await contract.s_hackathons(1);
      expect(hackathon?.organizer).to.equal(h2MetaData.organizer.address);
      expect(hackathon?.timestampStart).to.equal(h2MetaData.timestampStart);
      expect(hackathon?.timestampEnd).to.equal(h2MetaData.timestampEnd);
      expect(hackathon?.judgingPeriod).to.equal(h2MetaData.judgingPeriod);
      expect(hackathon?.stage).to.equal(0); // NEW
      expect(hackathon?.name).to.equal(h2MetaData.name);
      expect(hackathon?.url).to.equal(h2MetaData.url);
      expect(hackathon?.balance).to.equal(0);
    });
  });
