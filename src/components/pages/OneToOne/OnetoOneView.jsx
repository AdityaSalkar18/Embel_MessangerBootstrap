


// import { useEffect, useRef, useState } from "react";
// import {
//   ArrowLeft,
//   Search as SearchIcon,
//   MoreVertical,
//   Paperclip,
//   Send,
//   Pin,
//   FileText,
//   Image,
//   FolderOpen,
//   Link,
//   Trash2,
//   Star,
//   Pencil,
//   Forward,
//   Smile,
//   X,
// } from "lucide-react";

// import Search from "./OnetoOneSearch";
// import { getMyProfile } from "../../../api/usersApi";
// import * as messagesApi from "../../../api/messagesApi";

// /* =========================================================
//  * HELPERS
//  * ========================================================= */

// const EMOJIS = ["👍", "❤️", "😂", "😮", "😢", "🙏"];

// const fmtTime = (value) => {
//   const date = value ? new Date(value) : new Date();
//   return isNaN(date) ? "" : date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
// };

// const statusTicks = (s) => (s === "READ" || s === "DELIVERED" ? "✓✓" : s === "SENT" ? "✓" : "");

// const mapReactions = (r) => {
//   if (Array.isArray(r)) {
//     const grouped = {};
//     r.forEach((x) => {
//       const emoji = typeof x === "string" ? x : x.emoji;
//       grouped[emoji] = (grouped[emoji] || 0) + (x.count ?? 1);
//     });
//     return Object.entries(grouped).map(([emoji, count]) => ({ emoji, count }));
//   }
//   if (r && typeof r === "object")
//     return Object.entries(r).map(([emoji, count]) => ({
//       emoji,
//       count: Array.isArray(count) ? count.length : count,
//     }));
//   return [];
// };

// const mapMessage = (m, myId) => ({
//   id: m.id ?? m.messageId,
//   text: m.content ?? m.text ?? "",
//   sender: String(m.senderId ?? m.sender?.id) === String(myId) ? "me" : "other",
//   time: fmtTime(m.createdAt ?? m.sentAt ?? m.timestamp),
//   status: m.status,
//   pinned: m.pinned ?? m.isPinned ?? false,
//   starred: m.starred ?? m.isStarred ?? false,
//   edited: m.edited ?? m.isEdited ?? false,
//   reactions: mapReactions(m.reactions),
// });

// /* =========================================================
//  * COMPONENT
//  * ========================================================= */

// function OnetoOneView({ chat, onBack }) {
//   const [message, setMessage] = useState("");
//   const [messages, setMessages] = useState([]);
//   const [myId, setMyId] = useState(null);

//   const [showSearch, setShowSearch] = useState(false);
//   const [showMenu, setShowMenu] = useState(false);
//   const [hoveredMessageId, setHoveredMessageId] = useState(null);
//   const [reactionPickerId, setReactionPickerId] = useState(null);
//   const [editingId, setEditingId] = useState(null);

//   const [panel, setPanel] = useState(null); // "starred" | "pinned" | null
//   const pinnedMessages = messages.filter((item) => item.pinned);
//   const starredMessages = messages.filter((item) => item.starred);

//   const [forwardMsg, setForwardMsg] = useState(null);
//   const [forwardTo, setForwardTo] = useState("");

//   const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);
//   const [showProjectModal, setShowProjectModal] = useState(false);
//   const [projectName, setProjectName] = useState("");
//   const [projectDate, setProjectDate] = useState("");
//   const [projectFile, setProjectFile] = useState(null);

//   const [projectFilesData] = useState({
//     "College ERP": [
//       { name: "StudentController.java", type: "Java" },
//       { name: "StudentService.java", type: "Java" },
//       { name: "Student.jsx", type: "React" },
//     ],
//     "Industrial ERP": [
//       { name: "OrderController.java", type: "Java" },
//       { name: "InventoryService.java", type: "Java" },
//       { name: "Dashboard.jsx", type: "React" },
//     ],
//     "Gurav Matrimonial": [
//       { name: "BiodataController.java", type: "Java" },
//       { name: "BiodataService.java", type: "Java" },
//       { name: "Biodata.jsx", type: "React" },
//     ],
//   });

//   const messagesEndRef = useRef(null);
//   const fileInputRef = useRef(null);
//   const imageInputRef = useRef(null);

//   const patchMessage = (id, patch) =>
//     setMessages((prev) => prev.map((item) => (item.id === id ? { ...item, ...patch } : item)));

//   /* ---------------------------------------------------------
//    * MY ID
//    * --------------------------------------------------------- */

//   useEffect(() => {
//     getMyProfile()
//       .then((p) => setMyId(p.id ?? p.userId))
//       .catch((e) => console.error("Profile error:", e));
//   }, []);

//   /* ---------------------------------------------------------
//    * LOAD HISTORY + POLL EVERY 5s
//    * --------------------------------------------------------- */

//   useEffect(() => {
//     if (!chat?.id || myId == null) return;
//     let cancelled = false;

//     const load = async () => {
//       try {
//         const list = await messagesApi.getChatMessages(chat.id);
//         if (!cancelled) setMessages(list.map((m) => mapMessage(m, myId)));
//       } catch (e) {
//         console.error("Load messages error:", e);
//       }
//     };

//     load();
//     const timer = setInterval(load, 5000);
//     return () => {
//       cancelled = true;
//       clearInterval(timer);
//     };
//   }, [chat?.id, myId]);

//   /* ---------------------------------------------------------
//    * AUTO SCROLL
//    * --------------------------------------------------------- */

//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   /* ---------------------------------------------------------
//    * SEND / EDIT
//    * --------------------------------------------------------- */

//   const sendMessage = async () => {
//     const text = message.trim();
//     if (!text) return;
//     if (editingId) return saveEdit(text);

//     try {
//       const sent = await messagesApi.sendMessage(chat.id, text);
//       setMessages((prev) => [...prev, mapMessage(sent, myId)]);
//       setMessage("");
//     } catch (e) {
//       console.error("Send error:", e);
//       alert("Failed to send message.");
//     }
//   };

//   const handleKeyDown = (e) => {
//     if (e.key === "Enter" && !e.shiftKey) {
//       e.preventDefault();
//       sendMessage();
//     }
//     if (e.key === "Escape" && editingId) cancelEdit();
//   };

//   const startEdit = (msg) => {
//     setEditingId(msg.id);
//     setMessage(msg.text);
//   };

//   const cancelEdit = () => {
//     setEditingId(null);
//     setMessage("");
//   };

//   const saveEdit = async (text) => {
//     const id = editingId;
//     const original = messages.find((m) => m.id === id);
//     if (!original || text === original.text) return cancelEdit();

//     try {
//       await messagesApi.editMessage(id, text);
//       patchMessage(id, { text, edited: true });
//     } catch (e) {
//       console.error("Edit error:", e);
//       alert("Failed to edit message.");
//     }
//     cancelEdit();
//   };

//   /* ---------------------------------------------------------
//    * DELETE / PIN / STAR / REACT / FORWARD
//    * --------------------------------------------------------- */

//   const deleteMessage = async (msg) => {
//     try {
//       await messagesApi.deleteMessage(msg.id);
//       setMessages((prev) => prev.filter((m) => m.id !== msg.id));
//       if (editingId === msg.id) cancelEdit();
//     } catch (e) {
//       console.error("Delete error:", e);
//       alert("Failed to delete message.");
//     }
//   };

//   const togglePinMessage = async (msg) => {
//     try {
//       await messagesApi.togglePinMessage(msg.id);
//       patchMessage(msg.id, { pinned: !msg.pinned });
//     } catch (e) {
//       console.error("Pin error:", e);
//     }
//   };

//   const toggleStarMessage = async (msg) => {
//     try {
//       await messagesApi.toggleStarMessage(msg.id);
//       patchMessage(msg.id, { starred: !msg.starred });
//     } catch (e) {
//       console.error("Star error:", e);
//     }
//   };

//   const reactToMessage = async (msg, emoji) => {
//     setReactionPickerId(null);
//     try {
//       const updated = await messagesApi.reactToMessage(msg.id, emoji);
//       if (updated?.reactions) {
//         patchMessage(msg.id, { reactions: mapReactions(updated.reactions) });
//       } else {
//         const found = msg.reactions.find((r) => r.emoji === emoji);
//         patchMessage(msg.id, {
//           reactions: found
//             ? msg.reactions.map((r) => (r.emoji === emoji ? { ...r, count: r.count + 1 } : r))
//             : [...msg.reactions, { emoji, count: 1 }],
//         });
//       }
//     } catch (e) {
//       console.error("React error:", e);
//     }
//   };

//   const submitForward = async () => {
//     if (!forwardTo.trim()) {
//       alert("Please enter the target chat ID.");
//       return;
//     }
//     try {
//       await messagesApi.forwardMessage(forwardMsg.id, forwardTo.trim());
//       alert("Message forwarded.");
//       setForwardMsg(null);
//       setForwardTo("");
//     } catch (e) {
//       console.error("Forward error:", e);
//       alert("Failed to forward message.");
//     }
//   };

//   const openPanel = (type) => {
//     setShowMenu(false);
//     setPanel(type);
//   };

//   /* ---------------------------------------------------------
//    * LOCAL-ONLY MESSAGES (attachments, links, projects)
//    * --------------------------------------------------------- */

//   const pushMessage = (text) => {
//     if (!text) return;
//     setMessages((prev) => [
//       ...prev,
//       {
//         id: `local-${Date.now()}`,
//         text,
//         sender: "me",
//         time: fmtTime(),
//         status: "",
//         reactions: [],
//       },
//     ]);
//   };

//   const handleFileClick = () => {
//     setShowAttachmentMenu(false);
//     fileInputRef.current?.click();
//   };

//   const handleImageClick = () => {
//     setShowAttachmentMenu(false);
//     imageInputRef.current?.click();
//   };

//   const handleFileChange = (e) => {
//     const file = e.target.files?.[0];
//     if (!file) return;
//     pushMessage(`📎 File attached: ${file.name}`);
//     e.target.value = "";
//   };

//   const handleImageChange = (e) => {
//     const file = e.target.files?.[0];
//     if (!file) return;
//     pushMessage(`🖼️ Image attached: ${file.name}`);
//     e.target.value = "";
//   };

//   const handleLink = () => {
//     setShowAttachmentMenu(false);
//     const url = window.prompt("Enter link:");
//     if (!url) return;
//     pushMessage(`🔗 ${url}`);
//   };

//   const handleProject = () => {
//     setShowAttachmentMenu(false);
//     setProjectName("");
//     setProjectDate("");
//     setProjectFile(null);
//     setShowProjectModal(true);
//   };

//   const handleProjectSubmit = () => {
//     if (!projectName.trim()) {
//       alert("Please enter project name.");
//       return;
//     }
//     let text = `📁 Project: ${projectName}`;
//     if (projectDate) text += `\n📅 Date: ${projectDate}`;
//     if (projectFile) text += `\n📎 File: ${projectFile.name}`;
//     pushMessage(text);
//     setShowProjectModal(false);
//     setProjectName("");
//     setProjectDate("");
//     setProjectFile(null);
//   };

//   /* ---------------------------------------------------------
//    * RENDER HELPERS
//    * --------------------------------------------------------- */

//   const renderMessageText = (text) => {
//     if (!text) return null;
//     const urlRegex = /(https?:\/\/[^\s]+)/g;
//     return text.split(urlRegex).map((part, index) =>
//       /^https?:\/\//.test(part) ? (
//         <a
//           key={index}
//           href={part}
//           target="_blank"
//           rel="noopener noreferrer"
//           style={{ color: "#F4712B", textDecoration: "underline", wordBreak: "break-all" }}
//         >
//           {part}
//         </a>
//       ) : (
//         <span key={index}>{part}</span>
//       )
//     );
//   };

//   const getInitial = () => chat?.name?.charAt(0)?.toUpperCase() || "U";

//   const iconBtn = {
//     border: "none",
//     background: "transparent",
//     cursor: "pointer",
//     padding: "4px",
//   };

//   /* ---------------------------------------------------------
//    * RENDER
//    * --------------------------------------------------------- */

//   return (
//     <div style={{ height: "100%", display: "flex", flexDirection: "column", background: "#fff", position: "relative" }}>
//       {/* ================= HEADER ================= */}
//       <div
//         style={{
//           height: "65px",
//           minHeight: "65px",
//           display: "flex",
//           alignItems: "center",
//           padding: "0 18px",
//           borderBottom: "1px solid #e5e7eb",
//           background: "#fff",
//         }}
//       >
//         <button
//           onClick={onBack}
//           style={{ border: "none", background: "transparent", cursor: "pointer", marginRight: "12px", display: "flex", alignItems: "center", justifyContent: "center" }}
//         >
//           <ArrowLeft size={21} color="#333" />
//         </button>

//         <div
//           style={{
//             width: "40px",
//             height: "40px",
//             borderRadius: "50%",
//             background: "#F4712B",
//             color: "#fff",
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//             fontWeight: "600",
//             marginRight: "10px",
//           }}
//         >
//           {getInitial()}
//         </div>

//         <div style={{ flex: 1, minWidth: 0 }}>
//           <div style={{ fontSize: "15px", fontWeight: "600", color: "#222" }}>{chat?.name || "Chat"}</div>
//           <div style={{ fontSize: "12px", color: "#888" }}>
//             {chat?.type === "group" ? "Group" : "Online"}
//           </div>
//         </div>

//         <button onClick={() => setShowSearch(true)} style={{ border: "none", background: "transparent", cursor: "pointer", padding: "8px" }}>
//           <SearchIcon size={20} color="#555" />
//         </button>

//         <div style={{ position: "relative" }}>
//           <button
//             onClick={() => setShowMenu((p) => !p)}
//             style={{ border: "none", background: "transparent", cursor: "pointer", padding: "8px" }}
//           >
//             <MoreVertical size={20} color="#555" />
//           </button>

//           {showMenu && (
//             <div
//               style={{
//                 position: "absolute",
//                 right: 0,
//                 top: "40px",
//                 background: "#fff",
//                 border: "1px solid #e5e7eb",
//                 borderRadius: "8px",
//                 boxShadow: "0 4px 14px rgba(0,0,0,0.12)",
//                 zIndex: 50,
//                 minWidth: "170px",
//                 overflow: "hidden",
//               }}
//             >
//               {[
//                 { key: "starred", label: "Starred messages", icon: <Star size={15} color="#555" /> },
//                 { key: "pinned", label: "Pinned messages", icon: <Pin size={15} color="#555" /> },
//               ].map((item) => (
//                 <button
//                   key={item.key}
//                   onClick={() => openPanel(item.key)}
//                   style={{
//                     display: "flex",
//                     alignItems: "center",
//                     gap: "8px",
//                     width: "100%",
//                     padding: "10px 14px",
//                     border: "none",
//                     background: "#fff",
//                     cursor: "pointer",
//                     fontSize: "13px",
//                     textAlign: "left",
//                   }}
//                 >
//                   {item.icon}
//                   {item.label}
//                 </button>
//               ))}
//             </div>
//           )}
//         </div>
//       </div>

//       {/* ================= SEARCH ================= */}
//       {showSearch && <Search onClose={() => setShowSearch(false)} projectFilesData={projectFilesData} />}

//       {/* ================= PINNED BANNER ================= */}
//       {pinnedMessages.length > 0 && (
//         <div
//           onClick={() => openPanel("pinned")}
//           style={{
//             display: "flex",
//             alignItems: "center",
//             gap: "8px",
//             padding: "8px 18px",
//             background: "#FFF6EE",
//             borderBottom: "1px solid #f3d9c3",
//             cursor: "pointer",
//             fontSize: "13px",
//             color: "#444",
//           }}
//         >
//           <Pin size={14} color="#F4712B" />
//           <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1 }}>
//             {pinnedMessages[pinnedMessages.length - 1].text}
//           </span>
//           <span style={{ color: "#888", fontSize: "11px" }}>{pinnedMessages.length} pinned</span>
//         </div>
//       )}

