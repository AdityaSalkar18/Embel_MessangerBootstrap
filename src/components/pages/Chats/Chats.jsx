



// import { Search, Plus, MoreVertical, Pin } from "lucide-react";
// import { useCallback, useEffect, useState } from "react";
// import NewChatModal from "./NewChatModal"; // adjust path if the modal lives elsewhere
// import {
//   getMyChats,
//   markChatAsRead,
//   togglePinChat,
//   toggleArchiveChat,
//   clearChatMessages,
// } from "../../../api/chatsApi";

// function Chats({ onOpenChat, onOpenGroup }) {
//   const [items, setItems] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [query, setQuery] = useState("");
//   const [menuKey, setMenuKey] = useState(null);
//   const [showNewChat, setShowNewChat] = useState(false);

//   const update = (key, patch) =>
//     setItems((prev) => prev.map((x) => (x.key === key ? { ...x, ...patch } : x)));

//   const load = useCallback(async () => {
//     try {
//       setItems(await getMyChats());
//     } catch (e) {
//       console.error("Load chats error:", e);
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   // Load + refresh every 10s (unread counts, last message)
//   useEffect(() => {
//     load();
//     const timer = setInterval(load, 10000);
//     return () => clearInterval(timer);
//   }, [load]);

//   const open = (item) => {
//     const payload = { ...item, unread: 0 };

//     if (item.type === "group") {
//       onOpenGroup && onOpenGroup(payload);
//     } else {
//       onOpenChat && onOpenChat(payload);
//     }

//     if (item.unread > 0) {
//       update(item.key, { unread: 0 });
//       markChatAsRead(item.id).catch((e) => console.error("Mark read error:", e));
//     }
//   };

//   // chat comes from NewChatModal: { id: chatId, userId, name, avatar, color, online }
//   const handleSelectUser = (chat) => {
//     setShowNewChat(false);

//     const existing = items.find((x) => x.type === "chat" && String(x.id) === String(chat.id));
//     if (existing) {
//       open(existing);
//       return;
//     }

//     const created = {
//       key: `chat-${chat.id}`,
//       type: "chat",
//       id: chat.id,
//       userId: chat.userId,
//       name: chat.name,
//       avatar: chat.avatar,
//       color: chat.color,
//       online: !!chat.online,
//       message: "",
//       time: "",
//       ts: Date.now(),
//       unread: 0,
//       pinned: false,
//     };

//     setItems((prev) => [created, ...prev]);
//     open(created);
//   };

//   const handlePin = async (item) => {
//     setMenuKey(null);
//     try {
//       await togglePinChat(item.id);
//       update(item.key, { pinned: !item.pinned });
//     } catch (e) {
//       console.error("Pin error:", e);
//     }
//   };

//   const handleClear = async (item) => {
//     setMenuKey(null);
//     if (!window.confirm(`Permanently clear all messages with ${item.name}?`)) return;
//     try {
//       await clearChatMessages(item.id);
//       update(item.key, { message: "", unread: 0 });
//     } catch (e) {
//       console.error("Clear error:", e);
//       alert("Failed to clear chat.");
//     }
//   };

//   const handleArchive = async (item) => {
//     setMenuKey(null);
//     const what = item.type === "group" ? "group" : "chat";
//     if (!window.confirm(`Archive ${what} "${item.name}"?`)) return;
//     try {
//       await toggleArchiveChat(item.id);
//       setItems((prev) => prev.filter((x) => x.key !== item.key));
//     } catch (e) {
//       console.error("Archive error:", e);
//       alert("Failed to archive.");
//     }
//   };

//   const term = query.trim().toLowerCase();

//   const visible = items
//     .filter((x) => x.name.toLowerCase().includes(term))
//     .sort((a, b) => Number(b.pinned) - Number(a.pinned) || b.ts - a.ts);

//   return (
//     <div className="position-relative d-flex flex-column" style={{ minHeight: "100%" }}>
//       {/* HEADER */}
//       <div className="px-3 pt-3 pb-2">
//         <div className="fw-semibold" style={{ color: "#1E2328", fontSize: "14px" }}>
//           All Chats
//         </div>
//         <small style={{ color: "#8A7C6F", fontSize: "11px" }}>
//           Personal conversations and groups
//         </small>
//       </div>

