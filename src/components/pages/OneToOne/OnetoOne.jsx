


// import { Search, Plus, MoreVertical, Pin } from "lucide-react";
// import { useCallback, useEffect, useState } from "react";
// import OneToOneModal from "./NewOnetoOneModal";
// import {
//   getMyChats,
//   markChatAsRead,
//   togglePinChat,
//   toggleArchiveChat,
//   clearChatMessages,
// } from "../../../api/chatsApi";

// function OnetoOne({ onOpenChat }) {
//   const [items, setItems] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [query, setQuery] = useState("");
//   const [menuKey, setMenuKey] = useState(null);
//   const [showNewChat, setShowNewChat] = useState(false);

//   const update = (key, patch) =>
//     setItems((prev) => prev.map((x) => (x.key === key ? { ...x, ...patch } : x)));

//   const load = useCallback(async () => {
//     try {
//       const all = await getMyChats();
//       setItems(all.filter((c) => c.type === "chat")); // one-to-one only
//     } catch (e) {
//       console.error("Load chats error:", e);
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     load();
//     const timer = setInterval(load, 10000);
//     return () => clearInterval(timer);
//   }, [load]);

//   const open = (item) => {
//     onOpenChat && onOpenChat({ ...item, unread: 0 });

//     if (item.unread > 0) {
//       update(item.key, { unread: 0 });
//       markChatAsRead(item.id).catch((e) => console.error("Mark read error:", e));
//     }
//   };

//   // chat comes from the modal: { id: chatId, userId, name, avatar, color, online }
//   const handleSelectUser = (chat) => {
//     setShowNewChat(false);

//     const existing = items.find((x) => String(x.id) === String(chat.id));
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
//     if (!window.confirm(`Archive chat with ${item.name}?`)) return;
//     try {
//       await toggleArchiveChat(item.id);
//       setItems((prev) => prev.filter((x) => x.key !== item.key));
//     } catch (e) {
//       console.error("Archive error:", e);
//       alert("Failed to archive chat.");
//     }
//   };

//   const term = query.trim().toLowerCase();

//   const visible = items
//     .filter((x) => x.name.toLowerCase().includes(term))
//     .sort((a, b) => Number(b.pinned) - Number(a.pinned) || b.ts - a.ts);

//   return (
//     <div className="position-relative" style={{ minHeight: "100%" }}>
//       {/* HEADER */}
//       <div className="px-3 pt-3 pb-2">
//         <div className="fw-semibold" style={{ color: "#1E2328", fontSize: "14px" }}>
//           One-to-One Chats
//         </div>
//         <small style={{ color: "#8A7C6F", fontSize: "11px" }}>
//           Your personal conversations
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
//       <div className="px-3" style={{ paddingBottom: "80px" }}>
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

//               {item.online && (
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
//               <div className="d-flex justify-content-between">
//                 <div className="d-flex align-items-center gap-1" style={{ minWidth: 0 }}>
//                   <div className="fw-medium text-truncate" style={{ color: "#1E2328", fontSize: "13px" }}>
//                     {item.name}
//                   </div>
//                   {item.pinned && <Pin size={11} color="#B9AFA5" style={{ flexShrink: 0 }} />}
//                 </div>

//                 <small style={{ color: item.unread > 0 ? "#F4712B" : "#B9AFA5", fontSize: "10px" }}>
//                   {item.time}
//                 </small>
//               </div>

//               <div className="d-flex justify-content-between align-items-center">
//                 <div
//                   className="text-truncate"
//                   style={{ color: "#8A7C6F", fontSize: "11px", maxWidth: "190px" }}
//                 >
//                   {item.message || "Say hi 👋"}
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
//                 <div className="px-3 py-2" onClick={() => handleClear(item)}>
//                   Clear chat
//                 </div>
//                 <div className="px-3 py-2 text-danger" onClick={() => handleArchive(item)}>
//                   Archive chat
//                 </div>
//               </div>
//             )}
//           </div>
//         ))}
//       </div>

//       {/* NEW CHAT BUTTON */}
//       <button
//         onClick={() => setShowNewChat(true)}
//         className="btn d-flex align-items-center justify-content-center border-0 position-absolute"
//         style={{
//           width: "48px",
//           height: "48px",
//           right: "18px",
//           bottom: "18px",
//           borderRadius: "50%",
//           backgroundColor: "#F4712B",
//           color: "#FFFFFF",
//           boxShadow: "0 4px 12px rgba(244,113,43,0.35)",
//           zIndex: 10,
//         }}
//         title="New Chat"
//         aria-label="New Chat"
//       >
//         <Plus size={24} strokeWidth={2} />
//       </button>

//       {/* NEW CHAT MODAL */}
//       <OneToOneModal
//         show={showNewChat}
//         onClose={() => setShowNewChat(false)}
//         onSelectUser={handleSelectUser}
//         existingIds={items.map((x) => x.userId)}
//       />
//     </div>
//   );
// }

// export default OnetoOne;

import { Search, Plus, MoreVertical, Pin } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import OneToOneModal from "./NewOnetoOneModal";
import {
  getMyChats,
  markChatAsRead,
  togglePinChat,
  toggleArchiveChat,
  clearChatMessages,
} from "../../../api/chatsApi";
import {
  getUnreadCount,
  markAllAsRead,
  markChatNotificationsRead,
} from "../../../api/notificationsApi";

