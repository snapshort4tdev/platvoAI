/* eslint-disable @typescript-eslint/no-explicit-any */
import { UseChatHelpers } from "@ai-sdk/react";
import { ChatStatus, FileUIPart, UIMessage } from "ai";
import React, {
  Dispatch,
  FC,
  SetStateAction,
  useCallback,
  useState,
  useEffect,
} from "react";
import {
  PromptInput,
  PromptInputAttachment,
  PromptInputAttachments,
  PromptInputButton,
  PromptInputModelSelect,
  PromptInputModelSelectContent,
  PromptInputModelSelectItem,
  PromptInputModelSelectTrigger,
  PromptInputModelSelectValue,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputToolbar,
  PromptInputTools,
  usePromptInputAttachments,
} from "../ai-elements/prompt-input";
import { cn } from "@/lib/utils";
import { MODEL_OPTIONS, chatModels } from "@/lib/ai/models";
import { ModelIcon } from "./model-icon";
import { useLocalChat } from "@/hooks/use-localchat";
import { ArrowUpIcon, XIcon, Search, LucideFilePlus, ImageIcon, LockIcon, PaperclipIcon } from "lucide-react";
import { AVAILABLE_TOOLS, AvailableToolType, SearchMode } from "@/lib/ai/tools/constant";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { RiSquareFill } from "@remixicon/react";
import { toast } from "sonner";
import useViewState from "@/hooks/use-view-state";
import { getTextDirection } from "@/lib/utils/language-detection";
import { useTranslation } from "@/lib/i18n";
import {
  FREE_MODEL_UPGRADE_MESSAGE,
  getDefaultModelForPlan,
  isModelLockedForPlan,
  type PlanAccessPlan,
} from "@/lib/subscription/plan-access";

const MAX_CHAT_FILES = 5;
const MAX_CHAT_FILE_SIZE = 5 * 1024 * 1024;
const CHAT_FILE_ACCEPT =
  "image/*,.pdf,.txt,.md,.csv,.json,text/*,application/pdf,application/json,text/csv";

type Props = {
  chatId: string;
  input: string;
  className?: string;
  hasReachedLimit?: boolean;

  setInput: Dispatch<SetStateAction<string>>;
  status: ChatStatus;
  messages: Array<UIMessage>;
  sendMessage: UseChatHelpers<UIMessage>["sendMessage"];
  initialModelId: string;
  subscriptionPlan?: PlanAccessPlan;
  isSubscriptionStatusLoading?: boolean;
  disabled?: boolean;
  stop: () => void;
};