//       {/* SEARCH */}
//       <div className="px-3 pb-2">
//         <div className="position-relative">
//           <Search
//             size={15}
//             strokeWidth={2}
//             className="position-absolute"
//             style={{
//               left: "12px",
//               top: "50%",
//               transform: "translateY(-50%)",
//               color: "#B9AFA5",
//               pointerEvents: "none",
//             }}
//           />
//           <input
//             type="text"
//             className="form-control"
//             placeholder="Search chats..."
//             value={query}
//             onChange={(e) => setQuery(e.target.value)}
//             style={{
//               border: "1px solid #F1E7DC",
//               borderRadius: "10px",
//               boxShadow: "none",
//               fontSize: "13px",
//               paddingLeft: "35px",
//               paddingRight: "12px",
//             }}
//           />
//         </div>
//       </div>

//       {/* CLICK OUTSIDE TO CLOSE MENU */}
//       {menuKey && (
//         <div onClick={() => setMenuKey(null)} style={{ position: "fixed", inset: 0, zIndex: 15 }} />
//       )}

//       {/* LIST */}
//       <div className="px-3 flex-grow-1" style={{ paddingBottom: "80px" }}>
//         {loading && <div className="text-center small text-muted py-3">Loading chats...</div>}

//         {!loading && visible.length === 0 && (
//           <div className="text-center small text-muted py-3">No chats</div>
//         )}

//         {visible.map((item) => (
//           <div
//             key={item.key}
//             onClick={() => open(item)}
//             className="d-flex align-items-center gap-2 p-2 mb-1 position-relative"
//             style={{ borderRadius: "10px", cursor: "pointer", color: "inherit" }}
//           >
//             {/* AVATAR */}
//             <div
//               className="position-relative d-flex align-items-center justify-content-center"
//               style={{
//                 width: "42px",
//                 height: "42px",
//                 minWidth: "42px",
//                 borderRadius: "50%",
//                 backgroundColor: item.color,
//                 color: "#FFFFFF",
//                 fontWeight: "600",
//                 fontSize: "12px",
//               }}
//             >
//               {item.avatar}

//               {item.type === "chat" && item.online && (
//                 <span
//                   className="position-absolute"
//                   style={{
//                     width: "9px",
//                     height: "9px",
//                     borderRadius: "50%",
//                     backgroundColor: "#2E9E6D",
//                     border: "2px solid #FFFFFF",
//                     right: "0",
//                     bottom: "1px",
//                   }}
//                 />
//               )}
//             </div>

//             {/* DETAILS */}
//             <div className="flex-grow-1" style={{ minWidth: 0 }}>
//               <div className="d-flex justify-content-between align-items-center">
//                 <div className="d-flex align-items-center gap-1" style={{ minWidth: 0 }}>
//                   <div className="fw-medium text-truncate" style={{ color: "#1E2328", fontSize: "13px" }}>
//                     {item.name}
//                   </div>
//                   {item.type === "group" && (
//                     <span
//                       style={{
//                         fontSize: "9px",
//                         color: "#F4712B",
//                         backgroundColor: "#FBE4D0",
//                         borderRadius: "6px",
//                         padding: "1px 5px",
//                         flexShrink: 0,
//                       }}
//                     >
//                       Group
//                     </span>
//                   )}
//                   {item.pinned && <Pin size={11} color="#B9AFA5" style={{ flexShrink: 0 }} />}
//                 </div>

//                 <small
//                   style={{
//                     color: item.unread > 0 ? "#F4712B" : "#B9AFA5",
//                     fontSize: "10px",
//                     flexShrink: 0,
//                   }}
//                 >
//                   {item.time}
//                 </small>
//               </div>

//               <div className="d-flex justify-content-between align-items-center">
//                 <div
//                   className="text-truncate"
//                   style={{ color: "#8A7C6F", fontSize: "11px", maxWidth: "190px" }}
//                 >
//                   {item.message || (item.type === "group" ? "No messages yet" : "Say hi 👋")}
//                 </div>

//                 {item.unread > 0 && (
//                   <span
//                     className="d-flex align-items-center justify-content-center"
//                     style={{
//                       minWidth: "18px",
//                       height: "18px",
//                       borderRadius: "50%",
//                       backgroundColor: "#F4712B",
//                       color: "#FFFFFF",
//                       fontSize: "9px",
//                     }}
//                   >
//                     {item.unread}
//                   </span>
//                 )}
//               </div>
//             </div>

