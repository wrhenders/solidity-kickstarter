import web3 from "./web3";
import CampaignFactory from "./build/CampaginFactory.json";

const instance = new web3.eth.Contract(
  JSON.parse(CampaignFactory.interface),
  "0x28b6FC18B6Ce445820eE7035a642B45Df8f6949E"
);

export default instance;
