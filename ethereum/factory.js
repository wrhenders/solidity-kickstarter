import web3 from "./web3";
import CampaignFactory from "./build/CampaginFactory.json";

const instance = new web3.eth.Contract(
  JSON.parse(CampaignFactory.interface),
  "0xF53143238BF4f8CB5203C27cfFf90A8E77Df380A"
);

export default instance;
