# Frontend-RAG

🚀 **Modern Web Interface for AI-Powered Document Intelligence**

A sleek, responsive frontend application that provides an intuitive interface for the RAG 2.0 document processing system. Built with vanilla JavaScript, HTML5, and CSS3 with stunning animations and glassmorphism design.

## 🎯 Overview

Frontend-RAG serves as the user-facing interface for the RAG (Retrieval Augmented Generation) system. It allows users to upload documents, ask natural language questions, and receive AI-generated answers based on document content through a beautiful, interactive web interface.

## ✨ Features

- **🎨 Modern UI/UX**: Glassmorphism design with animated backgrounds
- **📁 Multi-format Support**: Upload PDF, DOCX, XLSX, TXT, CSV files
- **💬 Interactive Chat**: Natural language query interface
- **⚡ Real-time Processing**: Live status updates and animations
- **📱 Responsive Design**: Works seamlessly across all devices
- **🎭 Animated Logo**: Custom SVG logo with document processing animations
- **🔄 Dynamic Feedback**: Visual processing indicators and typing animations

## 🏗️ Architecture

```
Frontend-RAG (This Repo)
    ↓ HTTP Requests
RAG 2.0 Backend (Gradio API)
    ↓ AI Processing
Document Intelligence Response
```

### How Frontend Connects to Backend

The frontend communicates with the **RAG 2.0** backend through RESTful API calls:

1. **Document Upload**: Sends files to `/upload` endpoint
2. **Query Processing**: Posts questions to `/query` endpoint
3. **Status Updates**: Polls backend for processing status
4. **Response Handling**: Receives and displays AI-generated answers

## 🚀 Quick Start

### Prerequisites

- Modern web browser (Chrome, Firefox, Safari, Edge)
- Access to RAG 2.0 backend system
- Basic web server (optional, for local development)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/[your-username]/frontend-rag.git
   cd frontend-rag
   ```

2. **Configure backend connection**
   - Open `script.js`
   - Update the `API_BASE_URL` variable with your RAG 2.0 backend URL
   ```javascript
   const API_BASE_URL = 'http://localhost:7860'; // Your RAG 2.0 backend URL
   ```

3. **Serve the application**
   ```bash
   # Option 1: Simple HTTP server
   python -m http.server 8000
   
   # Option 2: Node.js http-server
   npx http-server
   
   # Option 3: Just open index.html in browser
   ```

4. **Access the application**
   - Open `http://localhost:8000` in your browser
   - Or directly open `index.html` file

## 📁 Project Structure

```
frontend-rag/
├── index.html          # Main HTML structure
├── style.css           # Styling and animations
├── script.js           # Frontend logic and API integration
├── assets/            
│   └── logo/           # Custom animated SVG logo
└── README.md          # This file
```

## 🔗 Backend Integration

This frontend is designed to work with the **RAG 2.0** backend system. Make sure you have the backend running before using this interface.

### Required Backend Endpoints

The frontend expects these API endpoints from RAG 2.0:

- `POST /upload` - Document upload
- `POST /query` - Question processing
- `GET /status` - Processing status
- `GET /health` - System health check

### Backend Repository

👉 **Backend System**: [RAG 2.0](https://github.com/[your-username]/RAG-2.0)

## 🎨 Customization

### Logo Customization
The animated logo is embedded as SVG in the HTML. To modify:
1. Edit the SVG code in `index.html` (logo-icon section)
2. Adjust animations, colors, or shapes as needed

### Styling
- **Colors**: Modify CSS variables in `style.css`
- **Animations**: Adjust keyframes and transitions
- **Layout**: Responsive grid system easily customizable

### API Configuration
Update `script.js` to match your backend configuration:
```javascript
const config = {
    API_BASE_URL: 'your-backend-url',
    MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
    SUPPORTED_FORMATS: ['.pdf', '.docx', '.xlsx', '.txt', '.csv']
};
```

## 🛠️ Development

### Local Development
1. Make sure RAG 2.0 backend is running
2. Update API endpoints in `script.js`
3. Use live server for hot reloading during development

### Browser Compatibility
- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

## 🤝 Contributing

This is a personal project by **Krishna Naicker**. Feel free to fork and customize for your own RAG implementations!

## 📄 License

MIT License - Feel free to use and modify for your projects.

## 🔗 Related Projects

- **[RAG 2.0](https://github.com/[your-username]/RAG-2.0)** - The AI backend that powers this interface
- Built with ❤️ by Krishna Naicker

---

**Note**: This frontend requires the RAG 2.0 backend to be running. Please set up and start the backend system before using this interface.