const ChatInput: FC<Props> = ({
  chatId,
  input,
  initialModelId,
  status,
  className,
  setInput,
  sendMessage,
  disabled,
  stop,
  subscriptionPlan,
  isSubscriptionStatusLoading = false,
}) => {
  const { localModelId, setLocalModelId } = useLocalChat();
  const { setIsChatView } = useViewState();
  const [selectedTool, setSelectedTool] = useState<AvailableToolType | null>(
    null
  );
  const [searchMode, setSearchMode] = useState<SearchMode>("none");

  const selectedModelId = localModelId || initialModelId;
  const t = useTranslation();

  // Detect text direction based on input
  const inputDirection = getTextDirection(input);

  const handleInput = (e: any) => {
    const newValue = e.target.value;
    setInput(newValue);
  };

  const showUpgradeToast = useCallback(() => {
    toast.info(FREE_MODEL_UPGRADE_MESSAGE, {
      action: {
        label: "Upgrade",
        onClick: () => {
          window.location.href = "/billing";
        },
      },
    });
  }, []);

  const handleSelect = useCallback((value: string) => {
    const model = chatModels.find((m) => m.id === value);

    if (
      !isSubscriptionStatusLoading &&
      model &&
      isModelLockedForPlan(subscriptionPlan, model)
    ) {
      showUpgradeToast();
      return;
    }

    setLocalModelId(value);
  }, [
    isSubscriptionStatusLoading,
    setLocalModelId,
    showUpgradeToast,
    subscriptionPlan,
  ]);

  useEffect(() => {
    if (isSubscriptionStatusLoading) {
      return;
    }

    const selectedModel = chatModels.find((m) => m.id === selectedModelId);
    if (
      !selectedModel ||
      !isModelLockedForPlan(subscriptionPlan, selectedModel)
    ) {
      return;
    }

    const defaultModel = getDefaultModelForPlan(
      subscriptionPlan,
      chatModels,
      selectedModelId
    );

    if (defaultModel && defaultModel.id !== selectedModelId) {
      setLocalModelId(defaultModel.id);
    }
  }, [
    isSubscriptionStatusLoading,
    selectedModelId,
    setLocalModelId,
    subscriptionPlan,
  ]);


  const removeTool = () => {
    setSelectedTool(null);
  };

  const handleStop = () => {
    stop();
    toast.info(t("messages.generationStopped"));
  };

  const handleFormSubmit = useCallback(({
    text = "",
    files = [],
  }: {
    text?: string;
    files?: FileUIPart[];
  }) => {
    // Generation limit check removed - unlimited for now
    if (disabled) return false;
    const attachedFiles = files.filter((file) => file.url && file.mediaType);
    if (!text?.trim() && attachedFiles.length === 0) {
      toast.error(t("messages.pleaseTypeMessage"));
      return false;
    }

    if (!chatId) {
      toast.error(t("messages.chatIdNotFound"));
      return false;
    }

    window.history.replaceState({}, "", `/chat/${chatId}`);
    setIsChatView(true);

    if (status === "streaming") {
      toast.error(t("messages.waitForResponse"));
      return false;
    }

    const selectedModel = chatModels.find((m) => m.id === selectedModelId);
    if (
      !isSubscriptionStatusLoading &&
      selectedModel &&
      isModelLockedForPlan(subscriptionPlan, selectedModel)
    ) {
      showUpgradeToast();
      return false;
    }

    // Build message parts
    const parts: any[] = [];

    // Add text part
    if (text?.trim()) {
      parts.push({
        type: "text",
        text: text.trim(),
      });
    }

    attachedFiles.forEach((file) => {
      parts.push({
        type: "file",
        url: file.url,
        mediaType: file.mediaType,
        filename: file.filename,
      });
    });

    // Determine selected tool name based on search mode
    let toolName: string | null = selectedTool?.name || null;
    if (searchMode === "normal" && !toolName) {
      toolName = t("chat.webSearch");
    }

    // Send message
    sendMessage(
      {
        role: "user",
        parts,
      },
      {
        body: {
          selectedModelId: selectedModelId,
          selectedToolName: toolName,
          searchMode: searchMode,
        },
      }
    );
    setInput("");
    return true;
  }, [
    chatId,
    status,
    disabled,
    selectedTool,
    selectedModelId,
    subscriptionPlan,
    isSubscriptionStatusLoading,
    searchMode,
    setInput,
    sendMessage,
    showUpgradeToast,
    setIsChatView,
    t,
  ]);


  const isGenerating = status === "streaming" || status === "submitted";
  const placeholder = t("chat.placeholder");
  return (
    <PromptInput
      accept={CHAT_FILE_ACCEPT}
      className={cn(
        `relative bg-white dark:bg-[#242628] ring-border shadow-md dark:shadow-black/5 !rounded-2xl sm:!rounded-3xl !divide-y-0 pb-1.5 sm:pb-2 transition-colors`,
        className && className
      )}
      maxFiles={MAX_CHAT_FILES}
      maxFileSize={MAX_CHAT_FILE_SIZE}
      multiple
      onError={(error) => toast.error(error.message)}
      onSubmit={handleFormSubmit}
    >
      <div className="relative">
        {(selectedTool || searchMode !== "none") && (
          <div className="flex items-center gap-1 pt-1.5 pl-2 sm:pl-3 flex-wrap">
            {selectedTool && (
              <div className="inline-flex items-center gap-1 bg-primary/10 text-primary px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-md text-xs font-medium border">
                <selectedTool.icon size={11} className="sm:w-3 sm:h-3" />
                <span className="hidden sm:inline">{selectedTool.name}</span>
                <button
                  className="ml-0.5 sm:ml-1 hover:bg-primary/20 rounded-sm p-0.5 transition-colors"
                  onClick={removeTool}
                >
                  <XIcon size={10} className="sm:w-2.5 sm:h-2.5" />
                </button>
              </div>
            )}
            {searchMode === "normal" && (
              <div className="inline-flex items-center gap-1 bg-blue-500/10 text-blue-500 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-md text-xs font-medium border">
                <Search size={11} className="sm:w-3 sm:h-3" />
                <span className="hidden sm:inline">{t("chat.webSearch")}</span>
                <button
                  className="ml-0.5 sm:ml-1 hover:bg-blue-500/20 rounded-sm p-0.5 transition-colors"
                  onClick={() => setSearchMode("none")}
                >
                  <XIcon size={10} className="sm:w-2.5 sm:h-2.5" />
                </button>
              </div>
            )}
          </div>
        )}

        <PromptInputTextarea
          placeholder={placeholder}
          rows={2}
          autoFocus
          value={input}
          dir={inputDirection}
          className={cn(
            "min-h-14 sm:min-h-16 pt-2 px-2 sm:px-3 overflow-hidden !text-sm sm:!text-base",
            inputDirection === "rtl" ? "text-right" : "text-left"
          )}
          onChange={handleInput}
        />
        <PromptInputAttachments className="px-2 sm:px-3 pb-2">
          {(attachment) => (
            <PromptInputAttachment
              data={attachment}
              className="bg-background shadow-xs"
            />
          )}
        </PromptInputAttachments>
      </div>

      <PromptInputToolbar>
        <PromptInputTools className="flex-wrap gap-1 sm:gap-1.5">
          <AttachmentButton disabled={disabled || isGenerating} />

          <ModelSelector
            selectedModelId={selectedModelId}
            onSelect={handleSelect}
            subscriptionPlan={subscriptionPlan}
            isSubscriptionStatusLoading={isSubscriptionStatusLoading}
          />

          {/* Web Search Button */}
          <PromptInputButton
            className={cn(
              "text-muted-foreground flex items-center gap-1 sm:gap-1.5",
              searchMode === "normal" && "bg-blue-500/10 text-blue-500 border-blue-500/20"
            )}
            size="sm"
            variant="outline"
            onClick={() => {
              setSearchMode(searchMode === "normal" ? "none" : "normal");
              if (selectedTool?.toolName === "createNote") {
                setSelectedTool(null);
              }
            }}
            type="button"
            title={t("chat.webSearch")}
          >
            <Search size={14} className="sm:w-4 sm:h-4" />
            <span className="text-xs hidden sm:inline">{t("chat.webSearch")}</span>
          </PromptInputButton>

          {/* Create Note Button */}
          <PromptInputButton
            className={cn(
              "text-muted-foreground flex items-center gap-1 sm:gap-1.5",
              selectedTool?.toolName === "createNote" && "bg-primary/10 text-primary border-primary/20"
            )}
            size="sm"
            variant="outline"
            onClick={() => {
              const createNoteTool = AVAILABLE_TOOLS.find(tool => tool.toolName === "createNote");
              if (createNoteTool) {
                if (selectedTool?.toolName === "createNote") {
                  setSelectedTool(null);
                } else {
                  setSelectedTool(createNoteTool);
                  setSearchMode("none");
                }
              }
            }}
            type="button"
            title={t("chat.createNote")}
          >
            <LucideFilePlus size={14} className="sm:w-4 sm:h-4" />
            <span className="text-xs hidden sm:inline">{t("chat.createNote")}</span>
          </PromptInputButton>

          {/* Generate Image Button */}
          <PromptInputButton
            className={cn(
              "text-muted-foreground flex items-center gap-1 sm:gap-1.5",
              selectedTool?.toolName === "generateImage" && "bg-primary/10 text-primary border-primary/20"
            )}
            size="sm"
            variant="outline"
            onClick={() => {
              const generateImageTool = AVAILABLE_TOOLS.find(tool => tool.toolName === "generateImage");
              if (generateImageTool) {
                if (selectedTool?.toolName === "generateImage") {
                  setSelectedTool(null);
                } else {
                  setSelectedTool(generateImageTool);
                  setSearchMode("none");
                }
              }
            }}
            type="button"
            title={t("chat.generateImage")}
          >
            <ImageIcon size={14} className="sm:w-4 sm:h-4" />
            <span className="text-xs hidden sm:inline">{t("chat.generateImage")}</span>
          </PromptInputButton>
        </PromptInputTools>

        {isGenerating ? (
          <StopButton stop={handleStop} />
        ) : (
          <ChatSubmitButton
            disabled={disabled}
            input={input}
            status={status}
          />
        )}
      </PromptInputToolbar>
    </PromptInput>
  );
};