//             {/* MENU BUTTON */}
//             <button
//               className="btn border-0 p-1"
//               onClick={(e) => {
//                 e.stopPropagation();
//                 setMenuKey(menuKey === item.key ? null : item.key);
//               }}
//               aria-label="Chat options"
//             >
//               <MoreVertical size={14} color="#B9AFA5" />
//             </button>

//             {menuKey === item.key && (
//               <div
//                 onClick={(e) => e.stopPropagation()}
//                 className="position-absolute bg-white shadow-sm"
//                 style={{
//                   right: 8,
//                   top: 40,
//                   zIndex: 20,
//                   borderRadius: 10,
//                   border: "1px solid #F1E7DC",
//                   fontSize: 12,
//                   minWidth: 140,
//                   cursor: "pointer",
//                 }}
//               >
//                 <div className="px-3 py-2" onClick={() => handlePin(item)}>
//                   {item.pinned ? "Unpin" : "Pin"}
//                 </div>
//                 {item.type === "chat" && (
//                   <div className="px-3 py-2" onClick={() => handleClear(item)}>
//                     Clear chat
//                   </div>
//                 )}
//                 <div className="px-3 py-2 text-danger" onClick={() => handleArchive(item)}>
//                   {item.type === "group" ? "Archive group" : "Archive chat"}
//                 </div>
//               </div>
//             )}
//           </div>
//         ))}
//       </div>

//       {/* NEW CHAT BUTTON */}
//       <div style={{ position: "sticky", bottom: 0, height: 0, zIndex: 10 }}>
//         <button
//           onClick={() => setShowNewChat(true)}
//           className="btn d-flex align-items-center justify-content-center border-0"
//           style={{
//             position: "absolute",
//             right: "18px",
//             bottom: "18px",
//             width: "48px",
//             height: "48px",
//             borderRadius: "50%",
//             backgroundColor: "#F4712B",
//             color: "#FFFFFF",
//             boxShadow: "0 4px 12px rgba(244,113,43,0.35)",
//           }}
//           title="New Chat"
//           aria-label="New Chat"
//         >
//           <Plus size={24} strokeWidth={2} />
//         </button>
//       </div>

//       {/* NEW CHAT MODAL */}
//       <NewChatModal
//         show={showNewChat}
//         onClose={() => setShowNewChat(false)}
//         onSelectUser={handleSelectUser}
//       />
//     </div>
//   );
// }

// export default Chats;

import { Search, Plus, MoreVertical, Pin } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import NewChatModal from "./NewChatModal"; // adjust path if the modal lives elsewhere
import OnetoOneView from "../OneToOne/OnetoOneView"; // adjust paths if the views live elsewhere
import GroupView from "../Groups/GroupView";
import {
  getMyChats,
  markChatAsRead,
  togglePinChat,
  toggleArchiveChat,
  clearChatMessages,
} from "../../../api/chatsApi";

/* =========================================================
 * HELPERS
 * ========================================================= */

// makes sure every item has type === "group" or type === "chat"
const normalizeChat = (c) => {
  const isGroup =
    c.type === "group" ||
    c.isGroup === true ||
    String(c.chatType ?? c.type ?? "").toUpperCase() === "GROUP" ||
    c.groupId != null;
  return { ...c, type: isGroup ? "group" : "chat" };
};

/* =========================================================
 * COMPONENT
 * ========================================================= */

