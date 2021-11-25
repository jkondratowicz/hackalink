const HackathonMetadata = Moralis.Object.extend("HackathonMetadata");

Moralis.Cloud.afterSave("HackathonCreated", async (request) => {
  const logger = Moralis.Cloud.getLogger();
  logger.info("Creating hackathon " + request.object.get("hackathonId"));

  const query = new Moralis.Query("HackathonMetadata");
  query.equalTo("hackathonId", request.object.get("hackathonId"));
  const existingHackathon = await query.first();
  if (existingHackathon) {
    logger.error(`Hackathon ${request.object.get("hackathonId")} already exists`);
    return;
  }

  const hackathon = new HackathonMetadata();
  // uint indexed hackathonId, address indexed organizer, string name, string url, uint timestampStart
  hackathon.set("hackathonId", request.object.get("hackathonId"));
  hackathon.set("organizer", request.object.get("organizer"));
  hackathon.set("stage", 0);
  hackathon.set("name", request.object.get("name"));
  hackathon.set("url", request.object.get("url"));
  hackathon.set(
    "timestampStart",
    new Date(parseInt(request.object.get("timestampStart"), 10) * 1000)
  );
  hackathon.set(
    "timestampEnd",
    new Date(parseInt(request.object.get("timestampEnd"), 10) * 1000)
  );
  hackathon.set("judgingPeriod", request.object.get("judgingPeriod"));

  try {
    await hackathon.save();
    return hackathon;
  } catch (e) {
      logger.error("Got an error " + error.code + " : " + error.message);
  }
});

Moralis.Cloud.afterSave("HackathonChanged", async (request) => {
  const logger = Moralis.Cloud.getLogger();
  logger.info("Updating hackathon " + request.object.get("hackathonId"));
  const query = new Moralis.Query("HackathonMetadata");
  query.equalTo("hackathonId", request.object.get("hackathonId"));
  const hackathon = await query.first();
  if (!hackathon) {
    logger.error("Hackathon not found: " + request.object.get("hackathonId"));
    return;
  }

  hackathon.set("name", request.object.get("name"));
  hackathon.set("url", request.object.get("url"));
  hackathon.set(
    "timestampStart",
    new Date(parseInt(request.object.get("timestampStart"), 10) * 1000)
  );
  hackathon.set(
    "timestampEnd",
    new Date(parseInt(request.object.get("timestampEnd"), 10) * 1000)
  );
  hackathon.set("judgingPeriod", request.object.get("judgingPeriod"));
  return hackathon.save();
});


Moralis.Cloud.afterSave("HackathonStageChanged", async (request) => {
  // event HackathonStageChanged(uint indexed hackathonId, HackathonStage previousStage, HackathonStage newStage);
  const logger = Moralis.Cloud.getLogger();
  logger.info(`Hackathon stage changed; hackathon=${request.object.get("hackathonId")}, newStage=${request.object.get("newStage")}`);

  const query = new Moralis.Query("HackathonMetadata");
  query.equalTo("hackathonId", request.object.get("hackathonId"));
  const hackathon = await query.first();
  if (!hackathon) {
    logger.error("Hackathon not found: " + request.object.get("hackathonId"));
    return;
  }

  if (parseInt(hackathon.get("stage"), 10) >= parseInt(request.object.get("newStage"), 10)) {
    logger.info("Stage already changed, nothing to do.");
    return;
  }

  hackathon.set("stage", parseInt(request.object.get("newStage"), 10));
  return hackathon.save();
});
