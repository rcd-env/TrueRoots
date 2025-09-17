# 🌿 TrueRoots - Ayurvedic Herb Traceability System

<div align="center">

![TrueRoots Logo](https://img.shields.io/badge/TrueRoots-Blockchain%20Traceability-green?style=for-the-badge&logo=leaf)

**A blockchain-based traceability system for Ayurvedic herbs built on Algorand**

[![Algorand](https://img.shields.io/badge/Algorand-Blockchain-blue?style=flat-square&logo=algorand)](https://www.algorand.com/)
[![React](https://img.shields.io/badge/React-Frontend-61DAFB?style=flat-square&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Language-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-Build%20Tool-646CFF?style=flat-square&logo=vite)](https://vitejs.dev/)

[🚀 Live Demo](#) • [📱 Smart Contract](https://testnet.explorer.perawallet.app/application/745905580/) • [📖 Documentation](#getting-started)

</div>

---

## 🎯 What is TrueRoots?

TrueRoots is a revolutionary blockchain-based platform that ensures complete transparency and authenticity in the Ayurvedic herb supply chain. From collection to consumer, every step is tracked, verified, and immutably recorded on the Algorand blockchain.

### 🔥 Why TrueRoots?

- **🛡️ Combat Counterfeit Herbs**: Eliminate fake and adulterated Ayurvedic products
- **🌍 End-to-End Transparency**: Track herbs from forest to pharmacy
- **🔬 Scientific Verification**: AI-powered plant identification and lab certification
- **💰 Fair Compensation**: Automated payments to collectors via smart contracts
- **📱 Consumer Trust**: QR code scanning for instant authenticity verification

---

## ✨ Key Features

### 🌱 **For Herb Collectors**

- **Smart Collection Tracking**: GPS-enabled location verification
- **AI Plant Identification**: Upload photos for instant species verification
- **Automated Payments**: Receive 30% of estimated value in ALGO tokens
- **Quality Scoring**: Earn more for higher quality herbs

### 🏭 **For Pharmaceutical Companies**

- **Batch Management**: Track inventory from source to shelf
- **Compliance Dashboard**: Regulatory reporting and documentation
- **Supplier Network**: Connect with verified herb collectors
- **Cost Optimization**: Reduce intermediary costs

### 🔬 **For Testing Labs**

- **Digital Certification**: Issue tamper-proof quality certificates
- **Blockchain Integration**: Certificates permanently stored on-chain
- **Authenticity Scoring**: Rate herb purity and potency
- **Audit Trail**: Complete testing history

### 👥 **For Consumers**

- **QR Code Verification**: Instant authenticity check
- **Complete Provenance**: See the herb's entire journey
- **Lab Reports**: Access quality test results
- **Source Information**: Know your herb's origin story

---

## 🏗️ Technology Stack

### **Frontend**

- **React 19** with TypeScript for type-safe development
- **Vite** for lightning-fast builds and development
- **Tailwind CSS** for modern, responsive design
- **React Router** for seamless navigation
- **Framer Motion** for smooth animations

### **Backend & APIs**

- **Node.js/Express** REST API server
- **Plant.id API** for AI-powered plant identification
- **Multer** for secure file uploads
- **CORS** enabled for cross-origin requests

### **Blockchain**

- **Algorand** Layer 1 blockchain for fast, secure transactions
- **AlgoKit** for smart contract development and deployment
- **Pera Wallet** integration for seamless wallet connections
- **Algorand TypeScript** for type-safe smart contract development

### **Deployment & DevOps**

- **Vercel** for frontend hosting with automatic deployments
- **Render** for backend API hosting
- **GitHub Actions** for CI/CD pipeline
- **Environment-based configuration** for multiple deployment targets

---

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js 18+** ([Download](https://nodejs.org/))
- **AlgoKit CLI** ([Installation Guide](https://github.com/algorandfoundation/algokit-cli))
- **Git** ([Download](https://git-scm.com/))
- **Pera Wallet** ([Download](https://perawallet.app/))

### 🔧 Quick Setup

1. **Clone the Repository**

   ```bash
   git clone https://github.com/rcd-env/TrueRoots.git
   cd TrueRoots
   ```

2. **Install Dependencies**

   ```bash
   # Frontend
   cd client
   npm install

   # Backend
   cd ../server
   npm install

   # Smart Contracts
   cd ../contract/projects/contract
   npm install
   ```

3. **Environment Configuration**

   ```bash
   # In server directory
   cp .env.example .env
   # Add your API keys and configuration
   ```

4. **Start Development Servers**

   ```bash
   # Terminal 1: Frontend
   cd client && npm run dev

   # Terminal 2: Backend
   cd server && npm run dev

   # Terminal 3: Local Algorand Network (optional)
   algokit localnet start
   ```

5. **Open in Browser**
   ```
   Frontend: http://localhost:5173
   Backend:  http://localhost:3001
   ```

---

## 📱 Smart Contract

### **Deployed Contract Information**

- **Network**: Algorand TestNet
- **Application ID**: `745905580`
- **Explorer**: [View on Pera Explorer](https://testnet.explorer.perawallet.app/application/745905580/)

### **Contract Features**

- **Batch Creation**: Register new herb collections
- **Quality Verification**: Lab certification and scoring
- **Processing Tracking**: Monitor herb processing steps
- **Shipping Status**: Track delivery and distribution
- **Reward Distribution**: Automated collector payments
- **Provenance Queries**: Complete supply chain history

### **Key Methods**

```typescript
// Create a new herb batch
create_batch(batch_id, collector, collected_at, geo, species, quantity_kg);

// Lab quality verification
verify_qc(lab_cert_cid, authenticity_score, qc_at);

// Processing step
process_batch(final_img_cid, consumer_qr, proc_at);

// Mark as shipped
ship_batch();

// Get complete provenance data
provenance(); // Returns: batch_id|status|species|geo|lab_cid|final_img|qr
```

---

## 🌊 User Journey

### 1. **Herb Collection** 🌿

```
Collector → Select Herb Type → Upload Photos → AI Verification →
Location Capture → Submit → Receive Payment (30% in ALGO)
```

### 2. **Quality Assurance** 🔬

```
Lab → Receive Samples → Conduct Tests → Upload Certificates →
Blockchain Verification → Issue Quality Score
```

### 3. **Processing & Distribution** 🏭

```
Processor → Receive Verified Herbs → Process → Package →
Generate QR Codes → Update Blockchain → Ship to Market
```

### 4. **Consumer Verification** 📱

```
Consumer → Scan QR Code → View Provenance → Check Lab Reports →
Verify Authenticity → Make Informed Purchase
```

---

## 🎨 Screenshots

<div align="center">

### Collector Dashboard

![Collector Dashboard](./docs/images/collector-dashboard.png)

### Provenance Tracking

![Provenance View](./docs/images/provenance-view.png)

### QR Code Scanner

![QR Scanner](./docs/images/qr-scanner.png)

</div>

---

## 🧪 Testing

### **Run Frontend Tests**

```bash
cd client
npm run test
```

### **Run Backend Tests**

```bash
cd server
npm run test
```

### **Smart Contract Testing**

```bash
cd contract/projects/contract
algokit project run build
algokit project deploy localnet
```

### **Integration Testing**

```bash
# Test payment API
node test-payment-api.js

# Test complete user flow
npm run test:e2e
```

---

## 🌐 Deployment

### **Frontend (Vercel)**

- **Live URL**: Coming Soon
- **Auto-deployment**: Enabled on `main` branch pushes
- **Environment**: Production environment variables configured

### **Backend (Render)**

- **API URL**: `https://trueroots.onrender.com`
- **Health Check**: `/health` endpoint
- **Auto-scaling**: Enabled based on traffic

### **Smart Contract (Algorand TestNet)**

- **Application ID**: `745905580`
- **Network**: TestNet (ready for MainNet)
- **Verification**: [View on Explorer](https://testnet.explorer.perawallet.app/application/745905580/)

---

## 🔐 Security Features

- **🔒 Wallet Integration**: Secure Pera Wallet connection
- **🛡️ Input Validation**: Comprehensive server-side validation
- **🔐 Access Control**: Role-based permissions in smart contracts
- **📝 Immutable Records**: Blockchain-based audit trails
- **🌐 CORS Protection**: Secure cross-origin requests
- **🔑 Environment Secrets**: Secure API key management

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the Repository**
2. **Create a Feature Branch**: `git checkout -b feature/amazing-feature`
3. **Commit Changes**: `git commit -m 'Add amazing feature'`
4. **Push to Branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### **Development Guidelines**

- Follow TypeScript best practices
- Write comprehensive tests
- Update documentation
- Follow conventional commit messages

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Algorand Foundation** for the robust blockchain infrastructure
- **Plant.id** for AI-powered plant identification
- **AlgoKit Team** for excellent development tools
- **React Community** for the amazing frontend ecosystem
- **Open Source Community** for invaluable libraries and tools

---

## 📞 Contact & Support

<div align="center">

**Built with ❤️ for the future of Ayurvedic medicine**

[![GitHub](https://img.shields.io/badge/GitHub-Repository-black?style=flat-square&logo=github)](https://github.com/rcd-env/TrueRoots)
[![Issues](https://img.shields.io/badge/Issues-Report%20Bug-red?style=flat-square&logo=github)](https://github.com/rcd-env/TrueRoots/issues)
[![Discussions](https://img.shields.io/badge/Discussions-Join%20Community-purple?style=flat-square&logo=github)](https://github.com/rcd-env/TrueRoots/discussions)

</div>

---

<div align="center">
<sub>⭐ Star this repository if you find it helpful!</sub>
</div>