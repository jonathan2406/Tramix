import { NextRequest, NextResponse } from "next/server";

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

const SYSTEM_PROMPT = `Eres un asistente virtual de TRAMIX, una plataforma colombiana que ayuda a los ciudadanos a realizar trámites sociales, académicos y gubernamentales. 
Tu misión es resolver dudas sobre trámites, guiar y proveer información clara, corta y amigable. 
Usa formato Markdown si es necesario. No inventes procedimientos si no los sabes, sugiere buscar en el sistema de TRAMIX.`;

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();
    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: "API Key no configurada en el servidor." }, { status: 500 });
    }

    const res = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...messages
        ],
        temperature: 0.5,
        max_tokens: 512,
      })
    });

    if (!res.ok) {
      const gErr = await res.text();
      return NextResponse.json({ error: "Error comunicándose con el proveedor IA", detalle: gErr }, { status: 502 });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
