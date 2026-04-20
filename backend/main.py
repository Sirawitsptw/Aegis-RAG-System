from fastapi import FastAPI
from pydantic import BaseModel
from dotenv import load_dotenv
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain_community.vectorstores import FAISS
from google import genai
import os
from fastapi.middleware.cors import CORSMiddleware

load_dotenv()
my_api_key = os.getenv("API_KEY")

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

print("กำลังโหลดคู่มือบริษัทลงหน่วยความจำ FAISS...")
manual_data = [
    "วิธีแก้ปัญหาชำระเงิน: หากขึ้นรหัส ERR-PAY-01 ให้ตรวจสอบสถานะเครือข่ายของผู้ใช้",
    "วิธีแก้ปัญหาหน้าจอค้าง: ให้ผู้ใช้ทำการ Clear Cache ในเมนูตั้งค่าของแอป",
    "นโยบายการคืนเงิน: สามารถคืนเงินได้ภายใน 7 วันทำการ หากสินค้าไม่ถูกแกะใช้งาน",
    "ปัญหาคอมเปิดไม่ติด: ให้ตรวจสอบสายไฟ AC, ปลั๊กพ่วง และเต้ารับว่าเสียบแน่นหรือไม่",
    "ปัญหาเครื่องชาร์จไม่ทำงาน: ตรวจสอบว่าสายชาร์จเสียบแน่นหรือไม่ และลองเปลี่ยนพอร์ตชาร์จ",
    "ปัญหาไม่สามารถเชื่อมต่อ WiFi: ตรวจสอบว่ารหัสผ่าน WiFi ถูกต้องหรือไม่ และลองรีเซ็ตการตั้งค่าเครือข่าย"
]
embeddings = GoogleGenerativeAIEmbeddings(model="models/gemini-embedding-001", google_api_key=my_api_key)
vector_db = FAISS.from_texts(manual_data, embeddings)
client = genai.Client(api_key=my_api_key)
print("✅ โหลดเสร็จสิ้น! ระบบพร้อมให้บริการ")

class CustomerIssue(BaseModel):
    message: str

@app.post("/analyze")
async def analyze_issue(issue: CustomerIssue):
    
    docs = vector_db.similarity_search(issue.message, k=1)
    retrieved_context = docs[0].page_content
    
    prompt = f"""
    คุณคือผู้ช่วยเหลือลูกค้าที่สุภาพและเป็นมืออาชีพ
    จงวิเคราะห์ปัญหาและตอบลูกค้า โดยอ้างอิงจาก "คู่มือของบริษัท" ด้านล่างนี้เท่านั้น
    
    คำถามลูกค้า: "{issue.message}"
    
    คู่มือของบริษัท:
    "{retrieved_context}"
    
    จงตอบกลับในรูปแบบ JSON (ห้ามมี Markdown หรือเครื่องหมาย ``` ครอบ) ดังนี้:
    {{
        "priority": "High หรือ Medium หรือ Low",
        "category": "หมวดหมู่ปัญหา",
        "ai_response": "ข้อความตอบกลับลูกค้าที่สุภาพ"
    }}
    """
    
    response = client.models.generate_content(
        model='gemini-2.5-flash',
        contents=prompt
    )
    
    return {
        "status": "success",
        "raw_message": issue.message,
        "matched_manual": retrieved_context,
        "ai_analysis": response.text
    }