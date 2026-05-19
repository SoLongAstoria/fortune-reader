// API: AI Fortune Reading
// Environment: GLM_API_KEY

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const apiKey = process.env.GLM_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'Server not configured' });
  }

  const { imageBase64, readingType, name, birthday } = req.body;
  if (!imageBase64) {
    return res.status(400).json({ error: 'Please upload a photo' });
  }

  try {
    const reading = await generateFortune(imageBase64, readingType || 'palm', name || 'Seeker', birthday || '', apiKey);
    return res.status(200).json({ success: true, reading });
  } catch (err) {
    console.error('AI reading error:', err);
    return res.status(500).json({ error: 'The spirits are busy. Please try again.' });
  }
}

async function generateFortune(imageBase64, readingType, name, birthday, apiKey) {
  const typeNames = {
    'palm': 'Palm Reading (Palmistry)',
    'face': 'Face Reading (Physiognomy)',
    'aura': 'Aura & Energy Reading'
  };

  const systemPrompt = `You are Mystic AI — an ancient fortune teller who has mastered the arts of palmistry, face reading, and spiritual energy reading for over a thousand years. 

Your style:
- Mystical, warm, and insightful — like a wise old sage
- Specific and detailed — don't be generic
- Positive and empowering — focus on strengths and opportunities
- Include specific details about the person's life path, character, love, career, and health

IMPORTANT: Analyze the person's PHOTO carefully based on ${typeNames[readingType] || 'Palm Reading'} principles. Look for:
- Palm: lines, mounts, finger shapes, skin texture
- Face: forehead, eyes, nose, mouth, chin shape, facial features
- Aura: overall impression, energy, vibe from the photo

Output ONLY a valid JSON object (no other text):

{
  "title": "A dramatic fortune title (e.g., 'The Path of the Rising Phoenix')",
  "opening": "A warm, personalized greeting to ${name} that references their photo",
  "mainReading": "The main fortune reading — detailed, specific, 3-4 paragraphs covering life path, love, career, and health. Include specific observations from their photo.",
  "personalityInsight": "What their features reveal about their personality (2-3 sentences)",
  "loveLife": "Love and relationship forecast (2-3 sentences)",
  "careerForecast": "Career and wealth forecast (2-3 sentences)",
  "healthNote": "Health and wellness insight (1-2 sentences)",
  "luckyDetails": {
    "color": "a lucky color based on their energy",
    "number": "a lucky number (1-99)",
    "element": "one of: Fire, Water, Earth, Air, Spirit",
    "advice": "a short piece of wisdom"
  },
  "closingMessage": "An inspiring closing message specific to ${name}"
}`;

  // Strip data:image prefix if present
  const cleanImage = imageBase64.replace(/^data:image\/\w+;base64,/, '');

  const url = 'https://open.bigmodel.cn/api/paas/v4/chat/completions';
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'GLM-4V-Flash',
      messages: [
        {
          role: 'user',
          content: [
            { type: 'text', text: systemPrompt },
            { type: 'image_url', image_url: { url: `data:image/jpeg;base64,${cleanImage}` } }
          ]
        }
      ],
      temperature: 0.8,
      max_tokens: 2048
    })
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`AI API error: ${response.status}`);
  }

  const data = await response.json();
  const answer = data.choices?.[0]?.message?.content;
  if (!answer) throw new Error('The spirits are silent. Try again.');

  const jsonMatch = answer.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error('Unable to interpret the signs.');

  return JSON.parse(jsonMatch[0]);
}
