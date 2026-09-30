


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

import { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  Search as SearchIcon,
  MoreVertical,
  Paperclip,
  Send,
  Pin,
  FileText,
  Image,
  FolderOpen,
  Link,
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
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [projectDate, setProjectDate] = useState("");
  const [projectFile, setProjectFile] = useState(null);
  const [existingProjects, setExistingProjects] = useState([]);
  const [uploading, setUploading] = useState(false);

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

  // persists a message on the server and appends it to the bottom of the list
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

  const startEdit = (msg) => {
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
   * ATTACHMENTS (files, images, links, projects)
   * --------------------------------------------------------- */

  // POST /api/attachments/upload, then persist a chat message
  const uploadAndSend = async (file, prefix) => {
    setUploading(true);
    try {
      await attachmentsApi.uploadFile(file, chat.id);
      await sendText(`${prefix} ${file.name}`);
    } catch (e) {
      console.error("Upload error:", e);
      alert("Failed to upload file.");
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
    if (file) uploadAndSend(file, "📎 File attached:");
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (file) uploadAndSend(file, "🖼️ Image attached:");
  };

  const handleLink = async () => {
    setShowAttachmentMenu(false);
    const url = window.prompt("Enter link:");
    if (!url) return;
    try {
      await sendText(`🔗 ${url}`);
    } catch (e) {
      console.error("Link error:", e);
      alert("Failed to send link.");
    }
  };

  const handleProject = () => {
    setShowAttachmentMenu(false);
    setProjectName("");
    setProjectDate("");
    setProjectFile(null);
    setShowProjectModal(true);

    // GET /api/attachments/projects -> suggestions for the name field
    attachmentsApi
      .getMyProjects()
      .then(setExistingProjects)
      .catch((e) => console.error("Projects load error:", e));
  };

  const handleProjectSubmit = async () => {
    const name = projectName.trim();
    if (!name) {
      alert("Please enter project name.");
      return;
    }

    setUploading(true);
    try {
      // POST /api/attachments/projects/upload (only when a file was chosen)
      if (projectFile) {
        await attachmentsApi.uploadToProject({
          projectName: name,
          files: [projectFile],
          chatId: chat.id,
          dueDate: projectDate,
        });
      }

      let text = `📁 Project: ${name}`;
      if (projectDate) text += `\n📅 Date: ${projectDate}`;
      if (projectFile) text += `\n📎 File: ${projectFile.name}`;
      await sendText(text);

      setShowProjectModal(false);
      setProjectName("");
      setProjectDate("");
      setProjectFile(null);
    } catch (e) {
      console.error("Project error:", e);
      alert("Failed to add project.");
    } finally {
      setUploading(false);
    }
  };

  /* ---------------------------------------------------------
   * RENDER HELPERS
   * --------------------------------------------------------- */

  const renderMessageText = (text) => {
    if (!text) return null;
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

  const iconBtn = {
    border: "none",
    background: "transparent",
    cursor: "pointer",
    padding: "4px",
  };

  const modalInput = {
    width: "100%",
    padding: "10px",
    border: "1px solid #ddd",
    borderRadius: "7px",
    marginBottom: "10px",
    boxSizing: "border-box",
  };

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
          <div style={{ fontSize: "12px", color: "#888" }}>
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
            {pinnedMessages[pinnedMessages.length - 1].text}
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
                    background: isMine ? "#F4712B" : "#FBE4D0",
                    color: isMine ? "#fff" : "#222",
                    padding: "10px 13px",
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
      <div style={{ borderTop: "1px solid #e5e7eb", background: "#fff", padding: "10px 14px" }}>
        <input ref={fileInputRef} type="file" style={{ display: "none" }} onChange={handleFileChange} />
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
              display: "flex",
              gap: "8px",
              padding: "8px",
              marginBottom: "8px",
              background: "#fff",
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
              width: "fit-content",
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
            }}
          >
            {[
              { onClick: handleFileClick, title: "File", icon: FileText },
              { onClick: handleImageClick, title: "Image", icon: Image },
              { onClick: handleProject, title: "Project", icon: FolderOpen },
              { onClick: handleLink, title: "Link", icon: Link },
            ].map(({ onClick, title, icon: Icon }) => (
              <button
                key={title}
                onClick={onClick}
                disabled={uploading}
                style={{
                  border: "none",
                  background: "#FBE4D0",
                  borderRadius: "7px",
                  padding: "8px",
                  cursor: uploading ? "not-allowed" : "pointer",
                  opacity: uploading ? 0.6 : 1,
                }}
                title={title}
              >
                <Icon size={18} color="#F4712B" />
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
            {(panel === "starred" ? starredMessages : pinnedMessages).length === 0 && (
              <div style={{ color: "#888", fontSize: "13px" }}>Nothing here yet.</div>
            )}

            {(panel === "starred" ? starredMessages : pinnedMessages).map((m) => (
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
              {forwardMsg.text}
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

      {/* ================= PROJECT MODAL ================= */}
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
          <div style={{ width: "420px", maxWidth: "90%", background: "#fff", borderRadius: "12px", padding: "22px", boxShadow: "0 10px 30px rgba(0,0,0,0.2)" }}>
            <h3 style={{ marginTop: 0, marginBottom: "18px" }}>Add Project</h3>

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
                const n = p.name ?? p.projectName;
                return n ? <option key={p.id ?? n} value={n} /> : null;
              })}
            </datalist>

            <input
              type="date"
              value={projectDate}
              onChange={(e) => setProjectDate(e.target.value)}
              style={modalInput}
            />

            <input
              type="file"
              onChange={(e) => setProjectFile(e.target.files?.[0] || null)}
              style={{ width: "100%", marginBottom: "18px" }}
            />

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
              <button
                onClick={() => setShowProjectModal(false)}
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
                {uploading ? "Uploading..." : "Add Project"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default OnetoOneView;