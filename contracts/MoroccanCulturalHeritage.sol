// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/**
 * @title MoroccanCulturalHeritage
 * @dev Smart contract for verifying and managing Moroccan cultural heritage pieces
 * Supports artisan verification, piece registration, and museum submissions
 */
contract MoroccanCulturalHeritage is ERC721, ERC721URIStorage, Ownable, ReentrancyGuard {
    using Counters for Counters.Counter;
    
    Counters.Counter private _tokenIdCounter;
    Counters.Counter private _artisanIdCounter;
    
    // Verification levels for artisans
    enum VerificationLevel { BRONZE, SILVER, GOLD, MASTER }
    
    // Status for cultural pieces
    enum PieceStatus { PENDING, VERIFIED, MUSEUM_READY, ARCHIVED }
    
    // Artisan profile structure
    struct ArtisanProfile {
        uint256 artisanId;
        address artisanAddress;
        string name;
        string region;
        string specialization;
        VerificationLevel verificationLevel;
        uint256 yearsExperience;
        bool isActive;
        uint256 registrationDate;
        uint256 totalPieces;
        uint256 reputationScore;
    }
    
    // Cultural piece structure
    struct CulturalPiece {
        uint256 pieceId;
        uint256 artisanId;
        string title;
        string description;
        string culturalSignificance;
        string ipfsHash; // IPFS hash for multimedia content
        uint256 originalPrice;
        PieceStatus status;
        uint256 creationDate;
        uint256 verificationDate;
        address verifier;
        bool isMuseumSubmitted;
        uint256 viewCount;
        mapping(address => bool) hasViewed;
    }
    
    // Museum submission structure
    struct MuseumSubmission {
        uint256 pieceId;
        string curatorNotes;
        string educationalContent;
        uint256 submissionDate;
        address submittedBy;
        bool isApproved;
        uint256 approvalDate;
    }
    
    // Events
    event ArtisanRegistered(uint256 indexed artisanId, address indexed artisanAddress, string name);
    event ArtisanVerified(uint256 indexed artisanId, VerificationLevel level, address indexed verifier);
    event PieceRegistered(uint256 indexed pieceId, uint256 indexed artisanId, string title);
    event PieceVerified(uint256 indexed pieceId, address indexed verifier, PieceStatus status);
    event MuseumSubmissionCreated(uint256 indexed pieceId, address indexed submitter);
    event MuseumSubmissionApproved(uint256 indexed pieceId, address indexed approver);
    event ReputationUpdated(uint256 indexed artisanId, uint256 newScore);
    
    // Mappings
    mapping(uint256 => ArtisanProfile) public artisans;
    mapping(address => uint256) public addressToArtisanId;
    mapping(uint256 => CulturalPiece) public culturalPieces;
    mapping(uint256 => MuseumSubmission) public museumSubmissions;
    mapping(address => bool) public authorizedVerifiers;
    mapping(address => bool) public museumCurators;
    
    // Modifiers
    modifier onlyArtisan() {
        require(addressToArtisanId[msg.sender] != 0, "Not a registered artisan");
        _;
    }
    
    modifier onlyVerifier() {
        require(authorizedVerifiers[msg.sender] || msg.sender == owner(), "Not authorized verifier");
        _;
    }
    
    modifier onlyCurator() {
        require(museumCurators[msg.sender] || msg.sender == owner(), "Not authorized curator");
        _;
    }
    
    modifier pieceExists(uint256 pieceId) {
        require(pieceId > 0 && pieceId <= _tokenIdCounter.current(), "Piece does not exist");
        _;
    }
    
    modifier artisanExists(uint256 artisanId) {
        require(artisanId > 0 && artisanId <= _artisanIdCounter.current(), "Artisan does not exist");
        _;
    }
    
    constructor() ERC721("Moroccan Cultural Heritage", "MCH") {}
    
    /**
     * @dev Register a new artisan
     */
    function registerArtisan(
        address artisanAddress,
        string memory name,
        string memory region,
        string memory specialization,
        uint256 yearsExperience
    ) external onlyOwner returns (uint256) {
        require(addressToArtisanId[artisanAddress] == 0, "Artisan already registered");
        
        _artisanIdCounter.increment();
        uint256 newArtisanId = _artisanIdCounter.current();
        
        artisans[newArtisanId] = ArtisanProfile({
            artisanId: newArtisanId,
            artisanAddress: artisanAddress,
            name: name,
            region: region,
            specialization: specialization,
            verificationLevel: VerificationLevel.BRONZE,
            yearsExperience: yearsExperience,
            isActive: true,
            registrationDate: block.timestamp,
            totalPieces: 0,
            reputationScore: 100 // Starting reputation
        });
        
        addressToArtisanId[artisanAddress] = newArtisanId;
        
        emit ArtisanRegistered(newArtisanId, artisanAddress, name);
        return newArtisanId;
    }
    
    /**
     * @dev Verify an artisan and set their verification level
     */
    function verifyArtisan(uint256 artisanId, VerificationLevel level) 
        external 
        onlyVerifier 
        artisanExists(artisanId) 
    {
        artisans[artisanId].verificationLevel = level;
        emit ArtisanVerified(artisanId, level, msg.sender);
    }
    
    /**
     * @dev Register a new cultural piece
     */
    function registerPiece(
        string memory title,
        string memory description,
        string memory culturalSignificance,
        string memory ipfsHash,
        uint256 originalPrice
    ) external onlyArtisan returns (uint256) {
        uint256 artisanId = addressToArtisanId[msg.sender];
        require(artisans[artisanId].isActive, "Artisan is not active");
        
        _tokenIdCounter.increment();
        uint256 newPieceId = _tokenIdCounter.current();
        
        // Create the cultural piece
        CulturalPiece storage newPiece = culturalPieces[newPieceId];
        newPiece.pieceId = newPieceId;
        newPiece.artisanId = artisanId;
        newPiece.title = title;
        newPiece.description = description;
        newPiece.culturalSignificance = culturalSignificance;
        newPiece.ipfsHash = ipfsHash;
        newPiece.originalPrice = originalPrice;
        newPiece.status = PieceStatus.PENDING;
        newPiece.creationDate = block.timestamp;
        newPiece.verificationDate = 0;
        newPiece.verifier = address(0);
        newPiece.isMuseumSubmitted = false;
        newPiece.viewCount = 0;
        
        // Mint NFT to artisan
        _safeMint(msg.sender, newPieceId);
        _setTokenURI(newPieceId, ipfsHash);
        
        // Update artisan stats
        artisans[artisanId].totalPieces++;
        
        emit PieceRegistered(newPieceId, artisanId, title);
        return newPieceId;
    }
    
    /**
     * @dev Verify a cultural piece
     */
    function verifyPiece(uint256 pieceId, PieceStatus status) 
        external 
        onlyVerifier 
        pieceExists(pieceId) 
    {
        require(status != PieceStatus.PENDING, "Cannot set status to pending");
        
        CulturalPiece storage piece = culturalPieces[pieceId];
        piece.status = status;
        piece.verificationDate = block.timestamp;
        piece.verifier = msg.sender;
        
        // Update artisan reputation based on verification
        if (status == PieceStatus.VERIFIED || status == PieceStatus.MUSEUM_READY) {
            _updateArtisanReputation(piece.artisanId, 10); // Positive reputation
        }
        
        emit PieceVerified(pieceId, msg.sender, status);
    }
    
    /**
     * @dev Submit a piece to museum
     */
    function submitToMuseum(
        uint256 pieceId,
        string memory curatorNotes,
        string memory educationalContent
    ) external onlyCurator pieceExists(pieceId) {
        require(culturalPieces[pieceId].status == PieceStatus.VERIFIED, "Piece must be verified first");
        require(!culturalPieces[pieceId].isMuseumSubmitted, "Already submitted to museum");
        
        museumSubmissions[pieceId] = MuseumSubmission({
            pieceId: pieceId,
            curatorNotes: curatorNotes,
            educationalContent: educationalContent,
            submissionDate: block.timestamp,
            submittedBy: msg.sender,
            isApproved: false,
            approvalDate: 0
        });
        
        culturalPieces[pieceId].isMuseumSubmitted = true;
        culturalPieces[pieceId].status = PieceStatus.MUSEUM_READY;
        
        emit MuseumSubmissionCreated(pieceId, msg.sender);
    }
    
    /**
     * @dev Approve museum submission
     */
    function approveMuseumSubmission(uint256 pieceId) 
        external 
        onlyCurator 
        pieceExists(pieceId) 
    {
        require(culturalPieces[pieceId].isMuseumSubmitted, "Not submitted to museum");
        require(!museumSubmissions[pieceId].isApproved, "Already approved");
        
        museumSubmissions[pieceId].isApproved = true;
        museumSubmissions[pieceId].approvalDate = block.timestamp;
        
        // Bonus reputation for museum approval
        _updateArtisanReputation(culturalPieces[pieceId].artisanId, 25);
        
        emit MuseumSubmissionApproved(pieceId, msg.sender);
    }
    
    /**
     * @dev Record a view for analytics
     */
    function recordView(uint256 pieceId) external pieceExists(pieceId) {
        CulturalPiece storage piece = culturalPieces[pieceId];
        if (!piece.hasViewed[msg.sender]) {
            piece.hasViewed[msg.sender] = true;
            piece.viewCount++;
        }
    }
    
    /**
     * @dev Update artisan reputation
     */
    function _updateArtisanReputation(uint256 artisanId, uint256 points) internal {
        artisans[artisanId].reputationScore += points;
        
        // Auto-upgrade verification level based on reputation
        uint256 reputation = artisans[artisanId].reputationScore;
        if (reputation >= 500 && artisans[artisanId].verificationLevel == VerificationLevel.BRONZE) {
            artisans[artisanId].verificationLevel = VerificationLevel.SILVER;
        } else if (reputation >= 1000 && artisans[artisanId].verificationLevel == VerificationLevel.SILVER) {
            artisans[artisanId].verificationLevel = VerificationLevel.GOLD;
        } else if (reputation >= 2000 && artisans[artisanId].verificationLevel == VerificationLevel.GOLD) {
            artisans[artisanId].verificationLevel = VerificationLevel.MASTER;
        }
        
        emit ReputationUpdated(artisanId, artisans[artisanId].reputationScore);
    }
    
    /**
     * @dev Add authorized verifier
     */
    function addVerifier(address verifier) external onlyOwner {
        authorizedVerifiers[verifier] = true;
    }
    
    /**
     * @dev Remove authorized verifier
     */
    function removeVerifier(address verifier) external onlyOwner {
        authorizedVerifiers[verifier] = false;
    }
    
    /**
     * @dev Add museum curator
     */
    function addCurator(address curator) external onlyOwner {
        museumCurators[curator] = true;
    }
    
    /**
     * @dev Remove museum curator
     */
    function removeCurator(address curator) external onlyOwner {
        museumCurators[curator] = false;
    }
    
    /**
     * @dev Get artisan details
     */
    function getArtisan(uint256 artisanId) external view artisanExists(artisanId) returns (
        address artisanAddress,
        string memory name,
        string memory region,
        string memory specialization,
        VerificationLevel verificationLevel,
        uint256 yearsExperience,
        bool isActive,
        uint256 registrationDate,
        uint256 totalPieces,
        uint256 reputationScore
    ) {
        ArtisanProfile memory artisan = artisans[artisanId];
        return (
            artisan.artisanAddress,
            artisan.name,
            artisan.region,
            artisan.specialization,
            artisan.verificationLevel,
            artisan.yearsExperience,
            artisan.isActive,
            artisan.registrationDate,
            artisan.totalPieces,
            artisan.reputationScore
        );
    }
    
    /**
     * @dev Get piece details
     */
    function getPiece(uint256 pieceId) external view pieceExists(pieceId) returns (
        uint256 artisanId,
        string memory title,
        string memory description,
        string memory culturalSignificance,
        string memory ipfsHash,
        uint256 originalPrice,
        PieceStatus status,
        uint256 creationDate,
        uint256 verificationDate,
        address verifier,
        bool isMuseumSubmitted,
        uint256 viewCount
    ) {
        CulturalPiece storage piece = culturalPieces[pieceId];
        return (
            piece.artisanId,
            piece.title,
            piece.description,
            piece.culturalSignificance,
            piece.ipfsHash,
            piece.originalPrice,
            piece.status,
            piece.creationDate,
            piece.verificationDate,
            piece.verifier,
            piece.isMuseumSubmitted,
            piece.viewCount
        );
    }
    
    /**
     * @dev Get total counts for analytics
     */
    function getTotalCounts() external view returns (
        uint256 totalArtisans,
        uint256 totalPieces,
        uint256 verifiedPieces,
        uint256 museumPieces
    ) {
        totalArtisans = _artisanIdCounter.current();
        totalPieces = _tokenIdCounter.current();
        
        // Count verified and museum pieces
        for (uint256 i = 1; i <= totalPieces; i++) {
            if (culturalPieces[i].status == PieceStatus.VERIFIED || 
                culturalPieces[i].status == PieceStatus.MUSEUM_READY) {
                verifiedPieces++;
            }
            if (culturalPieces[i].isMuseumSubmitted) {
                museumPieces++;
            }
        }
        
        return (totalArtisans, totalPieces, verifiedPieces, museumPieces);
    }
    
    // Override required functions
    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }
    
    function tokenURI(uint256 tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }
    
    function supportsInterface(bytes4 interfaceId) public view override(ERC721, ERC721URIStorage) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
} 