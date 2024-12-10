import { Style, PortraitResponse } from './types';
import { env } from '@/app/env';

export class APIError extends Error {
  constructor(message: string, public status?: number) {
    super(message);
    this.name = 'APIError';
  }
}

export async function generatePortrait(
  userId: string,
  style: Style,
  avatar: boolean
): Promise<PortraitResponse> {
  try {
    const response = await fetch(`${env.DIFY_BASE_URL}workflows/run`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${env.DIFY_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: {
          user_id: userId,
          lang: 'zh-Hans',
          style: style,
          avatar: avatar.toString()
        },
        response_mode: 'blocking',
        user: userId
      }),
    });

    if (!response.ok) {
      throw new APIError(`API request failed with status ${response.status}`, response.status);
    }

    const data = await response.json();

    if (!data?.data?.outputs?.img?.[0]?.url || !data?.data?.outputs?.prompt) {
      throw new APIError('Invalid API response format');
    }

    return data;
  } catch (error) {
    if (error instanceof APIError) {
      throw error;
    }
    throw new APIError(error instanceof Error ? error.message : 'Failed to generate portrait');
  }
}