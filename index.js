const express = require('express');
const { GoogleGenAI } = require('@google/generative-ai');
const app = express();

// التعديل السحابي: جعل المنفذ ديناميكي ليناسب السيرفرات العالمية
const port = process.env.PORT || 3000;

app.use(express.json());

const GEMINI_API_KEY = "AQ.Ab8RN6JoHitQYpqHHM4JfFy_iMKCu1vD-AEWd7j8rEnw1FuGWA"; 

app.get('/', (req, res) => {
    res.send(htmlContent);
});

app.post('/generate-app', async (req, res) => {
    const { prompt } = req.body;
    if (!GEMINI_API_KEY) {
        return res.json({ message: "مفتاح الـ API مفقود." });
    }

    try {
        const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
        const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" });
        
        const systemInstruction = "أنت مبرمج محترف. صمم تطبيق ويب كامل (HTML, CSS, JS) داخل كود واحد فقط استجابة لطلب المستخدم. لا تكتب أي مقدمات أو تفسيرات، فقط الكود الصافي.";
        
        const result = await model.generateContent([systemInstruction, prompt]);
        let code = result.response.text();
        
        code = code.replace(/```html/g, '').replace(/```/g, '').trim();
        res.json({ message: code, status: "success" });
    } catch (error) {
        res.json({ message: "حدث خطأ أثناء الاتصال بالذكاء الاصطناعي: " + error.message });
    }
});

const htmlContent = `
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>منصة جسار AI لصناعة التطبيقات</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>body { background-color: #0b0f19; color: #f3f4f6; }</style>
</head>
<body class="font-sans min-h-screen flex flex-col">
    <header class="border-b border-gray-800 bg-[#111827] p-4 flex justify-between items-center shadow-lg">
        <div class="flex items-center gap-3">
            <div class="bg-blue-600 p-2 rounded-lg text-white font-bold text-xl">⚡</div>
            <h1 class="text-xl font-black tracking-wide text-blue-400">منصة جـسـار AI</h1>
        </div>
        <span class="text-xs bg-green-500/10 text-green-400 border border-green-500/20 px-3 py-1 rounded-full font-mono">المحرك السحابي نشط</span>
    </header>
    <main class="flex-1 flex flex-col md:flex-row p-4 gap-4 h-[calc(100vh-73px)]">
        <div class="w-full md:w-1/3 flex flex-col bg-[#111827] rounded-xl border border-gray-800 p-4 gap-4 shadow-xl">
            <h2 class="text-lg font-bold text-gray-200 border-b border-gray-800 pb-2">ماذا تريد أن تصنع اليوم؟</h2>
            <textarea id="promptInput" placeholder="اكتب فكرتك هنا بالتفصيل..." class="w-full flex-1 p-3 bg-[#1f2937] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 resize-none"></textarea>
            <button onclick="generateApp()" class="w-full py-3 bg-blue-600 hover:bg-blue-700 active:scale-[0.98] transition-all rounded-lg font-bold text-white text-center shadow-md">ابنِ التطبيق الآن 🚀</button>
        </div>
        <div class="flex-1 flex flex-col bg-[#111827] rounded-xl border border-gray-800 p-4 shadow-xl">
            <div class="flex border-b border-gray-800 pb-2 justify-between items-center"><h2 class="text-lg font-bold text-gray-200">نافذة المعاينة والإنتاج الدقيق</h2></div>
            <iframe class="flex-1 bg-white rounded-lg mt-3 border border-gray-800" id="previewFrame"></iframe>
        </div>
    </main>
    <script>
        async function generateApp() {
            const prompt = document.getElementById('promptInput').value;
            const previewFrame = document.getElementById('previewFrame');
            if(!prompt) return alert('رجاءً اكتب فكرتك أولاً!');
            
            previewFrame.srcdoc = "<h2 style='color:black; padding:20px; font-family:sans-serif;'>جاري بناء تطبيقك واختبار الأكواد بدقة عالية... 🚀</h2>";
            
            try {
                const response = await fetch('/generate-app', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ prompt })
                });
                const data = await response.json();
                previewFrame.srcdoc = data.message;
            } catch (error) { 
                previewFrame.srcdoc = "<h2 style='color:red; padding:20px;'>حدث خطأ في الاتصال بالسيرفر السحابي.</h2>"; 
            }
        }
    </script>
</body>
</html>
`;

app.listen(port, () => {
    console.log(`🚀 السيرفر يعمل على المنفذ: ${port}`);
});