//       {/* ================= MESSAGES ================= */}
//       <div style={{ flex: 1, overflowY: "auto", padding: "20px", background: "#fafafa" }}>
//         {messages.length === 0 && (
//           <div style={{ textAlign: "center", color: "#888", fontSize: "13px" }}>No messages yet. Say hi 👋</div>
//         )}

//         {messages.map((msg) => {
//           const isMine = msg.sender === "me";

//           return (
//             <div
//               key={msg.id}
//               style={{
//                 display: "flex",
//                 justifyContent: isMine ? "flex-end" : "flex-start",
//                 marginBottom: msg.reactions?.length ? "20px" : "12px",
//               }}
//               onMouseEnter={() => setHoveredMessageId(msg.id)}
//               onMouseLeave={() => {
//                 setHoveredMessageId(null);
//                 setReactionPickerId(null);
//               }}
//             >
//               <div style={{ position: "relative", maxWidth: "70%" }}>
//                 {/* Bubble */}
//                 <div
//                   style={{
//                     background: isMine ? "#F4712B" : "#FBE4D0",
//                     color: isMine ? "#fff" : "#222",
//                     padding: "10px 13px",
//                     borderRadius: isMine ? "14px 14px 3px 14px" : "14px 14px 14px 3px",
//                     whiteSpace: "pre-wrap",
//                     wordBreak: "break-word",
//                     fontSize: "14px",
//                     outline: editingId === msg.id ? "2px solid #333" : "none",
//                   }}
//                 >
//                   {renderMessageText(msg.text)}

//                   <div
//                     style={{
//                       display: "flex",
//                       justifyContent: "flex-end",
//                       alignItems: "center",
//                       gap: "5px",
//                       marginTop: "4px",
//                       fontSize: "10px",
//                       opacity: 0.8,
//                     }}
//                   >
//                     {msg.pinned && <Pin size={10} />}
//                     {msg.starred && <Star size={10} fill="currentColor" />}
//                     {msg.edited && <span>edited</span>}
//                     <span>{msg.time}</span>
//                     {isMine && <span>{statusTicks(msg.status)}</span>}
//                   </div>
//                 </div>

//                 {/* Reactions */}
//                 {msg.reactions?.length > 0 && (
//                   <div
//                     style={{
//                       position: "absolute",
//                       bottom: "-14px",
//                       [isMine ? "right" : "left"]: "8px",
//                       display: "flex",
//                       gap: "3px",
//                       background: "#fff",
//                       border: "1px solid #eee",
//                       borderRadius: "10px",
//                       padding: "1px 6px",
//                       fontSize: "12px",
//                       boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
//                     }}
//                   >
//                     {msg.reactions.map((r) => (
//                       <span key={r.emoji}>
//                         {r.emoji}
//                         {r.count > 1 ? ` ${r.count}` : ""}
//                       </span>
//                     ))}
//                   </div>
//                 )}

//                 {/* Hover Actions */}
//                 {hoveredMessageId === msg.id && (
//                   <div
//                     style={{
//                       position: "absolute",
//                       top: "-32px",
//                       right: isMine ? "0" : "auto",
//                       left: isMine ? "auto" : "0",
//                       display: "flex",
//                       gap: "2px",
//                       background: "#fff",
//                       border: "1px solid #ddd",
//                       borderRadius: "7px",
//                       padding: "3px",
//                       boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
//                       zIndex: 5,
//                     }}
//                   >
//                     <button onClick={() => setReactionPickerId((p) => (p === msg.id ? null : msg.id))} style={iconBtn} title="React">
//                       <Smile size={14} color="#555" />
//                     </button>

//                     <button onClick={() => toggleStarMessage(msg)} style={iconBtn} title={msg.starred ? "Unstar" : "Star"}>
//                       <Star size={14} color={msg.starred ? "#F4712B" : "#555"} fill={msg.starred ? "#F4712B" : "none"} />
//                     </button>

//                     <button onClick={() => togglePinMessage(msg)} style={iconBtn} title={msg.pinned ? "Unpin" : "Pin"}>
//                       <Pin size={14} color={msg.pinned ? "#F4712B" : "#555"} />
//                     </button>

//                     <button
//                       onClick={() => {
//                         setForwardMsg(msg);
//                         setForwardTo("");
//                       }}
//                       style={iconBtn}
//                       title="Forward"
//                     >
//                       <Forward size={14} color="#555" />
//                     </button>

//                     {isMine && (
//                       <button onClick={() => startEdit(msg)} style={iconBtn} title="Edit">
//                         <Pencil size={14} color="#555" />
//                       </button>
//                     )}

//                     <button onClick={() => deleteMessage(msg)} style={iconBtn} title="Delete">
//                       <Trash2 size={14} color="#555" />
//                     </button>
//                   </div>
//                 )}

//                 {/* Reaction picker */}
//                 {reactionPickerId === msg.id && (
//                   <div
//                     style={{
//                       position: "absolute",
//                       top: "-68px",
//                       right: isMine ? "0" : "auto",
//                       left: isMine ? "auto" : "0",
//                       display: "flex",
//                       gap: "4px",
//                       background: "#fff",
//                       border: "1px solid #ddd",
//                       borderRadius: "20px",
//                       padding: "4px 8px",
//                       boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
//                       zIndex: 6,
//                     }}
//                   >
//                     {EMOJIS.map((emoji) => (
//                       <button
//                         key={emoji}
//                         onClick={() => reactToMessage(msg, emoji)}
//                         style={{ border: "none", background: "transparent", cursor: "pointer", fontSize: "18px" }}
//                       >
//                         {emoji}
//                       </button>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             </div>
//           );
//         })}

//         <div ref={messagesEndRef} />
//       </div>

//       {/* ================= INPUT ================= */}
//       <div style={{ borderTop: "1px solid #e5e7eb", background: "#fff", padding: "10px 14px" }}>
//         <input ref={fileInputRef} type="file" style={{ display: "none" }} onChange={handleFileChange} />
//         <input ref={imageInputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleImageChange} />

//         {/* Editing banner */}
//         {editingId && (
//           <div
//             style={{
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "space-between",
//               padding: "6px 10px",
//               marginBottom: "8px",
//               background: "#FFF6EE",
//               borderLeft: "3px solid #F4712B",
//               borderRadius: "4px",
//               fontSize: "12px",
//               color: "#555",
//             }}
//           >
//             <span>Editing message</span>
//             <button onClick={cancelEdit} style={iconBtn} title="Cancel edit">
//               <X size={14} color="#555" />
//             </button>
//           </div>
//         )}

//         {showAttachmentMenu && (
//           <div
//             style={{
//               display: "flex",
//               gap: "8px",
//               padding: "8px",
//               marginBottom: "8px",
//               background: "#fff",
//               border: "1px solid #e5e7eb",
//               borderRadius: "8px",
//               width: "fit-content",
//               boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
//             }}
//           >
//             {[
//               { onClick: handleFileClick, title: "File", icon: FileText },
//               { onClick: handleImageClick, title: "Image", icon: Image },
//               { onClick: handleProject, title: "Project", icon: FolderOpen },
//               { onClick: handleLink, title: "Link", icon: Link },
//             ].map(({ onClick, title, icon: Icon }) => (
//               <button
//                 key={title}
//                 onClick={onClick}
//                 style={{ border: "none", background: "#FBE4D0", borderRadius: "7px", padding: "8px", cursor: "pointer" }}
//                 title={title}
//               >
//                 <Icon size={18} color="#F4712B" />
//               </button>
//             ))}
//           </div>
//         )}

//         <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
//           <button
//             onClick={() => setShowAttachmentMenu((prev) => !prev)}
//             style={{ border: "none", background: "transparent", cursor: "pointer", padding: "8px" }}
//             title="Attach"
//           >
//             <Paperclip size={20} color="#555" />
//           </button>

//           <input
//             type="text"
//             value={message}
//             onChange={(e) => setMessage(e.target.value)}
//             onKeyDown={handleKeyDown}
//             placeholder={editingId ? "Edit your message..." : "Type a message..."}
//             style={{
//               flex: 1,
//               border: "1px solid #ddd",
//               outline: "none",
//               borderRadius: "20px",
//               padding: "10px 15px",
//               fontSize: "14px",
//             }}
//           />

//           <button
//             onClick={sendMessage}
//             disabled={!message.trim()}
//             style={{
//               width: "42px",
//               height: "42px",
//               border: "none",
//               borderRadius: "50%",
//               background: message.trim() ? "#F4712B" : "#ddd",
//               cursor: message.trim() ? "pointer" : "not-allowed",
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//             }}
//             title={editingId ? "Save" : "Send"}
//           >
//             <Send size={18} color="#fff" />
//           </button>
//         </div>
//       </div>

//       {/* ================= STARRED / PINNED PANEL ================= */}
//       {panel && (
//         <div
//           style={{
//             position: "absolute",
//             top: 0,
//             right: 0,
//             bottom: 0,
//             width: "min(340px, 100%)",
//             background: "#fff",
//             borderLeft: "1px solid #e5e7eb",
//             boxShadow: "-4px 0 14px rgba(0,0,0,0.08)",
//             display: "flex",
//             flexDirection: "column",
//             zIndex: 60,
//           }}
//         >
//           <div
//             style={{
//               height: "65px",
//               minHeight: "65px",
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "space-between",
//               padding: "0 16px",
//               borderBottom: "1px solid #e5e7eb",
//               fontWeight: 600,
//             }}
//           >
//             {panel === "starred" ? "Starred messages" : "Pinned messages"}
//             <button onClick={() => setPanel(null)} style={iconBtn}>
//               <X size={18} color="#555" />
//             </button>
//           </div>

//           <div style={{ flex: 1, overflowY: "auto", padding: "12px" }}>
//             {(panel === "starred" ? starredMessages : pinnedMessages).length === 0 && (
//               <div style={{ color: "#888", fontSize: "13px" }}>Nothing here yet.</div>
//             )}

//             {(panel === "starred" ? starredMessages : pinnedMessages).map((m) => (
//               <div
//                 key={m.id}
//                 style={{
//                   background: "#FBE4D0",
//                   borderRadius: "10px",
//                   padding: "10px 12px",
//                   marginBottom: "8px",
//                   fontSize: "13px",
//                   wordBreak: "break-word",
//                   whiteSpace: "pre-wrap",
//                 }}
//               >
//                 {renderMessageText(m.text)}
//                 <div style={{ fontSize: "10px", color: "#777", marginTop: "4px", textAlign: "right" }}>{m.time}</div>
//               </div>
//             ))}
//           </div>
//         </div>
//       )}

//       {/* ================= FORWARD MODAL ================= */}
//       {forwardMsg && (
//         <div
//           style={{
//             position: "fixed",
//             inset: 0,
//             background: "rgba(0,0,0,0.4)",
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//             zIndex: 1000,
//           }}
//         >
//           <div style={{ width: "380px", maxWidth: "90%", background: "#fff", borderRadius: "12px", padding: "22px", boxShadow: "0 10px 30px rgba(0,0,0,0.2)" }}>
//             <h3 style={{ marginTop: 0, marginBottom: "12px" }}>Forward message</h3>

//             <div style={{ background: "#FBE4D0", borderRadius: "8px", padding: "8px 10px", fontSize: "13px", marginBottom: "12px", maxHeight: "80px", overflow: "hidden" }}>
//               {forwardMsg.text}
//             </div>

//             <input
//               type="text"
//               placeholder="Target chat ID"
//               value={forwardTo}
//               onChange={(e) => setForwardTo(e.target.value)}
//               style={{ width: "100%", padding: "10px", border: "1px solid #ddd", borderRadius: "7px", marginBottom: "16px", boxSizing: "border-box" }}
//             />

//             <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
//               <button
//                 onClick={() => setForwardMsg(null)}
//                 style={{ border: "1px solid #ddd", background: "#fff", padding: "9px 16px", borderRadius: "7px", cursor: "pointer" }}
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={submitForward}
//                 style={{ border: "none", background: "#F4712B", color: "#fff", padding: "9px 16px", borderRadius: "7px", cursor: "pointer" }}
//               >
//                 Forward
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* ================= PROJECT MODAL ================= */}
//       {showProjectModal && (
//         <div
//           style={{
//             position: "fixed",
//             inset: 0,
//             background: "rgba(0,0,0,0.4)",
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//             zIndex: 1000,
//           }}
//         >
//           <div style={{ width: "420px", maxWidth: "90%", background: "#fff", borderRadius: "12px", padding: "22px", boxShadow: "0 10px 30px rgba(0,0,0,0.2)" }}>
//             <h3 style={{ marginTop: 0, marginBottom: "18px" }}>Add Project</h3>

//             <input
//               type="text"
//               placeholder="Project name"
//               value={projectName}
//               onChange={(e) => setProjectName(e.target.value)}
//               style={{ width: "100%", padding: "10px", border: "1px solid #ddd", borderRadius: "7px", marginBottom: "10px", boxSizing: "border-box" }}
//             />

//             <input
//               type="date"
//               value={projectDate}
//               onChange={(e) => setProjectDate(e.target.value)}
//               style={{ width: "100%", padding: "10px", border: "1px solid #ddd", borderRadius: "7px", marginBottom: "10px", boxSizing: "border-box" }}
//             />

//             <input
//               type="file"
//               onChange={(e) => setProjectFile(e.target.files?.[0] || null)}
//               style={{ width: "100%", marginBottom: "18px" }}
//             />

//             <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
//               <button
//                 onClick={() => setShowProjectModal(false)}
//                 style={{ border: "1px solid #ddd", background: "#fff", padding: "9px 16px", borderRadius: "7px", cursor: "pointer" }}
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleProjectSubmit}
//                 style={{ border: "none", background: "#F4712B", color: "#fff", padding: "9px 16px", borderRadius: "7px", cursor: "pointer" }}
//               >
//                 Add Project
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default OnetoOneView;



// import { useEffect, useRef, useState } from "react";
// import {
//   ArrowLeft,
//   Search as SearchIcon,
//   MoreVertical,
//   Paperclip,
//   Send,
//   Pin,
//   FileText,
//   Image,
//   FolderOpen,
//   Link,
//   Trash2,
//   Star,
//   Pencil,
//   Forward,
//   Smile,
//   X,
// } from "lucide-react";

// import Search from "./OnetoOneSearch";
// import { getMyProfile } from "../../../api/usersApi";
// import * as messagesApi from "../../../api/messagesApi";
// import * as attachmentsApi from "../../../api/attachmentsApi";

// /* =========================================================
//  * HELPERS
//  * ========================================================= */

// const EMOJIS = ["👍", "❤️", "😂", "😮", "😢", "🙏"];

// const fmtTime = (value) => {
//   const date = value ? new Date(value) : new Date();
//   return isNaN(date) ? "" : date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
// };

// const statusTicks = (s) => (s === "READ" || s === "DELIVERED" ? "✓✓" : s === "SENT" ? "✓" : "");

// const mapReactions = (r) => {
//   if (Array.isArray(r)) {
//     const grouped = {};
//     r.forEach((x) => {
//       const emoji = typeof x === "string" ? x : x.emoji;
//       grouped[emoji] = (grouped[emoji] || 0) + (x.count ?? 1);
//     });
//     return Object.entries(grouped).map(([emoji, count]) => ({ emoji, count }));
//   }
//   if (r && typeof r === "object")
//     return Object.entries(r).map(([emoji, count]) => ({
//       emoji,
//       count: Array.isArray(count) ? count.length : count,
//     }));
//   return [];
// };

// const mapMessage = (m, myId) => ({
//   id: m.id ?? m.messageId,
//   text: m.content ?? m.text ?? "",
//   sender: String(m.senderId ?? m.sender?.id) === String(myId) ? "me" : "other",
//   time: fmtTime(m.createdAt ?? m.sentAt ?? m.timestamp),
//   status: m.status,
//   pinned: m.pinned ?? m.isPinned ?? false,
//   starred: m.starred ?? m.isStarred ?? false,
//   edited: m.edited ?? m.isEdited ?? false,
//   reactions: mapReactions(m.reactions),
// });

