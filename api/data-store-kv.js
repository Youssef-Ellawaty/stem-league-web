// استيراد Vercel KV إذا كان متاحاً
let kv;
try {
    kv = require('@vercel/kv');
} catch (error) {
    kv = null;
}

const fs = require('fs');
const path = require('path');

// مسار ملف البيانات المحلي (للتطوير)
const DATA_FILE_PATH = path.join(process.cwd(), 'data.json');
const KV_KEY = 'stem-league-data';

// تحميل البيانات
async function loadData() {
    // محاولة التحميل من Vercel KV أولاً
    if (kv && kv.kv) {
        try {
            const data = await kv.kv.get(KV_KEY);
            if (data) {
                console.log('✓ Data loaded from Vercel KV');
                return data;
            }
        } catch (error) {
            console.error('Error loading from KV:', error.message);
        }
    }
    
    // محاولة التحميل من الملف المحلي
    try {
        if (fs.existsSync(DATA_FILE_PATH)) {
            const fileContent = fs.readFileSync(DATA_FILE_PATH, 'utf8');
            const data = JSON.parse(fileContent);
            console.log('✓ Data loaded from data.json');
            
            // حفظ في KV إذا كان متاحاً
            if (kv && kv.kv && data) {
                try {
                    await kv.kv.set(KV_KEY, data);
                    console.log('✓ Data synced to Vercel KV');
                } catch (error) {
                    console.error('Error syncing to KV:', error.message);
                }
            }
            
            return data;
        }
    } catch (error) {
        console.error('Error loading data.json:', error);
    }
    
    // إرجاع البيانات الافتراضية
    console.log('⚠️  Using default data');
    return getDefaultData();
}

// حفظ البيانات
async function saveData(data) {
    try {
        data.lastUpdate = new Date().toISOString();
        
        // حفظ في Vercel KV
        if (kv && kv.kv) {
            try {
                await kv.kv.set(KV_KEY, data);
                console.log('✓ Data saved to Vercel KV');
                return true;
            } catch (error) {
                console.error('Error saving to KV:', error.message);
            }
        }
        
        // حفظ في الملف المحلي (للتطوير)
        try {
            fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(data, null, 2), 'utf8');
            console.log('✓ Data saved to data.json');
            return true;
        } catch (error) {
            console.error('Error saving data.json:', error);
            return false;
        }
    } catch (error) {
        console.error('Error in saveData:', error);
        return false;
    }
}

// البيانات الافتراضية
function getDefaultData() {
    return {
        teams: [
            { id: 1, name: "King", group: "A", logo: "👑" },
            { id: 2, name: "صيادين البرايز", group: "A", logo: "🎯" },
            { id: 3, name: "Koom Elzawany Pro", group: "A", logo: "🔥" },
            { id: 4, name: "خدتك عليه", group: "A", logo: "💪" },
            { id: 5, name: "Kong", group: "B", logo: "🦍" },
            { id: 6, name: "7enkesh FC", group: "B", logo: "⚡" },
            { id: 7, name: "جبناهم فيك", group: "B", logo: "🏆" },
            { id: 8, name: "خليها على الله", group: "B", logo: "🌟" }
        ],
        players: [],
        matches: [],
        rounds: [
            { id: 1, name: "الجولة الأولى" },
            { id: 2, name: "الجولة الثانية" },
            { id: 3, name: "الجولة الثالثة" }
        ],
        news: [],
        tots: [],
        standings: {
            A: [
                { teamId: 1, teamName: "King", played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, goalDiff: 0, points: 0 },
                { teamId: 2, teamName: "صيادين البرايز", played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, goalDiff: 0, points: 0 },
                { teamId: 3, teamName: "Koom Elzawany Pro", played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, goalDiff: 0, points: 0 },
                { teamId: 4, teamName: "خدتك عليه", played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, goalDiff: 0, points: 0 }
            ],
            B: [
                { teamId: 5, teamName: "Kong", played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, goalDiff: 0, points: 0 },
                { teamId: 6, teamName: "7enkesh FC", played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, goalDiff: 0, points: 0 },
                { teamId: 7, teamName: "جبناهم فيك", played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, goalDiff: 0, points: 0 },
                { teamId: 8, teamName: "خليها على الله", played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, goalDiff: 0, points: 0 }
            ]
        },
        lastUpdate: new Date().toISOString()
    };
}

module.exports = {
    loadData,
    saveData,
    getDefaultData
};