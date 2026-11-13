import { useEffect, useState } from "react";
import { Moon, Sun, Bell, Command } from "lucide-react";
import { useAppDispatch, useAppSelector } from "./app/hooks";
import { toggleTheme } from "./features/chat/chatSlice";
import { fetchConversations } from "./services/mockChatApi";
import Sidebar from "./components/Sidebar";
import ChatWindow from "./components/ChatWindow";
import GroupInfo from "./components/GroupInfo";

export default function App() {
  const dispatch = useAppDispatch();
  const theme = useAppSelector((state) => state.chat.theme);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    let mounted = true;
    fetchConversations()
      .then(() => { if (mounted) setLoading(false); })
      .catch(() => { if (mounted) { setLoadError(true); setLoading(false); } });
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  useEffect(() => {
    const handleShortcut = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        document.querySelector<HTMLInputElement>(".search-wrap input")?.focus();
      }
      if (event.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", handleShortcut);
    return () => window.removeEventListener("keydown", handleShortcut);
  }, []);

  if (loading) return <div className="app-loading"><div className="brand-mark">Q</div><strong>QuantumChat</strong><span>Preparing your workspace...</span><div className="loading-bar"><i /></div></div>;
  if (loadError) return <div className="app-loading"><strong>Couldn't load your workspace</strong><button onClick={() => window.location.reload()}>Try again</button></div>;

  return (
    <div className="app-shell">
      <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
      <div className="workspace">
        <div className="workspace-topbar"><div className="breadcrumb"><span>Workspace</span><b>/</b><strong>Messages</strong></div><div className="topbar-actions"><span className="shortcut"><Command size={12} /> K</span><button className="icon-button" aria-label="Notifications"><Bell size={17} /></button><button className="theme-toggle" onClick={() => dispatch(toggleTheme())} aria-label="Toggle theme">{theme === "light" ? <Moon size={16} /> : <Sun size={16} />}<span>{theme === "light" ? "Dark mode" : "Light mode"}</span></button></div></div>
        <div className="chat-layout"><ChatWindow onMenu={() => setMobileOpen(true)} /><GroupInfo /></div>
      </div>
    </div>
  );
}