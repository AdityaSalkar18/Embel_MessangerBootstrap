// import { Search, X, Check } from "lucide-react";
// import { useState } from "react";

// const DUMMY_USERS = [
//   { id: 1, name: "Aditya Salkar", avatar: "AS", online: true, color: "#7C6FE8" },
//   { id: 2, name: "Rahul Patil", avatar: "RP", online: true, color: "#2E9E6D" },
//   { id: 3, name: "Vishal", avatar: "V", online: false, color: "#D9822B" },
//   { id: 4, name: "Darshan", avatar: "D", online: true, color: "#2E9E6D" },
//   { id: 5, name: "Sneha Kulkarni", avatar: "SK", online: false, color: "#7C6FE8" },
//   { id: 6, name: "Omkar Deshmukh", avatar: "OD", online: true, color: "#D9822B" },
// ];

// const GROUP_COLORS = ["#7C6FE8", "#2E9E6D", "#D9822B", "#F4712B"];

// function NewGroupModal({ show, onClose, onCreateGroup }) {
//   const [groupName, setGroupName] = useState("");
//   const [search, setSearch] = useState("");
//   const [selectedIds, setSelectedIds] = useState([]);
//   const [error, setError] = useState("");

//   if (!show) return null;

//   const filteredUsers = DUMMY_USERS.filter((user) =>
//     user.name.toLowerCase().includes(search.toLowerCase())
//   );

//   const selectedUsers = DUMMY_USERS.filter((u) => selectedIds.includes(u.id));

//   const resetForm = () => {
//     setGroupName("");
//     setSearch("");
//     setSelectedIds([]);
//     setError("");
//   };

//   const handleClose = () => {
//     resetForm();
//     onClose && onClose();
//   };

//   const toggleUser = (id) => {
//     setError("");
//     setSelectedIds((prev) =>
//       prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
//     );
//   };

//   const handleCreate = () => {
//     const name = groupName.trim();

//     if (!name) {
//       setError("Please enter a group name");
//       return;
//     }

//     if (selectedIds.length < 1) {
//       setError("Select at least one member");
//       return;
//     }

//     const avatar = name
//       .split(" ")
//       .map((w) => w.charAt(0))
//       .join("")
//       .substring(0, 2)
//       .toUpperCase();

//     const newGroup = {
//       id: Date.now(),
//       name,
//       avatar,
//       color: GROUP_COLORS[Math.floor(Math.random() * GROUP_COLORS.length)],
//       members: selectedUsers,
//       memberCount: selectedUsers.length + 1, // +1 for you
//     };

//     onCreateGroup && onCreateGroup(newGroup);
//     resetForm();
//   };

//   return (
//     <>
//       {/* BACKDROP */}
//       <div
//         className="position-fixed top-0 start-0 w-100 h-100"
//         style={{ backgroundColor: "rgba(0, 0, 0, 0.35)", zIndex: 1040 }}
//         onClick={handleClose}
//       />

//       {/* MODAL */}
//       <div
//         className="position-fixed"
//         style={{
//           top: "50%",
//           left: "50%",
//           transform: "translate(-50%, -50%)",
//           width: "400px",
//           maxWidth: "calc(100% - 30px)",
//           backgroundColor: "#FFFFFF",
//           borderRadius: "14px",
//           boxShadow: "0 10px 35px rgba(0,0,0,0.18)",
//           zIndex: 1050,
//           overflow: "hidden",
//         }}
//       >
//         {/* HEADER */}
//         <div
//           className="d-flex align-items-center justify-content-between px-3 py-3"
//           style={{ borderBottom: "1px solid #F1E7DC" }}
//         >
//           <div
//             className="fw-semibold"
//             style={{ color: "#1E2328", fontSize: "15px" }}
//           >
//             Create New Group
//           </div>

//           <button
//             onClick={handleClose}
//             className="btn p-1 border-0"
//             style={{ color: "#8A7C6F" }}
//           >
//             <X size={19} />
//           </button>
//         </div>

//         {/* GROUP NAME */}
//         <div className="px-3 pt-3">
//           <input
//             type="text"
//             value={groupName}
//             onChange={(e) => {
//               setGroupName(e.target.value);
//               setError("");
//             }}
//             className="form-control"
//             placeholder="Group name"
//             autoFocus
//             style={{
//               border: "1px solid #F1E7DC",
//               borderRadius: "9px",
//               boxShadow: "none",
//               fontSize: "13px",
//             }}
//           />
//         </div>

