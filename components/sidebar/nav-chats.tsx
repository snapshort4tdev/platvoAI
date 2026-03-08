"use client";
import React from "react";
import {
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "../ui/sidebar";
import { RiAddLine, RiChatAiLine, RiLoader5Fill } from "@remixicon/react";
import { useChats } from "@/features/use-chat";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { useTranslation } from "@/lib/i18n";

const NavChats = () => {
  const router = useRouter();
  const { data, isPending } = useChats();
  const t = useTranslation();

  const chats = data || [];

  const onCreate = () => {
    router.push("/chat");
  };

  const onClick = (id: string) => {
    router.push(`/chat/${id}`);
  };

  return (
    <SidebarGroup>
      <SidebarGroupLabel>
        <h5>{t("header.chatHistory")}</h5>
        <SidebarGroupAction
          className="mt-[1.5px] flex items-center size-5.5 rounded-md bg-primary/20 border cursor-pointer"
          onClick={onCreate}
        >
          <RiAddLine className="!size-5" />
          <span className="sr-only">{t("header.newChat")}</span>
        </SidebarGroupAction>
      </SidebarGroupLabel>
      <SidebarGroupContent className="w-full h-auto min-h-32 max-h-[360px] overflow-y-auto">
        <SidebarMenu>
          {chats?.length === 0 ? (
            <div>{t("chats.noChats")}</div>
          ) : isPending ? (
            <div className="flex items-center justify-center">
              <RiLoader5Fill className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : (
            chats?.map((chat) => {
              return (
                <SidebarMenuItem key={chat.id}>
                  <SidebarMenuButton
                    className="flex items-center w-full"
                    onClick={() => onClick(chat.id)}
                  >
                    <span className="w-8 h-8 bg-secondary rounded-lg flex items-center justify-center">
                      <RiChatAiLine className="w-4 h-4 text-primary" />
                    </span>
                    <div className="flex-1 min-w-0">
                      <h5 className="truncate">{chat.title}</h5>
                      <p className="text-xs text-muted-foreground truncate">
                        {format(new Date(chat.createdAt), "MMM d, yyyy")}
                      </p>
                    </div>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })
          )}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
};

export default NavChats;
