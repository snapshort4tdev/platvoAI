/* eslint-disable @typescript-eslint/no-explicit-any */

import { ToolUIPart } from "ai";
import {
  AlertCircleIcon,
  CircleSlash,
  FileText,
  GlobeIcon,
  Lightbulb,
  ImageIcon,
} from "lucide-react";
export const getToolStatus = (
  toolName: string,
  state: ToolUIPart["state"],
  output?: any,
  t?: (key: string) => string
) => {
  const getText = (key: string, fallback: string) => t ? t(key) : fallback;

  if (state === "input-streaming") {
    return { 
      text: getText("tools.preparingRequest", "Preparing request..."), 
      icon: Lightbulb 
    };
  }

  if (state === "input-available") {
    return toolName === "createNote"
      ? { 
          text: getText("tools.creatingNote", "Creating note.."), 
          icon: FileText 
        }
        : toolName === "webSearch"
          ? { 
              text: getText("tools.searchingWeb", "Searching web.."), 
              icon: GlobeIcon 
            }
          : toolName === "extractWebUrl"
            ? { 
                text: getText("tools.extractingContent", "Extracting content.."), 
                icon: GlobeIcon 
              }
            : toolName === "generateImage"
              ? { 
                  text: getText("tools.generatingImage", "Generating image.."), 
                  icon: ImageIcon 
                }
              : { 
                  text: getText("tools.working", "Working..."), 
                  icon: Lightbulb 
                };
  }

  if (state === "output-available") {
    return toolName === "createNote"
      ? { 
          text: `Result from ${toolName}`, 
          icon: Lightbulb 
        }
        : toolName === "webSearch"
        ? { 
            text: getText("tools.webSearchResults", "Web search results"), 
            icon: GlobeIcon 
          }
          : toolName === "extractWebUrl"
            ? { 
                text: getText("tools.extractedContent", "Extracted content"), 
                icon: GlobeIcon 
              }
            : toolName === "generateImage"
              ? { 
                  text: getText("tools.imageGenerated", "Image generated"), 
                  icon: ImageIcon 
                }
              : { 
                  text: getText("tools.done", "Done"), 
                  icon: Lightbulb 
                };
  }

  if (state === "output-error") {
    return { 
      text: getText("tools.errorOccurred", "Error occurred"), 
      icon: AlertCircleIcon 
    };
  }

  return { 
    text: getText("tools.unknown", "Unknown"), 
    icon: CircleSlash 
  };
};