// /* =========================================================
//  * COMPONENT
//  * ========================================================= */

// function OnetoOneView({ chat, onBack }) {
//   const [message, setMessage] = useState("");
//   const [messages, setMessages] = useState([]);
//   const [myId, setMyId] = useState(null);

//   const [showSearch, setShowSearch] = useState(false);
//   const [showMenu, setShowMenu] = useState(false);
//   const [hoveredMessageId, setHoveredMessageId] = useState(null);
//   const [reactionPickerId, setReactionPickerId] = useState(null);
//   const [editingId, setEditingId] = useState(null);

//   const [panel, setPanel] = useState(null); // "starred" | "pinned" | null
//   const pinnedMessages = messages.filter((item) => item.pinned);
//   const starredMessages = messages.filter((item) => item.starred);

//   const [forwardMsg, setForwardMsg] = useState(null);
//   const [forwardTo, setForwardTo] = useState("");

//   const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);
//   const [showProjectModal, setShowProjectModal] = useState(false);
//   const [projectName, setProjectName] = useState("");
//   const [projectDate, setProjectDate] = useState("");
//   const [projectFile, setProjectFile] = useState(null);
//   const [existingProjects, setExistingProjects] = useState([]);
//   const [uploading, setUploading] = useState(false);

//   const messagesEndRef = useRef(null);
//   const fileInputRef = useRef(null);
//   const imageInputRef = useRef(null);

//   const patchMessage = (id, patch) =>
//     setMessages((prev) => prev.map((item) => (item.id === id ? { ...item, ...patch } : item)));

//   /* ---------------------------------------------------------
//    * MY ID
//    * --------------------------------------------------------- */

//   useEffect(() => {
//     getMyProfile()
//       .then((p) => setMyId(p.id ?? p.userId))
//       .catch((e) => console.error("Profile error:", e));
//   }, []);

//   /* ---------------------------------------------------------
//    * LOAD HISTORY + POLL EVERY 5s
//    * --------------------------------------------------------- */

//   useEffect(() => {
//     if (!chat?.id || myId == null) return;
//     let cancelled = false;

//     const load = async () => {
//       try {
//         const list = await messagesApi.getChatMessages(chat.id);
//         if (!cancelled) setMessages(list.map((m) => mapMessage(m, myId)));
//       } catch (e) {
//         console.error("Load messages error:", e);
//       }
//     };

//     load();
//     const timer = setInterval(load, 5000);
//     return () => {
//       cancelled = true;
//       clearInterval(timer);
//     };
//   }, [chat?.id, myId]);

//   /* ---------------------------------------------------------
//    * AUTO SCROLL
//    * --------------------------------------------------------- */

//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   /* ---------------------------------------------------------
//    * SEND / EDIT
//    * --------------------------------------------------------- */

//   // persists a message on the server and appends it to the list
//   const sendText = async (text) => {
//     const sent = await messagesApi.sendMessage(chat.id, text);
//     setMessages((prev) => [...prev, mapMessage(sent, myId)]);
//   };

//   const sendMessage = async () => {
//     const text = message.trim();
//     if (!text) return;
//     if (editingId) return saveEdit(text);

//     try {
//       await sendText(text);
//       setMessage("");
//     } catch (e) {
//       console.error("Send error:", e);
//       alert("Failed to send message.");
//     }
//   };

//   const handleKeyDown = (e) => {
//     if (e.key === "Enter" && !e.shiftKey) {
//       e.preventDefault();
//       sendMessage();
//     }
//     if (e.key === "Escape" && editingId) cancelEdit();
//   };

//   const startEdit = (msg) => {
//     setEditingId(msg.id);
//     setMessage(msg.text);
//   };

//   const cancelEdit = () => {
//     setEditingId(null);
//     setMessage("");
//   };

//   const saveEdit = async (text) => {
//     const id = editingId;
//     const original = messages.find((m) => m.id === id);
//     if (!original || text === original.text) return cancelEdit();

//     try {
//       await messagesApi.editMessage(id, text);
//       patchMessage(id, { text, edited: true });
//     } catch (e) {
//       console.error("Edit error:", e);
//       alert("Failed to edit message.");
//     }
//     cancelEdit();
//   };

//   /* ---------------------------------------------------------
//    * DELETE / PIN / STAR / REACT / FORWARD
//    * --------------------------------------------------------- */

//   const deleteMessage = async (msg) => {
//     try {
//       await messagesApi.deleteMessage(msg.id);
//       setMessages((prev) => prev.filter((m) => m.id !== msg.id));
//       if (editingId === msg.id) cancelEdit();
//     } catch (e) {
//       console.error("Delete error:", e);
//       alert("Failed to delete message.");
//     }
//   };

//   const togglePinMessage = async (msg) => {
//     try {
//       await messagesApi.togglePinMessage(msg.id);
//       patchMessage(msg.id, { pinned: !msg.pinned });
//     } catch (e) {
//       console.error("Pin error:", e);
//     }
//   };

//   const toggleStarMessage = async (msg) => {
//     try {
//       await messagesApi.toggleStarMessage(msg.id);
//       patchMessage(msg.id, { starred: !msg.starred });
//     } catch (e) {
//       console.error("Star error:", e);
//     }
//   };

//   const reactToMessage = async (msg, emoji) => {
//     setReactionPickerId(null);
//     try {
//       const updated = await messagesApi.reactToMessage(msg.id, emoji);
//       if (updated?.reactions) {
//         patchMessage(msg.id, { reactions: mapReactions(updated.reactions) });
//       } else {
//         const found = msg.reactions.find((r) => r.emoji === emoji);
//         patchMessage(msg.id, {
//           reactions: found
//             ? msg.reactions.map((r) => (r.emoji === emoji ? { ...r, count: r.count + 1 } : r))
//             : [...msg.reactions, { emoji, count: 1 }],
//         });
//       }
//     } catch (e) {
//       console.error("React error:", e);
//     }
//   };

//   const submitForward = async () => {
//     if (!forwardTo.trim()) {
//       alert("Please enter the target chat ID.");
//       return;
//     }
//     try {
//       await messagesApi.forwardMessage(forwardMsg.id, forwardTo.trim());
//       alert("Message forwarded.");
//       setForwardMsg(null);
//       setForwardTo("");
//     } catch (e) {
//       console.error("Forward error:", e);
//       alert("Failed to forward message.");
//     }
//   };

//   const openPanel = (type) => {
//     setShowMenu(false);
//     setPanel(type);
//   };

//   /* ---------------------------------------------------------
//    * ATTACHMENTS (files, images, links, projects)
//    * --------------------------------------------------------- */

//   // POST /api/attachments/upload, then persist a chat message
//   const uploadAndSend = async (file, prefix) => {
//     setUploading(true);
//     try {
//       await attachmentsApi.uploadFile(file, chat.id);
//       await sendText(`${prefix} ${file.name}`);
//     } catch (e) {
//       console.error("Upload error:", e);
//       alert("Failed to upload file.");
//     } finally {
//       setUploading(false);
//     }
//   };

//   const handleFileClick = () => {
//     setShowAttachmentMenu(false);
//     fileInputRef.current?.click();
//   };

//   const handleImageClick = () => {
//     setShowAttachmentMenu(false);
//     imageInputRef.current?.click();
//   };

//   const handleFileChange = (e) => {
//     const file = e.target.files?.[0];
//     e.target.value = "";
//     if (file) uploadAndSend(file, "📎 File attached:");
//   };

//   const handleImageChange = (e) => {
//     const file = e.target.files?.[0];
//     e.target.value = "";
//     if (file) uploadAndSend(file, "🖼️ Image attached:");
//   };

//   const handleLink = async () => {
//     setShowAttachmentMenu(false);
//     const url = window.prompt("Enter link:");
//     if (!url) return;
//     try {
//       await sendText(`🔗 ${url}`);
//     } catch (e) {
//       console.error("Link error:", e);
//       alert("Failed to send link.");
//     }
//   };

//   const handleProject = () => {
//     setShowAttachmentMenu(false);
//     setProjectName("");
//     setProjectDate("");
//     setProjectFile(null);
//     setShowProjectModal(true);

//     // GET /api/attachments/projects -> suggestions for the name field
//     attachmentsApi
//       .getMyProjects()
//       .then(setExistingProjects)
//       .catch((e) => console.error("Projects load error:", e));
//   };

//   const handleProjectSubmit = async () => {
//     const name = projectName.trim();
//     if (!name) {
//       alert("Please enter project name.");
//       return;
//     }

//     setUploading(true);
//     try {
//       // POST /api/attachments/projects/upload (only when a file was chosen)
//       if (projectFile) {
//         await attachmentsApi.uploadToProject({
//           projectName: name,
//           files: [projectFile],
//           chatId: chat.id,
//           dueDate: projectDate,
//         });
//       }

//       let text = `📁 Project: ${name}`;
//       if (projectDate) text += `\n📅 Date: ${projectDate}`;
//       if (projectFile) text += `\n📎 File: ${projectFile.name}`;
//       await sendText(text);

//       setShowProjectModal(false);
//       setProjectName("");
//       setProjectDate("");
//       setProjectFile(null);
//     } catch (e) {
//       console.error("Project error:", e);
//       alert("Failed to add project.");
//     } finally {
//       setUploading(false);
//     }
//   };

//   /* ---------------------------------------------------------
//    * RENDER HELPERS
//    * --------------------------------------------------------- */

//   const renderMessageText = (text) => {
//     if (!text) return null;
//     const urlRegex = /(https?:\/\/[^\s]+)/g;
//     return text.split(urlRegex).map((part, index) =>
//       /^https?:\/\//.test(part) ? (
//         <a
//           key={index}
//           href={part}
//           target="_blank"
//           rel="noopener noreferrer"
//           style={{ color: "#F4712B", textDecoration: "underline", wordBreak: "break-all" }}
//         >
//           {part}
//         </a>
//       ) : (
//         <span key={index}>{part}</span>
//       )
//     );
//   };

//   const getInitial = () => chat?.name?.charAt(0)?.toUpperCase() || "U";

//   const iconBtn = {
//     border: "none",
//     background: "transparent",
//     cursor: "pointer",
//     padding: "4px",
//   };

//   const modalInput = {
//     width: "100%",
//     padding: "10px",
//     border: "1px solid #ddd",
//     borderRadius: "7px",
//     marginBottom: "10px",
//     boxSizing: "border-box",
//   };

//   /* ---------------------------------------------------------
//    * RENDER
//    * --------------------------------------------------------- */

//   return (
//     <div style={{ height: "100%", display: "flex", flexDirection: "column", background: "#fff", position: "relative" }}>
//       {/* ================= HEADER ================= */}
//       <div
//         style={{
//           height: "65px",
//           minHeight: "65px",
//           display: "flex",
//           alignItems: "center",
//           padding: "0 18px",
//           borderBottom: "1px solid #e5e7eb",
//           background: "#fff",
//         }}
//       >
//         <button
//           onClick={onBack}
//           style={{ border: "none", background: "transparent", cursor: "pointer", marginRight: "12px", display: "flex", alignItems: "center", justifyContent: "center" }}
//         >
//           <ArrowLeft size={21} color="#333" />
//         </button>

//         <div
//           style={{
//             width: "40px",
//             height: "40px",
//             borderRadius: "50%",
//             background: "#F4712B",
//             color: "#fff",
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//             fontWeight: "600",
//             marginRight: "10px",
//           }}
//         >
//           {getInitial()}
//         </div>

//         <div style={{ flex: 1, minWidth: 0 }}>
//           <div style={{ fontSize: "15px", fontWeight: "600", color: "#222" }}>{chat?.name || "Chat"}</div>
//           <div style={{ fontSize: "12px", color: "#888" }}>
//             {uploading ? "Uploading..." : chat?.type === "group" ? "Group" : "Online"}
//           </div>
//         </div>

//         <button onClick={() => setShowSearch(true)} style={{ border: "none", background: "transparent", cursor: "pointer", padding: "8px" }}>
//           <SearchIcon size={20} color="#555" />
//         </button>

//         <div style={{ position: "relative" }}>
//           <button
//             onClick={() => setShowMenu((p) => !p)}
//             style={{ border: "none", background: "transparent", cursor: "pointer", padding: "8px" }}
//           >
//             <MoreVertical size={20} color="#555" />
//           </button>

//           {showMenu && (
//             <div
//               style={{
//                 position: "absolute",
//                 right: 0,
//                 top: "40px",
//                 background: "#fff",
//                 border: "1px solid #e5e7eb",
//                 borderRadius: "8px",
//                 boxShadow: "0 4px 14px rgba(0,0,0,0.12)",
//                 zIndex: 50,
//                 minWidth: "170px",
//                 overflow: "hidden",
//               }}
//             >
//               {[
//                 { key: "starred", label: "Starred messages", icon: <Star size={15} color="#555" /> },
//                 { key: "pinned", label: "Pinned messages", icon: <Pin size={15} color="#555" /> },
//               ].map((item) => (
//                 <button
//                   key={item.key}
//                   onClick={() => openPanel(item.key)}
//                   style={{
//                     display: "flex",
//                     alignItems: "center",
//                     gap: "8px",
//                     width: "100%",
//                     padding: "10px 14px",
//                     border: "none",
//                     background: "#fff",
//                     cursor: "pointer",
//                     fontSize: "13px",
//                     textAlign: "left",
//                   }}
//                 >
//                   {item.icon}
//                   {item.label}
//                 </button>
//               ))}
//             </div>
//           )}
//         </div>
//       </div>

//       {/* ================= SEARCH ================= */}
//       {showSearch && (
//         <Search chatId={chat?.id} contactName={chat?.name} onClose={() => setShowSearch(false)} />
//       )}

//       {/* ================= PINNED BANNER ================= */}
//       {pinnedMessages.length > 0 && (
//         <div
//           onClick={() => openPanel("pinned")}
//           style={{
//             display: "flex",
//             alignItems: "center",
//             gap: "8px",
//             padding: "8px 18px",
//             background: "#FFF6EE",
//             borderBottom: "1px solid #f3d9c3",
//             cursor: "pointer",
//             fontSize: "13px",
//             color: "#444",
//           }}
//         >
//           <Pin size={14} color="#F4712B" />
//           <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1 }}>
//             {pinnedMessages[pinnedMessages.length - 1].text}
//           </span>
//           <span style={{ color: "#888", fontSize: "11px" }}>{pinnedMessages.length} pinned</span>
//         </div>
//       )}

//       {/* ================= MESSAGES ================= */}
//       <div style={{ flex: 1, overflowY: "auto", padding: "20px", background: "#fafafa" }}>
//         {messages.length === 0 && (
//           <div style={{ textAlign: "center", color: "#888", fontSize: "13px" }}>No messages yet. Say hi 👋</div>
//         )}

//         {messages.map((msg) => {
//           const isMine = msg.sender === "me";

//           return (
//             <div
//               key={msg.id}
//               style={{
//                 display: "flex",
//                 justifyContent: isMine ? "flex-end" : "flex-start",
//                 marginBottom: msg.reactions?.length ? "20px" : "12px",
//               }}
//               onMouseEnter={() => setHoveredMessageId(msg.id)}
//               onMouseLeave={() => {
//                 setHoveredMessageId(null);
//                 setReactionPickerId(null);
//               }}
//             >
//               <div style={{ position: "relative", maxWidth: "70%" }}>
//                 {/* Bubble */}
//                 <div
//                   style={{
//                     background: isMine ? "#F4712B" : "#FBE4D0",
//                     color: isMine ? "#fff" : "#222",
//                     padding: "10px 13px",
//                     borderRadius: isMine ? "14px 14px 3px 14px" : "14px 14px 14px 3px",
//                     whiteSpace: "pre-wrap",
//                     wordBreak: "break-word",
//                     fontSize: "14px",
//                     outline: editingId === msg.id ? "2px solid #333" : "none",
//                   }}
//                 >
//                   {renderMessageText(msg.text)}

