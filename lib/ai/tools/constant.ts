import {
  LucideFilePlus,
  LucideGlobe,
  LucideIcon,
  ImageIcon,
} from "lucide-react";

export const ToolNameEnum = {
  CreateNote: "createNote",
  WebSearch: "webSearch",
  ExtractWebUrl: "extractWebUrl",
  GenerateImage: "generateImage",
} as const;

export type ToolNameType = (typeof ToolNameEnum)[keyof typeof ToolNameEnum];

export const ToolTypeEnum = {
  CreateNote: "tool-createNote",
  WebSearch: "tool-webSearch",
  ExtractWebUrl: "tool-extractWebUrl",
  GenerateImage: "tool-generateImage",
} as const;

export type ToolType = (typeof ToolTypeEnum)[keyof typeof ToolTypeEnum];

export interface AvailableToolType {
  toolName: ToolNameType;
  type: ToolType;
  name: string;
  description: string;
  icon: LucideIcon;
}

export type SearchMode = "normal" | "none";

export const AVAILABLE_TOOLS: AvailableToolType[] = [
  {
    toolName: ToolNameEnum.CreateNote,
    type: ToolTypeEnum.CreateNote,
    name: "Create Note",
    description: "Create a new note with a title and content",
    icon: LucideFilePlus,
  },
  {
    toolName: ToolNameEnum.WebSearch,
    type: ToolTypeEnum.WebSearch,
    name: "Web Search",
    description: "Web search",
    icon: LucideGlobe,
  },
  {
    toolName: ToolNameEnum.GenerateImage,
    type: ToolTypeEnum.GenerateImage,
    name: "Generate Image",
    description: "Generate an image from a text prompt",
    icon: ImageIcon,
  },
];
