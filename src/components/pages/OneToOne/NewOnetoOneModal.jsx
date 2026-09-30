


// import { Search, X } from "lucide-react";
// import { useEffect, useState } from "react";
// import { getMyProfile, searchUsers, getUserProfile } from "../../../api/usersApi";

// const COLORS = ["#7C6FE8", "#2E9E6D", "#D9822B", "#E8556D", "#2B8FD9"];

// function NewOnetoOneModal({ show, onClose, onSelectUser, existingIds = [] }) {
//   const [search, setSearch] = useState("");
//   const [users, setUsers] = useState([]);
//   const [me, setMe] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   // Fetch my own profile when modal opens
//   useEffect(() => {
//     if (!show) return;

//     let cancelled = false;

//     getMyProfile()
//       .then((profile) => {
//         if (!cancelled) setMe(profile);
//       })
//       .catch((err) => console.error("Error fetching my profile:", err));

//     return () => {
//       cancelled = true;
//     };
//   }, [show]);

//   // Search users (debounced) when modal opens or search changes
//   useEffect(() => {
//     if (!show) return;

//     let cancelled = false;

//     const fetchUsers = async () => {
//       try {
//         setLoading(true);
//         setError("");

//         const apiUsers = await searchUsers(search.trim());

//         const formatted = apiUsers.map((user, index) => {
//           const name =
//             user.name || user.fullName || user.username || user.email || "Unknown User";

//           const avatar =
//             user.avatar ||
//             user.initials ||
//             name
//               .split(" ")
//               .map((w) => w.charAt(0))
//               .join("")
//               .substring(0, 2)
//               .toUpperCase();

//           return {
//             ...user,
//             id: user.id ?? user.userId ?? index + 1,
//             name,
//             avatar,
//             online: user.online ?? user.isOnline ?? false,
//             color: user.color || COLORS[name.charCodeAt(0) % COLORS.length],
//           };
//         });

//         if (!cancelled) setUsers(formatted);
//       } catch (err) {
//         console.error("Error fetching users:", err);
//         if (!cancelled) {
//           setError("Unable to load users");
//           setUsers([]);
//         }
//       } finally {
//         if (!cancelled) setLoading(false);
//       }
//     };

//     const timer = setTimeout(fetchUsers, 300);

//     return () => {
//       cancelled = true;
//       clearTimeout(timer);
//     };
//   }, [show, search]);

//   if (!show) return null;

//   // Server already filters by search; hide myself from the list
//   const filteredUsers = users.filter((u) => u.id !== me?.id);

//   const handleClose = () => {
//     setSearch("");
//     onClose && onClose();
//   };

//   const handleSelectUser = async (user) => {
//     let profile = user;
//     try {
//       const details = await getUserProfile(user.id);
//       profile = { ...user, ...details };
//     } catch (err) {
//       console.error("Error fetching user profile:", err);
//     }

//     setSearch("");
//     onSelectUser && onSelectUser(profile);
//     onClose && onClose();
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
//           <div>
//             <div className="fw-semibold" style={{ color: "#1E2328", fontSize: "15px" }}>
//               New One-to-One Chat
//             </div>
//             <small style={{ color: "#8A7C6F", fontSize: "11px" }}>
//               Pick a person to message
//             </small>
//           </div>

//           <button
//             onClick={handleClose}
//             className="btn p-1 border-0"
//             style={{ color: "#8A7C6F" }}
//             aria-label="Close"
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
//                 pointerEvents: "none",
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
//         <div style={{ maxHeight: "320px", overflowY: "auto" }}>
//           {loading && (
//             <div className="text-center py-4" style={{ color: "#8A7C6F", fontSize: "12px" }}>
//               Loading users...
//             </div>
//           )}

//           {!loading && error && (
//             <div className="text-center py-4" style={{ color: "#D9534F", fontSize: "12px" }}>
//               {error}
//             </div>
//           )}

//           {!loading && !error && filteredUsers.length === 0 && (
//             <div className="text-center py-4" style={{ color: "#8A7C6F", fontSize: "12px" }}>
//               No users found
//             </div>
//           )}

//           {!loading &&
//             !error &&
//             filteredUsers.map((user) => (
//               <div
//                 key={user.id}
//                 onClick={() => handleSelectUser(user)}
//                 className="d-flex align-items-center gap-2 px-3 py-2"
//                 style={{ cursor: "pointer", transition: "background-color 0.15s" }}
//                 onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#FFF7F2")}
//                 onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#FFFFFF")}
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

//                 {/* NAME */}
//                 <div className="flex-grow-1" style={{ minWidth: 0 }}>
//                   <div style={{ color: "#1E2328", fontSize: "13px", fontWeight: "500" }}>
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

//                 {existingIds.includes(user.id) && (
//                   <small style={{ color: "#8A7C6F", fontSize: "10px" }}>Chatting</small>
//                 )}
//               </div>
//             ))}
//         </div>
//       </div>
//     </>
//   );
// }

// export default NewOnetoOneModal;


