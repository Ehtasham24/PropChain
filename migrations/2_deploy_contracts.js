const DubaiRealEstateMarket = artifacts.require("DubaiRealEstateMarket");

module.exports = function (deployer) {
  deployer.deploy(DubaiRealEstateMarket); // Remove gas override
};
