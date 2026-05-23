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