import { Search, X } from "lucide-react";
import { useEffect, useState } from "react";
import { getMyProfile, searchUsers, getUserProfile } from "../../../api/usersApi";
import { getOrCreateOneToOneChat } from "../../../api/chatsApi";

const COLORS = ["#7C6FE8", "#2E9E6D", "#D9822B", "#E8556D", "#2B8FD9"];

function NewOnetoOneModal({ show, onClose, onSelectUser, existingIds = [] }) {
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState([]);
  const [me, setMe] = useState(null);
  const [loading, setLoading] = useState(false);
  const [opening, setOpening] = useState(false);
  const [error, setError] = useState("");

  // Fetch my own profile when modal opens
  useEffect(() => {
    if (!show) return;

    let cancelled = false;

    getMyProfile()
      .then((profile) => {
        if (!cancelled) setMe(profile);
      })
      .catch((err) => console.error("Error fetching my profile:", err));

    return () => {
      cancelled = true;
    };
  }, [show]);

  // Search users (debounced) when modal opens or search changes
  useEffect(() => {
    if (!show) return;

    let cancelled = false;

    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError("");

        const apiUsers = await searchUsers(search.trim());

        const formatted = apiUsers.map((user, index) => {
          const name =
            user.name || user.fullName || user.username || user.email || "Unknown User";

          const avatar =
            user.avatar ||
            user.initials ||
            name
              .split(" ")
              .map((w) => w.charAt(0))
              .join("")
              .substring(0, 2)
              .toUpperCase();

          return {
            ...user,
            id: user.id ?? user.userId ?? index + 1,
            name,
            avatar,
            online: user.online ?? user.isOnline ?? false,
            color: user.color || COLORS[name.charCodeAt(0) % COLORS.length],
          };
        });

        if (!cancelled) setUsers(formatted);
      } catch (err) {
        console.error("Error fetching users:", err);
        if (!cancelled) {
          setError("Unable to load users");
          setUsers([]);
        }
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

  // Server already filters by search; hide myself from the list
  const filteredUsers = users.filter((u) => u.id !== me?.id);

  const handleClose = () => {
    setSearch("");
    setError("");
    onClose && onClose();
  };

  const handleSelectUser = async (user) => {
    if (opening) return;

    try {
      setOpening(true);
      setError("");

      // Full profile (optional, falls back to search data)
      let profile = user;
      try {
        const details = await getUserProfile(user.id);
        profile = { ...user, ...details };
      } catch (err) {
        console.error("Error fetching user profile:", err);
      }

      // Get or create the 1-to-1 chat
      const chat = await getOrCreateOneToOneChat(user.id);
      const chatId = chat.id ?? chat.chatId;
      if (chatId == null) throw new Error("Chat id missing in response");

      // Object passed to OnetoOneView: id = chatId
      onSelectUser &&
        onSelectUser({
          id: chatId,
          userId: user.id,
          name: profile.name,
          avatar: profile.avatar,
          color: profile.color,
          online: profile.online,
          type: "one-to-one",
          user: profile,
        });

      setSearch("");
      onClose && onClose();
    } catch (err) {
      console.error("Error opening chat:", err);
      setError("Unable to open chat");
    } finally {
      setOpening(false);
    }
  };

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
          <div>
            <div className="fw-semibold" style={{ color: "#1E2328", fontSize: "15px" }}>
              New One-to-One Chat
            </div>
            <small style={{ color: "#8A7C6F", fontSize: "11px" }}>
              Pick a person to message
            </small>
          </div>

          <button
            onClick={handleClose}
            className="btn p-1 border-0"
            style={{ color: "#8A7C6F" }}
            aria-label="Close"
          >
            <X size={19} />
          </button>
        </div>

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
                pointerEvents: "none",
              }}
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="form-control"
              placeholder="Search users..."
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
        <div
          style={{
            maxHeight: "320px",
            overflowY: "auto",
            opacity: opening ? 0.6 : 1,
            pointerEvents: opening ? "none" : "auto",
          }}
        >
          {loading && (
            <div className="text-center py-4" style={{ color: "#8A7C6F", fontSize: "12px" }}>
              Loading users...
            </div>
          )}

          {!loading && error && (
            <div className="text-center py-4" style={{ color: "#D9534F", fontSize: "12px" }}>
              {error}
            </div>
          )}

          {!loading && !error && filteredUsers.length === 0 && (
            <div className="text-center py-4" style={{ color: "#8A7C6F", fontSize: "12px" }}>
              No users found
            </div>
          )}

          {!loading &&
            filteredUsers.map((user) => (
              <div
                key={user.id}
                onClick={() => handleSelectUser(user)}
                className="d-flex align-items-center gap-2 px-3 py-2"
                style={{ cursor: "pointer", transition: "background-color 0.15s" }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#FFF7F2")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#FFFFFF")}
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

                {/* NAME */}
                <div className="flex-grow-1" style={{ minWidth: 0 }}>
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

                {existingIds.includes(user.id) && (
                  <small style={{ color: "#8A7C6F", fontSize: "10px" }}>Chatting</small>
                )}
              </div>
            ))}
        </div>
      </div>
    </>
  );
}

export default NewOnetoOneModal;