function Chats() {
  const [activeChat, setActiveChat] = useState(null); // one-to-one -> OnetoOneView
  const [activeGroup, setActiveGroup] = useState(null); // group -> GroupView
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [menuKey, setMenuKey] = useState(null);
  const [showNewChat, setShowNewChat] = useState(false);

  const update = (key, patch) =>
    setItems((prev) => prev.map((x) => (x.key === key ? { ...x, ...patch } : x)));

  const load = useCallback(async () => {
    try {
      const list = await getMyChats();
      setItems(list.map(normalizeChat));
    } catch (e) {
      console.error("Load chats error:", e);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load + refresh every 10s (unread counts, last message)
  useEffect(() => {
    load();
    const timer = setInterval(load, 10000);
    return () => clearInterval(timer);
  }, [load]);

  // group -> GroupView, one-to-one -> OnetoOneView
  const open = (item) => {
    const payload = { ...item, unread: 0 };

    if (item.type === "group") setActiveGroup(payload); // -> GroupView
    else setActiveChat(payload); // -> OnetoOneView

    if (item.unread > 0) {
      update(item.key, { unread: 0 });
      markChatAsRead(item.id).catch((e) => console.error("Mark read error:", e));
    }
  };

  // chat comes from NewChatModal: { id: chatId, userId, name, avatar, color, online }
  const handleSelectUser = (chat) => {
    setShowNewChat(false);

    const existing = items.find((x) => x.type === "chat" && String(x.id) === String(chat.id));
    if (existing) {
      open(existing);
      return;
    }

    const created = {
      key: `chat-${chat.id}`,
      type: "chat",
      id: chat.id,
      userId: chat.userId,
      name: chat.name,
      avatar: chat.avatar,
      color: chat.color,
      online: !!chat.online,
      message: "",
      time: "",
      ts: Date.now(),
      unread: 0,
      pinned: false,
    };

    setItems((prev) => [created, ...prev]);
    open(created);
  };

  const handlePin = async (item) => {
    setMenuKey(null);
    try {
      await togglePinChat(item.id);
      update(item.key, { pinned: !item.pinned });
    } catch (e) {
      console.error("Pin error:", e);
    }
  };

  const handleClear = async (item) => {
    setMenuKey(null);
    if (!window.confirm(`Permanently clear all messages with ${item.name}?`)) return;
    try {
      await clearChatMessages(item.id);
      update(item.key, { message: "", unread: 0 });
    } catch (e) {
      console.error("Clear error:", e);
      alert("Failed to clear chat.");
    }
  };

  const handleArchive = async (item) => {
    setMenuKey(null);
    const what = item.type === "group" ? "group" : "chat";
    if (!window.confirm(`Archive ${what} "${item.name}"?`)) return;
    try {
      await toggleArchiveChat(item.id);
      setItems((prev) => prev.filter((x) => x.key !== item.key));
    } catch (e) {
      console.error("Archive error:", e);
      alert("Failed to archive.");
    }
  };

  const term = query.trim().toLowerCase();

  const visible = items
    .filter((x) => (x.name || "").toLowerCase().includes(term))
    .sort((a, b) => Number(b.pinned) - Number(a.pinned) || (b.ts || 0) - (a.ts || 0));

  const closeView = () => {
    setActiveChat(null);
    setActiveGroup(null);
    load(); // refresh last message / unread counts when coming back
  };

  /* ---------- OPEN CONVERSATION ---------- */

  if (activeGroup) return <GroupView group={activeGroup} onBack={closeView} />;
  if (activeChat) return <OnetoOneView chat={activeChat} onBack={closeView} />;

  /* ---------- CHAT LIST ---------- */

  return (
    <div className="position-relative d-flex flex-column" style={{ minHeight: "100%" }}>
      {/* HEADER */}
      <div className="px-3 pt-3 pb-2">
        <div className="fw-semibold" style={{ color: "#1E2328", fontSize: "14px" }}>
          All Chats
        </div>
        <small style={{ color: "#8A7C6F", fontSize: "11px" }}>
          Personal conversations and groups
        </small>
      </div>

      {/* SEARCH */}
      <div className="px-3 pb-2">
        <div className="position-relative">
          <Search
            size={15}
            strokeWidth={2}
            className="position-absolute"
            style={{
              left: "12px",
              top: "50%",
              transform: "translateY(-50%)",
              color: "#B9AFA5",
              pointerEvents: "none",
            }}
          />
          <input
            type="text"
            className="form-control"
            placeholder="Search chats..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{
              border: "1px solid #F1E7DC",
              borderRadius: "10px",
              boxShadow: "none",
              fontSize: "13px",
              paddingLeft: "35px",
              paddingRight: "12px",
            }}
          />
        </div>
      </div>

      {/* CLICK OUTSIDE TO CLOSE MENU */}
      {menuKey && (
        <div onClick={() => setMenuKey(null)} style={{ position: "fixed", inset: 0, zIndex: 15 }} />
      )}

      {/* LIST */}
      <div className="px-3 flex-grow-1" style={{ paddingBottom: "80px" }}>
        {loading && <div className="text-center small text-muted py-3">Loading chats...</div>}

        {!loading && visible.length === 0 && (
          <div className="text-center small text-muted py-3">No chats</div>
        )}

        {visible.map((item) => (
          <div
            key={item.key}
            onClick={() => open(item)}
            className="d-flex align-items-center gap-2 p-2 mb-1 position-relative"
            style={{ borderRadius: "10px", cursor: "pointer", color: "inherit" }}
          >
            {/* AVATAR */}
            <div
              className="position-relative d-flex align-items-center justify-content-center"
              style={{
                width: "42px",
                height: "42px",
                minWidth: "42px",
                borderRadius: "50%",
                backgroundColor: item.color,
                color: "#FFFFFF",
                fontWeight: "600",
                fontSize: "12px",
              }}
            >
              {item.avatar}

              {item.type === "chat" && item.online && (
                <span
                  className="position-absolute"
                  style={{
                    width: "9px",
                    height: "9px",
                    borderRadius: "50%",
                    backgroundColor: "#2E9E6D",
                    border: "2px solid #FFFFFF",
                    right: "0",
                    bottom: "1px",
                  }}
                />
              )}
            </div>

            {/* DETAILS */}
            <div className="flex-grow-1" style={{ minWidth: 0 }}>
              <div className="d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center gap-1" style={{ minWidth: 0 }}>
                  <div className="fw-medium text-truncate" style={{ color: "#1E2328", fontSize: "13px" }}>
                    {item.name}
                  </div>
                  {item.type === "group" && (
                    <span
                      style={{
                        fontSize: "9px",
                        color: "#F4712B",
                        backgroundColor: "#FBE4D0",
                        borderRadius: "6px",
                        padding: "1px 5px",
                        flexShrink: 0,
                      }}
                    >
                      Group
                    </span>
                  )}
                  {item.pinned && <Pin size={11} color="#B9AFA5" style={{ flexShrink: 0 }} />}
                </div>

                <small
                  style={{
                    color: item.unread > 0 ? "#F4712B" : "#B9AFA5",
                    fontSize: "10px",
                    flexShrink: 0,
                  }}
                >
                  {item.time}
                </small>
              </div>

              <div className="d-flex justify-content-between align-items-center">
                <div
                  className="text-truncate"
                  style={{ color: "#8A7C6F", fontSize: "11px", maxWidth: "190px" }}
                >
                  {item.message || (item.type === "group" ? "No messages yet" : "Say hi 👋")}
                </div>

                {item.unread > 0 && (
                  <span
                    className="d-flex align-items-center justify-content-center"
                    style={{
                      minWidth: "18px",
                      height: "18px",
                      borderRadius: "50%",
                      backgroundColor: "#F4712B",
                      color: "#FFFFFF",
                      fontSize: "9px",
                    }}
                  >
                    {item.unread}
                  </span>
                )}
              </div>
            </div>

            {/* MENU BUTTON */}
            <button
              className="btn border-0 p-1"
              onClick={(e) => {
                e.stopPropagation();
                setMenuKey(menuKey === item.key ? null : item.key);
              }}
              aria-label="Chat options"
            >
              <MoreVertical size={14} color="#B9AFA5" />
            </button>

            {menuKey === item.key && (
              <div
                onClick={(e) => e.stopPropagation()}
                className="position-absolute bg-white shadow-sm"
                style={{
                  right: 8,
                  top: 40,
                  zIndex: 20,
                  borderRadius: 10,
                  border: "1px solid #F1E7DC",
                  fontSize: 12,
                  minWidth: 140,
                  cursor: "pointer",
                }}
              >
                <div className="px-3 py-2" onClick={() => handlePin(item)}>
                  {item.pinned ? "Unpin" : "Pin"}
                </div>
                {item.type === "chat" && (
                  <div className="px-3 py-2" onClick={() => handleClear(item)}>
                    Clear chat
                  </div>
                )}
                <div className="px-3 py-2 text-danger" onClick={() => handleArchive(item)}>
                  {item.type === "group" ? "Archive group" : "Archive chat"}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* NEW CHAT BUTTON */}
      <div style={{ position: "sticky", bottom: 0, height: 0, zIndex: 10 }}>
        <button
          onClick={() => setShowNewChat(true)}
          className="btn d-flex align-items-center justify-content-center border-0"
          style={{
            position: "absolute",
            right: "18px",
            bottom: "18px",
            width: "48px",
            height: "48px",
            borderRadius: "50%",
            backgroundColor: "#F4712B",
            color: "#FFFFFF",
            boxShadow: "0 4px 12px rgba(244,113,43,0.35)",
          }}
          title="New Chat"
          aria-label="New Chat"
        >
          <Plus size={24} strokeWidth={2} />
        </button>
      </div>

      {/* NEW CHAT MODAL */}
      <NewChatModal
        show={showNewChat}
        onClose={() => setShowNewChat(false)}
        onSelectUser={handleSelectUser}
      />
    </div>
  );
}

export default Chats;