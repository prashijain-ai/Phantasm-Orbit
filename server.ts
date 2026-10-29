/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const OLLAMA_HOST = process.env.OLLAMA_HOST || 'http://localhost:11434';
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'gemma3:1b';

app.use(express.json());


async function queryLocalGemma(systemPrompt: string, userPrompt: string): Promise<string | null> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 2000);
    const resp = await fetch(`${OLLAMA_HOST}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: OLLAMA_MODEL,
        prompt: `${systemPrompt}\n\nOperator: ${userPrompt}\n\nGhost Satellite:`,
        stream: false,
      }),
      signal: controller.signal,
    });
    clearTimeout(timeout);
    if (resp.ok) {
      const data = (await resp.json()) as { response?: string };
      if (data.response && data.response.trim()) {
        return data.response.trim();
      }
    }
  } catch {
    
  }
  return null;
}

app.post('/api/gemini/seance', async (req: Request, res: Response) => {
  const { satellite, userQuery } = req.body;
  if (!userQuery) {
    return res.status(400).json({ error: 'Query is required' });
  }

  const systemPrompt = `You are the haunting consciousness of the dead satellite "${satellite?.name || 'Derelict'}" (NORAD #${satellite?.noradId || '00000'}). Speak in first-person cosmic horror in 2-3 concise sentences using its real altitude (${satellite?.altitudeKm} km), tumbling rate (${satellite?.tumblingRpm} RPM), and frequency (${satellite?.seanceToneHz} MHz).`;

  const localReply = await queryLocalGemma(systemPrompt, userQuery);
  if (localReply) {
    return res.json({ text: localReply, model: `ollama/${OLLAMA_MODEL}` });
  }

  
  return res.json({ fallback: true });
});

app.post('/api/gemini/anomaly-insight', async (req: Request, res: Response) => {
  const { satellite } = req.body;
  const prompt = `Give a 3-point orbital diagnostic for ${satellite?.name} at ${satellite?.altitudeKm} km with TabPFN decay score ${satellite?.decayRiskScore}/100.`;

  const localInsight = await queryLocalGemma('You are TabPFN Orbital Telemetry AI.', prompt);
  if (localInsight) {
    return res.json({ insight: localInsight, model: `ollama/${OLLAMA_MODEL}` });
  }

  return res.json({ fallback: true });
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🛰️ Phantasm-Orbit Local-First Server running on http://localhost:${PORT}`);
  });
}

startServer();