# 🪞 Mirror Mirror MVP - Hackathon Edition

> **Face your worst enemy: yourself.**  
> Upload a selfie, get roasted by your AI digital twin with brutal honesty.

![Demo](https://img.shields.io/badge/Status-MVP%20Ready-brightgreen)
![Python](https://img.shields.io/badge/Python-FastAPI-blue)
![React](https://img.shields.io/badge/React-Vite-cyan)
![AI](https://img.shields.io/badge/AI-GPT--4%20%2B%20D--ID-purple)

## 🚀 **MVP Features**

| Feature | Description | Status |
|---------|-------------|--------|
| **Selfie Upload** | Webcam capture or file upload | ✅ Ready |
| **RoastGPT Chat** | GPT-4 powered sarcastic therapist | ✅ Ready |
| **Deepfake Avatar** | D-ID API lip-sync animations | ✅ Ready |
| **Neon UI** | Cyberpunk-themed React interface | ✅ Ready |

## 🛠 **Tech Stack**

### Backend
- **FastAPI** - Lightning-fast Python API
- **OpenAI GPT-4** - Sarcastic therapy responses
- **D-ID API** - Deepfake video generation
- **Uvicorn** - ASGI server

### Frontend
- **React 18** - Modern UI library
- **Vite** - Super-fast build tool
- **Tailwind CSS** - Utility-first styling
- **React Webcam** - Camera integration

## ⚡ **Quick Start**

### 1. Backend Setup
```bash
cd mvp_backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### 2. Configure API Keys
```bash
cp .env.template .env
# Edit .env with your keys:
# OPENAI_API_KEY=your-openai-key
# DID_API_KEY=your-did-key
```

### 3. Start Backend
```bash
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

### 4. Frontend Setup
```bash
cd mvp_frontend
npm install
npm run dev
```

## 🔑 **API Keys Required**

### OpenAI (GPT-4)
1. Go to [OpenAI API](https://platform.openai.com/api-keys)
2. Create new secret key
3. Add to `.env` as `OPENAI_API_KEY`

### D-ID (Deepfake)
1. Sign up at [D-ID](https://www.d-id.com/)
2. Get API key from dashboard
3. Add to `.env` as `DID_API_KEY`

## 🎯 **Demo Flow**

1. **Welcome Screen** - Cyberpunk landing page
2. **Selfie Upload** - Webcam or file upload
3. **Chat Interface** - Talk to your digital twin
4. **Deepfake Response** - Watch yourself roast you back

## 🏗 **API Endpoints**

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/upload-selfie` | POST | Upload user selfie |
| `/api/chat` | POST | Send message to RoastGPT |
| `/api/generate-deepfake` | POST | Create deepfake video |
| `/api/deepfake-status/{id}` | GET | Check video status |

## 🎨 **UI Components**

- **Neon borders** with glowing effects
- **Glass morphism** cards
- **Gradient animations** for deepfake container
- **Responsive design** for mobile/desktop
- **Real-time chat** with typing indicators

## 🧠 **AI Personality**

The RoastGPT therapist has these traits:
- **Brutally honest** but helpful
- **Escalating roast level** (1.0 → 5.0)
- **Uses modern slang** and references
- **Knows your secrets** (acts like your inner critic)
- **Short, punchy responses** (<100 words)

## 🚀 **Deployment**

### Backend (FastAPI)
```bash
# Using Docker
docker build -t mirror-mirror-api .
docker run -p 8000:8000 mirror-mirror-api

# Using Heroku
git push heroku main
```

### Frontend (React)
```bash
# Build for production
npm run build

# Deploy to Vercel/Netlify
vercel --prod
```

## 🔧 **Development**

### Backend Development
```bash
# Run with auto-reload
uvicorn main:app --reload

# Test endpoints
curl -X POST "http://localhost:8000/api/chat" \
  -H "Content-Type: application/json" \
  -d '{"message":"I hate my life","user_id":"test123"}'
```

### Frontend Development
```bash
# Start dev server
npm run dev

# Run linting
npm run lint

# Build production
npm run build
```

## 🐛 **Troubleshooting**

### Common Issues

**"CORS Error"**
- Check backend is running on port 8000
- Verify frontend proxy in `vite.config.js`

**"OpenAI API Error"**
- Verify API key in `.env`
- Check you have GPT-4 access
- Monitor API usage/limits

**"D-ID Webhook Timeout"**
- D-ID can take 30-60s for videos
- Check API key and credits
- Monitor network connectivity

**"Upload Failed"**
- Check `uploads/` directory exists
- Verify file size limits
- Test with different image formats

## 📈 **Performance**

- **Backend**: ~50ms response time (excluding AI calls)
- **Frontend**: <3s initial load with Vite
- **Deepfake**: 30-60s generation time (D-ID)
- **Chat**: 2-5s GPT-4 response time

## 🚀 **Next Steps (Post-MVP)**

### Phase 2 Features
- [ ] Voice synthesis (ElevenLabs)
- [ ] Real-time video chat
- [ ] Multiple personality styles
- [ ] User accounts & history
- [ ] Share deepfake videos

### Phase 3 Features
- [ ] Live video deepfake
- [ ] Group therapy sessions
- [ ] Custom avatar training
- [ ] Mobile app (React Native)

## 🏆 **Hackathon Tips**

1. **Demo Script**: Have a 2-min walkthrough ready
2. **Fallbacks**: GPT/D-ID APIs have backups built-in
3. **Wow Factor**: Show the deepfake generation live
4. **Story**: Emphasize the "digital twin therapy" angle
5. **Tech Stack**: Highlight modern APIs (GPT-4, D-ID)

## 📝 **License**

MIT License - Perfect for hackathons and demos!

---

**Built with ❤️ and sarcasm for your next hackathon victory! 🏆**