//                   <div
//                     style={{
//                       display: "flex",
//                       justifyContent: "flex-end",
//                       alignItems: "center",
//                       gap: "5px",
//                       marginTop: "4px",
//                       fontSize: "10px",
//                       opacity: 0.8,
//                     }}
//                   >
//                     {msg.pinned && <Pin size={10} />}
//                     {msg.starred && <Star size={10} fill="currentColor" />}
//                     {msg.edited && <span>edited</span>}
//                     <span>{msg.time}</span>
//                     {isMine && <span>{statusTicks(msg.status)}</span>}
//                   </div>
//                 </div>

//                 {/* Reactions */}
//                 {msg.reactions?.length > 0 && (
//                   <div
//                     style={{
//                       position: "absolute",
//                       bottom: "-14px",
//                       [isMine ? "right" : "left"]: "8px",
//                       display: "flex",
//                       gap: "3px",
//                       background: "#fff",
//                       border: "1px solid #eee",
//                       borderRadius: "10px",
//                       padding: "1px 6px",
//                       fontSize: "12px",
//                       boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
//                     }}
//                   >
//                     {msg.reactions.map((r) => (
//                       <span key={r.emoji}>
//                         {r.emoji}
//                         {r.count > 1 ? ` ${r.count}` : ""}
//                       </span>
//                     ))}
//                   </div>
//                 )}

//                 {/* Hover Actions */}
//                 {hoveredMessageId === msg.id && (
//                   <div
//                     style={{
//                       position: "absolute",
//                       top: "-32px",
//                       right: isMine ? "0" : "auto",
//                       left: isMine ? "auto" : "0",
//                       display: "flex",
//                       gap: "2px",
//                       background: "#fff",
//                       border: "1px solid #ddd",
//                       borderRadius: "7px",
//                       padding: "3px",
//                       boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
//                       zIndex: 5,
//                     }}
//                   >
//                     <button onClick={() => setReactionPickerId((p) => (p === msg.id ? null : msg.id))} style={iconBtn} title="React">
//                       <Smile size={14} color="#555" />
//                     </button>

//                     <button onClick={() => toggleStarMessage(msg)} style={iconBtn} title={msg.starred ? "Unstar" : "Star"}>
//                       <Star size={14} color={msg.starred ? "#F4712B" : "#555"} fill={msg.starred ? "#F4712B" : "none"} />
//                     </button>

//                     <button onClick={() => togglePinMessage(msg)} style={iconBtn} title={msg.pinned ? "Unpin" : "Pin"}>
//                       <Pin size={14} color={msg.pinned ? "#F4712B" : "#555"} />
//                     </button>

//                     <button
//                       onClick={() => {
//                         setForwardMsg(msg);
//                         setForwardTo("");
//                       }}
//                       style={iconBtn}
//                       title="Forward"
//                     >
//                       <Forward size={14} color="#555" />
//                     </button>

//                     {isMine && (
//                       <button onClick={() => startEdit(msg)} style={iconBtn} title="Edit">
//                         <Pencil size={14} color="#555" />
//                       </button>
//                     )}

//                     <button onClick={() => deleteMessage(msg)} style={iconBtn} title="Delete">
//                       <Trash2 size={14} color="#555" />
//                     </button>
//                   </div>
//                 )}

//                 {/* Reaction picker */}
//                 {reactionPickerId === msg.id && (
//                   <div
//                     style={{
//                       position: "absolute",
//                       top: "-68px",
//                       right: isMine ? "0" : "auto",
//                       left: isMine ? "auto" : "0",
//                       display: "flex",
//                       gap: "4px",
//                       background: "#fff",
//                       border: "1px solid #ddd",
//                       borderRadius: "20px",
//                       padding: "4px 8px",
//                       boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
//                       zIndex: 6,
//                     }}
//                   >
//                     {EMOJIS.map((emoji) => (
//                       <button
//                         key={emoji}
//                         onClick={() => reactToMessage(msg, emoji)}
//                         style={{ border: "none", background: "transparent", cursor: "pointer", fontSize: "18px" }}
//                       >
//                         {emoji}
//                       </button>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             </div>
//           );
//         })}

//         <div ref={messagesEndRef} />
//       </div>

//       {/* ================= INPUT ================= */}
//       <div style={{ borderTop: "1px solid #e5e7eb", background: "#fff", padding: "10px 14px" }}>
//         <input ref={fileInputRef} type="file" style={{ display: "none" }} onChange={handleFileChange} />
//         <input ref={imageInputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleImageChange} />

//         {/* Editing banner */}
//         {editingId && (
//           <div
//             style={{
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "space-between",
//               padding: "6px 10px",
//               marginBottom: "8px",
//               background: "#FFF6EE",
//               borderLeft: "3px solid #F4712B",
//               borderRadius: "4px",
//               fontSize: "12px",
//               color: "#555",
//             }}
//           >
//             <span>Editing message</span>
//             <button onClick={cancelEdit} style={iconBtn} title="Cancel edit">
//               <X size={14} color="#555" />
//             </button>
//           </div>
//         )}

//         {showAttachmentMenu && (
//           <div
//             style={{
//               display: "flex",
//               gap: "8px",
//               padding: "8px",
//               marginBottom: "8px",
//               background: "#fff",
//               border: "1px solid #e5e7eb",
//               borderRadius: "8px",
//               width: "fit-content",
//               boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
//             }}
//           >
//             {[
//               { onClick: handleFileClick, title: "File", icon: FileText },
//               { onClick: handleImageClick, title: "Image", icon: Image },
//               { onClick: handleProject, title: "Project", icon: FolderOpen },
//               { onClick: handleLink, title: "Link", icon: Link },
//             ].map(({ onClick, title, icon: Icon }) => (
//               <button
//                 key={title}
//                 onClick={onClick}
//                 disabled={uploading}
//                 style={{
//                   border: "none",
//                   background: "#FBE4D0",
//                   borderRadius: "7px",
//                   padding: "8px",
//                   cursor: uploading ? "not-allowed" : "pointer",
//                   opacity: uploading ? 0.6 : 1,
//                 }}
//                 title={title}
//               >
//                 <Icon size={18} color="#F4712B" />
//               </button>
//             ))}
//           </div>
//         )}

//         <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
//           <button
//             onClick={() => setShowAttachmentMenu((prev) => !prev)}
//             style={{ border: "none", background: "transparent", cursor: "pointer", padding: "8px" }}
//             title="Attach"
//           >
//             <Paperclip size={20} color="#555" />
//           </button>

//           <input
//             type="text"
//             value={message}
//             onChange={(e) => setMessage(e.target.value)}
//             onKeyDown={handleKeyDown}
//             placeholder={editingId ? "Edit your message..." : "Type a message..."}
//             style={{
//               flex: 1,
//               border: "1px solid #ddd",
//               outline: "none",
//               borderRadius: "20px",
//               padding: "10px 15px",
//               fontSize: "14px",
//             }}
//           />

//           <button
//             onClick={sendMessage}
//             disabled={!message.trim()}
//             style={{
//               width: "42px",
//               height: "42px",
//               border: "none",
//               borderRadius: "50%",
//               background: message.trim() ? "#F4712B" : "#ddd",
//               cursor: message.trim() ? "pointer" : "not-allowed",
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//             }}
//             title={editingId ? "Save" : "Send"}
//           >
//             <Send size={18} color="#fff" />
//           </button>
//         </div>
//       </div>

//       {/* ================= STARRED / PINNED PANEL ================= */}
//       {panel && (
//         <div
//           style={{
//             position: "absolute",
//             top: 0,
//             right: 0,
//             bottom: 0,
//             width: "min(340px, 100%)",
//             background: "#fff",
//             borderLeft: "1px solid #e5e7eb",
//             boxShadow: "-4px 0 14px rgba(0,0,0,0.08)",
//             display: "flex",
//             flexDirection: "column",
//             zIndex: 60,
//           }}
//         >
//           <div
//             style={{
//               height: "65px",
//               minHeight: "65px",
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "space-between",
//               padding: "0 16px",
//               borderBottom: "1px solid #e5e7eb",
//               fontWeight: 600,
//             }}
//           >
//             {panel === "starred" ? "Starred messages" : "Pinned messages"}
//             <button onClick={() => setPanel(null)} style={iconBtn}>
//               <X size={18} color="#555" />
//             </button>
//           </div>

//           <div style={{ flex: 1, overflowY: "auto", padding: "12px" }}>
//             {(panel === "starred" ? starredMessages : pinnedMessages).length === 0 && (
//               <div style={{ color: "#888", fontSize: "13px" }}>Nothing here yet.</div>
//             )}

//             {(panel === "starred" ? starredMessages : pinnedMessages).map((m) => (
//               <div
//                 key={m.id}
//                 style={{
//                   background: "#FBE4D0",
//                   borderRadius: "10px",
//                   padding: "10px 12px",
//                   marginBottom: "8px",
//                   fontSize: "13px",
//                   wordBreak: "break-word",
//                   whiteSpace: "pre-wrap",
//                 }}
//               >
//                 {renderMessageText(m.text)}
//                 <div style={{ fontSize: "10px", color: "#777", marginTop: "4px", textAlign: "right" }}>{m.time}</div>
//               </div>
//             ))}
//           </div>
//         </div>
//       )}

//       {/* ================= FORWARD MODAL ================= */}
//       {forwardMsg && (
//         <div
//           style={{
//             position: "fixed",
//             inset: 0,
//             background: "rgba(0,0,0,0.4)",
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//             zIndex: 1000,
//           }}
//         >
//           <div style={{ width: "380px", maxWidth: "90%", background: "#fff", borderRadius: "12px", padding: "22px", boxShadow: "0 10px 30px rgba(0,0,0,0.2)" }}>
//             <h3 style={{ marginTop: 0, marginBottom: "12px" }}>Forward message</h3>

//             <div style={{ background: "#FBE4D0", borderRadius: "8px", padding: "8px 10px", fontSize: "13px", marginBottom: "12px", maxHeight: "80px", overflow: "hidden" }}>
//               {forwardMsg.text}
//             </div>

//             <input
//               type="text"
//               placeholder="Target chat ID"
//               value={forwardTo}
//               onChange={(e) => setForwardTo(e.target.value)}
//               style={{ ...modalInput, marginBottom: "16px" }}
//             />

//             <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
//               <button
//                 onClick={() => setForwardMsg(null)}
//                 style={{ border: "1px solid #ddd", background: "#fff", padding: "9px 16px", borderRadius: "7px", cursor: "pointer" }}
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={submitForward}
//                 style={{ border: "none", background: "#F4712B", color: "#fff", padding: "9px 16px", borderRadius: "7px", cursor: "pointer" }}
//               >
//                 Forward
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* ================= PROJECT MODAL ================= */}
//       {showProjectModal && (
//         <div
//           style={{
//             position: "fixed",
//             inset: 0,
//             background: "rgba(0,0,0,0.4)",
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//             zIndex: 1000,
//           }}
//         >
//           <div style={{ width: "420px", maxWidth: "90%", background: "#fff", borderRadius: "12px", padding: "22px", boxShadow: "0 10px 30px rgba(0,0,0,0.2)" }}>
//             <h3 style={{ marginTop: 0, marginBottom: "18px" }}>Add Project</h3>

//             <input
//               type="text"
//               list="project-names"
//               placeholder="Project name"
//               value={projectName}
//               onChange={(e) => setProjectName(e.target.value)}
//               style={modalInput}
//             />
//             <datalist id="project-names">
//               {existingProjects.map((p) => {
//                 const n = p.name ?? p.projectName;
//                 return n ? <option key={p.id ?? n} value={n} /> : null;
//               })}
//             </datalist>

//             <input
//               type="date"
//               value={projectDate}
//               onChange={(e) => setProjectDate(e.target.value)}
//               style={modalInput}
//             />

//             <input
//               type="file"
//               onChange={(e) => setProjectFile(e.target.files?.[0] || null)}
//               style={{ width: "100%", marginBottom: "18px" }}
//             />

//             <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
//               <button
//                 onClick={() => setShowProjectModal(false)}
//                 disabled={uploading}
//                 style={{ border: "1px solid #ddd", background: "#fff", padding: "9px 16px", borderRadius: "7px", cursor: "pointer" }}
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleProjectSubmit}
//                 disabled={uploading}
//                 style={{
//                   border: "none",
//                   background: "#F4712B",
//                   color: "#fff",
//                   padding: "9px 16px",
//                   borderRadius: "7px",
//                   cursor: uploading ? "not-allowed" : "pointer",
//                   opacity: uploading ? 0.7 : 1,
//                 }}
//               >
//                 {uploading ? "Uploading..." : "Add Project"}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default OnetoOneView;

// import { useEffect, useRef, useState } from "react";
// import {
//   ArrowLeft,
//   Search as SearchIcon,
//   MoreVertical,
//   Paperclip,
//   Send,
//   Pin,
//   FileText,
//   Image,
//   FolderOpen,
//   Link,
//   Trash2,
//   Star,
//   Pencil,
//   Forward,
//   Smile,
//   X,
// } from "lucide-react";

// import Search from "./OnetoOneSearch";
// import { getMyProfile } from "../../../api/usersApi";
// import * as messagesApi from "../../../api/messagesApi";
// import * as attachmentsApi from "../../../api/attachmentsApi";

// /* =========================================================
//  * HELPERS
//  * ========================================================= */

// const EMOJIS = ["👍", "❤️", "😂", "😮", "😢", "🙏"];

// const fmtTime = (value) => {
//   const date = value ? new Date(value) : new Date();
//   return isNaN(date) ? "" : date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
// };

// // raw timestamp (ms) used for sorting
// const toTs = (value) => {
//   const t = value ? new Date(value).getTime() : Date.now();
//   return isNaN(t) ? 0 : t;
// };

// const statusTicks = (s) => (s === "READ" || s === "DELIVERED" ? "✓✓" : s === "SENT" ? "✓" : "");

// const mapReactions = (r) => {
//   if (Array.isArray(r)) {
//     const grouped = {};
//     r.forEach((x) => {
//       const emoji = typeof x === "string" ? x : x.emoji;
//       grouped[emoji] = (grouped[emoji] || 0) + (x.count ?? 1);
//     });
//     return Object.entries(grouped).map(([emoji, count]) => ({ emoji, count }));
//   }
//   if (r && typeof r === "object")
//     return Object.entries(r).map(([emoji, count]) => ({
//       emoji,
//       count: Array.isArray(count) ? count.length : count,
//     }));
//   return [];
// };

// const mapMessage = (m, myId) => {
//   const rawTime = m.createdAt ?? m.sentAt ?? m.timestamp;
//   return {
//     id: m.id ?? m.messageId,
//     text: m.content ?? m.text ?? "",
//     sender: String(m.senderId ?? m.sender?.id) === String(myId) ? "me" : "other",
//     ts: toTs(rawTime),
//     time: fmtTime(rawTime),
//     status: m.status,
//     pinned: m.pinned ?? m.isPinned ?? false,
//     starred: m.starred ?? m.isStarred ?? false,
//     edited: m.edited ?? m.isEdited ?? false,
//     reactions: mapReactions(m.reactions),
//   };
// };

// // oldest first -> newest last (WhatsApp style)
// const sortAsc = (list) =>
//   [...list].sort((a, b) => a.ts - b.ts || Number(a.id) - Number(b.id) || 0);

// /* =========================================================
//  * COMPONENT
//  * ========================================================= */

// function OnetoOneView({ chat, onBack }) {
//   const [message, setMessage] = useState("");
//   const [messages, setMessages] = useState([]);
//   const [myId, setMyId] = useState(null);

//   const [showSearch, setShowSearch] = useState(false);
//   const [showMenu, setShowMenu] = useState(false);
//   const [hoveredMessageId, setHoveredMessageId] = useState(null);
//   const [reactionPickerId, setReactionPickerId] = useState(null);
//   const [editingId, setEditingId] = useState(null);

