# 🏠 PropChain - Blockchain Real Estate Marketplace

A decentralized real estate marketplace built on Ethereum blockchain, enabling transparent and secure property transactions with smart contracts. PropChain revolutionizes property buying, selling, and ownership tracking through blockchain technology.

[![Solidity](https://img.shields.io/badge/Solidity-0.8.13-363636?style=flat&logo=solidity)](https://soliditylang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-14.2-000000?style=flat&logo=next.js)](https://nextjs.org/)
[![NestJS](https://img.shields.io/badge/NestJS-11.0-E0234E?style=flat&logo=nestjs)](https://nestjs.com/)
[![Truffle](https://img.shields.io/badge/Truffle-Suite-5E464D?style=flat&logo=truffle)](https://trufflesuite.com/)

## 🌟 Features

### 🔐 **Blockchain Features**

- **Smart Contract Based**: Ethereum smart contracts for trustless transactions
- **Property NFTs**: Each property as a unique blockchain asset
- **Transparent Ownership**: Complete ownership history on blockchain
- **Direct P2P Transactions**: No intermediaries, direct buyer-seller transactions
- **Immutable Records**: Tamper-proof property records
- **Price Discovery**: On-chain property pricing and updates

### 💼 **Platform Features**

- **Property Listing**: List properties with details and pricing
- **Property Activation**: Seller-controlled listing activation/deactivation
- **Direct Purchase**: Instant property purchase with crypto payments
- **Ownership Tracking**: Full ownership history for each property
- **Real-time Updates**: Live blockchain event tracking
- **Wallet Integration**: MetaMask & Web3 wallet support

### 🎨 **User Interface**

- **Modern UI/UX**: Built with Next.js 14 & Tailwind CSS
- **Responsive Design**: Mobile-first approach
- **Real-time Notifications**: Toast notifications for transactions
- **Dark Mode**: Eye-friendly dark theme support
- **Interactive Charts**: Property analytics with Recharts

## 🏗️ Architecture

```
PropChain/
├── contracts/              # Ethereum Smart Contracts
│   └── RealEstate.sol     # Main marketplace contract
├── FE/PropChain/          # Next.js Frontend
│   ├── src/
│   │   ├── app/           # Next.js 14 App Router
│   │   ├── components/    # Reusable UI components
│   │   ├── services/      # API & blockchain services
│   │   ├── context/       # React Context providers
│   │   └── utils/         # Helper functions
│   └── package.json
├── BE/real-estate-backend/  # NestJS Backend API
│   ├── src/
│   │   ├── modules/       # Feature modules
│   │   ├── config/        # Configuration
│   │   └── main.ts        # Entry point
│   └── package.json
├── migrations/            # Truffle migration scripts
├── truffle-config.js      # Truffle configuration
└── README.md
```

## 🚀 Tech Stack

### **Blockchain Layer**

- **Solidity 0.8.13** - Smart contract development
- **Truffle Suite** - Smart contract compilation & deployment
- **Ganache** - Local blockchain for development
- **Web3.js/Ethers.js** - Blockchain interaction

### **Frontend**

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Shadcn/ui** - Modern component library
- **Ethers.js 6** - Ethereum library
- **Redux Toolkit** - State management
- **React Query** - Server state management
- **Formik & Yup** - Form handling & validation
- **Socket.io Client** - Real-time communication

### **Backend**

- **NestJS 11** - Progressive Node.js framework
- **MongoDB + Mongoose** - Database & ODM
- **Passport JWT** - Authentication
- **Swagger** - API documentation
- **Nodemailer** - Email service
- **Class Validator** - DTO validation

## 📋 Prerequisites

Before running PropChain, ensure you have:

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **Ganache** (for local blockchain)
- **Truffle** (`npm install -g truffle`)
- **MetaMask** browser extension
- **MongoDB** (local or Atlas)

## 🔧 Installation & Setup

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/yourusername/PropChain.git
cd PropChain
```

### 2️⃣ Setup Smart Contracts

```bash
# Install Truffle globally if not installed
npm install -g truffle

# Start Ganache (in a separate terminal)
ganache-cli

# Compile smart contracts
truffle compile

# Deploy to local blockchain
truffle migrate --network development

# Copy contract ABI and address for frontend
```

### 3️⃣ Setup Backend

```bash
cd BE/real-estate-backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Configure environment variables
# Add MongoDB URI, JWT secret, etc.

# Start development server
npm run start:dev

# Backend runs on http://localhost:3000
```

### 4️⃣ Setup Frontend

```bash
cd FE/PropChain

# Install dependencies
npm install

# Create .env.local file
cp .env.example .env.local

# Configure environment variables
# Add contract address, RPC URL, etc.

# Start development server
npm run dev

# Frontend runs on http://localhost:3000
```

## 🔑 Environment Variables

### **Backend (.env)**

```env
# Database
MONGODB_URI=mongodb://localhost:27017/propchain
DATABASE_NAME=propchain

# JWT
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRATION=7d

# Email (Optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_app_password

# Server
PORT=4000
NODE_ENV=development
```

### **Frontend (.env.local)**

```env
# API
NEXT_PUBLIC_API_URL=http://localhost:4000/api

# Blockchain
NEXT_PUBLIC_RPC_URL=http://127.0.0.1:8545
NEXT_PUBLIC_CONTRACT_ADDRESS=0x... # Your deployed contract address
NEXT_PUBLIC_CHAIN_ID=1337

# Environment
NEXT_PUBLIC_ENV=development
```

## 📝 Smart Contract Functions

### **Core Functions**

#### List Property

```solidity
function listProperty(
    string calldata _propertyId,
    uint256 _price,
    string calldata _location
) external
```

#### Activate Listing

```solidity
function activateListing(string calldata _propertyId) external
```

#### Buy Property

```solidity
function buyProperty(string calldata _propertyId) external payable
```

#### Update Price

```solidity
function updatePropertyPrice(
    string calldata _propertyId,
    uint256 _newPrice
) external
```

#### View Functions

```solidity
function getAllPropertyIds() public view returns (string[] memory)
function getOwnershipHistory(string calldata _propertyId) public view returns (address[] memory)
```

## 🎯 User Flows

### **1. Seller Flow**

1. Connect wallet (MetaMask)
2. List property with details and price
3. Property created on blockchain (pending state)
4. Activate listing to make it available
5. Receive payment when property is sold
6. Ownership automatically transferred

### **2. Buyer Flow**

1. Connect wallet (MetaMask)
2. Browse active property listings
3. View property details & ownership history
4. Purchase property with crypto payment
5. Receive property ownership on blockchain
6. Transaction recorded immutably

### **3. Admin Flow** (Optional)

1. Monitor all property transactions
2. View analytics and statistics
3. Manage platform settings

## 🧪 Testing Smart Contracts

```bash
# Run Truffle tests
truffle test

# Test specific file
truffle test ./test/RealEstate.test.js

# Test with detailed output
truffle test --show-events
```

## 🔐 Security Features

- ✅ **Ownership Verification**: Only owners can activate/deactivate listings
- ✅ **Payment Validation**: Exact payment amount required
- ✅ **Reentrancy Protection**: Safe transfer patterns
- ✅ **Access Control**: Function-level permissions
- ✅ **Input Validation**: Smart contract & backend validation
- ✅ **JWT Authentication**: Secure API endpoints
- ✅ **Rate Limiting**: API protection (optional)

## 📊 Database Schema

### **User Collection**

```javascript
{
  _id: ObjectId,
  walletAddress: String (unique, indexed),
  email: String,
  name: String,
  role: Enum ['buyer', 'seller', 'admin'],
  createdAt: Date,
  updatedAt: Date
}
```

### **Property Collection**

```javascript
{
  _id: ObjectId,
  propertyId: String (blockchain ID),
  title: String,
  description: String,
  images: [String],
  documents: [String],
  seller: ObjectId (ref: User),
  status: Enum ['pending', 'active', 'sold'],
  transactionHash: String,
  createdAt: Date,
  updatedAt: Date
}
```

## 🌐 API Endpoints

### **Authentication**

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/verify-otp` - Verify OTP

### **Properties**

- `GET /api/properties` - Get all properties
- `GET /api/properties/:id` - Get property details
- `POST /api/properties` - Create property listing
- `PATCH /api/properties/:id` - Update property
- `DELETE /api/properties/:id` - Delete property

### **Blockchain**

- `GET /api/blockchain/properties` - Get blockchain properties
- `GET /api/blockchain/ownership/:propertyId` - Get ownership history
- `POST /api/blockchain/sync` - Sync blockchain data

## 🚧 Roadmap

- [x] Smart contract deployment
- [x] Basic frontend UI
- [x] Backend API integration
- [x] Wallet connection
- [x] Property listing & purchase
- [ ] Bidding system implementation
- [ ] Property fractional ownership (NFT-based)
- [ ] IPFS integration for property documents
- [ ] Multi-chain support (Polygon, BSC)
- [ ] Mobile app (React Native)
- [ ] Property inspection scheduling
- [ ] Rental marketplace
- [ ] DAO governance for platform decisions
- [ ] Integration with real-world property registries

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

### **Development Guidelines**

- Follow ESLint & Prettier configurations
- Write tests for new features
- Update documentation
- Follow Git commit conventions

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

- **Ehtasham Azhar** - Full Stack & Blockchain Developer - [@Ehtasham24](https://github.com/Ehtasham24)

## 🙏 Acknowledgments

- Truffle Suite for development tools
- Ethereum community for documentation
- Next.js team for the amazing framework
- NestJS team for the backend framework

---

<div align="center">

**Built with ❤️ using Blockchain Technology**

⭐ Star me on GitHub — it helps!

</div>
