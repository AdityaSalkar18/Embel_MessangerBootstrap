
// import { Search, X } from "lucide-react";
// import { useEffect, useState } from "react";

// function NewChatModal({ show, onClose, onSelectUser }) {
//   const [search, setSearch] = useState("");
//   const [users, setUsers] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   // Fetch users when modal opens
//   useEffect(() => {
//     if (!show) return;

//     const fetchUsers = async () => {
//       try {
//         setLoading(true);
//         setError("");

//         const token = localStorage.getItem("token");

//         const response = await fetch(
//           "http://localhost:8081/api/users/search",
//           {
//             method: "GET",
//             headers: {
//               "Content-Type": "application/json",
//               ...(token && {
//                 Authorization: `Bearer ${token}`,
//               }),
//             },
//           }
//         );

//         if (!response.ok) {
//           throw new Error("Failed to fetch users");
//         }

//         const data = await response.json();

//         console.log("Users search response:", data);

//         // Handle different common response formats
//         let apiUsers = [];

//         if (Array.isArray(data)) {
//           apiUsers = data;
//         } else if (Array.isArray(data.data)) {
//           apiUsers = data.data;
//         } else if (Array.isArray(data.users)) {
//           apiUsers = data.users;
//         }

//         const formattedUsers = apiUsers.map((user, index) => {
//           const name =
//             user.name ||
//             user.fullName ||
//             user.username ||
//             user.email ||
//             "Unknown User";

//           const avatar =
//             user.avatar ||
//             user.initials ||
//             name
//               .split(" ")
//               .map((word) => word.charAt(0))
//               .join("")
//               .substring(0, 2)
//               .toUpperCase();

//           return {
//             ...user,
//             id: user.id || user.userId || index + 1,
//             name,
//             avatar,
//             online: user.online ?? user.isOnline ?? false,
//             color:
//               user.color ||
//               ["#7C6FE8", "#2E9E6D", "#D9822B"][index % 3],
//           };
//         });

//         setUsers(formattedUsers);
//       } catch (err) {
//         console.error("Error fetching users:", err);
//         setError("Unable to load users");
//         setUsers([]);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchUsers();
//   }, [show]);

//   // Local search
//   const filteredUsers = users.filter((user) =>
//     user.name.toLowerCase().includes(search.toLowerCase())
//   );

//   if (!show) return null;

//   const handleSelectUser = (user) => {
//     if (onSelectUser) {
//       onSelectUser(user);
//     }

//     onClose();
//     setSearch("");
//   };

//   const handleClose = () => {
//     onClose();
//     setSearch("");
//   };

//   return (
//     <>
//       {/* BACKDROP */}
//       <div
//         className="position-fixed top-0 start-0 w-100 h-100"
//         style={{
//           backgroundColor: "rgba(0, 0, 0, 0.35)",
//           zIndex: 1040,
//         }}
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
//           style={{
//             borderBottom: "1px solid #F1E7DC",
//           }}
//         >
//           <div
//             className="fw-semibold"
//             style={{
//               color: "#1E2328",
//               fontSize: "15px",
//             }}
//           >
//             Start New Chat
//           </div>

//           <button
//             onClick={handleClose}
//             className="btn p-1 border-0"
//             style={{
//               color: "#8A7C6F",
//             }}
//           >
//             <X size={19} />
//           </button>
//         </div>

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
//               placeholder="Search users..."
//               autoFocus
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
//         <div
//           style={{
//             maxHeight: "320px",
//             overflowY: "auto",
//           }}
//         >
//           {/* LOADING */}
//           {loading && (
//             <div
//               className="text-center py-4"
//               style={{
//                 color: "#8A7C6F",
//                 fontSize: "12px",
//               }}
//             >
//               Loading users...
//             </div>
//           )}

//           {/* ERROR */}
//           {!loading && error && (
//             <div
//               className="text-center py-4"
//               style={{
//                 color: "#D9534F",
//                 fontSize: "12px",
//               }}
//             >
//               {error}
//             </div>
//           )}

//           {/* USERS */}
//           {!loading && !error && filteredUsers.length > 0 ? (
//             filteredUsers.map((user) => (
//               <div
//                 key={user.id}
//                 onClick={() => handleSelectUser(user)}
//                 className="d-flex align-items-center gap-2 px-3 py-2"
//                 style={{
//                   cursor: "pointer",
//                   transition: "background-color 0.15s",
//                 }}
//                 onMouseEnter={(e) => {
//                   e.currentTarget.style.backgroundColor = "#FFF7F2";
//                 }}
//                 onMouseLeave={(e) => {
//                   e.currentTarget.style.backgroundColor = "#FFFFFF";
//                 }}
//               >
//                 {/* AVATAR */}
//                 <div
//                   className="position-relative d-flex align-items-center justify-content-center"
//                   style={{
//                     width: "40px",
//                     height: "40px",
//                     minWidth: "40px",
//                     borderRadius: "50%",
//                     backgroundColor: user.color,
//                     color: "#FFFFFF",
//                     fontWeight: "600",
//                     fontSize: "11px",
//                   }}
//                 >
//                   {user.avatar}

