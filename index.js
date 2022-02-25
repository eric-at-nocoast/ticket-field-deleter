require("dotenv").config();
let axios = require("axios");

//Authorization needs to be base64 encoded to be accepted by Zendesk
const encodedToken = Buffer.from(
  `${process.env.ZD_USER}/token:${process.env.ZD_TOKEN}`
).toString("base64");

// This is the config that we use for making our api requests through axios. It will be reassigned with different data for the appropriate call using Object.assign
let config = {
  method: "get",
  url: process.env.ZD_URL + "/api/v2/ticket_fields.json",
  headers: {
    Authorization: `Basic ${encodedToken}`,
    "Content-Type": "application/json",
  },
};

const delay = (ms = 500) => new Promise((r) => setTimeout(r, ms));
//This slows down the script to make sure we don't hit rate limit issues

//This function receives the clean ticket field array with all matching ticket fields to be deleted. It then loops through the ticket fields deleting them one by one.
const fieldDeleter = async (arr) => {
  let deletedArr = [];
  for (i = 0; i < arr.length; i++) {
    await delay();
    let deleteId = JSON.stringify(arr[i]);

    Object.assign(config, {
      method: "delete",
      url: process.env.ZD_URL + `/api/v2/ticket_fields/${deleteId}`,
    });
    const resp = await axios(config);
    if (resp.status == 204) {
      let idDeleted = config.url.split("ticket_fields/")[1];
      deletedArr.push(idDeleted);
    }
  }
  return deletedArr;
};

//This function grabs a list of all the articles and then loops through them to the articleUpdater
const fieldSorter = async (fieldArr) => {
  //parsing the ticket id out of the response for use in updating the ticket
  let scrubbedArr = [];
  for (i = 0; i < fieldArr.length; i++) {
    let ticketField = fieldArr[i];
    //Have an exact timestamp you want to hit and not just the date? You can remove .split("T")[0]; to do this
    let cleandCreatedAt = ticketField.created_at.split("T")[0];

    // The date you'd like to match all ticket fields to
    let matchDate = "2022-01-17";
    //An array of titles to match to
    let matchTitleArr = ["example field 1", "example field 2"]
    
    //This checks to see if the current ticket fields title matches one listed in the line above
    let findTitle = matchTitleArr.find(
      (subject) => subject == ticketField.title
    );

    // If you want to just use the title or the created date you can remove one of the conditions below
    if (cleandCreatedAt === matchDate && findTitle != undefined) {
      scrubbedArr.push(ticketField.id);
    }
  }
  const response = await fieldDeleter(scrubbedArr);
  return response;
};

async function main() {
  const res = await axios(config);
  const fieldArr = res.data.ticket_fields;
  const results = await fieldSorter(fieldArr);
  console.log(`The following ticket fields have been deleted: ` + results);
}

main().catch((err) => {
  console.log(err);
});
