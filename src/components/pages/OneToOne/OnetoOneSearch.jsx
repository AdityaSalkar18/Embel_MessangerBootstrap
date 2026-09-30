import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  Link as LinkIcon,
  FileText,
  Image as ImageIcon,
  FolderOpen,
  Search as SearchIcon,
} from "lucide-react";
import * as messagesApi from "../../../api/messagesApi";
import * as chatsApi from "../../../api/chatsApi"; // <- adjust to your chats API file name

const URL_REGEX = /https?:\/\/[^\s]+/g;

const TABS = [
  { key: "links", label: "Links" },
  { key: "files", label: "Files" },
  { key: "media", label: "Media" },
  { key: "projects", label: "Project Files" },
];

const dayKey = (d) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

const fmtDate = (d) =>
  d ? d.toLocaleDateString([], { day: "2-digit", month: "short", year: "numeric" }) : "";

const matchesDate = (date, dateFilter, specificDate) => {
  if (specificDate) return !!date && dayKey(date) === specificDate;
  if (dateFilter === "all") return true;
  if (!date) return false;

  const now = new Date();
  if (dateFilter === "today") return dayKey(date) === dayKey(now);
  if (dateFilter === "week") return now - date <= 7 * 24 * 60 * 60 * 1000;
  if (dateFilter === "month")
    return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
  return true;
};

// Turns raw messages into links / files / media / projects
const buildItems = (messages) => {
  const out = { links: [], files: [], media: [], projects: [] };

  messages.forEach((m) => {
    const id = m.id ?? m.messageId;
    const text = m.content ?? m.text ?? "";
    const raw = m.createdAt ?? m.sentAt ?? m.timestamp;
    const date = raw ? new Date(raw) : null;
    const validDate = date && !isNaN(date) ? date : null;
    const sender = m.senderName ?? m.sender?.name ?? m.sender?.fullName ?? m.sender?.username ?? "";
    const base = { date: validDate, sender };

    if (text.startsWith("📁 Project:")) {
      const line = (prefix) =>
        text.split("\n").find((l) => l.startsWith(prefix))?.slice(prefix.length).trim() || "";
      out.projects.push({
        ...base,
        id,
        projectName: line("📁 Project:"),
        fileName: line("📎 File:"),
        projectDate: line("📅 Date:"),
      });
      return;
    }

    if (text.startsWith("📎 File attached:")) {
      out.files.push({ ...base, id, name: text.replace("📎 File attached:", "").trim() });
      return;
    }

    if (text.startsWith("🖼️ Image attached:")) {
      out.media.push({ ...base, id, name: text.replace("🖼️ Image attached:", "").trim() });
      return;
    }

    (text.match(URL_REGEX) || []).forEach((url, i) => {
      const title = text.replace(URL_REGEX, "").replace("🔗", "").trim();
      out.links.push({ ...base, id: `${id}-${i}`, title: title || url, url });
    });
  });

  return out;
};

const card = {
  borderRadius: "10px",
  border: "1px solid #F1E7DC",
  backgroundColor: "#FFFFFF",
};

const titleStyle = { fontSize: "12px", fontWeight: "500", color: "#1E2328" };
const iconStyle = { color: "#F4712B", flexShrink: 0 };

// Contact name: prefer the prop, fall back to whatever the chats API returns
const contactNameOf = (chat) =>
  chat?.name ??
  chat?.title ??
  chat?.otherUser?.name ??
  chat?.otherUser?.fullName ??
  chat?.targetUser?.name ??
  chat?.targetUser?.fullName ??
  chat?.user?.name ??
  "";

