// import { ArrowLeft, Users, LogOut, Search as SearchIcon } from "lucide-react";
// import { useState } from "react";

// const DEFAULT_MEMBERS = [
//   { id: 1, name: "You", avatar: "Y", color: "#F4712B", role: "Admin" },
//   { id: 2, name: "Rahul Patil", avatar: "RP", color: "#2E9E6D", role: "Member" },
//   { id: 3, name: "Vishal", avatar: "V", color: "#D9822B", role: "Member" },
//   { id: 4, name: "Darshan", avatar: "D", color: "#7C6FE8", role: "Member" },
// ];

// function GroupDetails({ group, onClose, onLeave }) {
//   const [memberSearch, setMemberSearch] = useState("");

//   const hasRealMembers =
//     Array.isArray(group?.members) &&
//     group.members.length > 0 &&
//     typeof group.members[0] === "object";

//   const members = hasRealMembers
//     ? [
//         { id: "me", name: "You", avatar: "Y", color: "#F4712B", role: "Admin" },
//         ...group.members.map((m) => ({ ...m, role: m.role || "Member" })),
//       ]
//     : DEFAULT_MEMBERS;

//   const filteredMembers = members.filter((m) =>
//     m.name.toLowerCase().includes(memberSearch.toLowerCase())
//   );

//   const groupAvatar =
//     group?.avatar || group?.name?.slice(0, 2).toUpperCase() || "G";

//   return (
//     <div
//       className="d-flex flex-column"
//       style={{
//         height: "100%",
//         backgroundColor: "#FCFBF8",
//       }}
//     >
//       {/* HEADER */}
//       <div
//         className="d-flex align-items-center px-3"
//         style={{
//           height: "60px",
//           minHeight: "60px",
//           backgroundColor: "#FBE4D0",
//           color: "#1E2328",
//         }}
//       >
//         <button
//           onClick={onClose}
//           className="btn border-0 p-0 me-2 d-flex align-items-center justify-content-center"
//           style={{ width: "30px", height: "30px", color: "#1E2328" }}
//           title="Back"
//         >
//           <ArrowLeft size={20} strokeWidth={2} />
//         </button>

//         <div className="fw-semibold" style={{ fontSize: "13px" }}>
//           Group Info
//         </div>
//       </div>

//       <div className="flex-grow-1" style={{ overflowY: "auto" }}>
//         {/* GROUP INFO */}
//         <div
//           className="d-flex flex-column align-items-center px-3 py-4"
//           style={{
//             backgroundColor: "#FFFFFF",
//             borderBottom: "1px solid #F1E7DC",
//           }}
//         >
//           <div
//             className="d-flex align-items-center justify-content-center"
//             style={{
//               width: "80px",
//               height: "80px",
//               borderRadius: "22px",
//               backgroundColor: group?.color || "#F4712B",
//               color: "#FFFFFF",
//               fontWeight: "600",
//               fontSize: "24px",
//             }}
//           >
//             {groupAvatar}
//           </div>

//           <div
//             className="fw-semibold mt-3 text-center"
//             style={{ fontSize: "17px", color: "#1E2328" }}
//           >
//             {group?.name || "Group"}
//           </div>

//           <div
//             className="d-flex align-items-center gap-1 mt-1"
//             style={{ fontSize: "12px", color: "#8A7C6F" }}
//           >
//             <Users size={13} />
//             Group · {members.length} members
//           </div>
//         </div>

//         {/* DESCRIPTION */}
//         <div
//           className="px-3 py-3 mt-2"
//           style={{
//             backgroundColor: "#FFFFFF",
//             borderTop: "1px solid #F1E7DC",
//             borderBottom: "1px solid #F1E7DC",
//           }}
//         >
//           <div
//             style={{ fontSize: "11px", color: "#8A7C6F", marginBottom: "4px" }}
//           >
//             Description
//           </div>

//           <div style={{ fontSize: "13px", color: "#1E2328" }}>
//             {group?.description || "No description added."}
//           </div>
//         </div>

//         {/* MEMBERS */}
//         <div
//           className="mt-2"
//           style={{
//             backgroundColor: "#FFFFFF",
//             borderTop: "1px solid #F1E7DC",
//             borderBottom: "1px solid #F1E7DC",
//           }}
//         >
//           <div
//             className="px-3 pt-3 pb-2 fw-semibold"
//             style={{ fontSize: "13px", color: "#1E2328" }}
//           >
//             {members.length} Members
//           </div>

