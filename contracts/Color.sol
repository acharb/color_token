pragma solidity >=0.4.21 <0.7.0;

import "@openzeppelin/contracts/token/ERC721/ERC721Full.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721Burnable.sol";

contract Color is ERC721Full, ERC721Burnable {

  string[] public colors;
  mapping(string => bool) private _colorExists;

  constructor() ERC721Full("Color", "COLOR") public {
  }

  function mint(string memory _color, string memory _shape) public {
    require(!_colorExists[_color], "New Color required!");
    uint idx = colors.push(_color) - 1;
    _mint(msg.sender, idx);
    _setTokenURI(idx, _shape);
    _colorExists[_color] = true;
  }

  function my_token_ids() public view returns (uint256[] memory) {
    return _tokensOfOwner(msg.sender);
  }

}

