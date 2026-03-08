import { UIMessage } from "ai";
import React from "react";
import { Message, MessageContent } from "../ai-elements/message";
import { cn } from "@/lib/utils";
import { Response } from "../ai-elements/response";
// import { useTheme } from "next-themes";
import { ToolTypeEnum } from "@/lib/ai/tools/constant";
import ToolCall from "./tool-call";
import MessageAction from "./message-action";
import { getTextDirection } from "@/lib/utils/language-detection";

interface Props {
  message: UIMessage;
  isLoading: boolean;
}

const PreviewMessage = React.memo(({ message, isLoading }: Props) => {
  // const { theme } = useTheme();
  
  // Extract all text from message parts to detect language
  const allText = message.parts
    .map((part) => {
      if (part.type === "text") {
        return (part as { text: string }).text;
      }
      return "";
    })
    .join(" ");

  // Detect text direction based on language
  const textDirection = getTextDirection(allText);

  return (
    <Message
      from={message.role}
      key={message.id}
      className={cn("", message.role !== "user" && "!max-w-full")}
    >
      <MessageContent
        dir={textDirection}
        className={cn(
          "text-sm sm:text-[15.5px] dark:text-white",
          textDirection === "rtl" ? "text-right" : "text-left",
          message.role !== "user"
            ? "!w-full !max-w-full !px-1 sm:!px-2 !pb-0 !bg-transparent !m-0 !min-h-0"
            : "!bg-muted !p-2 sm:!p-2.5 text-sm sm:text-[14.5px] !text-foreground"
        )}
      >
        {message.parts.map((part, i) => {
          switch (part.type) {
            case "text": {
              // Check if this message has a GenerateImage tool call - if so, filter out image URLs from text
              const hasGenerateImage = message.parts.some(p => p.type === ToolTypeEnum.GenerateImage);
              let textContent = part.text;
              
              if (hasGenerateImage) {
                // Remove image URLs from text to prevent duplicate rendering
                // Match common image URL patterns (ImageKit, Replicate, etc.)
                const imageUrlPattern = /https?:\/\/[^\s]+\.(jpg|jpeg|png|gif|webp|svg)(\?[^\s]*)?/gi;
                textContent = textContent.replace(imageUrlPattern, '').trim();
              }
              
              // Don't render empty text after filtering
              if (!textContent) {
                return null;
              }
              
              return (
                <Response
                  key={`${message.id}-${i}`}
                  // shikiTheme={theme === "light" ? "light-plus" : "dracula"}
                >
                  {textContent}
                </Response>
              );
            }

            case ToolTypeEnum.CreateNote: {
              const { toolCallId, state, output, input, errorText } = part;
              return (
                <ToolCall
                  key={toolCallId}
                  toolCallId={toolCallId}
                  type={part.type}
                  input={input}
                  state={state}
                  output={output}
                  errorText={errorText}
                  isLoading={isLoading}
                />
              );
            }
            case ToolTypeEnum.WebSearch: {
              const { toolCallId, state, output, input, errorText } = part;

              return (
                <ToolCall
                  key={toolCallId}
                  toolCallId={toolCallId}
                  type={part.type}
                  input={input}
                  isLoading={isLoading}
                  state={state}
                  output={output}
                  errorText={errorText}
                />
              );
            }
            case ToolTypeEnum.ExtractWebUrl: {
              const { toolCallId, state, output, input, errorText } = part;
              return (
                <ToolCall
                  key={toolCallId}
                  toolCallId={toolCallId}
                  input={input}
                  type={part.type}
                  isLoading={isLoading}
                  state={state}
                  output={output}
                  errorText={errorText}
                />
              );
            }
            case ToolTypeEnum.GenerateImage: {
              const { toolCallId, state, output, input, errorText } = part;
              return (
                <ToolCall
                  key={toolCallId}
                  toolCallId={toolCallId}
                  input={input}
                  type={part.type}
                  isLoading={isLoading}
                  state={state}
                  output={output}
                  errorText={errorText}
                />
              );
            }

            default:
              return null;
          }
        })}

        <MessageAction
          key={`action-${message.id}`}
          message={message}
          isLoading={isLoading}
        />
      </MessageContent>
    </Message>
  );
});

PreviewMessage.displayName = "PreviewMessage";
export default PreviewMessage;
