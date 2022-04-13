const assert = require("assert");
const ganache = require("ganache-cli");
const Web3 = require("web3");
const web3 = new Web3(ganache.provider());

const compiledFactory = require("../ethereum/build/CampaginFactory.json");
const compiledCampaign = require("../ethereum/build/Campaign.json");

let accounts;
let factory;
let campaignAddress;
let campaign;

beforeEach(async () => {
  accounts = await web3.eth.getAccounts();

  factory = await new web3.eth.Contract(JSON.parse(compiledFactory.interface))
    .deploy({ data: compiledFactory.bytecode })
    .send({ from: accounts[0], gas: "1000000" });

  await factory.methods
    .createCampaign("100")
    .send({ from: accounts[0], gas: "1000000" });

  // add first address in the deployed array and assign to variable
  [campaignAddress] = await factory.methods.getDeployedCampaigns().call();

  // if contract already deployed, then address is second argument and just assign
  campaign = await new web3.eth.Contract(
    JSON.parse(compiledCampaign.interface),
    campaignAddress
  );
});

describe("Campaigns", () => {
  it("deploys a factory and a campaign", () => {
    assert.ok(factory.options.address);
    assert.ok(campaign.options.address);
  });

  it("marks caller as the campaign manager", async () => {
    const manager = await campaign.methods.manager().call();
    assert.equal(accounts[0], manager);
  });

  it("allows people to contribute and marks that", async () => {
    await campaign.methods.contribute().send({
      value: "200",
      from: accounts[1],
    });

    const isContributer = await campaign.methods.approvers(accounts[1]).call();
    assert(isContributer);
  });

  it("requires a minimum contribution", async () => {
    try {
      await campaign.methods.contribute().send({
        value: "10",
        from: accounts[1],
      });
      assert(false);
    } catch (err) {
      assert(err);
    }
  });

  it("allows manager to make payment request", async () => {
    await campaign.methods.createRequest("Buy stuff", "100", accounts[1]).send({
      from: accounts[0],
      gas: "1000000",
    });
    const req = await campaign.methods.requests(0).call();
    assert.equal("Buy stuff", req.description);
  });
});