//   const [panel, setPanel] = useState(null); // "starred" | "pinned" | null
//   const pinnedMessages = messages.filter((item) => item.pinned);
//   const starredMessages = messages.filter((item) => item.starred);

//   const [forwardMsg, setForwardMsg] = useState(null);
//   const [forwardTo, setForwardTo] = useState("");

//   const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);
//   const [showProjectModal, setShowProjectModal] = useState(false);
//   const [projectName, setProjectName] = useState("");
//   const [projectDate, setProjectDate] = useState("");
//   const [projectFile, setProjectFile] = useState(null);
//   const [existingProjects, setExistingProjects] = useState([]);
//   const [uploading, setUploading] = useState(false);

//   const messagesEndRef = useRef(null);
//   const fileInputRef = useRef(null);
//   const imageInputRef = useRef(null);

//   const patchMessage = (id, patch) =>
//     setMessages((prev) => prev.map((item) => (item.id === id ? { ...item, ...patch } : item)));

//   /* ---------------------------------------------------------
//    * MY ID
//    * --------------------------------------------------------- */

//   useEffect(() => {
//     getMyProfile()
//       .then((p) => setMyId(p.id ?? p.userId))
//       .catch((e) => console.error("Profile error:", e));
//   }, []);

//   /* ---------------------------------------------------------
//    * LOAD HISTORY + POLL EVERY 5s
//    * --------------------------------------------------------- */

//   useEffect(() => {
//     if (!chat?.id || myId == null) return;
//     let cancelled = false;

//     const load = async () => {
//       try {
//         const list = await messagesApi.getChatMessages(chat.id);
//         if (!cancelled) setMessages(sortAsc(list.map((m) => mapMessage(m, myId))));
//       } catch (e) {
//         console.error("Load messages error:", e);
//       }
//     };

//     load();
//     const timer = setInterval(load, 5000);
//     return () => {
//       cancelled = true;
//       clearInterval(timer);
//     };
//   }, [chat?.id, myId]);

//   /* ---------------------------------------------------------
//    * AUTO SCROLL (only when a message is added, not on every poll)
//    * --------------------------------------------------------- */

//   const lastId = messages[messages.length - 1]?.id;

//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [lastId, messages.length]);

//   /* ---------------------------------------------------------
//    * SEND / EDIT
//    * --------------------------------------------------------- */

//   // persists a message on the server and appends it to the bottom of the list
//   const sendText = async (text) => {
//     const sent = await messagesApi.sendMessage(chat.id, text);
//     setMessages((prev) => sortAsc([...prev, mapMessage(sent, myId)]));
//   };

//   const sendMessage = async () => {
//     const text = message.trim();
//     if (!text) return;
//     if (editingId) return saveEdit(text);

//     try {
//       await sendText(text);
//       setMessage("");
//     } catch (e) {
//       console.error("Send error:", e);
//       alert("Failed to send message.");
//     }
//   };

//   const handleKeyDown = (e) => {
//     if (e.key === "Enter" && !e.shiftKey) {
//       e.preventDefault();
//       sendMessage();
//     }
//     if (e.key === "Escape" && editingId) cancelEdit();
//   };

//   const startEdit = (msg) => {
//     setEditingId(msg.id);
//     setMessage(msg.text);
//   };

//   const cancelEdit = () => {
//     setEditingId(null);
//     setMessage("");
//   };

//   const saveEdit = async (text) => {
//     const id = editingId;
//     const original = messages.find((m) => m.id === id);
//     if (!original || text === original.text) return cancelEdit();

//     try {
//       await messagesApi.editMessage(id, text);
//       patchMessage(id, { text, edited: true });
//     } catch (e) {
//       console.error("Edit error:", e);
//       alert("Failed to edit message.");
//     }
//     cancelEdit();
//   };

//   /* ---------------------------------------------------------
//    * DELETE / PIN / STAR / REACT / FORWARD
//    * --------------------------------------------------------- */

//   const deleteMessage = async (msg) => {
//     try {
//       await messagesApi.deleteMessage(msg.id);
//       setMessages((prev) => prev.filter((m) => m.id !== msg.id));
//       if (editingId === msg.id) cancelEdit();
//     } catch (e) {
//       console.error("Delete error:", e);
//       alert("Failed to delete message.");
//     }
//   };

//   const togglePinMessage = async (msg) => {
//     try {
//       await messagesApi.togglePinMessage(msg.id);
//       patchMessage(msg.id, { pinned: !msg.pinned });
//     } catch (e) {
//       console.error("Pin error:", e);
//     }
//   };

//   const toggleStarMessage = async (msg) => {
//     try {
//       await messagesApi.toggleStarMessage(msg.id);
//       patchMessage(msg.id, { starred: !msg.starred });
//     } catch (e) {
//       console.error("Star error:", e);
//     }
//   };

//   const reactToMessage = async (msg, emoji) => {
//     setReactionPickerId(null);
//     try {
//       const updated = await messagesApi.reactToMessage(msg.id, emoji);
//       if (updated?.reactions) {
//         patchMessage(msg.id, { reactions: mapReactions(updated.reactions) });
//       } else {
//         const found = msg.reactions.find((r) => r.emoji === emoji);
//         patchMessage(msg.id, {
//           reactions: found
//             ? msg.reactions.map((r) => (r.emoji === emoji ? { ...r, count: r.count + 1 } : r))
//             : [...msg.reactions, { emoji, count: 1 }],
//         });
//       }
//     } catch (e) {
//       console.error("React error:", e);
//     }
//   };

//   const submitForward = async () => {
//     if (!forwardTo.trim()) {
//       alert("Please enter the target chat ID.");
//       return;
//     }
//     try {
//       await messagesApi.forwardMessage(forwardMsg.id, forwardTo.trim());
//       alert("Message forwarded.");
//       setForwardMsg(null);
//       setForwardTo("");
//     } catch (e) {
//       console.error("Forward error:", e);
//       alert("Failed to forward message.");
//     }
//   };

//   const openPanel = (type) => {
//     setShowMenu(false);
//     setPanel(type);
//   };

//   /* ---------------------------------------------------------
//    * ATTACHMENTS (files, images, links, projects)
//    * --------------------------------------------------------- */

//   // POST /api/attachments/upload, then persist a chat message
//   const uploadAndSend = async (file, prefix) => {
//     setUploading(true);
//     try {
//       await attachmentsApi.uploadFile(file, chat.id);
//       await sendText(`${prefix} ${file.name}`);
//     } catch (e) {
//       console.error("Upload error:", e);
//       alert("Failed to upload file.");
//     } finally {
//       setUploading(false);
//     }
//   };

//   const handleFileClick = () => {
//     setShowAttachmentMenu(false);
//     fileInputRef.current?.click();
//   };

//   const handleImageClick = () => {
//     setShowAttachmentMenu(false);
//     imageInputRef.current?.click();
//   };

//   const handleFileChange = (e) => {
//     const file = e.target.files?.[0];
//     e.target.value = "";
//     if (file) uploadAndSend(file, "📎 File attached:");
//   };

//   const handleImageChange = (e) => {
//     const file = e.target.files?.[0];
//     e.target.value = "";
//     if (file) uploadAndSend(file, "🖼️ Image attached:");
//   };

//   const handleLink = async () => {
//     setShowAttachmentMenu(false);
//     const url = window.prompt("Enter link:");
//     if (!url) return;
//     try {
//       await sendText(`🔗 ${url}`);
//     } catch (e) {
//       console.error("Link error:", e);
//       alert("Failed to send link.");
//     }
//   };

//   const handleProject = () => {
//     setShowAttachmentMenu(false);
//     setProjectName("");
//     setProjectDate("");
//     setProjectFile(null);
//     setShowProjectModal(true);

//     // GET /api/attachments/projects -> suggestions for the name field
//     attachmentsApi
//       .getMyProjects()
//       .then(setExistingProjects)
//       .catch((e) => console.error("Projects load error:", e));
//   };

//   const handleProjectSubmit = async () => {
//     const name = projectName.trim();
//     if (!name) {
//       alert("Please enter project name.");
//       return;
//     }

//     setUploading(true);
//     try {
//       // POST /api/attachments/projects/upload (only when a file was chosen)
//       if (projectFile) {
//         await attachmentsApi.uploadToProject({
//           projectName: name,
//           files: [projectFile],
//           chatId: chat.id,
//           dueDate: projectDate,
//         });
//       }

//       let text = `📁 Project: ${name}`;
//       if (projectDate) text += `\n📅 Date: ${projectDate}`;
//       if (projectFile) text += `\n📎 File: ${projectFile.name}`;
//       await sendText(text);

//       setShowProjectModal(false);
//       setProjectName("");
//       setProjectDate("");
//       setProjectFile(null);
//     } catch (e) {
//       console.error("Project error:", e);
//       alert("Failed to add project.");
//     } finally {
//       setUploading(false);
//     }
//   };

//   /* ---------------------------------------------------------
//    * RENDER HELPERS
//    * --------------------------------------------------------- */

//   const renderMessageText = (text) => {
//     if (!text) return null;
//     const urlRegex = /(https?:\/\/[^\s]+)/g;
//     return text.split(urlRegex).map((part, index) =>
//       /^https?:\/\//.test(part) ? (
//         <a
//           key={index}
//           href={part}
//           target="_blank"
//           rel="noopener noreferrer"
//           style={{ color: "#F4712B", textDecoration: "underline", wordBreak: "break-all" }}
//         >
//           {part}
//         </a>
//       ) : (
//         <span key={index}>{part}</span>
//       )
//     );
//   };

//   const getInitial = () => chat?.name?.charAt(0)?.toUpperCase() || "U";

//   const iconBtn = {
//     border: "none",
//     background: "transparent",
//     cursor: "pointer",
//     padding: "4px",
//   };

//   const modalInput = {
//     width: "100%",
//     padding: "10px",
//     border: "1px solid #ddd",
//     borderRadius: "7px",
//     marginBottom: "10px",
//     boxSizing: "border-box",
//   };

//   /* ---------------------------------------------------------
//    * RENDER
//    * --------------------------------------------------------- */

//   return (
//     <div style={{ height: "100%", display: "flex", flexDirection: "column", background: "#fff", position: "relative" }}>
//       {/* ================= HEADER ================= */}
//       <div
//         style={{
//           height: "65px",
//           minHeight: "65px",
//           display: "flex",
//           alignItems: "center",
//           padding: "0 18px",
//           borderBottom: "1px solid #e5e7eb",
//           background: "#fff",
//         }}
//       >
//         <button
//           onClick={onBack}
//           style={{ border: "none", background: "transparent", cursor: "pointer", marginRight: "12px", display: "flex", alignItems: "center", justifyContent: "center" }}
//         >
//           <ArrowLeft size={21} color="#333" />
//         </button>

//         <div
//           style={{
//             width: "40px",
//             height: "40px",
//             borderRadius: "50%",
//             background: "#F4712B",
//             color: "#fff",
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//             fontWeight: "600",
//             marginRight: "10px",
//           }}
//         >
//           {getInitial()}
//         </div>

//         <div style={{ flex: 1, minWidth: 0 }}>
//           <div style={{ fontSize: "15px", fontWeight: "600", color: "#222" }}>{chat?.name || "Chat"}</div>
//           <div style={{ fontSize: "12px", color: "#888" }}>
//             {uploading ? "Uploading..." : chat?.type === "group" ? "Group" : "Online"}
//           </div>
//         </div>

//         <button onClick={() => setShowSearch(true)} style={{ border: "none", background: "transparent", cursor: "pointer", padding: "8px" }}>
//           <SearchIcon size={20} color="#555" />
//         </button>

//         <div style={{ position: "relative" }}>
//           <button
//             onClick={() => setShowMenu((p) => !p)}
//             style={{ border: "none", background: "transparent", cursor: "pointer", padding: "8px" }}
//           >
//             <MoreVertical size={20} color="#555" />
//           </button>

//           {showMenu && (
//             <div
//               style={{
//                 position: "absolute",
//                 right: 0,
//                 top: "40px",
//                 background: "#fff",
//                 border: "1px solid #e5e7eb",
//                 borderRadius: "8px",
//                 boxShadow: "0 4px 14px rgba(0,0,0,0.12)",
//                 zIndex: 50,
//                 minWidth: "170px",
//                 overflow: "hidden",
//               }}
//             >
//               {[
//                 { key: "starred", label: "Starred messages", icon: <Star size={15} color="#555" /> },
//                 { key: "pinned", label: "Pinned messages", icon: <Pin size={15} color="#555" /> },
//               ].map((item) => (
//                 <button
//                   key={item.key}
//                   onClick={() => openPanel(item.key)}
//                   style={{
//                     display: "flex",
//                     alignItems: "center",
//                     gap: "8px",
//                     width: "100%",
//                     padding: "10px 14px",
//                     border: "none",
//                     background: "#fff",
//                     cursor: "pointer",
//                     fontSize: "13px",
//                     textAlign: "left",
//                   }}
//                 >
//                   {item.icon}
//                   {item.label}
//                 </button>
//               ))}
//             </div>
//           )}
//         </div>
//       </div>

//       {/* ================= SEARCH ================= */}
//       {showSearch && (
//         <Search chatId={chat?.id} contactName={chat?.name} onClose={() => setShowSearch(false)} />
//       )}

//       {/* ================= PINNED BANNER ================= */}
//       {pinnedMessages.length > 0 && (
//         <div
//           onClick={() => openPanel("pinned")}
//           style={{
//             display: "flex",
//             alignItems: "center",
//             gap: "8px",
//             padding: "8px 18px",
//             background: "#FFF6EE",
//             borderBottom: "1px solid #f3d9c3",
//             cursor: "pointer",
//             fontSize: "13px",
//             color: "#444",
//           }}
//         >
//           <Pin size={14} color="#F4712B" />
//           <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1 }}>
//             {pinnedMessages[pinnedMessages.length - 1].text}
//           </span>
//           <span style={{ color: "#888", fontSize: "11px" }}>{pinnedMessages.length} pinned</span>
//         </div>
//       )}

//       {/* ================= MESSAGES ================= */}
//       <div style={{ flex: 1, overflowY: "auto", padding: "20px", background: "#fafafa" }}>
//         {messages.length === 0 && (
//           <div style={{ textAlign: "center", color: "#888", fontSize: "13px" }}>No messages yet. Say hi 👋</div>
//         )}

//         {messages.map((msg) => {
//           const isMine = msg.sender === "me";

//           return (
//             <div
//               key={msg.id}
//               style={{
//                 display: "flex",
//                 justifyContent: isMine ? "flex-end" : "flex-start",
//                 marginBottom: msg.reactions?.length ? "20px" : "12px",
//               }}
//               onMouseEnter={() => setHoveredMessageId(msg.id)}
//               onMouseLeave={() => {
//                 setHoveredMessageId(null);
//                 setReactionPickerId(null);
//               }}
//             >
//               <div style={{ position: "relative", maxWidth: "70%" }}>
//                 {/* Bubble */}
//                 <div
//                   style={{
//                     background: isMine ? "#F4712B" : "#FBE4D0",
//                     color: isMine ? "#fff" : "#222",
//                     padding: "10px 13px",
//                     borderRadius: isMine ? "14px 14px 3px 14px" : "14px 14px 14px 3px",
//                     whiteSpace: "pre-wrap",
//                     wordBreak: "break-word",
//                     fontSize: "14px",
//                     outline: editingId === msg.id ? "2px solid #333" : "none",
//                   }}
//                 >
//                   {renderMessageText(msg.text)}

//                   <div
//                     style={{
//                       display: "flex",
//                       justifyContent: "flex-end",
//                       alignItems: "center",
//                       gap: "5px",
//                       marginTop: "4px",
//                       fontSize: "10px",
//                       opacity: 0.8,
//                     }}
//                   >
//                     {msg.pinned && <Pin size={10} />}
//                     {msg.starred && <Star size={10} fill="currentColor" />}
//                     {msg.edited && <span>edited</span>}
//                     <span>{msg.time}</span>
//                     {isMine && <span>{statusTicks(msg.status)}</span>}
//                   </div>
//                 </div>

