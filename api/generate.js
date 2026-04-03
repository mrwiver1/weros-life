export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { inputData } = req.body;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
       model: 'claude-3-5-sonnet-20241022',
        max_tokens: 4000,
        messages: [
          {
            role: 'user',
            content: `입력 데이터:
${JSON.stringify(inputData, null, 2)}`
          }
        ]
      })
    });

    const data = await response.json();
    const result = data.content?.map(item => item.text || '').join('') || '결과 생성 실패';

    return res.status(200).json({ result });
  } catch (error) {
    return res.status(500).json({ error: error.message || 'Server error' });
  }
}
