//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./IWhitelist.sol";

contract Degens is ERC721Enumerable, Ownable {
  string _baseTokenURI;
  uint256 public price = 0.01 ether;
  bool public paused;
  uint256 public maxTokenIds = 20;
  uint256 public tokenIds;

  IWhitelist whitelist;

  bool public presaleStarted;

  uint256 public presaleEndTime;

  modifier onlyWhenNotPaused() {
    require(!paused, "contract currently pauesd");
    _;
  }

  constructor(string memory baseURI, address whitelistContract)
    ERC721("Degens", "DGX")
  {
    _baseTokenURI = baseURI;
    whitelist = IWhitelist(whitelistContract);
  }

  function startPresale() public onlyOwner {
    presaleStarted = true;
    presaleEndTime = block.timestamp + 5 minutes;
  }

  function presaleMint() public payable onlyWhenNotPaused {
    require(
      presaleStarted && block.timestamp < presaleEndTime,
      "Presale in not running"
    );
    require(
      whitelist.whitelistAddresses(msg.sender),
      "You are not whitelisted"
    );
    require(tokenIds < maxTokenIds, "exceeded max degens");
    require(msg.value > price, "ether is not enough");
    tokenIds++;
    _safeMint(msg.sender, tokenIds);
  }

  function mint() public payable onlyWhenNotPaused {
    require(
      presaleStarted && block.timestamp >= presaleEndTime,
      "presale not ended yet"
    );
    require(tokenIds < maxTokenIds, "degend exceeded in limits");
    require(msg.value > price, "ether sent is not enough");
    tokenIds++;
    _safeMint(msg.sender, tokenIds);
  }

  function _baseURI() internal view virtual override returns (string memory) {
    return _baseTokenURI;
  }

  function setPaused(bool val) public onlyOwner {
    paused = val;
  }

  function withdraw() public onlyOwner {
    address _owner = owner();
    uint256 amount = address(this).balance;
    (bool sent, ) = _owner.call{ value: amount }("");
    require(sent, "failed to send ether");
  }

  receive() external payable {}

  fallback() external payable {}
}
