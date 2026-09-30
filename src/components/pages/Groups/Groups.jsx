// import { Search, Plus, MoreVertical } from "lucide-react";
// import { useState } from "react";
// import NewGroupModal from "./NewGroupModal";

// const COLORS = ["#7C6FE8", "#2E9E6D", "#D9822B", "#E8556D", "#2B8FD9"];

// const initials = (name) =>
//   name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();

// const makeGroup = (id, name, message = "", time = "", unread = 0, memberCount = 0, isAdmin = false, description = "") => ({
//   id,
//   name,
//   description,
//   avatar: initials(name),
//   message,
//   time,
//   unread,
//   memberCount,
//   isAdmin,
//   color: COLORS[name.charCodeAt(0) % COLORS.length],
//   type: "group",
// });

// // Example data
// const INITIAL_GROUPS = [
//   makeGroup(101, "Project Team", "Priya: Meeting at 4 PM", "11:02 AM", 3, 8, true, "Project discussion"),
//   makeGroup(102, "Family", "Mom: Dinner at 8", "Yesterday", 0, 5, false, "Family group"),
//   makeGroup(103, "College Friends", "Omkar: Trip plan?", "Mon", 0, 12, false, "Old friends"),
//   makeGroup(104, "Office Updates", "HR: Holiday on Friday", "Sun", 1, 40, false, "Company announcements"),
// ];

// function Groups({ onOpenGroup, onOpenChat }) {
//   const [showNewGroup, setShowNewGroup] = useState(false);
//   const [groups, setGroups] = useState(INITIAL_GROUPS);
//   const [query, setQuery] = useState("");
//   const [menuId, setMenuId] = useState(null);

//   const update = (id, patch) =>
//     setGroups((prev) => prev.map((g) => (g.id === id ? { ...g, ...patch } : g)));

//   // Works with either prop name: onOpenGroup or onOpenChat
//   const openGroup = (group) => {
//     const handler = onOpenGroup || onOpenChat;
//     handler && handler({ ...group, unread: 0, type: "group" });
//     if (group.unread > 0) update(group.id, { unread: 0 });
//   };

//   // modal may pass {name, description, memberIds}
//   const handleCreateGroup = (data) => {
//     setShowNewGroup(false);
//     const created = makeGroup(
//       data?.id ?? Date.now(),
//       data?.name || "New Group",
//       "",
//       "",
//       0,
//       data?.memberIds?.length ?? data?.members?.length ?? 1,
//       true,
//       data?.description ?? ""
//     );
//     setGroups((prev) => [created, ...prev]);
//     openGroup(created);
//   };

//   const handleClear = (g) => {
//     setMenuId(null);
//     if (!window.confirm(`Permanently clear all messages in ${g.name}?`)) return;
//     update(g.id, { message: "", unread: 0 });
//   };

//   const handleLeave = (g) => {
//     setMenuId(null);
//     if (!window.confirm(`Leave ${g.name}?`)) return;
//     setGroups((prev) => prev.filter((x) => x.id !== g.id));
//   };

//   const handleDelete = (g) => {
//     setMenuId(null);
//     if (!window.confirm(`Delete ${g.name} for everyone? This can't be undone.`)) return;
//     setGroups((prev) => prev.filter((x) => x.id !== g.id));
//   };

//   const visible = groups.filter((g) =>
//     g.name.toLowerCase().includes(query.trim().toLowerCase())
//   );

//   return (
//     <div className="position-relative" style={{ minHeight: "100%" }}>
//       {/* HEADER */}
//       <div className="px-3 pt-3 pb-2">
//         <div className="fw-semibold" style={{ color: "#1E2328", fontSize: "14px" }}>
//           Groups
//         </div>
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
//             placeholder="Search groups..."
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
//       {menuId && (
//         <div
//           onClick={() => setMenuId(null)}
//           style={{ position: "fixed", inset: 0, zIndex: 15 }}
//         />
//       )}

//       {/* GROUP LIST */}
//       <div className="px-3">
//         {visible.length === 0 && (
//           <div className="text-center small text-muted py-3">No groups</div>
//         )}

//         {visible.map((group) => (
//           <div
//             key={group.id}
//             onClick={() => openGroup(group)}
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
//                 backgroundColor: group.color,
//                 color: "#FFFFFF",
//                 fontWeight: "600",
//                 fontSize: "12px",
//               }}
//             >
//               {group.avatar}
//             </div>