//         {/* SELECTED MEMBERS */}
//         {selectedUsers.length > 0 && (
//           <div className="px-3 pt-2 d-flex flex-wrap gap-1">
//             {selectedUsers.map((user) => (
//               <span
//                 key={user.id}
//                 className="d-flex align-items-center gap-1"
//                 style={{
//                   backgroundColor: "#FFF0E7",
//                   color: "#F4712B",
//                   borderRadius: "14px",
//                   padding: "3px 6px 3px 10px",
//                   fontSize: "11px",
//                 }}
//               >
//                 {user.name}
//                 <X
//                   size={12}
//                   style={{ cursor: "pointer" }}
//                   onClick={() => toggleUser(user.id)}
//                 />
//               </span>
//             ))}
//           </div>
//         )}

//         {/* SEARCH */}
//         <div className="px-3 py-3">
//           <div className="position-relative">
//             <Search
//               size={15}
//               className="position-absolute"
//               style={{
//                 left: "12px",
//                 top: "50%",
//                 transform: "translateY(-50%)",
//                 color: "#B9AFA5",
//               }}
//             />

//             <input
//               type="text"
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//               className="form-control"
//               placeholder="Search members..."
//               style={{
//                 border: "1px solid #F1E7DC",
//                 borderRadius: "9px",
//                 boxShadow: "none",
//                 fontSize: "13px",
//                 paddingLeft: "35px",
//               }}
//             />
//           </div>
//         </div>

//         {/* USERS */}
//         <div style={{ maxHeight: "240px", overflowY: "auto" }}>
//           {filteredUsers.length > 0 ? (
//             filteredUsers.map((user) => {
//               const selected = selectedIds.includes(user.id);

//               return (
//                 <div
//                   key={user.id}
//                   onClick={() => toggleUser(user.id)}
//                   className="d-flex align-items-center gap-2 px-3 py-2"
//                   style={{
//                     cursor: "pointer",
//                     backgroundColor: selected ? "#FFF7F2" : "#FFFFFF",
//                     transition: "background-color 0.15s",
//                   }}
//                 >
//                   {/* AVATAR */}
//                   <div
//                     className="position-relative d-flex align-items-center justify-content-center"
//                     style={{
//                       width: "40px",
//                       height: "40px",
//                       minWidth: "40px",
//                       borderRadius: "50%",
//                       backgroundColor: user.color,
//                       color: "#FFFFFF",
//                       fontWeight: "600",
//                       fontSize: "11px",
//                     }}
//                   >
//                     {user.avatar}

//                     {user.online && (
//                       <span
//                         className="position-absolute"
//                         style={{
//                           width: "9px",
//                           height: "9px",
//                           borderRadius: "50%",
//                           backgroundColor: "#2E9E6D",
//                           border: "2px solid #FFFFFF",
//                           right: "0",
//                           bottom: "0",
//                         }}
//                       />
//                     )}
//                   </div>

//                   {/* NAME */}
//                   <div className="flex-grow-1">
//                     <div
//                       style={{
//                         color: "#1E2328",
//                         fontSize: "13px",
//                         fontWeight: "500",
//                       }}
//                     >
//                       {user.name}
//                     </div>

//                     <div
//                       style={{
//                         color: user.online ? "#2E9E6D" : "#B9AFA5",
//                         fontSize: "10px",
//                         marginTop: "2px",
//                       }}
//                     >
//                       {user.online ? "Online" : "Offline"}
//                     </div>
//                   </div>

//                   {/* CHECK */}
//                   <div
//                     className="d-flex align-items-center justify-content-center"
//                     style={{
//                       width: "20px",
//                       height: "20px",
//                       borderRadius: "50%",
//                       border: selected
//                         ? "none"
//                         : "1.5px solid #D8D5CE",
//                       backgroundColor: selected ? "#F4712B" : "transparent",
//                       color: "#FFFFFF",
//                     }}
//                   >
//                     {selected && <Check size={13} strokeWidth={3} />}
//                   </div>
//                 </div>
//               );
//             })
//           ) : (
//             <div
//               className="text-center py-4"
//               style={{ color: "#8A7C6F", fontSize: "12px" }}
//             >
//               No users found
//             </div>
//           )}
//         </div>

//         {/* ERROR */}
//         {error && (
//           <div
//             className="px-3 pt-2"
//             style={{ color: "#D9534F", fontSize: "12px" }}
//           >
//             {error}
//           </div>
//         )}

