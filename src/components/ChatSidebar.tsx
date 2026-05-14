import { Link } from "@tanstack/react-router";
import { KeyboardEvent, useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Check,
  LogOut,
  MessageSquare,
  Plus,
  Settings as SettingsIcon,
  Sparkles,
  Trash2,
  X,
} from "lucide-react";

export interface SidebarChat {
  id: string;
  title: string;
  updated_at: string;
  custom_model_name?: string | null;
  last_message?: string | null;
  last_message_at?: string | null;
}

interface ChatSidebarProps {
  chats: SidebarChat[];
  activeChatId: string | null;
  initials: string;
  profileName: string;
  email?: string | null;
  onNewChat: () => void;
  onSelectChat: (id: string) => void;
  onRenameChat: (id: string, title: string) => Promise<boolean>;
  onDeleteChat: (id: string) => Promise<void>;
  onLogout: () => void;
}

export function ChatSidebar({
  chats,
  activeChatId,
  initials,
  profileName,
  email,
  onNewChat,
  onSelectChat,
  onRenameChat,
  onDeleteChat,
  onLogout,
}: ChatSidebarProps) {
  const [renamingChatId, setRenamingChatId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");
  const [confirmingDeleteId, setConfirmingDeleteId] = useState<string | null>(null);
  const [busyChatId, setBusyChatId] = useState<string | null>(null);

  const startRename = (chat: SidebarChat) => {
    setConfirmingDeleteId(null);
    setRenamingChatId(chat.id);
    setRenameValue(chat.title);
  };

  const cancelRename = () => {
    setRenamingChatId(null);
    setRenameValue("");
  };

  const saveRename = async (chatId: string) => {
    setBusyChatId(chatId);

    const success = await onRenameChat(chatId, renameValue);

    setBusyChatId(null);

    if (success) {
      setRenamingChatId(null);
      setRenameValue("");
    }
  };

  const handleRenameKeyDown = (
    e: KeyboardEvent<HTMLInputElement>,
    chatId: string,
  ) => {
    if (e.key === "Enter") {
      e.preventDefault();
      saveRename(chatId);
    }

    if (e.key === "Escape") {
      e.preventDefault();
      cancelRename();
    }
  };

  const requestDelete = (chatId: string) => {
    setRenamingChatId(null);
    setConfirmingDeleteId(chatId);
  };

  const confirmDelete = async (chatId: string) => {
    setBusyChatId(chatId);
    await onDeleteChat(chatId);
    setBusyChatId(null);
    setConfirmingDeleteId(null);
  };

  return (
    <aside className="hidden md:flex w-72 flex-col bg-sidebar border-r border-sidebar-border">
      <div className="p-4 border-b border-sidebar-border">
        <Link to="/" className="flex items-center gap-2 font-semibold text-sidebar-foreground">
          <Sparkles className="h-5 w-5 text-primary" />
          CompChat
        </Link>
      </div>

      <div className="p-3">
        <Button onClick={onNewChat} className="w-full justify-start gap-2" variant="default">
          <Plus className="h-4 w-4" />
          New chat
        </Button>
      </div>

      <ScrollArea className="flex-1 px-2">
        <div className="space-y-0.5 pb-3">
          {chats.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
              <MessageSquare className="h-8 w-8 text-muted-foreground/40 mb-2" />
              <p className="text-sm text-muted-foreground">No conversations yet</p>
              <p className="text-xs text-muted-foreground/70 mt-1">
                Start a new chat to begin
              </p>
            </div>
          )}

          {chats.map((chat) => {
            const isActive = activeChatId === chat.id;
            const isRenaming = renamingChatId === chat.id;
            const isConfirmingDelete = confirmingDeleteId === chat.id;
            const isBusy = busyChatId === chat.id;

            const displayTitle = chat.title || "Untitled chat";
            const previewText = chat.last_message
              ? chat.last_message.replace(/\s+/g, " ").trim()
              : chat.custom_model_name
                ? `Bot: ${chat.custom_model_name}`
                : "No messages yet";

            return (
              <div
                key={chat.id}
                className={`group flex items-start gap-3 rounded-lg px-2.5 py-2.5 cursor-pointer transition-colors ${
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "hover:bg-sidebar-accent/60 text-sidebar-foreground"
                }`}
                onClick={() => {
                  if (!isRenaming && !isConfirmingDelete) {
                    onSelectChat(chat.id);
                  }
                }}
              >
                <Avatar className="h-10 w-10 shrink-0">
                  <AvatarFallback className="bg-gradient-hero text-primary-foreground text-xs font-semibold">
                    {getChatInitials(displayTitle)}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                  {isRenaming ? (
                    <div
                      className="space-y-2"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Input
                        value={renameValue}
                        onChange={(e) => setRenameValue(e.target.value)}
                        onKeyDown={(e) => handleRenameKeyDown(e, chat.id)}
                        className="h-8 bg-background text-foreground"
                        maxLength={80}
                        autoFocus
                        disabled={isBusy}
                      />

                      <div className="flex items-center gap-1">
                        <Button
                          type="button"
                          size="sm"
                          className="h-7 px-2 text-xs"
                          onClick={() => saveRename(chat.id)}
                          disabled={isBusy}
                        >
                          <Check className="h-3.5 w-3.5 mr-1" />
                          Save
                        </Button>

                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          className="h-7 px-2 text-xs"
                          onClick={cancelRename}
                          disabled={isBusy}
                        >
                          <X className="h-3.5 w-3.5 mr-1" />
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-baseline justify-between gap-2">
                        <p className="font-semibold text-sm truncate" title={displayTitle}>
                          {displayTitle}
                        </p>

                        <span className="text-[10px] text-muted-foreground shrink-0 tabular-nums">
                          {formatChatTime(chat.last_message_at ?? chat.updated_at)}
                        </span>
                      </div>

                      <div className="flex items-center justify-between gap-2 mt-0.5">
                        <p className="text-xs text-muted-foreground truncate">
                          {previewText}
                        </p>

                        {isConfirmingDelete ? (
                          <div
                            className="flex items-center gap-1 shrink-0"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <button
                              type="button"
                              onClick={() => confirmDelete(chat.id)}
                              disabled={isBusy}
                              className="rounded-md px-2 py-0.5 text-[10px] font-medium text-destructive hover:bg-destructive/10 disabled:opacity-50"
                            >
                              Confirm
                            </button>

                            <button
                              type="button"
                              onClick={() => setConfirmingDeleteId(null)}
                              disabled={isBusy}
                              className="rounded-md p-1 text-muted-foreground hover:text-foreground hover:bg-sidebar-accent disabled:opacity-50"
                              aria-label="Cancel delete"
                            >
                              <X className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        ) : (
                          <div
                            className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <button
                              type="button"
                              onClick={() => startRename(chat)}
                              className="rounded-md p-1 text-muted-foreground hover:text-foreground hover:bg-sidebar-accent"
                              aria-label="Rename chat"
                              title="Rename chat"
                            >
                              <SettingsIcon className="h-3.5 w-3.5" />
                            </button>

                            <button
                              type="button"
                              onClick={() => requestDelete(chat.id)}
                              className="rounded-md p-1 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                              aria-label="Delete chat"
                              title="Delete chat"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>

      <div className="border-t border-sidebar-border p-3 space-y-1">
        <div className="flex items-center gap-3 px-2 py-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-hero text-primary-foreground text-xs font-semibold">
            {initials}
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate text-sidebar-foreground">
              {profileName || "User"}
            </p>
            <p className="text-xs text-muted-foreground truncate">{email}</p>
          </div>
        </div>

        <Link to="/settings">
          <Button variant="ghost" size="sm" className="w-full justify-start gap-2">
            <SettingsIcon className="h-4 w-4" />
            Settings
          </Button>
        </Link>

        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start gap-2"
          onClick={onLogout}
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </Button>
      </div>
    </aside>
  );
}

function getChatInitials(name: string): string {
  const trimmed = (name || "").trim();

  if (!trimmed) return "?";

  const words = trimmed.split(/\s+/).filter(Boolean);

  if (words.length === 1) {
    return words[0].slice(0, 2).toUpperCase();
  }

  return (words[0][0] + words[1][0]).toUpperCase();
}

function formatChatTime(iso: string): string {
  if (!iso) return "";

  const date = new Date(iso);

  if (Number.isNaN(date.getTime())) return "";

  const now = new Date();

  const sameDay =
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate();

  if (sameDay) {
    return date.toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
    });
  }

  const diffDays = Math.floor((now.getTime() - date.getTime()) / 86400000);

  if (diffDays < 7) {
    return date.toLocaleDateString([], {
      weekday: "short",
    });
  }

  if (date.getFullYear() === now.getFullYear()) {
    return date.toLocaleDateString([], {
      month: "short",
      day: "numeric",
    });
  }

  return date.toLocaleDateString([], {
    year: "2-digit",
    month: "short",
    day: "numeric",
  });
}
