# AI RAG Support System (Full-Stack)

โปรเจกต์พัฒนาระบบตัวช่วยตอบคำถามอัจฉริยะโดยใช้เทคนิค Retrieval-Augmented Generation (RAG) เพื่อดึงข้อมูลจากฐานความรู้มาตอบคำถามได้อย่างแม่นยำ 

## 🚀 จุดเด่นของโปรเจกต์
- **RAG Integration:** เชื่อมต่อ LLM กับฐานความรู้ส่วนตัวเพื่อให้ AI ตอบคำถามได้ตรงประเด็น
- **Full-Stack Architecture:** พัฒนาด้วย Next.js (Frontend) และ FastAPI (Backend)
- **Containerized:** รองรับการทำงานผ่าน Docker Compose

## 🛠️ Tech Stack
- **Frontend:** Next.js 14/15, Tailwind CSS, TypeScript
- **Backend:** FastAPI (Python), LangChain
- **AI Model:** Google Gemini API (หรือโมเดลที่คุณใช้)
- **Database/Vector Store:** FAISS (สำหรับจัดเก็บข้อมูล Vector)
- **DevOps:** Docker, Docker Compose

## 📂 โครงสร้างโปรเจกต์ (Project Structure)
```text
.
├── backend/            # ระบบ API และส่วนประมวลผล AI (FastAPI)
├── frontend/           # ส่วนติดต่อผู้ใช้งาน (Next.js)
└── docker-compose.yml  # ไฟล์ตั้งค่าการรันระบบผ่าน Docker