//         {/* FOOTER */}
//         <div
//           className="d-flex align-items-center justify-content-between px-3 py-3"
//           style={{ borderTop: "1px solid #F1E7DC", marginTop: "8px" }}
//         >
//           <small style={{ color: "#8A7C6F", fontSize: "11px" }}>
//             {selectedUsers.length} selected
//           </small>

//           <div className="d-flex gap-2">
//             <button
//               className="btn btn-sm border-0"
//               onClick={handleClose}
//               style={{ color: "#8A7C6F", fontSize: "12px" }}
//             >
//               Cancel
//             </button>

//             <button
//               className="btn btn-sm border-0"
//               onClick={handleCreate}
//               style={{
//                 backgroundColor: "#F4712B",
//                 color: "#FFFFFF",
//                 fontSize: "12px",
//                 padding: "5px 14px",
//                 borderRadius: "8px",
//               }}
//             >
//               Create Group
//             </button>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }

// export default NewGroupModal;


import { Search, X, Check } from "lucide-react";
import { useEffect, useState } from "react";
import { getMyProfile, searchUsers } from "../../../api/usersApi";

const COLORS = ["#7C6FE8", "#2E9E6D", "#D9822B", "#E8556D", "#2B8FD9"];

function NewGroupModal({ show, onClose, onCreateGroup }) {
  const [groupName, setGroupName] = useState("");
  const [description, setDescription] = useState("");
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState([]);
  const [me, setMe] = useState(null);
  const [selected, setSelected] = useState([]); // full user objects
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!show) return;
    getMyProfile().then(setMe).catch((e) => console.error("Profile error:", e));
  }, [show]);

  useEffect(() => {
    if (!show) return;
    let cancelled = false;

    const fetchUsers = async () => {
      try {
        setLoading(true);
        const list = await searchUsers(search.trim());
        const formatted = list.map((user, index) => {
          const name = user.name || user.fullName || user.username || user.email || "Unknown User";
          return {
            ...user,
            id: user.id ?? user.userId ?? index + 1,
            name,
            avatar:
              user.avatar ||
              name.split(" ").map((w) => w.charAt(0)).join("").substring(0, 2).toUpperCase(),
            online: user.online ?? user.isOnline ?? false,
            color: user.color || COLORS[name.charCodeAt(0) % COLORS.length],
          };
        });
        if (!cancelled) setUsers(formatted);
      } catch (e) {
        console.error("Error fetching users:", e);
        if (!cancelled) setUsers([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    const timer = setTimeout(fetchUsers, 300);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [show, search]);

  if (!show) return null;

  const filteredUsers = users.filter((u) => u.id !== me?.id);
  const isSelected = (id) => selected.some((u) => u.id === id);

  const resetForm = () => {
    setGroupName("");
    setDescription("");
    setSearch("");
    setSelected([]);
    setError("");
  };

  const handleClose = () => {
    resetForm();
    onClose && onClose();
  };

  const toggleUser = (user) => {
    setError("");
    setSelected((prev) =>
      prev.some((u) => u.id === user.id) ? prev.filter((u) => u.id !== user.id) : [...prev, user]
    );
  };

  const handleCreate = async () => {
    const name = groupName.trim();
    if (!name) return setError("Please enter a group name");
    if (selected.length < 1) return setError("Select at least one member");

    setCreating(true);
    const ok = await onCreateGroup({
      name,
      description: description.trim(),
      memberIds: selected.map((u) => u.id),
    });
    setCreating(false);

    if (ok) resetForm();
    else setError("Unable to create group");
  };

  return (
    <>
      <div
        className="position-fixed top-0 start-0 w-100 h-100"
        style={{ backgroundColor: "rgba(0, 0, 0, 0.35)", zIndex: 1040 }}
        onClick={handleClose}
      />

      <div
        className="position-fixed"
        style={{
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "400px",
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
            Create New Group
          </div>
          <button onClick={handleClose} className="btn p-1 border-0" style={{ color: "#8A7C6F" }}>
            <X size={19} />
          </button>
        </div>

        <div className="px-3 pt-3">
          <input
            type="text"
            value={groupName}
            onChange={(e) => {
              setGroupName(e.target.value);
              setError("");
            }}
            className="form-control mb-2"
            placeholder="Group name"
            autoFocus
            style={{ border: "1px solid #F1E7DC", borderRadius: "9px", boxShadow: "none", fontSize: "13px" }}
          />
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="form-control"
            placeholder="Description (optional)"
            style={{ border: "1px solid #F1E7DC", borderRadius: "9px", boxShadow: "none", fontSize: "13px" }}
          />
        </div>

        {selected.length > 0 && (
          <div className="px-3 pt-2 d-flex flex-wrap gap-1">
            {selected.map((user) => (
              <span
                key={user.id}
                className="d-flex align-items-center gap-1"
                style={{
                  backgroundColor: "#FFF0E7",
                  color: "#F4712B",
                  borderRadius: "14px",
                  padding: "3px 6px 3px 10px",
                  fontSize: "11px",
                }}
              >
                {user.name}
                <X size={12} style={{ cursor: "pointer" }} onClick={() => toggleUser(user)} />
              </span>
            ))}
          </div>
        )}

        <div className="px-3 py-3">
          <div className="position-relative">
            <Search
              size={15}
              className="position-absolute"
              style={{ left: "12px", top: "50%", transform: "translateY(-50%)", color: "#B9AFA5" }}
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="form-control"
              placeholder="Search members..."
              style={{
                border: "1px solid #F1E7DC",
                borderRadius: "9px",
                boxShadow: "none",
                fontSize: "13px",
                paddingLeft: "35px",
              }}
            />
          </div>
        </div>

        <div style={{ maxHeight: "240px", overflowY: "auto" }}>
          {loading && (
            <div className="text-center py-4" style={{ color: "#8A7C6F", fontSize: "12px" }}>
              Loading users...
            </div>
          )}

          {!loading && filteredUsers.length === 0 && (
            <div className="text-center py-4" style={{ color: "#8A7C6F", fontSize: "12px" }}>
              No users found
            </div>
          )}

          {!loading &&
            filteredUsers.map((user) => {
              const sel = isSelected(user.id);
              return (
                <div
                  key={user.id}
                  onClick={() => toggleUser(user)}
                  className="d-flex align-items-center gap-2 px-3 py-2"
                  style={{
                    cursor: "pointer",
                    backgroundColor: sel ? "#FFF7F2" : "#FFFFFF",
                    transition: "background-color 0.15s",
                  }}
                >
                  <div
                    className="position-relative d-flex align-items-center justify-content-center"
                    style={{
                      width: "40px",
                      height: "40px",
                      minWidth: "40px",
                      borderRadius: "50%",
                      backgroundColor: user.color,
                      color: "#FFFFFF",
                      fontWeight: "600",
                      fontSize: "11px",
                    }}
                  >
                    {user.avatar}
                    {user.online && (
                      <span
                        className="position-absolute"
                        style={{
                          width: "9px",
                          height: "9px",
                          borderRadius: "50%",
                          backgroundColor: "#2E9E6D",
                          border: "2px solid #FFFFFF",
                          right: "0",
                          bottom: "0",
                        }}
                      />
                    )}
                  </div>

                  <div className="flex-grow-1">
                    <div style={{ color: "#1E2328", fontSize: "13px", fontWeight: "500" }}>{user.name}</div>
                    <div style={{ color: user.online ? "#2E9E6D" : "#B9AFA5", fontSize: "10px", marginTop: "2px" }}>
                      {user.online ? "Online" : "Offline"}
                    </div>
                  </div>

                  <div
                    className="d-flex align-items-center justify-content-center"
                    style={{
                      width: "20px",
                      height: "20px",
                      borderRadius: "50%",
                      border: sel ? "none" : "1.5px solid #D8D5CE",
                      backgroundColor: sel ? "#F4712B" : "transparent",
                      color: "#FFFFFF",
                    }}
                  >
                    {sel && <Check size={13} strokeWidth={3} />}
                  </div>
                </div>
              );
            })}
        </div>

        {error && (
          <div className="px-3 pt-2" style={{ color: "#D9534F", fontSize: "12px" }}>
            {error}
          </div>
        )}

        <div
          className="d-flex align-items-center justify-content-between px-3 py-3"
          style={{ borderTop: "1px solid #F1E7DC", marginTop: "8px" }}
        >
          <small style={{ color: "#8A7C6F", fontSize: "11px" }}>{selected.length} selected</small>

          <div className="d-flex gap-2">
            <button
              className="btn btn-sm border-0"
              onClick={handleClose}
              style={{ color: "#8A7C6F", fontSize: "12px" }}
            >
              Cancel
            </button>
            <button
              className="btn btn-sm border-0"
              onClick={handleCreate}
              disabled={creating}
              style={{
                backgroundColor: "#F4712B",
                color: "#FFFFFF",
                fontSize: "12px",
                padding: "5px 14px",
                borderRadius: "8px",
                opacity: creating ? 0.6 : 1,
              }}
            >
              {creating ? "Creating..." : "Create Group"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default NewGroupModal;