//             {/* DETAILS */}
//             <div className="flex-grow-1" style={{ minWidth: 0 }}>
//               <div className="d-flex justify-content-between">
//                 <div className="fw-medium" style={{ color: "#1E2328", fontSize: "13px" }}>
//                   {group.name}
//                 </div>

//                 <small
//                   style={{
//                     color: group.unread > 0 ? "#F4712B" : "#B9AFA5",
//                     fontSize: "10px",
//                   }}
//                 >
//                   {group.time}
//                 </small>
//               </div>

//               <div className="d-flex justify-content-between align-items-center">
//                 <div
//                   className="text-truncate"
//                   style={{ color: "#8A7C6F", fontSize: "11px", maxWidth: "210px" }}
//                 >
//                   {group.message}
//                 </div>

//                 {group.unread > 0 && (
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
//                     {group.unread}
//                   </span>
//                 )}
//               </div>
//             </div>

//             {/* MENU BUTTON */}
//             <button
//               className="btn border-0 p-1"
//               onClick={(e) => {
//                 e.stopPropagation();
//                 setMenuId(menuId === group.id ? null : group.id);
//               }}
//             >
//               <MoreVertical size={14} color="#B9AFA5" />
//             </button>

//             {menuId === group.id && (
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
//                 }}
//               >
//                 <div className="px-3 py-2" onClick={() => handleClear(group)}>
//                   Clear chat
//                 </div>
//                 <div className="px-3 py-2 text-danger" onClick={() => handleLeave(group)}>
//                   Leave group
//                 </div>
//                 {group.isAdmin && (
//                   <div className="px-3 py-2 text-danger" onClick={() => handleDelete(group)}>
//                     Delete group
//                   </div>
//                 )}
//               </div>
//             )}
//           </div>
//         ))}
//       </div>

//       {/* NEW GROUP BUTTON */}
//       <button
//         onClick={() => setShowNewGroup(true)}
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
//         title="New Group"
//         aria-label="New Group"
//       >
//         <Plus size={24} strokeWidth={2} />
//       </button>

//       {/* NEW GROUP MODAL */}
//       <NewGroupModal
//         show={showNewGroup}
//         onClose={() => setShowNewGroup(false)}
//         onCreateGroup={handleCreateGroup}
//       />
//     </div>
//   );
// }

// export default Groups;


import { Search, Plus, MoreVertical } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import NewGroupModal from "./NewGroupModal";
import { getMyGroups, createGroup, leaveGroup, deleteGroup, clearGroupMessages } from "../../../api/groupsApi";
import { markChatAsRead } from "../../../api/chatsApi";

