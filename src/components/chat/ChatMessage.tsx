import { cn } from "@/lib/utils";
import { Bot, User } from "lucide-react";

interface ChatMessageProps {
  message: {
    id: string;
    content: string;
    role: 'user' | 'assistant';
    timestamp: Date;
  };
}

export const ChatMessage = ({ message }: ChatMessageProps) => {
  const isUser = message.role === 'user';
  
  return (
    <div className={cn(
      "flex gap-3 p-4 hover:bg-chat-hover transition-colors",
      isUser ? "flex-row-reverse" : "flex-row"
    )}>
      <div className={cn(
        "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
        isUser ? "bg-chat-user-bubble" : "bg-chat-ai-bubble"
      )}>
        {isUser ? (
          <User className="w-4 h-4 text-chat-user-text" />
        ) : (
          <Bot className="w-4 h-4 text-chat-ai-text" />
        )}
      </div>
      
      <div className={cn(
        "max-w-[70%] rounded-2xl px-4 py-2 break-words",
        isUser 
          ? "bg-chat-user-bubble text-chat-user-text rounded-br-md" 
          : "bg-chat-ai-bubble text-chat-ai-text rounded-bl-md"
      )}>
        <div className="whitespace-pre-wrap">{message.content}</div>
        <div className={cn(
          "text-xs mt-1 opacity-60",
          isUser ? "text-chat-user-text" : "text-chat-ai-text"
        )}>
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </div>
  );
};