function OnetoOneSearch({ chatId, contactName = "", onClose }) {
  const [searchTab, setSearchTab] = useState("links");
  const [dateFilter, setDateFilter] = useState("all");
  const [specificDate, setSpecificDate] = useState("");
  const [keyword, setKeyword] = useState("");
  const [messages, setMessages] = useState([]);
  const [chatName, setChatName] = useState(contactName);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (chatId == null) return;
    let cancelled = false;

    (async () => {
      try {
        setLoading(true);
        setError("");

        // GET /api/messages/chat/{chatId}  +  GET /api/chats/{chatId}
        const [list, chat] = await Promise.all([
          messagesApi.getChatMessages(chatId),
          contactName ? Promise.resolve(null) : chatsApi.getChat(chatId).catch(() => null),
        ]);

        if (cancelled) return;
        setMessages(list);
        if (!contactName && chat) setChatName(contactNameOf(chat));
      } catch (e) {
        console.error("One-to-one search load error:", e);
        if (!cancelled) setError("Unable to load chat data");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [chatId, contactName]);

  const items = useMemo(() => buildItems(messages), [messages]);

  const term = keyword.trim().toLowerCase();

  const activeData = items[searchTab].filter((item) => {
    if (!matchesDate(item.date, dateFilter, specificDate)) return false;
    if (!term) return true;
    const haystack = [item.title, item.url, item.name, item.projectName, item.fileName, item.sender]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();
    return haystack.includes(term);
  });

  const meta = (item) => [item.sender, fmtDate(item.date)].filter(Boolean).join(" • ");

  const showList = !loading && !error;

  return (
    <div
      className="position-absolute d-flex flex-column"
      style={{ top: 0, left: 0, right: 0, bottom: 0, zIndex: 1060, backgroundColor: "#FCFBF8" }}
    >
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

        <div style={{ minWidth: 0 }}>
          <div className="fw-semibold" style={{ fontSize: "13px" }}>
            Search & Filters
          </div>
          {chatName && (
            <div className="text-truncate" style={{ fontSize: "10px", opacity: 0.7 }}>
              {chatName}
            </div>
          )}
        </div>
      </div>

      {/* TABS */}
      <div
        className="d-flex px-2 pt-2"
        style={{ backgroundColor: "#FFFFFF", borderBottom: "1px solid #F1E7DC", gap: "2px" }}
      >
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => {
              setSearchTab(tab.key);
              setSpecificDate("");
            }}
            className="btn border-0"
            style={{
              flex: 1,
              fontSize: "11px",
              fontWeight: searchTab === tab.key ? "600" : "400",
              color: searchTab === tab.key ? "#F4712B" : "#8A7C6F",
              borderBottom: searchTab === tab.key ? "2px solid #F4712B" : "2px solid transparent",
              borderRadius: 0,
              paddingBottom: "8px",
              paddingLeft: "2px",
              paddingRight: "2px",
              whiteSpace: "nowrap",
            }}
          >
            {tab.label} ({items[tab.key].length})
          </button>
        ))}
      </div>

      {/* KEYWORD */}
      <div className="px-3 pt-2" style={{ backgroundColor: "#FFFFFF" }}>
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
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="form-control"
            placeholder="Search in this tab..."
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

      {/* DATE FILTER */}
      <div
        className="d-flex align-items-center px-3 py-2"
        style={{ backgroundColor: "#FFFFFF", borderBottom: "1px solid #F1E7DC", gap: "8px" }}
      >
        <select
          value={dateFilter}
          onChange={(e) => {
            setDateFilter(e.target.value);
            setSpecificDate("");
          }}
          className="form-select"
          style={{
            flex: 1,
            border: "1px solid #F1E7DC",
            borderRadius: "8px",
            boxShadow: "none",
            fontSize: "12px",
            height: "32px",
            padding: "2px 8px",
            color: "#1E2328",
            backgroundColor: "#FFF8F3",
          }}
        >
          <option value="all">All Time</option>
          <option value="today">Today</option>
          <option value="week">Last 7 Days</option>
          <option value="month">This Month</option>
        </select>

        <div style={{ width: "135px", flexShrink: 0 }}>
          <input
            type="date"
            value={specificDate}
            onChange={(e) => {
              setSpecificDate(e.target.value);
              if (e.target.value) setDateFilter("all");
            }}
            className="form-control"
            title="Select specific date"
            style={{
              width: "100%",
              height: "32px",
              border: "1px solid #F1E7DC",
              borderRadius: "8px",
              boxShadow: "none",
              fontSize: "11px",
              padding: "2px 6px",
              color: "#1E2328",
              backgroundColor: "#FFF8F3",
            }}
          />
        </div>
      </div>

      {/* RESULTS */}
      <div className="flex-grow-1 px-3 py-2" style={{ overflowY: "auto" }}>
        {loading && (
          <div className="text-center pt-4" style={{ fontSize: "12px", color: "#8A7C6F" }}>
            Loading...
          </div>
        )}

        {!loading && error && (
          <div className="text-center pt-4" style={{ fontSize: "12px", color: "#D9534F" }}>
            {error}
          </div>
        )}

        {showList && activeData.length === 0 && (
          <div className="text-center pt-4" style={{ fontSize: "12px", color: "#8A7C6F" }}>
            No results found
          </div>
        )}

        {/* LINKS */}
        {showList &&
          searchTab === "links" &&
          activeData.map((item) => (
            <div key={item.id} className="d-flex align-items-center gap-2 p-2 mb-1" style={card}>
              <LinkIcon size={18} strokeWidth={2} style={iconStyle} />
              <div style={{ minWidth: 0 }}>
                <div className="text-truncate" style={titleStyle}>
                  {item.title}
                </div>
                <div className="text-truncate" style={{ fontSize: "10px" }}>
                  <a href={item.url} target="_blank" rel="noreferrer" style={{ color: "#F4712B" }}>
                    {item.url}
                  </a>
                </div>
                <div style={{ fontSize: "9px", color: "#8A7C6F" }}>{meta(item)}</div>
              </div>
            </div>
          ))}

        {/* FILES + MEDIA */}
        {showList &&
          (searchTab === "files" || searchTab === "media") &&
          activeData.map((item) => {
            const Icon = searchTab === "files" ? FileText : ImageIcon;
            return (
              <div key={item.id} className="d-flex align-items-center gap-2 p-2 mb-1" style={card}>
                <Icon size={18} strokeWidth={2} style={iconStyle} />
                <div style={{ minWidth: 0 }}>
                  <div className="text-truncate" style={titleStyle}>
                    {item.name}
                  </div>
                  <div style={{ fontSize: "10px", color: "#8A7C6F" }}>{meta(item)}</div>
                </div>
              </div>
            );
          })}

        {/* PROJECT FILES */}
        {showList &&
          searchTab === "projects" &&
          activeData.map((item) => (
            <div key={item.id} className="d-flex align-items-center gap-2 p-2 mb-1" style={card}>
              <FolderOpen size={18} strokeWidth={2} style={iconStyle} />
              <div style={{ minWidth: 0, flexGrow: 1 }}>
                <div className="text-truncate" style={{ ...titleStyle, fontWeight: "600" }}>
                  {item.projectName}
                </div>
                {item.fileName && (
                  <div className="text-truncate" style={{ fontSize: "10px", color: "#F4712B" }}>
                    {item.fileName}
                  </div>
                )}
                <div style={{ fontSize: "9px", color: "#8A7C6F", marginTop: "2px" }}>
                  {[item.projectDate && `Due ${item.projectDate}`, meta(item)].filter(Boolean).join(" • ")}
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

export default OnetoOneSearch;