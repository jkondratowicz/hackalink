module.exports = class HackathonMetadata {
  constructor(
    organizer,
    timestampStart,
    timestampEnd,
    judgingPeriod,
    name,
    url
  ) {
    this.organizer = organizer;
    this.timestampStart = timestampStart;
    this.timestampEnd = timestampEnd;
    this.judgingPeriod = judgingPeriod;
    this.name = name;
    this.url = url;
  }
};
