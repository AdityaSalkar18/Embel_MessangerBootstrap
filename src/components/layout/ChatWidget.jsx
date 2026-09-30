import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { MessageCircle, MessageSquare, Users, Maximize2, Minimize2, X } from "lucide-react";

import Chat from "../pages/Chats/Chats";
import Group from "../pages/Groups/Groups";
import OneToOne from "../pages/OneToOne/OneToOne";
import GroupView from "../pages/Groups/GroupView";
import OneToOneView from "../pages/OneToOne/OneToOneView";
// NOTE: make the "OneToOne" folder casing match your real folder name exactly

const tabs = [
  { key: "chat", label: "Chat", Icon: MessageCircle, Component: Chat },
  { key: "onetoone", label: "One-to-one", Icon: MessageSquare, Component: OneToOne },
  { key: "group", label: "Group", Icon: Users, Component: Group },
  
];

// Build the initial "selected" view from route state (used by /groupview and /onetooneview)
const selectionFromState = (state) => {
  if (state?.group) return { type: "group", data: state.group };
  if (state?.chat) return { type: "onetoone", data: state.chat };
  return null;
};

function ChatWidget() {
  const { pathname, state } = useLocation();

  const isViewRoute = pathname === "/groupview" || pathname === "/onetooneview";

  const [open, setOpen] = useState(isViewRoute || !!state?.openWidget);
  const [expanded, setExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState(
    pathname === "/groupview" ? "group" : pathname === "/onetooneview" ? "onetoone" : state?.tab || "chat"
  );
  const [selected, setSelected] = useState(selectionFromState(state));

  // Keep in sync if the route/state changes while the widget stays mounted
  useEffect(() => {
    const next = selectionFromState(state);
    if (next) {
      setSelected(next);
      setActiveTab(next.type);
      setOpen(true);
    }
  }, [pathname, state]);

    const openOneToOne = (chat) => setSelected({ type: "onetoone", data: chat });
  const openGroup = (group) => setSelected({ type: "group", data: group });

  const closeDetail = () => setSelected(null);

  const switchTab = (key) => {
    setActiveTab(key);
    setSelected(null);
  };

  const ActiveComponent = (tabs.find((t) => t.key === activeTab) || tabs[0]).Component;

  const headerBtn = { width: "32px", height: "32px", color: "#1E2328" };

  return (
    <>
      {open && (
        <div
          className="position-fixed d-flex flex-column"
          style={{
            right: "24px",
            bottom: "90px",
            width: expanded ? "720px" : "370px",
            maxWidth: "calc(100vw - 30px)",
            height: expanded ? "calc(100vh - 120px)" : "520px",
            backgroundColor: "#FFFFFF",
            border: "1px solid #F1E7DC",
            borderRadius: "16px",
            boxShadow: "0 12px 35px rgba(30,35,40,0.20)",
            zIndex: 1050,
            overflow: "hidden",
            transition: "width 0.2s ease, height 0.2s ease",
          }}
        >
          {/* HEADER */}
          <div
            className="d-flex align-items-center justify-content-between px-3 flex-shrink-0"
            style={{ height: "60px", backgroundColor: "#FBE4D0", color: "#1E2328" }}
          >
            <div className="d-flex align-items-center gap-2">
              <div
                className="d-flex align-items-center justify-content-center"
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "50%",
                  backgroundColor: "#F4712B",
                  color: "#FFFFFF",
                  fontWeight: "600",
                  fontSize: "14px",
                }}
              >
                C
              </div>
              <div>
                <div className="fw-semibold" style={{ fontSize: "15px", color: "#1E2328" }}>
                  Chat
                </div>
                <small style={{ color: "#8A7C6F", fontSize: "11px" }}>
                  Messages &amp; contacts
                </small>
              </div>
            </div>

            <div className="d-flex align-items-center gap-2">
              <button
                onClick={() => setExpanded((v) => !v)}
                className="btn p-0 border-0 d-flex align-items-center justify-content-center"
                style={headerBtn}
                title={expanded ? "Shrink chat" : "Expand chat"}
                aria-label={expanded ? "Shrink chat" : "Expand chat"}
              >
                {expanded ? (
                  <Minimize2 size={18} strokeWidth={2} />
                ) : (
                  <Maximize2 size={18} strokeWidth={2} />
                )}
              </button>
              <button
                onClick={() => setOpen(false)}
                className="btn p-0 border-0 d-flex align-items-center justify-content-center"
                style={headerBtn}
                aria-label="Close chat"
                title="Close chat"
              >
                <X size={22} strokeWidth={2} />
              </button>
            </div>
          </div>

          {/* PAGE CONTENT: list tab OR selected view */}
          <div
            className="flex-grow-1"
            style={{ minHeight: 0, overflowY: "auto", backgroundColor: "#FFFFFF" }}
          >
            {selected?.type === "group" ? (
              <GroupView group={selected.data} onBack={closeDetail} />
            ) : selected?.type === "onetoone" ? (
              <OneToOneView chat={selected.data} onBack={closeDetail} />
            ) : (
              <ActiveComponent onOpenGroup={openGroup} onOpenChat={openOneToOne} />
            )}
          </div>

          {/* BOTTOM NAV (hidden while a conversation is open) */}
          {!selected && (
            <div
              className="d-flex align-items-center justify-content-around flex-shrink-0"
              style={{
                height: "65px",
                backgroundColor: "#FFFFFF",
                borderTop: "1px solid #F1E7DC",
              }}
            >
              {tabs.map(({ key, label, Icon }) => (
                <button
                  key={key}
                  onClick={() => switchTab(key)}
                  className="btn border-0 d-flex flex-column align-items-center justify-content-center"
                  style={{
                    color: activeTab === key ? "#F4712B" : "#B9AFA5",
                    fontSize: "10px",
                    fontWeight: activeTab === key ? "600" : "400",
                    gap: "2px",
                  }}
                >
                  <Icon size={17} strokeWidth={2} />
                  {label}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* FLOATING CHAT BUTTON */}
     {/* FLOATING CHAT BUTTON (only shown when the widget is closed) */}
{!open && (
  <button
    onClick={() => setOpen(true)}
    className="position-fixed d-flex align-items-center justify-content-center border-0"
    style={{
      right: "24px",
      bottom: "24px",
      width: "58px",
      height: "58px",
      borderRadius: "50%",
      backgroundColor: "#F4712B",
      color: "#FFFFFF",
      boxShadow: "0 6px 20px rgba(244,113,43,0.35)",
      zIndex: 1060,
      cursor: "pointer",
    }}
    aria-label="Open chat"
  >
    <MessageCircle size={23} strokeWidth={2} />
  </button>
)}
    </>
  );
}

export default ChatWidget;