function AttachmentButton({ disabled }: { disabled?: boolean }) {
  const attachments = usePromptInputAttachments();

  return (
    <PromptInputButton
      className="text-muted-foreground"
      disabled={disabled}
      onClick={attachments.openFileDialog}
      size="sm"
      title="Attach files"
      type="button"
      variant="outline"
    >
      <PaperclipIcon size={14} className="sm:w-4 sm:h-4" />
    </PromptInputButton>
  );
}

function ChatSubmitButton({
  disabled,
  input,
  status,
}: {
  disabled?: boolean;
  input: string;
  status: ChatStatus;
}) {
  const attachments = usePromptInputAttachments();
  const hasMessageContent = input.trim().length > 0 || attachments.files.length > 0;

  return (
    <PromptInputSubmit
      status={status}
      disabled={!hasMessageContent || disabled}
      className="absolute right-1.5 sm:right-2 rounded-full bottom-1 sm:bottom-1.5 !text-white"
    >
      <ArrowUpIcon size={20} className="sm:w-6 sm:h-6" />
    </PromptInputSubmit>
  );
}

function ModelSelector({
  selectedModelId,
  onSelect,
  subscriptionPlan,
  isSubscriptionStatusLoading,
}: {
  selectedModelId: string;
  onSelect: (value: string) => void;
  subscriptionPlan?: PlanAccessPlan;
  isSubscriptionStatusLoading: boolean;
}) {
  return (
    <>
      <PromptInputModelSelect
        value={selectedModelId}
        onValueChange={(value) => {
          onSelect(value);
        }}
      >
        <PromptInputModelSelectTrigger className="bg-white dark:bg-inherit border text-xs sm:text-sm">
          <PromptInputModelSelectValue>
            {(() => {
              const selectedModel = chatModels.find((m) => m.id === selectedModelId);
              const selectedOption = MODEL_OPTIONS.find((m) => m.value === selectedModelId);
              if (selectedModel && selectedOption) {
                return (
                  <span className="flex items-center gap-1.5 sm:gap-2">
                    <ModelIcon
                      iconUrl={selectedModel.iconUrl}
                      size={14}
                      className="sm:w-4 sm:h-4"
                      alt={`${selectedOption.label} icon`}
                    />
                    <span className="truncate max-w-[80px] sm:max-w-none">{selectedOption.label}</span>
                  </span>
                );
              }
              return <span className="truncate max-w-[80px] sm:max-w-none">{selectedOption?.label || ""}</span>;
            })()}
          </PromptInputModelSelectValue>
        </PromptInputModelSelectTrigger>
        <PromptInputModelSelectContent>
          {MODEL_OPTIONS.map((model) => {
            const modelData = chatModels.find((m) => m.id === model.value);
            const isLocked =
              !isSubscriptionStatusLoading &&
              !!modelData &&
              isModelLockedForPlan(subscriptionPlan, modelData);
            return (
              <PromptInputModelSelectItem
                key={model.value}
                value={model.value}
                aria-disabled={isLocked}
                onSelect={(event) => {
                  if (!isLocked) {
                    return;
                  }

                  event.preventDefault();
                  onSelect(model.value);
                }}
                className={cn(
                  "flex items-center gap-2 pr-12",
                  isLocked &&
                    "cursor-pointer bg-muted/40 text-muted-foreground focus:bg-primary/10 focus:text-foreground"
                )}
              >
                <ModelIcon
                  iconUrl={modelData?.iconUrl}
                  size={16}
                  alt={`${model.label} icon`}
                />
                <span className="flex min-w-0 flex-1 items-center gap-2 overflow-hidden">
                  <span className="min-w-0 flex-1 truncate">{model.label}</span>
                  {isLocked && (
                    <Badge
                      variant="outline"
                      className="ml-auto border-primary/30 bg-primary/10 px-1.5 py-0 text-[10px] font-semibold uppercase text-primary"
                    >
                      <LockIcon className="size-3" />
                      Pro
                    </Badge>
                  )}
                </span>
              </PromptInputModelSelectItem>
            );
          })}
        </PromptInputModelSelectContent>
      </PromptInputModelSelect>
    </>
  );
}

function StopButton({ stop }: { stop: () => void }) {
  return (
    <Button
      size="icon"
      className="!bg-muted rounded-full dark:!bg-black border cursor-pointer"
      onClick={stop}
    >
      <RiSquareFill size={14} className="text-black dark:text-white" />
    </Button>
  );
}
export default ChatInput;