function Groups({ onOpenGroup, onOpenChat }) {
  const [showNewGroup, setShowNewGroup] = useState(false);
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [menuId, setMenuId] = useState(null);

  const update = (id, patch) =>
    setGroups((prev) => prev.map((g) => (g.id === id ? { ...g, ...patch } : g)));

  const load = useCallback(async () => {
    try {
      setGroups(await getMyGroups());
    } catch (e) {
      console.error("Load groups error:", e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
    const timer = setInterval(load, 10000);
    return () => clearInterval(timer);
  }, [load]);

  // Works with either prop name: onOpenGroup or onOpenChat
  const openGroup = (group) => {
    const handler = onOpenGroup || onOpenChat;
    handler && handler({ ...group, unread: 0, type: "group" });
    if (group.unread > 0) {
      update(group.id, { unread: 0 });
      markChatAsRead(group.chatId).catch((e) => console.error("Mark read error:", e));
    }
  };

  // modal passes { name, description, memberIds }
  const handleCreateGroup = async (data) => {
    try {
      const created = await createGroup(data);
      setShowNewGroup(false);
      setGroups((prev) => [{ ...created, isAdmin: true, ts: Date.now() }, ...prev]);
      openGroup({ ...created, isAdmin: true });
      return true;
    } catch (e) {
      console.error("Create group error:", e);
      return false;
    }
  };

  const handleClear = async (g) => {
    setMenuId(null);
    if (!window.confirm(`Permanently clear all messages in ${g.name}?`)) return;
    try {
      await clearGroupMessages(g.id);
      update(g.id, { message: "", unread: 0 });
    } catch (e) {
      alert("Failed to clear chat.");
    }
  };

  const handleLeave = async (g) => {
    setMenuId(null);
    if (!window.confirm(`Leave ${g.name}?`)) return;
    try {
      await leaveGroup(g.id);
      setGroups((prev) => prev.filter((x) => x.id !== g.id));
    } catch (e) {
      alert("Failed to leave group.");
    }
  };

  const handleDelete = async (g) => {
    setMenuId(null);
    if (!window.confirm(`Delete ${g.name} for everyone? This can't be undone.`)) return;
    try {
      await deleteGroup(g.id);
      setGroups((prev) => prev.filter((x) => x.id !== g.id));
    } catch (e) {
      alert("Failed to delete group.");
    }
  };

  const term = query.trim().toLowerCase();
  const visible = groups
    .filter((g) => g.name.toLowerCase().includes(term))
    .sort((a, b) => b.ts - a.ts);

  return (
    <div className="position-relative" style={{ minHeight: "100%" }}>
      {/* HEADER */}
      <div className="px-3 pt-3 pb-2">
        <div className="fw-semibold" style={{ color: "#1E2328", fontSize: "14px" }}>
          Groups
        </div>
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
            placeholder="Search groups..."
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
      {menuId && (
        <div onClick={() => setMenuId(null)} style={{ position: "fixed", inset: 0, zIndex: 15 }} />
      )}

      {/* GROUP LIST */}
      <div className="px-3" style={{ paddingBottom: "80px" }}>
        {loading && <div className="text-center small text-muted py-3">Loading groups...</div>}

        {!loading && visible.length === 0 && (
          <div className="text-center small text-muted py-3">No groups</div>
        )}

        {visible.map((group) => (
          <div
            key={group.id}
            onClick={() => openGroup(group)}
            className="d-flex align-items-center gap-2 p-2 mb-1 position-relative"
            style={{ borderRadius: "10px", cursor: "pointer", color: "inherit" }}
          >
            <div
              className="d-flex align-items-center justify-content-center"
              style={{
                width: "42px",
                height: "42px",
                minWidth: "42px",
                borderRadius: "50%",
                backgroundColor: group.color,
                color: "#FFFFFF",
                fontWeight: "600",
                fontSize: "12px",
              }}
            >
              {group.avatar}
            </div>

            <div className="flex-grow-1" style={{ minWidth: 0 }}>
              <div className="d-flex justify-content-between">
                <div className="fw-medium text-truncate" style={{ color: "#1E2328", fontSize: "13px" }}>
                  {group.name}
                </div>
                <small style={{ color: group.unread > 0 ? "#F4712B" : "#B9AFA5", fontSize: "10px" }}>
                  {group.time}
                </small>
              </div>

              <div className="d-flex justify-content-between align-items-center">
                <div
                  className="text-truncate"
                  style={{ color: "#8A7C6F", fontSize: "11px", maxWidth: "210px" }}
                >
                  {group.message || "No messages yet"}
                </div>

                {group.unread > 0 && (
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
                    {group.unread}
                  </span>
                )}
              </div>
            </div>

            <button
              className="btn border-0 p-1"
              onClick={(e) => {
                e.stopPropagation();
                setMenuId(menuId === group.id ? null : group.id);
              }}
            >
              <MoreVertical size={14} color="#B9AFA5" />
            </button>

            {menuId === group.id && (
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
                }}
              >
                <div className="px-3 py-2" onClick={() => handleClear(group)}>
                  Clear chat
                </div>
                <div className="px-3 py-2 text-danger" onClick={() => handleLeave(group)}>
                  Leave group
                </div>
                {group.isAdmin && (
                  <div className="px-3 py-2 text-danger" onClick={() => handleDelete(group)}>
                    Delete group
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* NEW GROUP BUTTON */}
      <button
        onClick={() => setShowNewGroup(true)}
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
        title="New Group"
        aria-label="New Group"
      >
        <Plus size={24} strokeWidth={2} />
      </button>

      <NewGroupModal
        show={showNewGroup}
        onClose={() => setShowNewGroup(false)}
        onCreateGroup={handleCreateGroup}
      />
    </div>
  );
}

export default Groups;