//                   {user.online && (
//                     <span
//                       className="position-absolute"
//                       style={{
//                         width: "9px",
//                         height: "9px",
//                         borderRadius: "50%",
//                         backgroundColor: "#2E9E6D",
//                         border: "2px solid #FFFFFF",
//                         right: "0",
//                         bottom: "0",
//                       }}
//                     />
//                   )}
//                 </div>

//                 {/* USER NAME */}
//                 <div className="flex-grow-1">
//                   <div
//                     style={{
//                       color: "#1E2328",
//                       fontSize: "13px",
//                       fontWeight: "500",
//                     }}
//                   >
//                     {user.name}
//                   </div>

//                   <div
//                     style={{
//                       color: user.online ? "#2E9E6D" : "#B9AFA5",
//                       fontSize: "10px",
//                       marginTop: "2px",
//                     }}
//                   >
//                     {user.online ? "Online" : "Offline"}
//                   </div>
//                 </div>
//               </div>
//             ))
//           ) : (
//             !loading &&
//             !error && (
//               <div
//                 className="text-center py-4"
//                 style={{
//                   color: "#8A7C6F",
//                   fontSize: "12px",
//                 }}
//               >
//                 No users found
//               </div>
//             )
//           )}
//         </div>
//       </div>
//     </>
//   );
// }

// export default NewChatModal;


import { Search, X, Check } from "lucide-react";
import { useEffect, useState } from "react";
import { getOrCreateOneToOneChat } from "../../../api/chatsApi";
import { createGroup } from "../../../api/groupsApi";