//           <div className="px-3 pb-2">
//             <div className="position-relative">
//               <SearchIcon
//                 size={14}
//                 className="position-absolute"
//                 style={{
//                   left: "10px",
//                   top: "50%",
//                   transform: "translateY(-50%)",
//                   color: "#B9AFA5",
//                   pointerEvents: "none",
//                 }}
//               />

//               <input
//                 type="text"
//                 value={memberSearch}
//                 onChange={(e) => setMemberSearch(e.target.value)}
//                 className="form-control"
//                 placeholder="Search members..."
//                 style={{
//                   border: "1px solid #F1E7DC",
//                   borderRadius: "8px",
//                   boxShadow: "none",
//                   fontSize: "12px",
//                   height: "32px",
//                   paddingLeft: "30px",
//                   backgroundColor: "#FFF8F3",
//                 }}
//               />
//             </div>
//           </div>

//           {filteredMembers.length === 0 && (
//             <div
//               className="text-center py-3"
//               style={{ fontSize: "12px", color: "#8A7C6F" }}
//             >
//               No members found
//             </div>
//           )}

//           {filteredMembers.map((member) => (
//             <div
//               key={member.id}
//               className="d-flex align-items-center gap-2 px-3 py-2"
//             >
//               <div
//                 className="d-flex align-items-center justify-content-center"
//                 style={{
//                   width: "40px",
//                   height: "40px",
//                   minWidth: "40px",
//                   borderRadius: "50%",
//                   backgroundColor: member.color || "#7C6FE8",
//                   color: "#FFFFFF",
//                   fontWeight: "600",
//                   fontSize: "12px",
//                 }}
//               >
//                 {member.avatar || member.name.slice(0, 2).toUpperCase()}
//               </div>

//               <div className="flex-grow-1" style={{ minWidth: 0 }}>
//                 <div
//                   className="text-truncate fw-medium"
//                   style={{ fontSize: "13px", color: "#1E2328" }}
//                 >
//                   {member.name}
//                 </div>

//                 <div style={{ fontSize: "10px", color: "#B9AFA5" }}>
//                   {member.role}
//                 </div>
//               </div>

//               {member.role === "Admin" && (
//                 <span
//                   style={{
//                     fontSize: "9px",
//                     color: "#F4712B",
//                     backgroundColor: "#FFF0E7",
//                     borderRadius: "8px",
//                     padding: "2px 8px",
//                     fontWeight: "600",
//                   }}
//                 >
//                   Admin
//                 </span>
//               )}
//             </div>
//           ))}
//         </div>

//         {/* EXIT GROUP */}
//         <div className="px-3 py-3">
//           <button
//             onClick={() => onLeave && onLeave(group)}
//             className="btn w-100 d-flex align-items-center justify-content-center gap-2"
//             style={{
//               border: "1px solid #F5C6C2",
//               color: "#D9534F",
//               backgroundColor: "#FFFFFF",
//               borderRadius: "10px",
//               fontSize: "13px",
//             }}
//           >
//             <LogOut size={15} />
//             Exit Group
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default GroupDetails;

