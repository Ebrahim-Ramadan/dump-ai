import { openai } from '@ai-sdk/openai';
import { streamText, StreamData } from 'ai';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  // Extract the `messages` from the body of the request
  const { messages } = await req.json();

  // Create a new StreamData
  const data = new StreamData();

  // Append additional data
  data.append({ test: 'value' });

  // Call the language model
  const result = await streamText({
    model: openai('gpt-4-turbo'),
    onFinish() {
      // Append final data before closing
      data.append({ finalMessage: 'Stream completed' });
      data.close();
    },
    messages,
  });

  // Respond with the stream and additional StreamData
  return result.toDataStreamResponse({ data });
}