function NewChatModal({ show, onClose, onSelectUser, onCreateGroup }) {
  const [tab, setTab] = useState("chat"); // "chat" | "group"
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [groupDesc, setGroupDesc] = useState("");
  const [selectedIds, setSelectedIds] = useState([]);

  // Fetch users when modal opens
  useEffect(() => {
    if (!show) return;

    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError("");

        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:8081/api/users/search", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        });

        if (!response.ok) throw new Error("Failed to fetch users");

        const data = await response.json();

        let apiUsers = [];
        if (Array.isArray(data)) apiUsers = data;
        else if (Array.isArray(data.data)) apiUsers = data.data;
        else if (Array.isArray(data.users)) apiUsers = data.users;

        const formattedUsers = apiUsers.map((user, index) => {
          const name =
            user.name || user.fullName || user.username || user.email || "Unknown User";

          const avatar =
            user.avatar ||
            user.initials ||
            name
              .split(" ")
              .map((word) => word.charAt(0))
              .join("")
              .substring(0, 2)
              .toUpperCase();

          return {
            ...user,
            id: user.id || user.userId || index + 1,
            name,
            avatar,
            online: user.online ?? user.isOnline ?? false,
            color: user.color || ["#7C6FE8", "#2E9E6D", "#D9822B"][index % 3],
          };
        });

        setUsers(formattedUsers);
      } catch (err) {
        console.error("Error fetching users:", err);
        setError("Unable to load users");
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [show]);

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(search.toLowerCase())
  );

  const reset = () => {
    setSearch("");
    setTab("chat");
    setGroupName("");
    setGroupDesc("");
    setSelectedIds([]);
    setError("");
    setBusy(false);
  };

  const handleClose = () => {
    onClose();
    reset();
  };

  if (!show) return null;

  /* ---------- ONE-TO-ONE (chat API) ---------- */
  const handleSelectUser = async (user) => {
    if (busy) return;
    try {
      setBusy(true);
      setError("");
      const res = await getOrCreateOneToOneChat(user.id);
      const chatId = res?.id ?? res?.chatId ?? res?.chat?.id;

      onSelectUser &&
        onSelectUser({
          id: chatId,
          userId: user.id,
          name: user.name,
          avatar: user.avatar,
          color: user.color,
          online: user.online,
        });

      reset();
    } catch (err) {
      console.error("Start chat error:", err);
      setError("Unable to start chat");
      setBusy(false);
    }
  };

  /* ---------- GROUP (group API) ---------- */
  const toggleSelect = (id) =>
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  const handleCreateGroup = async () => {
    if (busy) return;
    if (!groupName.trim()) return setError("Enter a group name");
    if (selectedIds.length === 0) return setError("Select at least one member");

    try {
      setBusy(true);
      setError("");
      const created = await createGroup({
        name: groupName.trim(),
        description: groupDesc.trim(),
        memberIds: selectedIds,
      });

      onCreateGroup && onCreateGroup(created);
      reset();
    } catch (err) {
      console.error("Create group error:", err);
      setError("Unable to create group");
      setBusy(false);
    }
  };

  const tabStyle = (active) => ({
    flex: 1,
    border: "none",
    background: "none",
    padding: "10px 0",
    fontSize: "13px",
    fontWeight: 600,
    color: active ? "#F4712B" : "#8A7C6F",
    borderBottom: active ? "2px solid #F4712B" : "2px solid transparent",
  });

  return (
    <>
      {/* BACKDROP */}
      <div
        className="position-fixed top-0 start-0 w-100 h-100"
        style={{ backgroundColor: "rgba(0, 0, 0, 0.35)", zIndex: 1040 }}
        onClick={handleClose}
      />

      {/* MODAL */}
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
        {/* HEADER */}
        <div
          className="d-flex align-items-center justify-content-between px-3 py-3"
          style={{ borderBottom: "1px solid #F1E7DC" }}
        >
          <div className="fw-semibold" style={{ color: "#1E2328", fontSize: "15px" }}>
            {tab === "chat" ? "Start New Chat" : "Create New Group"}
          </div>
          <button onClick={handleClose} className="btn p-1 border-0" style={{ color: "#8A7C6F" }}>
            <X size={19} />
          </button>
        </div>

        {/* TABS */}
        <div className="d-flex" style={{ borderBottom: "1px solid #F1E7DC" }}>
          <button
            style={tabStyle(tab === "chat")}
            onClick={() => {
              setTab("chat");
              setError("");
            }}
          >
            Chat
          </button>
          <button
            style={tabStyle(tab === "group")}
            onClick={() => {
              setTab("group");
              setError("");
            }}
          >
            Group
          </button>
        </div>

        {/* GROUP FIELDS */}
        {tab === "group" && (
          <div className="px-3 pt-3">
            <input
              type="text"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              className="form-control mb-2"
              placeholder="Group name"
              style={{
                border: "1px solid #F1E7DC",
                borderRadius: "9px",
                boxShadow: "none",
                fontSize: "13px",
              }}
            />
            <input
              type="text"
              value={groupDesc}
              onChange={(e) => setGroupDesc(e.target.value)}
              className="form-control"
              placeholder="Description (optional)"
              style={{
                border: "1px solid #F1E7DC",
                borderRadius: "9px",
                boxShadow: "none",
                fontSize: "13px",
              }}
            />
          </div>
        )}

        {/* SEARCH */}
        <div className="px-3 py-3">
          <div className="position-relative">
            <Search
              size={15}
              className="position-absolute"
              style={{
                left: "12px",
                top: "50%",
                transform: "translateY(-50%)",
                color: "#B9AFA5",
              }}
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="form-control"
              placeholder={tab === "chat" ? "Search users..." : "Search members..."}
              autoFocus
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

        {/* USERS */}
        <div style={{ maxHeight: "260px", overflowY: "auto" }}>
          {loading && (
            <div className="text-center py-4" style={{ color: "#8A7C6F", fontSize: "12px" }}>
              Loading users...
            </div>
          )}

          {!loading && error && (
            <div className="text-center py-2" style={{ color: "#D9534F", fontSize: "12px" }}>
              {error}
            </div>
          )}

          {!loading && filteredUsers.length > 0
            ? filteredUsers.map((user) => {
                const selected = selectedIds.includes(user.id);
                return (
                  <div
                    key={user.id}
                    onClick={() => (tab === "chat" ? handleSelectUser(user) : toggleSelect(user.id))}
                    className="d-flex align-items-center gap-2 px-3 py-2"
                    style={{
                      cursor: busy ? "wait" : "pointer",
                      transition: "background-color 0.15s",
                      backgroundColor: selected ? "#FFF7F2" : "#FFFFFF",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "#FFF7F2";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = selected ? "#FFF7F2" : "#FFFFFF";
                    }}
                  >
                    {/* AVATAR */}
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

                    {/* USER NAME */}
                    <div className="flex-grow-1">
                      <div style={{ color: "#1E2328", fontSize: "13px", fontWeight: "500" }}>
                        {user.name}
                      </div>
                      <div
                        style={{
                          color: user.online ? "#2E9E6D" : "#B9AFA5",
                          fontSize: "10px",
                          marginTop: "2px",
                        }}
                      >
                        {user.online ? "Online" : "Offline"}
                      </div>
                    </div>

                    {/* CHECK (group mode) */}
                    {tab === "group" && selected && <Check size={16} color="#F4712B" />}
                  </div>
                );
              })
            : !loading &&
              !error && (
                <div className="text-center py-4" style={{ color: "#8A7C6F", fontSize: "12px" }}>
                  No users found
                </div>
              )}
        </div>

        {/* GROUP FOOTER */}
        {tab === "group" && (
          <div
            className="d-flex align-items-center justify-content-between px-3 py-3"
            style={{ borderTop: "1px solid #F1E7DC" }}
          >
            <small style={{ color: "#8A7C6F", fontSize: "11px" }}>
              {selectedIds.length} selected
            </small>
            <button
              onClick={handleCreateGroup}
              disabled={busy}
              className="btn btn-sm border-0"
              style={{
                backgroundColor: "#F4712B",
                color: "#FFFFFF",
                fontSize: "12px",
                borderRadius: "8px",
                padding: "6px 14px",
              }}
            >
              {busy ? "Creating..." : "Create Group"}
            </button>
          </div>
        )}
      </div>
    </>
  );
}

export default NewChatModal;