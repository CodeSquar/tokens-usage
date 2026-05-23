import type { Message } from "../types/index.js";
import { ValidationError } from "../errors/index.js";

export function textToMessages(text: string): Message[] {
  return [{ role: "user", content: text }];
}

export function resolveMessages(
  messages?: Message[],
  text?: string,
): Message[] {
  if (messages && messages.length > 0) {
    return messages;
  }
  if (text !== undefined && text !== "") {
    return textToMessages(text);
  }
  throw new ValidationError(
    "Either messages or text must be provided and non-empty.",
  );
}

export function partitionSystemMessages(
  messages: Message[],
  system?: string,
): { system?: string; messages: Message[] } {
  const systemParts: string[] = [];
  if (system) {
    systemParts.push(system);
  }

  const conversationMessages: Message[] = [];
  for (const message of messages) {
    if (message.role === "system") {
      systemParts.push(message.content);
    } else {
      conversationMessages.push(message);
    }
  }

  if (conversationMessages.length === 0) {
    throw new ValidationError(
      "At least one non-system message must be provided.",
    );
  }

  return {
    system: systemParts.length > 0 ? systemParts.join("\n") : undefined,
    messages: conversationMessages,
  };
}

export function flattenMessages(messages: Message[], system?: string): string {
  const parts: string[] = [];
  if (system) {
    parts.push(system);
  }
  for (const message of messages) {
    parts.push(`${message.role}: ${message.content}`);
  }
  return parts.join("\n");
}