import {
  ArrowLeft,
  Users,
  LogOut,
  Search as SearchIcon,
  MoreVertical,
  UserPlus,
  Pencil,
  Trash2,
  X,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import {
  getGroup,
  updateGroup,
  deleteGroup,
  getGroupMembers,
  addGroupMember,
  removeGroupMember,
  promoteMember,
  demoteMember,
  blockMember,
  unblockMember,
  leaveGroup,
  clearGroupMessages,
} from "../../../api/groupsApi";
import { getMyProfile, searchUsers } from "../../../api/usersApi";

const COLORS = ["#7C6FE8", "#2E9E6D", "#D9822B", "#E8556D", "#2B8FD9"];

const mapMember = (m) => {
  const u = m.user ?? m;
  const name = u.name ?? u.fullName ?? u.username ?? u.email ?? "Unknown";
  const role = String(m.role ?? u.role ?? "").toUpperCase();
  return {
    id: m.userId ?? u.userId ?? u.id ?? m.id,
    name,
    avatar:
      u.avatar ||
      name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase(),
    color: u.color || COLORS[name.charCodeAt(0) % COLORS.length],
    isAdmin: role === "ADMIN" || m.admin === true || m.isAdmin === true,
    blocked: m.blocked ?? m.isBlocked ?? false,
  };
};

const menuItem = { fontSize: 12, cursor: "pointer" };

function GroupDetails({ group: initialGroup, onClose, onLeave }) {
  const groupId = initialGroup?.id;

  const [group, setGroup] = useState(initialGroup);
  const [members, setMembers] = useState([]);
  const [myId, setMyId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [memberSearch, setMemberSearch] = useState("");
  const [menuId, setMenuId] = useState(null);

  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [editDesc, setEditDesc] = useState("");

  const [showAdd, setShowAdd] = useState(false);
  const [addSearch, setAddSearch] = useState("");
  const [addUsers, setAddUsers] = useState([]);
  const [addLoading, setAddLoading] = useState(false);

  /* ---------- LOAD ---------- */

  const loadMembers = useCallback(async () => {
    try {
      const list = await getGroupMembers(groupId);
      setMembers(list.map(mapMember));
    } catch (e) {
      console.error("Load members error:", e);
    }
  }, [groupId]);

  useEffect(() => {
    if (groupId == null) return;
    let cancelled = false;

    (async () => {
      try {
        const [me, g] = await Promise.all([getMyProfile(), getGroup(groupId)]);
        if (cancelled) return;
        setMyId(me.id ?? me.userId);
        setGroup((prev) => ({ ...prev, ...g, chatId: g.chatId ?? prev.chatId }));
      } catch (e) {
        console.error("Load group error:", e);
      }
      await loadMembers();
      if (!cancelled) setLoading(false);
    })();

    return () => {
      cancelled = true;
    };
  }, [groupId, loadMembers]);

  const isMe = (m) => String(m.id) === String(myId);
  const amAdmin =
    members.some((m) => isMe(m) && m.isAdmin) || (!members.length && !!group?.isAdmin);

  /* ---------- GROUP ACTIONS ---------- */

  const startEdit = () => {
    setEditName(group?.name || "");
    setEditDesc(group?.description || "");
    setEditing(true);
  };

  const saveEdit = async () => {
    const name = editName.trim();
    if (!name) return alert("Group name is required.");
    try {
      await updateGroup(groupId, { name, description: editDesc.trim() });
      setGroup((g) => ({ ...g, name, description: editDesc.trim() }));
      setEditing(false);
    } catch (e) {
      alert("Failed to update group.");
    }
  };

  const handleLeave = async () => {
    if (!window.confirm(`Leave ${group?.name}?`)) return;
    try {
      await leaveGroup(groupId);
      onLeave && onLeave(group);
    } catch (e) {
      alert("Failed to leave group.");
    }
  };

  const handleDeleteGroup = async () => {
    if (!window.confirm(`Delete ${group?.name} for everyone? This can't be undone.`)) return;
    try {
      await deleteGroup(groupId);
      onLeave && onLeave(group);
    } catch (e) {
      alert("Failed to delete group.");
    }
  };

  const handleClear = async () => {
    if (!window.confirm("Permanently clear all messages in this group?")) return;
    try {
      await clearGroupMessages(groupId);
      alert("Chat cleared.");
    } catch (e) {
      alert("Failed to clear chat.");
    }
  };

  /* ---------- MEMBER ACTIONS ---------- */

  const runMemberAction = async (fn, m, failMsg) => {
    setMenuId(null);
    try {
      await fn(groupId, m.id);
      await loadMembers();
    } catch (e) {
      alert(failMsg);
    }
  };

  const handleRemove = (m) => {
    if (!window.confirm(`Remove ${m.name} from the group?`)) return;
    runMemberAction(removeGroupMember, m, "Failed to remove member.");
  };

  /* ---------- ADD MEMBER ---------- */

  useEffect(() => {
    if (!showAdd) return;
    let cancelled = false;

    const timer = setTimeout(async () => {
      try {
        setAddLoading(true);
        const list = await searchUsers(addSearch.trim());
        if (!cancelled) setAddUsers(list.map(mapMember));
      } catch (e) {
        if (!cancelled) setAddUsers([]);
      } finally {
        if (!cancelled) setAddLoading(false);
      }
    }, 300);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [showAdd, addSearch]);

  const handleAdd = async (user) => {
    try {
      await addGroupMember(groupId, user.id);
      await loadMembers();
    } catch (e) {
      alert("Failed to add member.");
    }
  };

  const closeAdd = () => {
    setShowAdd(false);
    setAddSearch("");
  };

  /* ---------- DERIVED ---------- */

  const memberIds = new Set(members.map((m) => String(m.id)));
  const addable = addUsers.filter((u) => !memberIds.has(String(u.id)) && String(u.id) !== String(myId));

  const filteredMembers = members
    .filter((m) => m.name.toLowerCase().includes(memberSearch.toLowerCase()))
    .sort((a, b) => Number(isMe(b)) - Number(isMe(a)) || Number(b.isAdmin) - Number(a.isAdmin));

  const groupAvatar = group?.avatar || group?.name?.slice(0, 2).toUpperCase() || "G";
  const memberTotal = members.length || group?.memberCount || 0;

  /* ---------- RENDER ---------- */

  return (
    <div className="d-flex flex-column" style={{ height: "100%", backgroundColor: "#FCFBF8" }}>
      {/* HEADER */}
      <div
        className="d-flex align-items-center px-3"
        style={{ height: "60px", minHeight: "60px", backgroundColor: "#FBE4D0", color: "#1E2328" }}
      >
        <button
          onClick={onClose}
          className="btn border-0 p-0 me-2 d-flex align-items-center justify-content-center"
          style={{ width: "30px", height: "30px", color: "#1E2328" }}
          title="Back"
        >
          <ArrowLeft size={20} strokeWidth={2} />
        </button>

        <div className="fw-semibold flex-grow-1" style={{ fontSize: "13px" }}>
          Group Info
        </div>

        {amAdmin && !editing && (
          <button onClick={startEdit} className="btn border-0 p-1" title="Edit group">
            <Pencil size={16} color="#1E2328" />
          </button>
        )}
      </div>

      {/* CLICK OUTSIDE TO CLOSE MEMBER MENU */}
      {menuId && (
        <div onClick={() => setMenuId(null)} style={{ position: "fixed", inset: 0, zIndex: 15 }} />
      )}

      <div className="flex-grow-1" style={{ overflowY: "auto" }}>
        {/* GROUP INFO */}
        <div
          className="d-flex flex-column align-items-center px-3 py-4"
          style={{ backgroundColor: "#FFFFFF", borderBottom: "1px solid #F1E7DC" }}
        >
          <div
            className="d-flex align-items-center justify-content-center"
            style={{
              width: "80px",
              height: "80px",
              borderRadius: "22px",
              backgroundColor: group?.color || "#F4712B",
              color: "#FFFFFF",
              fontWeight: "600",
              fontSize: "24px",
            }}
          >
            {groupAvatar}
          </div>

          {editing ? (
            <div className="w-100 mt-3">
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="form-control mb-2"
                placeholder="Group name"
                style={{ fontSize: "13px", boxShadow: "none", border: "1px solid #F1E7DC" }}
              />
              <input
                type="text"
                value={editDesc}
                onChange={(e) => setEditDesc(e.target.value)}
                className="form-control mb-2"
                placeholder="Description"
                style={{ fontSize: "13px", boxShadow: "none", border: "1px solid #F1E7DC" }}
              />
              <div className="d-flex justify-content-end gap-2">
                <button
                  className="btn btn-sm border-0"
                  onClick={() => setEditing(false)}
                  style={{ color: "#8A7C6F", fontSize: "12px" }}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-sm border-0"
                  onClick={saveEdit}
                  style={{ backgroundColor: "#F4712B", color: "#FFF", fontSize: "12px", borderRadius: "8px" }}
                >
                  Save
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="fw-semibold mt-3 text-center" style={{ fontSize: "17px", color: "#1E2328" }}>
                {group?.name || "Group"}
              </div>

              <div
                className="d-flex align-items-center gap-1 mt-1"
                style={{ fontSize: "12px", color: "#8A7C6F" }}
              >
                <Users size={13} />
                Group · {memberTotal} members
              </div>
            </>
          )}
        </div>

        {/* DESCRIPTION */}
        {!editing && (
          <div
            className="px-3 py-3 mt-2"
            style={{
              backgroundColor: "#FFFFFF",
              borderTop: "1px solid #F1E7DC",
              borderBottom: "1px solid #F1E7DC",
            }}
          >
            <div style={{ fontSize: "11px", color: "#8A7C6F", marginBottom: "4px" }}>Description</div>
            <div style={{ fontSize: "13px", color: "#1E2328" }}>
              {group?.description || "No description added."}
            </div>
          </div>
        )}

        {/* MEMBERS */}
        <div
          className="mt-2"
          style={{
            backgroundColor: "#FFFFFF",
            borderTop: "1px solid #F1E7DC",
            borderBottom: "1px solid #F1E7DC",
          }}
        >
          <div className="d-flex align-items-center justify-content-between px-3 pt-3 pb-2">
            <div className="fw-semibold" style={{ fontSize: "13px", color: "#1E2328" }}>
              {memberTotal} Members
            </div>

            {amAdmin && (
              <button
                onClick={() => setShowAdd(true)}
                className="btn btn-sm border-0 d-flex align-items-center gap-1"
                style={{ color: "#F4712B", fontSize: "12px" }}
              >
                <UserPlus size={14} />
                Add
              </button>
            )}
          </div>

          <div className="px-3 pb-2">
            <div className="position-relative">
              <SearchIcon
                size={14}
                className="position-absolute"
                style={{
                  left: "10px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#B9AFA5",
                  pointerEvents: "none",
                }}
              />
              <input
                type="text"
                value={memberSearch}
                onChange={(e) => setMemberSearch(e.target.value)}
                className="form-control"
                placeholder="Search members..."
                style={{
                  border: "1px solid #F1E7DC",
                  borderRadius: "8px",
                  boxShadow: "none",
                  fontSize: "12px",
                  height: "32px",
                  paddingLeft: "30px",
                  backgroundColor: "#FFF8F3",
                }}
              />
            </div>
          </div>

          {loading && (
            <div className="text-center py-3" style={{ fontSize: "12px", color: "#8A7C6F" }}>
              Loading members...
            </div>
          )}

          {!loading && filteredMembers.length === 0 && (
            <div className="text-center py-3" style={{ fontSize: "12px", color: "#8A7C6F" }}>
              No members found
            </div>
          )}

          {filteredMembers.map((member) => (
            <div
              key={member.id}
              className="d-flex align-items-center gap-2 px-3 py-2 position-relative"
            >
              <div
                className="d-flex align-items-center justify-content-center"
                style={{
                  width: "40px",
                  height: "40px",
                  minWidth: "40px",
                  borderRadius: "50%",
                  backgroundColor: member.color,
                  color: "#FFFFFF",
                  fontWeight: "600",
                  fontSize: "12px",
                }}
              >
                {member.avatar}
              </div>

              <div className="flex-grow-1" style={{ minWidth: 0 }}>
                <div className="text-truncate fw-medium" style={{ fontSize: "13px", color: "#1E2328" }}>
                  {isMe(member) ? "You" : member.name}
                </div>
                <div style={{ fontSize: "10px", color: member.blocked ? "#D9534F" : "#B9AFA5" }}>
                  {member.blocked ? "Blocked" : member.isAdmin ? "Admin" : "Member"}
                </div>
              </div>

              {member.isAdmin && (
                <span
                  style={{
                    fontSize: "9px",
                    color: "#F4712B",
                    backgroundColor: "#FFF0E7",
                    borderRadius: "8px",
                    padding: "2px 8px",
                    fontWeight: "600",
                  }}
                >
                  Admin
                </span>
              )}

              {amAdmin && !isMe(member) && (
                <>
                  <button
                    className="btn border-0 p-1"
                    onClick={() => setMenuId(menuId === member.id ? null : member.id)}
                    aria-label="Member options"
                  >
                    <MoreVertical size={14} color="#B9AFA5" />
                  </button>

                  {menuId === member.id && (
                    <div
                      className="position-absolute bg-white shadow-sm"
                      style={{
                        right: 12,
                        top: 42,
                        zIndex: 20,
                        borderRadius: 10,
                        border: "1px solid #F1E7DC",
                        minWidth: 150,
                      }}
                    >
                      {member.isAdmin ? (
                        <div
                          className="px-3 py-2"
                          style={menuItem}
                          onClick={() => runMemberAction(demoteMember, member, "Failed to demote.")}
                        >
                          Remove as admin
                        </div>
                      ) : (
                        <div
                          className="px-3 py-2"
                          style={menuItem}
                          onClick={() => runMemberAction(promoteMember, member, "Failed to promote.")}
                        >
                          Make admin
                        </div>
                      )}
                      <div
                        className="px-3 py-2"
                        style={menuItem}
                        onClick={() =>
                          runMemberAction(
                            member.blocked ? unblockMember : blockMember,
                            member,
                            "Failed to update block status."
                          )
                        }
                      >
                        {member.blocked ? "Unblock" : "Block"}
                      </div>
                      <div
                        className="px-3 py-2 text-danger"
                        style={menuItem}
                        onClick={() => handleRemove(member)}
                      >
                        Remove from group
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          ))}
        </div>

        {/* ACTIONS */}
        <div className="px-3 py-3 d-flex flex-column gap-2">
          <button
            onClick={handleClear}
            className="btn w-100 d-flex align-items-center justify-content-center gap-2"
            style={{
              border: "1px solid #F1E7DC",
              color: "#1E2328",
              backgroundColor: "#FFFFFF",
              borderRadius: "10px",
              fontSize: "13px",
            }}
          >
            <Trash2 size={15} />
            Clear chat
          </button>

          <button
            onClick={handleLeave}
            className="btn w-100 d-flex align-items-center justify-content-center gap-2"
            style={{
              border: "1px solid #F5C6C2",
              color: "#D9534F",
              backgroundColor: "#FFFFFF",
              borderRadius: "10px",
              fontSize: "13px",
            }}
          >
            <LogOut size={15} />
            Exit Group
          </button>

          {amAdmin && (
            <button
              onClick={handleDeleteGroup}
              className="btn w-100 d-flex align-items-center justify-content-center gap-2"
              style={{
                border: "1px solid #F5C6C2",
                color: "#FFFFFF",
                backgroundColor: "#D9534F",
                borderRadius: "10px",
                fontSize: "13px",
              }}
            >
              <Trash2 size={15} />
              Delete Group
            </button>
          )}
        </div>
      </div>

      {/* ADD MEMBER MODAL */}
      {showAdd && (
        <>
          <div
            className="position-fixed top-0 start-0 w-100 h-100"
            style={{ backgroundColor: "rgba(0,0,0,0.35)", zIndex: 1040 }}
            onClick={closeAdd}
          />
          <div
            className="position-fixed"
            style={{
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "380px",
              maxWidth: "calc(100% - 30px)",
              backgroundColor: "#FFFFFF",
              borderRadius: "14px",
              boxShadow: "0 10px 35px rgba(0,0,0,0.18)",
              zIndex: 1050,
              overflow: "hidden",
            }}
          >
            <div
              className="d-flex align-items-center justify-content-between px-3 py-3"
              style={{ borderBottom: "1px solid #F1E7DC" }}
            >
              <div className="fw-semibold" style={{ color: "#1E2328", fontSize: "15px" }}>
                Add Member
              </div>
              <button onClick={closeAdd} className="btn p-1 border-0" style={{ color: "#8A7C6F" }}>
                <X size={19} />
              </button>
            </div>

            <div className="px-3 py-3">
              <input
                type="text"
                value={addSearch}
                onChange={(e) => setAddSearch(e.target.value)}
                className="form-control"
                placeholder="Search users..."
                autoFocus
                style={{ border: "1px solid #F1E7DC", borderRadius: "9px", boxShadow: "none", fontSize: "13px" }}
              />
            </div>

            <div style={{ maxHeight: "280px", overflowY: "auto" }}>
              {addLoading && (
                <div className="text-center py-4" style={{ color: "#8A7C6F", fontSize: "12px" }}>
                  Loading users...
                </div>
              )}

              {!addLoading && addable.length === 0 && (
                <div className="text-center py-4" style={{ color: "#8A7C6F", fontSize: "12px" }}>
                  No users to add
                </div>
              )}

              {!addLoading &&
                addable.map((user) => (
                  <div key={user.id} className="d-flex align-items-center gap-2 px-3 py-2">
                    <div
                      className="d-flex align-items-center justify-content-center"
                      style={{
                        width: "36px",
                        height: "36px",
                        minWidth: "36px",
                        borderRadius: "50%",
                        backgroundColor: user.color,
                        color: "#FFFFFF",
                        fontWeight: "600",
                        fontSize: "11px",
                      }}
                    >
                      {user.avatar}
                    </div>
                    <div className="flex-grow-1 text-truncate" style={{ fontSize: "13px", color: "#1E2328" }}>
                      {user.name}
                    </div>
                    <button
                      className="btn btn-sm border-0"
                      onClick={() => handleAdd(user)}
                      style={{ backgroundColor: "#F4712B", color: "#FFF", fontSize: "11px", borderRadius: "8px" }}
                    >
                      Add
                    </button>
                  </div>
                ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default GroupDetails;