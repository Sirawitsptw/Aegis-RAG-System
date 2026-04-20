'use client';

import { useState } from 'react';

export default function Home() {
  const [issue, setIssue] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  // ฟังก์ชันยิงข้อมูลไปหา FastAPI
const analyzeTicket = async () => {
    if (!issue.trim()) return;
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: issue }),
      });

      const data = await response.json();
      
      // แปลงข้อความ JSON string ที่ AI ตอบกลับมา ให้กลายเป็น Object
      const aiAnalysis = JSON.parse(data.ai_analysis);
      setResult({ ...data, parsed_analysis: aiAnalysis });

    } catch (error) {
      console.error('Error:', error);
      alert('เกิดข้อผิดพลาดในการเชื่อมต่อกับ Server');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 p-8 flex items-center justify-center font-sans">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl overflow-hidden">
        
        {/* Header */}
        <div className="bg-blue-600 p-6 text-white text-center">
          <h1 className="text-2xl font-bold">AI Support Ticket Triage</h1>
          <p className="text-blue-100 mt-2">Automatic Customer Issue Triage System with AI</p>
        </div>

        <div className="p-8">
          {/* ส่วนรับข้อมูล */}
          <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-2">
              Customer Issue:
            </label>
            <textarea
              className="w-full border text-gray-800 border-gray-300 rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-blue-500 h-32"
              placeholder="ตัวอย่าง: คอมเปิดไม่ติดเลยค่ะ..."
              value={issue}
              onChange={(e) => setIssue(e.target.value)}
            />
          </div>

          <button
            onClick={analyzeTicket}
            disabled={loading}
            className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 disabled:bg-blue-300 transition-colors"
          >
            {loading ? '🤖 AI กำลังวิเคราะห์ข้อมูล...' : 'ส่งปัญหาให้ AI วิเคราะห์ ✨'}
          </button>

          {/* ส่วนแสดงผลลัพธ์ (จะโชว์เมื่อ AI ตอบกลับมาแล้ว) */}
          {result && (
            <div className="mt-8 p-6 bg-gray-50 border border-gray-200 rounded-xl animate-fade-in">
              <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">ผลการวิเคราะห์</h2>
              
              <div className="flex gap-4 mb-4">
                <div className={`px-4 py-2 rounded-full text-sm font-bold ${
                  result.parsed_analysis.priority === 'High' ? 'bg-red-100 text-red-700' : 
                  result.parsed_analysis.priority === 'Medium' ? 'bg-yellow-100 text-yellow-700' : 
                  'bg-green-100 text-green-700'
                }`}>
                  Priority: {result.parsed_analysis.priority}
                </div>
                <div className="px-4 py-2 rounded-full text-sm font-bold bg-blue-100 text-blue-700">
                  Category: {result.parsed_analysis.category}
                </div>
              </div>

              <div className="mb-4">
                <span className="text-xs font-bold text-gray-500 uppercase">Reference from Manual:</span>
                <p className="text-sm text-gray-600 italic bg-gray-200 p-2 rounded mt-1">
                  "{result.matched_manual}"
                </p>
              </div>

              <div>
                <span className="text-xs font-bold text-gray-500 uppercase">Draft Response to Customer:</span>
                <div className="bg-white border border-gray-200 p-4 rounded-lg mt-1 text-gray-800">
                  {result.parsed_analysis.ai_response}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}