//                 {/* Reactions */}
//                 {msg.reactions?.length > 0 && (
//                   <div
//                     style={{
//                       position: "absolute",
//                       bottom: "-14px",
//                       [isMine ? "right" : "left"]: "8px",
//                       display: "flex",
//                       gap: "3px",
//                       background: "#fff",
//                       border: "1px solid #eee",
//                       borderRadius: "10px",
//                       padding: "1px 6px",
//                       fontSize: "12px",
//                       boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
//                     }}
//                   >
//                     {msg.reactions.map((r) => (
//                       <span key={r.emoji}>
//                         {r.emoji}
//                         {r.count > 1 ? ` ${r.count}` : ""}
//                       </span>
//                     ))}
//                   </div>
//                 )}

//                 {/* Hover Actions */}
//                 {hoveredMessageId === msg.id && (
//                   <div
//                     style={{
//                       position: "absolute",
//                       top: "-32px",
//                       right: isMine ? "0" : "auto",
//                       left: isMine ? "auto" : "0",
//                       display: "flex",
//                       gap: "2px",
//                       background: "#fff",
//                       border: "1px solid #ddd",
//                       borderRadius: "7px",
//                       padding: "3px",
//                       boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
//                       zIndex: 5,
//                     }}
//                   >
//                     <button onClick={() => setReactionPickerId((p) => (p === msg.id ? null : msg.id))} style={iconBtn} title="React">
//                       <Smile size={14} color="#555" />
//                     </button>

//                     <button onClick={() => toggleStarMessage(msg)} style={iconBtn} title={msg.starred ? "Unstar" : "Star"}>
//                       <Star size={14} color={msg.starred ? "#F4712B" : "#555"} fill={msg.starred ? "#F4712B" : "none"} />
//                     </button>

//                     <button onClick={() => togglePinMessage(msg)} style={iconBtn} title={msg.pinned ? "Unpin" : "Pin"}>
//                       <Pin size={14} color={msg.pinned ? "#F4712B" : "#555"} />
//                     </button>

//                     <button
//                       onClick={() => {
//                         setForwardMsg(msg);
//                         setForwardTo("");
//                       }}
//                       style={iconBtn}
//                       title="Forward"
//                     >
//                       <Forward size={14} color="#555" />
//                     </button>

//                     {isMine && (
//                       <button onClick={() => startEdit(msg)} style={iconBtn} title="Edit">
//                         <Pencil size={14} color="#555" />
//                       </button>
//                     )}

//                     <button onClick={() => deleteMessage(msg)} style={iconBtn} title="Delete">
//                       <Trash2 size={14} color="#555" />
//                     </button>
//                   </div>
//                 )}

//                 {/* Reaction picker */}
//                 {reactionPickerId === msg.id && (
//                   <div
//                     style={{
//                       position: "absolute",
//                       top: "-68px",
//                       right: isMine ? "0" : "auto",
//                       left: isMine ? "auto" : "0",
//                       display: "flex",
//                       gap: "4px",
//                       background: "#fff",
//                       border: "1px solid #ddd",
//                       borderRadius: "20px",
//                       padding: "4px 8px",
//                       boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
//                       zIndex: 6,
//                     }}
//                   >
//                     {EMOJIS.map((emoji) => (
//                       <button
//                         key={emoji}
//                         onClick={() => reactToMessage(msg, emoji)}
//                         style={{ border: "none", background: "transparent", cursor: "pointer", fontSize: "18px" }}
//                       >
//                         {emoji}
//                       </button>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             </div>
//           );
//         })}

//         <div ref={messagesEndRef} />
//       </div>

//       {/* ================= INPUT ================= */}
//       <div style={{ borderTop: "1px solid #e5e7eb", background: "#fff", padding: "10px 14px" }}>
//         <input ref={fileInputRef} type="file" style={{ display: "none" }} onChange={handleFileChange} />
//         <input ref={imageInputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleImageChange} />

//         {/* Editing banner */}
//         {editingId && (
//           <div
//             style={{
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "space-between",
//               padding: "6px 10px",
//               marginBottom: "8px",
//               background: "#FFF6EE",
//               borderLeft: "3px solid #F4712B",
//               borderRadius: "4px",
//               fontSize: "12px",
//               color: "#555",
//             }}
//           >
//             <span>Editing message</span>
//             <button onClick={cancelEdit} style={iconBtn} title="Cancel edit">
//               <X size={14} color="#555" />
//             </button>
//           </div>
//         )}

//         {showAttachmentMenu && (
//           <div
//             style={{
//               display: "flex",
//               gap: "8px",
//               padding: "8px",
//               marginBottom: "8px",
//               background: "#fff",
//               border: "1px solid #e5e7eb",
//               borderRadius: "8px",
//               width: "fit-content",
//               boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
//             }}
//           >
//             {[
//               { onClick: handleFileClick, title: "File", icon: FileText },
//               { onClick: handleImageClick, title: "Image", icon: Image },
//               { onClick: handleProject, title: "Project", icon: FolderOpen },
//               { onClick: handleLink, title: "Link", icon: Link },
//             ].map(({ onClick, title, icon: Icon }) => (
//               <button
//                 key={title}
//                 onClick={onClick}
//                 disabled={uploading}
//                 style={{
//                   border: "none",
//                   background: "#FBE4D0",
//                   borderRadius: "7px",
//                   padding: "8px",
//                   cursor: uploading ? "not-allowed" : "pointer",
//                   opacity: uploading ? 0.6 : 1,
//                 }}
//                 title={title}
//               >
//                 <Icon size={18} color="#F4712B" />
//               </button>
//             ))}
//           </div>
//         )}

//         <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
//           <button
//             onClick={() => setShowAttachmentMenu((prev) => !prev)}
//             style={{ border: "none", background: "transparent", cursor: "pointer", padding: "8px" }}
//             title="Attach"
//           >
//             <Paperclip size={20} color="#555" />
//           </button>

//           <input
//             type="text"
//             value={message}
//             onChange={(e) => setMessage(e.target.value)}
//             onKeyDown={handleKeyDown}
//             placeholder={editingId ? "Edit your message..." : "Type a message..."}
//             style={{
//               flex: 1,
//               border: "1px solid #ddd",
//               outline: "none",
//               borderRadius: "20px",
//               padding: "10px 15px",
//               fontSize: "14px",
//             }}
//           />

//           <button
//             onClick={sendMessage}
//             disabled={!message.trim()}
//             style={{
//               width: "42px",
//               height: "42px",
//               border: "none",
//               borderRadius: "50%",
//               background: message.trim() ? "#F4712B" : "#ddd",
//               cursor: message.trim() ? "pointer" : "not-allowed",
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//             }}
//             title={editingId ? "Save" : "Send"}
//           >
//             <Send size={18} color="#fff" />
//           </button>
//         </div>
//       </div>

//       {/* ================= STARRED / PINNED PANEL ================= */}
//       {panel && (
//         <div
//           style={{
//             position: "absolute",
//             top: 0,
//             right: 0,
//             bottom: 0,
//             width: "min(340px, 100%)",
//             background: "#fff",
//             borderLeft: "1px solid #e5e7eb",
//             boxShadow: "-4px 0 14px rgba(0,0,0,0.08)",
//             display: "flex",
//             flexDirection: "column",
//             zIndex: 60,
//           }}
//         >
//           <div
//             style={{
//               height: "65px",
//               minHeight: "65px",
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "space-between",
//               padding: "0 16px",
//               borderBottom: "1px solid #e5e7eb",
//               fontWeight: 600,
//             }}
//           >
//             {panel === "starred" ? "Starred messages" : "Pinned messages"}
//             <button onClick={() => setPanel(null)} style={iconBtn}>
//               <X size={18} color="#555" />
//             </button>
//           </div>

//           <div style={{ flex: 1, overflowY: "auto", padding: "12px" }}>
//             {(panel === "starred" ? starredMessages : pinnedMessages).length === 0 && (
//               <div style={{ color: "#888", fontSize: "13px" }}>Nothing here yet.</div>
//             )}

//             {(panel === "starred" ? starredMessages : pinnedMessages).map((m) => (
//               <div
//                 key={m.id}
//                 style={{
//                   background: "#FBE4D0",
//                   borderRadius: "10px",
//                   padding: "10px 12px",
//                   marginBottom: "8px",
//                   fontSize: "13px",
//                   wordBreak: "break-word",
//                   whiteSpace: "pre-wrap",
//                 }}
//               >
//                 {renderMessageText(m.text)}
//                 <div style={{ fontSize: "10px", color: "#777", marginTop: "4px", textAlign: "right" }}>{m.time}</div>
//               </div>
//             ))}
//           </div>
//         </div>
//       )}

//       {/* ================= FORWARD MODAL ================= */}
//       {forwardMsg && (
//         <div
//           style={{
//             position: "fixed",
//             inset: 0,
//             background: "rgba(0,0,0,0.4)",
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//             zIndex: 1000,
//           }}
//         >
//           <div style={{ width: "380px", maxWidth: "90%", background: "#fff", borderRadius: "12px", padding: "22px", boxShadow: "0 10px 30px rgba(0,0,0,0.2)" }}>
//             <h3 style={{ marginTop: 0, marginBottom: "12px" }}>Forward message</h3>

//             <div style={{ background: "#FBE4D0", borderRadius: "8px", padding: "8px 10px", fontSize: "13px", marginBottom: "12px", maxHeight: "80px", overflow: "hidden" }}>
//               {forwardMsg.text}
//             </div>

//             <input
//               type="text"
//               placeholder="Target chat ID"
//               value={forwardTo}
//               onChange={(e) => setForwardTo(e.target.value)}
//               style={{ ...modalInput, marginBottom: "16px" }}
//             />

//             <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
//               <button
//                 onClick={() => setForwardMsg(null)}
//                 style={{ border: "1px solid #ddd", background: "#fff", padding: "9px 16px", borderRadius: "7px", cursor: "pointer" }}
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={submitForward}
//                 style={{ border: "none", background: "#F4712B", color: "#fff", padding: "9px 16px", borderRadius: "7px", cursor: "pointer" }}
//               >
//                 Forward
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* ================= PROJECT MODAL ================= */}
//       {showProjectModal && (
//         <div
//           style={{
//             position: "fixed",
//             inset: 0,
//             background: "rgba(0,0,0,0.4)",
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//             zIndex: 1000,
//           }}
//         >
//           <div style={{ width: "420px", maxWidth: "90%", background: "#fff", borderRadius: "12px", padding: "22px", boxShadow: "0 10px 30px rgba(0,0,0,0.2)" }}>
//             <h3 style={{ marginTop: 0, marginBottom: "18px" }}>Add Project</h3>

//             <input
//               type="text"
//               list="project-names"
//               placeholder="Project name"
//               value={projectName}
//               onChange={(e) => setProjectName(e.target.value)}
//               style={modalInput}
//             />
//             <datalist id="project-names">
//               {existingProjects.map((p) => {
//                 const n = p.name ?? p.projectName;
//                 return n ? <option key={p.id ?? n} value={n} /> : null;
//               })}
//             </datalist>

//             <input
//               type="date"
//               value={projectDate}
//               onChange={(e) => setProjectDate(e.target.value)}
//               style={modalInput}
//             />

//             <input
//               type="file"
//               onChange={(e) => setProjectFile(e.target.files?.[0] || null)}
//               style={{ width: "100%", marginBottom: "18px" }}
//             />

//             <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
//               <button
//                 onClick={() => setShowProjectModal(false)}
//                 disabled={uploading}
//                 style={{ border: "1px solid #ddd", background: "#fff", padding: "9px 16px", borderRadius: "7px", cursor: "pointer" }}
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleProjectSubmit}
//                 disabled={uploading}
//                 style={{
//                   border: "none",
//                   background: "#F4712B",
//                   color: "#fff",
//                   padding: "9px 16px",
//                   borderRadius: "7px",
//                   cursor: uploading ? "not-allowed" : "pointer",
//                   opacity: uploading ? 0.7 : 1,
//                 }}
//               >
//                 {uploading ? "Uploading..." : "Add Project"}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default OnetoOneView;

import { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  Search as SearchIcon,
  MoreVertical,
  Paperclip,
  Send,
  Pin,
  FileText,
  Image as ImageIcon,
  FolderOpen,
  Download,
  Trash2,
  Star,
  Pencil,
  Forward,
  Smile,
  X,
} from "lucide-react";

import Search from "./OnetoOneSearch";
import { getMyProfile } from "../../../api/usersApi";
import * as messagesApi from "../../../api/messagesApi";
import * as attachmentsApi from "../../../api/attachmentsApi";

/* =========================================================
 * HELPERS
 * ========================================================= */

const EMOJIS = ["👍", "❤️", "😂", "😮", "😢", "🙏"];

const ATTACH_RE = /^\[\[(img|file):(.*?)\|(.*?)\]\]$/;
const API_BASE = "http://localhost:8081"; // your backend
const toUrl = (u) =>
  /^https?:\/\//.test(u) ? u : `${API_BASE}${u.startsWith("/") ? "" : "/"}${u}`;

// short text for banner / previews
const previewText = (text) => {
  const a = (text || "").match(ATTACH_RE);
  if (a) return `${a[1] === "img" ? "🖼️" : "📎"} ${a[3]}`;
  if ((text || "").startsWith("📁 Project:")) return text.split("\n")[0];
  return text;
};

const fileExt = (name = "") =>
  name.includes(".") ? name.split(".").pop().toUpperCase() : "FILE";
const baseName = (u = "") => decodeURIComponent(u.split("?")[0].split("/").pop() || "");
const isCard = (t = "") => ATTACH_RE.test(t) || t.startsWith("📁 Project:");

/* ---------- project card helpers ---------- */

const today = () => new Date().toISOString().slice(0, 10);

// text stored in the chat message for a project card
const buildProjectText = ({ name, date, projectId, fileNames }) => {
  let t = `📁 Project: ${name}\n📅 Date: ${date || today()}`;
  if (projectId != null) t += `\n🆔 ID: ${projectId}`;
  fileNames.forEach((n) => (t += `\n📎 File: ${n}`));
  return t;
};

const parseProjectText = (text = "") => {
  const lines = text.split("\n");
  const pick = (p) => lines.find((l) => l.startsWith(p))?.replace(p, "").trim();
  return {
    name: pick("📁 Project:") || "",
    date: pick("📅 Date:"),
    projectId: pick("🆔 ID:"),
    files: lines.filter((l) => l.startsWith("📎 File:")).map((l) => l.replace("📎 File:", "").trim()),
  };
};

// a file object coming from the server (field names vary)
const fName = (f) => f.fileName ?? f.originalName ?? f.name ?? "file";
const fId = (f) => f.id ?? f.fileId;
const toFiles = (p) => p?.files ?? p?.attachments ?? (Array.isArray(p) ? p : []);