function OnetoOne({ onOpenChat }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [menuKey, setMenuKey] = useState(null);
  const [showNewChat, setShowNewChat] = useState(false);
  const [notifCount, setNotifCount] = useState(0);

  const update = (key, patch) =>
    setItems((prev) => prev.map((x) => (x.key === key ? { ...x, ...patch } : x)));

  const load = useCallback(async () => {
    try {
      const all = await getMyChats();
      setItems(all.filter((c) => c.type === "chat")); // one-to-one only
    } catch (e) {
      console.error("Load chats error:", e);
    } finally {
      setLoading(false);
    }
    try {
      setNotifCount(await getUnreadCount());
    } catch (e) {
      console.error("Unread count error:", e);
    }
  }, []);

  useEffect(() => {
    load();
    const timer = setInterval(load, 10000);
    return () => clearInterval(timer);
  }, [load]);

  const handleReadAll = async () => {
    try {
      await markAllAsRead();
      setNotifCount(0);
    } catch (e) {
      console.error("Mark all read error:", e);
    }
  };

  const open = (item) => {
    onOpenChat && onOpenChat({ ...item, unread: 0 });

    if (item.unread > 0) {
      update(item.key, { unread: 0 });
      markChatAsRead(item.id).catch((e) => console.error("Mark read error:", e));
      markChatNotificationsRead(item.id)
        .then(() => getUnreadCount())
        .then(setNotifCount)
        .catch((e) => console.error("Notification read error:", e));
    }
  };

  // chat comes from the modal: { id: chatId, userId, name, avatar, color, online }
  const handleSelectUser = (chat) => {
    setShowNewChat(false);

    const existing = items.find((x) => String(x.id) === String(chat.id));
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
    if (!window.confirm(`Archive chat with ${item.name}?`)) return;
    try {
      await toggleArchiveChat(item.id);
      setItems((prev) => prev.filter((x) => x.key !== item.key));
    } catch (e) {
      console.error("Archive error:", e);
      alert("Failed to archive chat.");
    }
  };

  const term = query.trim().toLowerCase();

  const visible = items
    .filter((x) => x.name.toLowerCase().includes(term))
    .sort((a, b) => Number(b.pinned) - Number(a.pinned) || b.ts - a.ts);

  return (
    <div className="position-relative" style={{ minHeight: "100%" }}>
      {/* HEADER */}
      <div className="px-3 pt-3 pb-2 d-flex justify-content-between align-items-center">
        <div>
          <div className="fw-semibold" style={{ color: "#1E2328", fontSize: "14px" }}>
            One-to-One Chats
          </div>
          <small style={{ color: "#8A7C6F", fontSize: "11px" }}>
            Your personal conversations
          </small>
        </div>
        {notifCount > 0 && (
          <button
            className="btn btn-sm border-0 p-0"
            style={{ color: "#F4712B", fontSize: "11px" }}
            onClick={handleReadAll}
          >
            {notifCount} new · Mark all read
          </button>
        )}
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
      <div className="px-3" style={{ paddingBottom: "80px" }}>
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

              {item.online && (
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
              <div className="d-flex justify-content-between">
                <div className="d-flex align-items-center gap-1" style={{ minWidth: 0 }}>
                  <div className="fw-medium text-truncate" style={{ color: "#1E2328", fontSize: "13px" }}>
                    {item.name}
                  </div>
                  {item.pinned && <Pin size={11} color="#B9AFA5" style={{ flexShrink: 0 }} />}
                </div>

                <small style={{ color: item.unread > 0 ? "#F4712B" : "#B9AFA5", fontSize: "10px" }}>
                  {item.time}
                </small>
              </div>

              <div className="d-flex justify-content-between align-items-center">
                <div
                  className="text-truncate"
                  style={{ color: "#8A7C6F", fontSize: "11px", maxWidth: "190px" }}
                >
                  {item.message || "Say hi 👋"}
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
                <div className="px-3 py-2" onClick={() => handleClear(item)}>
                  Clear chat
                </div>
                <div className="px-3 py-2 text-danger" onClick={() => handleArchive(item)}>
                  Archive chat
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* NEW CHAT BUTTON */}
      <button
        onClick={() => setShowNewChat(true)}
        className="btn d-flex align-items-center justify-content-center border-0 position-absolute"
        style={{
          width: "48px",
          height: "48px",
          right: "18px",
          bottom: "18px",
          borderRadius: "50%",
          backgroundColor: "#F4712B",
          color: "#FFFFFF",
          boxShadow: "0 4px 12px rgba(244,113,43,0.35)",
          zIndex: 10,
        }}
        title="New Chat"
        aria-label="New Chat"
      >
        <Plus size={24} strokeWidth={2} />
      </button>

      {/* NEW CHAT MODAL */}
      <OneToOneModal
        show={showNewChat}
        onClose={() => setShowNewChat(false)}
        onSelectUser={handleSelectUser}
        existingIds={items.map((x) => x.userId)}
      />
    </div>
  );
}

export default OnetoOne;