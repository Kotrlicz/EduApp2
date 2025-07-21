import React, { useState } from "react";
import { Button } from "@/components/ui/button";

interface ChatAIProps {
  topic: string;
  systemPrompt: string;
  firstQuestion: string;
}

const requiredGroups = [
  ["lidé", "lidi"],
  ["zvířata", "zvíře"],
  ["věci", "věc"]
];

function hasAllRequiredGroups(message: string) {
  const lower = message.toLowerCase().replace(/[.,!?;:]/g, '').trim();
  return requiredGroups.every(group =>
    group.some(variant => lower.includes(variant))
  );
}

const ChatAI: React.FC<ChatAIProps> = ({ topic, systemPrompt, firstQuestion }) => {
  const [messages, setMessages] = useState([
    { role: "system", content: systemPrompt },
    { role: "assistant", content: firstQuestion },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMessage = input.trim();

    // Hybrid logic: check for all required groups before calling AI
    if (!hasAllRequiredGroups(userMessage)) {
      setMessages([...messages, { role: "user", content: userMessage }, { role: "assistant", content: "Ano. Co dále?" }]);
      setInput("");
      return;
    }

    // If all groups are present, call the AI for feedback
    const newMessages = [...messages, { role: "user", content: userMessage }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("http://localhost:3001/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages.filter(m => m.role !== "system"), topic }),
      });
      const data = await res.json();
      setMessages([...newMessages, { role: "assistant", content: data.reply }]);
    } catch (err) {
      setMessages([...newMessages, { role: "assistant", content: "Došlo k chybě při komunikaci s AI." }]);
    }
    setLoading(false);
  };

  return (
    <div className="bg-card rounded-xl shadow-lg p-6 max-w-2xl w-full mx-auto mt-8">
      <h3 className="text-xl font-bold mb-4">AI Konverzace: {firstQuestion}</h3>
      <div className="h-64 overflow-y-auto bg-muted rounded p-3 mb-4 flex flex-col gap-2">
        {messages.filter(m => m.role !== "system").map((msg, idx) => (
          <div
            key={idx}
            className={`p-2 rounded-lg max-w-[80%] ${msg.role === "user" ? "bg-primary text-white self-end" : "bg-background text-foreground self-start"}`}
          >
            {msg.content}
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          className="flex-1 border rounded px-3 py-2 focus:outline-none focus:ring"
          type="text"
          placeholder="Napiš zprávu..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && handleSend()}
          disabled={loading}
        />
        <Button onClick={handleSend} disabled={loading || !input.trim()}>
          Odeslat
        </Button>
      </div>
    </div>
  );
};

export default ChatAI; 