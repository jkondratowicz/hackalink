Moralis.Cloud.define("getOrganizedHackathons", async (request) => {
  const query = new Moralis.Query("hackathons");
  query.equalTo("organizer", request.params.organizer);
  return query.find().then((results) => results.map((row) => ({
    id: row.get("hackathonId"),
    name: row.get("name"),
  })));
});