const fmtTime = (value) => {
  const date = value ? new Date(value) : new Date();
  return isNaN(date) ? "" : date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

// raw timestamp (ms) used for sorting
const toTs = (value) => {
  const t = value ? new Date(value).getTime() : Date.now();
  return isNaN(t) ? 0 : t;
};

const statusTicks = (s) => (s === "READ" || s === "DELIVERED" ? "✓✓" : s === "SENT" ? "✓" : "");

const iconBtn = { border: "none", background: "transparent", cursor: "pointer", padding: "4px" };

const cardBox = {
  width: 250,
  maxWidth: "100%",
  background: "#fff",
  border: "1px solid #e5e7eb",
  borderRadius: 12,
  overflow: "hidden",
  color: "#222",
};

const modalInput = {
  width: "100%",
  padding: "10px",
  border: "1px solid #ddd",
  borderRadius: "7px",
  marginBottom: "10px",
  boxSizing: "border-box",
};

const mapReactions = (r) => {
  if (Array.isArray(r)) {
    const grouped = {};
    r.forEach((x) => {
      const emoji = typeof x === "string" ? x : x.emoji;
      grouped[emoji] = (grouped[emoji] || 0) + (x.count ?? 1);
    });
    return Object.entries(grouped).map(([emoji, count]) => ({ emoji, count }));
  }
  if (r && typeof r === "object")
    return Object.entries(r).map(([emoji, count]) => ({
      emoji,
      count: Array.isArray(count) ? count.length : count,
    }));
  return [];
};

const mapMessage = (m, myId) => {
  const rawTime = m.createdAt ?? m.sentAt ?? m.timestamp;
  return {
    id: m.id ?? m.messageId,
    text: m.content ?? m.text ?? "",
    sender: String(m.senderId ?? m.sender?.id) === String(myId) ? "me" : "other",
    ts: toTs(rawTime),
    time: fmtTime(rawTime),
    status: m.status,
    pinned: m.pinned ?? m.isPinned ?? false,
    starred: m.starred ?? m.isStarred ?? false,
    edited: m.edited ?? m.isEdited ?? false,
    reactions: mapReactions(m.reactions),
  };
};

// oldest first -> newest last (WhatsApp style)
const sortAsc = (list) =>
  [...list].sort((a, b) => a.ts - b.ts || Number(a.id) - Number(b.id) || 0);

/* =========================================================
 * COMPONENT
 * ========================================================= */

function OnetoOneView({ chat, onBack }) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [myId, setMyId] = useState(null);

  const [showSearch, setShowSearch] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [hoveredMessageId, setHoveredMessageId] = useState(null);
  const [reactionPickerId, setReactionPickerId] = useState(null);
  const [editingId, setEditingId] = useState(null);

  const [panel, setPanel] = useState(null); // "starred" | "pinned" | null
  const pinnedMessages = messages.filter((item) => item.pinned);
  const starredMessages = messages.filter((item) => item.starred);

  const [forwardMsg, setForwardMsg] = useState(null);
  const [forwardTo, setForwardTo] = useState("");

  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);
  const [uploading, setUploading] = useState(false);

  // ----- project modal state -----
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [existingProjects, setExistingProjects] = useState([]); // name suggestions
  const [newFiles, setNewFiles] = useState([]); // files picked now (many)
  const [existingFiles, setExistingFiles] = useState([]); // files already on server (edit mode)
  const [removedIds, setRemovedIds] = useState([]); // server files marked for removal
  const [editingProject, setEditingProject] = useState(null); // { messageId, projectId, date } | null

  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const imageInputRef = useRef(null);

  const patchMessage = (id, patch) =>
    setMessages((prev) => prev.map((item) => (item.id === id ? { ...item, ...patch } : item)));

  /* ---------------------------------------------------------
   * MY ID
   * --------------------------------------------------------- */

  useEffect(() => {
    getMyProfile()
      .then((p) => setMyId(p.id ?? p.userId))
      .catch((e) => console.error("Profile error:", e));
  }, []);

  /* ---------------------------------------------------------
   * LOAD HISTORY + POLL EVERY 5s
   * --------------------------------------------------------- */

  useEffect(() => {
    if (!chat?.id || myId == null) return;
    let cancelled = false;

    const load = async () => {
      try {
        const list = await messagesApi.getChatMessages(chat.id);
        if (!cancelled) setMessages(sortAsc(list.map((m) => mapMessage(m, myId))));
      } catch (e) {
        console.error("Load messages error:", e);
      }
    };

    load();
    const timer = setInterval(load, 5000);
    return () => {
      cancelled = true;
      clearInterval(timer);
    };
  }, [chat?.id, myId]);

  /* ---------------------------------------------------------
   * AUTO SCROLL (only when a message is added, not on every poll)
   * --------------------------------------------------------- */

  const lastId = messages[messages.length - 1]?.id;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [lastId, messages.length]);

  /* ---------------------------------------------------------
   * SEND / EDIT
   * --------------------------------------------------------- */

  const sendText = async (text) => {
    const sent = await messagesApi.sendMessage(chat.id, text);
    setMessages((prev) => sortAsc([...prev, mapMessage(sent, myId)]));
  };

  const sendMessage = async () => {
    const text = message.trim();
    if (!text) return;
    if (editingId) return saveEdit(text);

    try {
      await sendText(text);
      setMessage("");
    } catch (e) {
      console.error("Send error:", e);
      alert("Failed to send message.");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
    if (e.key === "Escape" && editingId) cancelEdit();
  };

  // project cards open the project modal, normal text goes to the input box
  const startEdit = (msg) => {
    if (msg.text.startsWith("📁 Project:")) {
      openProjectEdit(msg);
      return;
    }
    setEditingId(msg.id);
    setMessage(msg.text);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setMessage("");
  };

  const saveEdit = async (text) => {
    const id = editingId;
    const original = messages.find((m) => m.id === id);
    if (!original || text === original.text) return cancelEdit();

    try {
      await messagesApi.editMessage(id, text);
      patchMessage(id, { text, edited: true });
    } catch (e) {
      console.error("Edit error:", e);
      alert("Failed to edit message.");
    }
    cancelEdit();
  };

  /* ---------------------------------------------------------
   * DELETE / PIN / STAR / REACT / FORWARD
   * --------------------------------------------------------- */

  const deleteMessage = async (msg) => {
    try {
      await messagesApi.deleteMessage(msg.id);
      setMessages((prev) => prev.filter((m) => m.id !== msg.id));
      if (editingId === msg.id) cancelEdit();
    } catch (e) {
      console.error("Delete error:", e);
      alert("Failed to delete message.");
    }
  };

  const togglePinMessage = async (msg) => {
    try {
      await messagesApi.togglePinMessage(msg.id);
      patchMessage(msg.id, { pinned: !msg.pinned });
    } catch (e) {
      console.error("Pin error:", e);
    }
  };

  const toggleStarMessage = async (msg) => {
    try {
      await messagesApi.toggleStarMessage(msg.id);
      patchMessage(msg.id, { starred: !msg.starred });
    } catch (e) {
      console.error("Star error:", e);
    }
  };

  const reactToMessage = async (msg, emoji) => {
    setReactionPickerId(null);
    try {
      const updated = await messagesApi.reactToMessage(msg.id, emoji);
      if (updated?.reactions) {
        patchMessage(msg.id, { reactions: mapReactions(updated.reactions) });
      } else {
        const found = msg.reactions.find((r) => r.emoji === emoji);
        patchMessage(msg.id, {
          reactions: found
            ? msg.reactions.map((r) => (r.emoji === emoji ? { ...r, count: r.count + 1 } : r))
            : [...msg.reactions, { emoji, count: 1 }],
        });
      }
    } catch (e) {
      console.error("React error:", e);
    }
  };

  const submitForward = async () => {
    if (!forwardTo.trim()) {
      alert("Please enter the target chat ID.");
      return;
    }
    try {
      await messagesApi.forwardMessage(forwardMsg.id, forwardTo.trim());
      alert("Message forwarded.");
      setForwardMsg(null);
      setForwardTo("");
    } catch (e) {
      console.error("Forward error:", e);
      alert("Failed to forward message.");
    }
  };

  const openPanel = (type) => {
    setShowMenu(false);
    setPanel(type);
  };

  /* ---------------------------------------------------------
   * ATTACHMENTS (files, images)
   * --------------------------------------------------------- */

  const uploadAndSend = async (file, kind) => {
    setUploading(true);
    try {
      const res = await attachmentsApi.uploadFile(file, chat.id);
      console.log("upload response:", res);
      const url =
        res?.url ?? res?.fileUrl ?? res?.filePath ?? res?.path ??
        (typeof res === "string" ? res : "");
      await sendText(`[[${kind}:${url}|${file.name}]]`);
    } catch (e) {
      console.error("Upload error:", e);
      alert(`Failed to upload file: ${e.message}`);
    } finally {
      setUploading(false);
    }
  };

  const handleFileClick = () => {
    setShowAttachmentMenu(false);
    fileInputRef.current?.click();
  };

  const handleImageClick = () => {
    setShowAttachmentMenu(false);
    imageInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (file) uploadAndSend(file, "file");
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (file) uploadAndSend(file, "img");
  };

  /* ---------------------------------------------------------
   * PROJECT FILES (add many files / edit: add + remove)
   * --------------------------------------------------------- */

  const resetProjectForm = () => {
    setProjectName("");
    setNewFiles([]);
    setExistingFiles([]);
    setRemovedIds([]);
    setEditingProject(null);
  };

  const closeProjectModal = () => {
    setShowProjectModal(false);
    resetProjectForm();
  };

  // "Project File" from the attach menu -> NEW project
  const handleProject = () => {
    setShowAttachmentMenu(false);
    resetProjectForm();
    setShowProjectModal(true);

    attachmentsApi
      .getMyProjects()
      .then(setExistingProjects)
      .catch((e) => console.error("Projects load error:", e));
  };

  // pencil on a project card -> EDIT project
  const openProjectEdit = async (msg) => {
    const p = parseProjectText(msg.text);
    resetProjectForm();
    setProjectName(p.name);
    setEditingProject({ messageId: msg.id, projectId: p.projectId, date: p.date });
    setShowProjectModal(true);

    try {
      let pid = p.projectId;

      // old cards have no "🆔 ID" line -> find the project by its name
      if (pid == null) {
        const list = await attachmentsApi.getMyProjects();
        setExistingProjects(list);
        pid = list.find((x) => (x.name ?? x.projectName ?? x.title) === p.name)?.id;
        if (pid != null) setEditingProject((prev) => ({ ...prev, projectId: pid }));
      }

      if (pid != null) {
        const data = await attachmentsApi.getProject(pid);
        setExistingFiles(toFiles(data));
      }
    } catch (e) {
      console.error("Project load error:", e);
    }
  };

  // multiple files, can be picked in several rounds
  const handlePickFiles = (e) => {
    const picked = Array.from(e.target.files || []);
    e.target.value = ""; // so the same file can be picked again later
    setNewFiles((prev) => [
      ...prev,
      ...picked.filter((f) => !prev.some((x) => x.name === f.name && x.size === f.size)),
    ]);
  };

  const handleProjectSubmit = async () => {
    const name = projectName.trim();
    if (!name) {
      alert("Please enter project name.");
      return;
    }

    setUploading(true);
    try {
      let projectId = editingProject?.projectId;

      // 1) delete the files marked for removal
      if (removedIds.length) {
        if (projectId == null) throw new Error("Project id not found, cannot remove files.");
        for (const id of removedIds) {
          await attachmentsApi.deleteProjectFile(projectId, id);
        }
      }

      // 2) upload all new files in ONE request
      if (newFiles.length) {
        const res = await attachmentsApi.uploadToProject({
          projectName: name,
          files: newFiles,
          chatId: chat.id,
          projectId,
        });
        console.log("project upload response:", res);
        projectId = projectId ?? res?.id ?? res?.projectId ?? res?.project?.id;
      }

      // 3) card text with the final file list
      const kept = existingFiles.filter((f) => !removedIds.includes(fId(f))).map(fName);
      const text = buildProjectText({
        name,
        date: editingProject?.date,
        projectId,
        fileNames: [...kept, ...newFiles.map((f) => f.name)],
      });

      if (editingProject) {
        await messagesApi.editMessage(editingProject.messageId, text);
        patchMessage(editingProject.messageId, { text, edited: true });
      } else {
        await sendText(text);
      }

      closeProjectModal();
    } catch (e) {
      console.error("Project error:", e);
      alert(`Failed to save project: ${e.message}`);
    } finally {
      setUploading(false);
    }
  };

  /* ---------------------------------------------------------
   * RENDER HELPERS
   * --------------------------------------------------------- */

  const renderMessageText = (text) => {
    if (!text) return null;

    // image / file attachment
    const a = text.match(ATTACH_RE);
    if (a) {
      const [, kind, url, name] = a;
      const href = toUrl(url);

      if (kind === "img") {
        return (
          <div style={{ ...cardBox, padding: 8 }}>
            <a href={href} target="_blank" rel="noopener noreferrer">
              <img
                src={href}
                alt={name}
                style={{ display: "block", width: "100%", maxHeight: 180, objectFit: "cover", borderRadius: 8 }}
              />
            </a>
            <div style={{ padding: "8px 4px 2px", fontSize: 12, fontWeight: 600, wordBreak: "break-word" }}>
              {name}
            </div>
          </div>
        );
      }

      return (
        <div style={cardBox}>
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "10px 12px",
              textDecoration: "none",
              color: "#222",
              borderBottom: "1px solid #eee",
            }}
          >
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 10,
                background: "#FFF1E6",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <FileText size={20} color="#F4712B" />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 700, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {baseName(url) || name}
              </div>
              <div style={{ fontSize: 10, color: "#8a8a8a", marginTop: 2, letterSpacing: 0.3 }}>
                {fileExt(name)} · CLICK TO OPEN
              </div>
            </div>
            <Download size={18} color="#777" style={{ flexShrink: 0 }} />
          </a>
          <div style={{ padding: "8px 12px 10px", fontSize: 12, fontWeight: 400, wordBreak: "break-all" }}>
            {name}
          </div>
        </div>
      );
    }

    // project card (shows ALL files)
    if (text.startsWith("📁 Project:")) {
      const { name: pName, date, files } = parseProjectText(text);
      return (
        <div style={{ ...cardBox, padding: 8 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: 8,
              borderBottom: files.length ? "1px solid #eee" : "none",
            }}
          >
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 10,
                background: "#E6F6EF",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <FolderOpen size={20} color="#2F9E75" />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {pName}
              </div>
              <div style={{ fontSize: 10, color: "#888", marginTop: 2 }}>
                PROJECT{date ? ` · ${date}` : ""} · {files.length} file{files.length === 1 ? "" : "s"}
              </div>
            </div>
          </div>
          {files.map((f, i) => (
            <div key={i} style={{ padding: "6px 8px 0", fontSize: 12, wordBreak: "break-all" }}>
              📎 {f}
            </div>
          ))}
        </div>
      );
    }

    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.split(urlRegex).map((part, index) =>
      /^https?:\/\//.test(part) ? (
        <a
          key={index}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "#F4712B", textDecoration: "underline", wordBreak: "break-all" }}
        >
          {part}
        </a>
      ) : (
        <span key={index}>{part}</span>
      )
    );
  };

  const getInitial = () => chat?.name?.charAt(0)?.toUpperCase() || "U";

  const panelList = panel === "starred" ? starredMessages : pinnedMessages;

  /* ---------------------------------------------------------
   * RENDER
   * --------------------------------------------------------- */

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", background: "#fff", position: "relative" }}>
      {/* ================= HEADER ================= */}
      <div
        style={{
          height: "65px",
          minHeight: "65px",
          display: "flex",
          alignItems: "center",
          padding: "0 18px",
          borderBottom: "1px solid #e5e7eb",
          background: "#fff",
        }}
      >
        <button
          onClick={onBack}
          style={{ border: "none", background: "transparent", cursor: "pointer", marginRight: "12px", display: "flex", alignItems: "center", justifyContent: "center" }}
        >
          <ArrowLeft size={21} color="#333" />
        </button>

        <div
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            background: "#F4712B",
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: "600",
            marginRight: "10px",
          }}
        >
          {getInitial()}
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: "15px", fontWeight: "600", color: "#222" }}>{chat?.name || "Chat"}</div>
          <div style={{ fontSize: "12px", color: uploading ? "#F4712B" : "#888" }}>
            {uploading ? "Uploading..." : chat?.type === "group" ? "Group" : "Online"}
          </div>
        </div>

        <button onClick={() => setShowSearch(true)} style={{ border: "none", background: "transparent", cursor: "pointer", padding: "8px" }}>
          <SearchIcon size={20} color="#555" />
        </button>

        <div style={{ position: "relative" }}>
          <button
            onClick={() => setShowMenu((p) => !p)}
            style={{ border: "none", background: "transparent", cursor: "pointer", padding: "8px" }}
          >
            <MoreVertical size={20} color="#555" />
          </button>

          {showMenu && (
            <div
              style={{
                position: "absolute",
                right: 0,
                top: "40px",
                background: "#fff",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
                boxShadow: "0 4px 14px rgba(0,0,0,0.12)",
                zIndex: 50,
                minWidth: "170px",
                overflow: "hidden",
              }}
            >
              {[
                { key: "starred", label: "Starred messages", icon: <Star size={15} color="#555" /> },
                { key: "pinned", label: "Pinned messages", icon: <Pin size={15} color="#555" /> },
              ].map((item) => (
                <button
                  key={item.key}
                  onClick={() => openPanel(item.key)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    width: "100%",
                    padding: "10px 14px",
                    border: "none",
                    background: "#fff",
                    cursor: "pointer",
                    fontSize: "13px",
                    textAlign: "left",
                  }}
                >
                  {item.icon}
                  {item.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ================= SEARCH ================= */}
      {showSearch && (
        <Search chatId={chat?.id} contactName={chat?.name} onClose={() => setShowSearch(false)} />
      )}

      {/* ================= PINNED BANNER ================= */}
      {pinnedMessages.length > 0 && (
        <div
          onClick={() => openPanel("pinned")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "8px 18px",
            background: "#FFF6EE",
            borderBottom: "1px solid #f3d9c3",
            cursor: "pointer",
            fontSize: "13px",
            color: "#444",
          }}
        >
          <Pin size={14} color="#F4712B" />
          <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1 }}>
            {previewText(pinnedMessages[pinnedMessages.length - 1].text)}
          </span>
          <span style={{ color: "#888", fontSize: "11px" }}>{pinnedMessages.length} pinned</span>
        </div>
      )}

      {/* ================= MESSAGES ================= */}
      <div style={{ flex: 1, overflowY: "auto", padding: "20px", background: "#fafafa" }}>
        {messages.length === 0 && (
          <div style={{ textAlign: "center", color: "#888", fontSize: "13px" }}>No messages yet. Say hi 👋</div>
        )}

        {messages.map((msg) => {
          const isMine = msg.sender === "me";
          const card = isCard(msg.text);

          return (
            <div
              key={msg.id}
              style={{
                display: "flex",
                justifyContent: isMine ? "flex-end" : "flex-start",
                marginBottom: msg.reactions?.length ? "20px" : "12px",
              }}
              onMouseEnter={() => setHoveredMessageId(msg.id)}
              onMouseLeave={() => {
                setHoveredMessageId(null);
                setReactionPickerId(null);
              }}
            >
              <div style={{ position: "relative", maxWidth: "70%" }}>
                {/* Bubble */}
                <div
                  style={{
                    background: card ? "transparent" : isMine ? "#F4712B" : "#FBE4D0",
                    color: card ? "#222" : isMine ? "#fff" : "#222",
                    border: "none",
                    padding: card ? 0 : "10px 13px",
                    borderRadius: isMine ? "14px 14px 3px 14px" : "14px 14px 14px 3px",
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-word",
                    fontSize: "14px",
                    outline: editingId === msg.id ? "2px solid #333" : "none",
                  }}
                >
                  {renderMessageText(msg.text)}

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "flex-end",
                      alignItems: "center",
                      gap: "5px",
                      marginTop: "4px",
                      fontSize: "10px",
                      opacity: 0.8,
                      color: card ? "#888" : "inherit",
                      padding: card ? "0 4px" : 0,
                    }}
                  >
                    {msg.pinned && <Pin size={10} />}
                    {msg.starred && <Star size={10} fill="currentColor" />}
                    {msg.edited && <span>edited</span>}
                    <span>{msg.time}</span>
                    {isMine && <span>{statusTicks(msg.status)}</span>}
                  </div>
                </div>

                {/* Reactions */}
                {msg.reactions?.length > 0 && (
                  <div
                    style={{
                      position: "absolute",
                      bottom: "-14px",
                      [isMine ? "right" : "left"]: "8px",
                      display: "flex",
                      gap: "3px",
                      background: "#fff",
                      border: "1px solid #eee",
                      borderRadius: "10px",
                      padding: "1px 6px",
                      fontSize: "12px",
                      boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
                    }}
                  >
                    {msg.reactions.map((r) => (
                      <span key={r.emoji}>
                        {r.emoji}
                        {r.count > 1 ? ` ${r.count}` : ""}
                      </span>
                    ))}
                  </div>
                )}

                {/* Hover Actions */}
                {hoveredMessageId === msg.id && (
                  <div
                    style={{
                      position: "absolute",
                      top: "-32px",
                      right: isMine ? "0" : "auto",
                      left: isMine ? "auto" : "0",
                      display: "flex",
                      gap: "2px",
                      background: "#fff",
                      border: "1px solid #ddd",
                      borderRadius: "7px",
                      padding: "3px",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                      zIndex: 5,
                    }}
                  >
                    <button onClick={() => setReactionPickerId((p) => (p === msg.id ? null : msg.id))} style={iconBtn} title="React">
                      <Smile size={14} color="#555" />
                    </button>

                    <button onClick={() => toggleStarMessage(msg)} style={iconBtn} title={msg.starred ? "Unstar" : "Star"}>
                      <Star size={14} color={msg.starred ? "#F4712B" : "#555"} fill={msg.starred ? "#F4712B" : "none"} />
                    </button>

                    <button onClick={() => togglePinMessage(msg)} style={iconBtn} title={msg.pinned ? "Unpin" : "Pin"}>
                      <Pin size={14} color={msg.pinned ? "#F4712B" : "#555"} />
                    </button>

                    <button
                      onClick={() => {
                        setForwardMsg(msg);
                        setForwardTo("");
                      }}
                      style={iconBtn}
                      title="Forward"
                    >
                      <Forward size={14} color="#555" />
                    </button>

                    {isMine && (
                      <button onClick={() => startEdit(msg)} style={iconBtn} title="Edit">
                        <Pencil size={14} color="#555" />
                      </button>
                    )}

                    <button onClick={() => deleteMessage(msg)} style={iconBtn} title="Delete">
                      <Trash2 size={14} color="#555" />
                    </button>
                  </div>
                )}

                {/* Reaction picker */}
                {reactionPickerId === msg.id && (
                  <div
                    style={{
                      position: "absolute",
                      top: "-68px",
                      right: isMine ? "0" : "auto",
                      left: isMine ? "auto" : "0",
                      display: "flex",
                      gap: "4px",
                      background: "#fff",
                      border: "1px solid #ddd",
                      borderRadius: "20px",
                      padding: "4px 8px",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
                      zIndex: 6,
                    }}
                  >
                    {EMOJIS.map((emoji) => (
                      <button
                        key={emoji}
                        onClick={() => reactToMessage(msg, emoji)}
                        style={{ border: "none", background: "transparent", cursor: "pointer", fontSize: "18px" }}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        <div ref={messagesEndRef} />
      </div>

      {/* ================= INPUT ================= */}
      <div style={{ position: "relative", borderTop: "1px solid #e5e7eb", background: "#fff", padding: "10px 14px" }}>
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.doc,.docx,.txt,.xls,.xlsx,.ppt,.pptx,.zip,.java,.js,.jsx,.ts,.py,.json,.sql,.xml"
          style={{ display: "none" }}
          onChange={handleFileChange}
        />
        <input ref={imageInputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleImageChange} />

        {/* Editing banner */}
        {editingId && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "6px 10px",
              marginBottom: "8px",
              background: "#FFF6EE",
              borderLeft: "3px solid #F4712B",
              borderRadius: "4px",
              fontSize: "12px",
              color: "#555",
            }}
          >
            <span>Editing message</span>
            <button onClick={cancelEdit} style={iconBtn} title="Cancel edit">
              <X size={14} color="#555" />
            </button>
          </div>
        )}

        {showAttachmentMenu && (
          <div
            style={{
              position: "absolute",
              bottom: "100%",
              left: 14,
              marginBottom: 6,
              background: "#fff",
              border: "1px solid #e5e7eb",
              borderRadius: 12,
              boxShadow: "0 4px 14px rgba(0,0,0,0.12)",
              padding: 6,
              minWidth: 200,
              zIndex: 20,
            }}
          >
            {[
              { onClick: handleFileClick, label: "Document / Code", icon: FileText, color: "#E8590C" },
              { onClick: handleImageClick, label: "Image", icon: ImageIcon, color: "#3B5BDB" },
              { onClick: handleProject, label: "Project File", icon: FolderOpen, color: "#2F9E75" },
            ].map(({ onClick, label, icon: Icon, color }) => (
              <button
                key={label}
                onClick={onClick}
                disabled={uploading}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  width: "100%",
                  padding: "11px 12px",
                  border: "none",
                  background: "transparent",
                  borderRadius: 8,
                  cursor: uploading ? "not-allowed" : "pointer",
                  fontSize: 14,
                  fontWeight: 600,
                  color: "#222",
                  opacity: uploading ? 0.6 : 1,
                }}
              >
                <Icon size={20} color={color} /> {label}
              </button>
            ))}
          </div>
        )}

        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <button
            onClick={() => setShowAttachmentMenu((prev) => !prev)}
            style={{ border: "none", background: "transparent", cursor: "pointer", padding: "8px" }}
            title="Attach"
          >
            <Paperclip size={20} color="#555" />
          </button>

          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={editingId ? "Edit your message..." : "Type a message..."}
            style={{
              flex: 1,
              border: "1px solid #ddd",
              outline: "none",
              borderRadius: "20px",
              padding: "10px 15px",
              fontSize: "14px",
            }}
          />

          <button
            onClick={sendMessage}
            disabled={!message.trim()}
            style={{
              width: "42px",
              height: "42px",
              border: "none",
              borderRadius: "50%",
              background: message.trim() ? "#F4712B" : "#ddd",
              cursor: message.trim() ? "pointer" : "not-allowed",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            title={editingId ? "Save" : "Send"}
          >
            <Send size={18} color="#fff" />
          </button>
        </div>
      </div>

      {/* ================= STARRED / PINNED PANEL ================= */}
      {panel && (
        <div
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            bottom: 0,
            width: "min(340px, 100%)",
            background: "#fff",
            borderLeft: "1px solid #e5e7eb",
            boxShadow: "-4px 0 14px rgba(0,0,0,0.08)",
            display: "flex",
            flexDirection: "column",
            zIndex: 60,
          }}
        >
          <div
            style={{
              height: "65px",
              minHeight: "65px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "0 16px",
              borderBottom: "1px solid #e5e7eb",
              fontWeight: 600,
            }}
          >
            {panel === "starred" ? "Starred messages" : "Pinned messages"}
            <button onClick={() => setPanel(null)} style={iconBtn}>
              <X size={18} color="#555" />
            </button>
          </div>

          <div style={{ flex: 1, overflowY: "auto", padding: "12px" }}>
            {panelList.length === 0 && <div style={{ color: "#888", fontSize: "13px" }}>Nothing here yet.</div>}

            {panelList.map((m) => (
              <div
                key={m.id}
                style={{
                  background: "#FBE4D0",
                  borderRadius: "10px",
                  padding: "10px 12px",
                  marginBottom: "8px",
                  fontSize: "13px",
                  wordBreak: "break-word",
                  whiteSpace: "pre-wrap",
                }}
              >
                {renderMessageText(m.text)}
                <div style={{ fontSize: "10px", color: "#777", marginTop: "4px", textAlign: "right" }}>{m.time}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= FORWARD MODAL ================= */}
      {forwardMsg && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <div style={{ width: "380px", maxWidth: "90%", background: "#fff", borderRadius: "12px", padding: "22px", boxShadow: "0 10px 30px rgba(0,0,0,0.2)" }}>
            <h3 style={{ marginTop: 0, marginBottom: "12px" }}>Forward message</h3>

            <div style={{ background: "#FBE4D0", borderRadius: "8px", padding: "8px 10px", fontSize: "13px", marginBottom: "12px", maxHeight: "80px", overflow: "hidden" }}>
              {previewText(forwardMsg.text)}
            </div>

            <input
              type="text"
              placeholder="Target chat ID"
              value={forwardTo}
              onChange={(e) => setForwardTo(e.target.value)}
              style={{ ...modalInput, marginBottom: "16px" }}
            />

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
              <button
                onClick={() => setForwardMsg(null)}
                style={{ border: "1px solid #ddd", background: "#fff", padding: "9px 16px", borderRadius: "7px", cursor: "pointer" }}
              >
                Cancel
              </button>
              <button
                onClick={submitForward}
                style={{ border: "none", background: "#F4712B", color: "#fff", padding: "9px 16px", borderRadius: "7px", cursor: "pointer" }}
              >
                Forward
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= PROJECT MODAL (add / edit, many files) ================= */}
      {showProjectModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              width: "440px",
              maxWidth: "90%",
              maxHeight: "85vh",
              overflowY: "auto",
              background: "#fff",
              borderRadius: "12px",
              padding: "22px",
              boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
            }}
          >
            <h3 style={{ marginTop: 0, marginBottom: "18px" }}>
              {editingProject ? "Edit Project" : "Add Project"}
            </h3>

            <input
              type="text"
              list="project-names"
              placeholder="Project name"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              style={modalInput}
            />
            <datalist id="project-names">
              {existingProjects.map((p) => {
                const n = p.name ?? p.projectName ?? p.title;
                return n ? <option key={p.id ?? n} value={n} /> : null;
              })}
            </datalist>

            {/* files already saved in the project (edit mode) */}
            {existingFiles.map((f) => {
              const removed = removedIds.includes(fId(f));
              return (
                <div
                  key={fId(f)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "6px 8px",
                    border: "1px solid #eee",
                    borderRadius: 7,
                    marginBottom: 6,
                    fontSize: 13,
                    opacity: removed ? 0.5 : 1,
                  }}
                >
                  <FileText size={16} color="#F4712B" />
                  <span style={{ flex: 1, wordBreak: "break-all", textDecoration: removed ? "line-through" : "none" }}>
                    {fName(f)}
                  </span>
                  {removed ? (
                    <button
                      onClick={() => setRemovedIds((prev) => prev.filter((id) => id !== fId(f)))}
                      style={{ ...iconBtn, fontSize: 12, color: "#F4712B" }}
                    >
                      Undo
                    </button>
                  ) : (
                    <button onClick={() => setRemovedIds((prev) => [...prev, fId(f)])} style={iconBtn} title="Remove file">
                      <X size={15} color="#c0392b" />
                    </button>
                  )}
                </div>
              );
            })}

            {/* newly picked files */}
            {newFiles.map((f, i) => (
              <div
                key={`${f.name}-${i}`}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "6px 8px",
                  border: "1px solid #cfeedd",
                  background: "#F6FFF9",
                  borderRadius: 7,
                  marginBottom: 6,
                  fontSize: 13,
                }}
              >
                <FileText size={16} color="#2F9E75" />
                <span style={{ flex: 1, wordBreak: "break-all" }}>{f.name}</span>
                <button
                  onClick={() => setNewFiles((prev) => prev.filter((_, idx) => idx !== i))}
                  style={iconBtn}
                  title="Remove"
                >
                  <X size={15} color="#c0392b" />
                </button>
              </div>
            ))}

            <input
              type="file"
              multiple
              onChange={handlePickFiles}
              style={{ width: "100%", margin: "6px 0 18px" }}
            />

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
              <button
                onClick={closeProjectModal}
                disabled={uploading}
                style={{ border: "1px solid #ddd", background: "#fff", padding: "9px 16px", borderRadius: "7px", cursor: "pointer" }}
              >
                Cancel
              </button>
              <button
                onClick={handleProjectSubmit}
                disabled={uploading}
                style={{
                  border: "none",
                  background: "#F4712B",
                  color: "#fff",
                  padding: "9px 16px",
                  borderRadius: "7px",
                  cursor: uploading ? "not-allowed" : "pointer",
                  opacity: uploading ? 0.7 : 1,
                }}
              >
                {uploading ? "Saving..." : editingProject ? "Save" : "Add Project"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default OnetoOneView;