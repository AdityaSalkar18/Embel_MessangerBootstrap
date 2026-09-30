import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  Link as LinkIcon,
  FileText,
  Image as ImageIcon,
  FolderOpen,
  Users,
  Search as SearchIcon,
} from "lucide-react";
import * as messagesApi from "../../../api/messagesApi";
import * as groupsApi from "../../../api/groupsApi"; // <- adjust to your groups API file name

const URL_REGEX = /https?:\/\/[^\s]+/g;

const TABS = [
  { key: "links", label: "Links" },
  { key: "files", label: "Files" },
  { key: "media", label: "Media" },
  { key: "projects", label: "Projects" },
  { key: "members", label: "Members" },
];

const COLORS = ["#7C6FE8", "#2E9E6D", "#D9822B", "#E8556D", "#2B8FD9"];

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

// Normalises whatever the members endpoint returns
const mapMember = (m, i) => {
  const name =
    m.name ?? m.fullName ?? m.username ?? m.user?.name ?? m.user?.fullName ?? m.user?.username ?? "Member";
  const role = String(m.role ?? m.user?.role ?? "").toUpperCase();
  const isAdmin = m.isAdmin ?? m.admin ?? role === "ADMIN";
  return {
    id: m.userId ?? m.id ?? m.user?.id ?? i,
    name,
    avatar: name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase(),
    color: m.color || COLORS[name.charCodeAt(0) % COLORS.length],
    role: isAdmin ? "Admin" : "Member",
  };
};

const rowStyle = {
  borderRadius: "10px",
  border: "1px solid #F1E7DC",
  backgroundColor: "#FFFFFF",
};
const titleStyle = { fontSize: "12px", fontWeight: "500", color: "#1E2328" };
const iconStyle = { color: "#F4712B", flexShrink: 0 };

function GroupSearch({ onClose, group }) {
  const [searchTab, setSearchTab] = useState("links");
  const [dateFilter, setDateFilter] = useState("all");
  const [specificDate, setSpecificDate] = useState("");
  const [keyword, setKeyword] = useState("");
  const [messages, setMessages] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // group.chatId -> Messages API, group.id -> Groups API (both come from mapGroup)
  const chatId = group?.chatId ?? group?.id;
  const groupId = group?.id;

  useEffect(() => {
    if (chatId == null) return;
    let cancelled = false;

    (async () => {
      try {
        setLoading(true);
        setError("");

        const [list, memberList] = await Promise.all([
          messagesApi.getChatMessages(chatId),
          groupId != null ? groupsApi.getGroupMembers(groupId) : Promise.resolve([]),
        ]);

        if (cancelled) return;
        setMessages(list);
        setMembers(memberList.map(mapMember));
      } catch (e) {
        console.error("Group search load error:", e);
        if (!cancelled) setError("Unable to load group data");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [chatId, groupId]);

  const items = useMemo(() => buildItems(messages), [messages]);

  const term = keyword.trim().toLowerCase();
  const isMembers = searchTab === "members";

  const activeData = isMembers
    ? members.filter((m) => m.name.toLowerCase().includes(term))
    : items[searchTab].filter((item) => {
        if (!matchesDate(item.date, dateFilter, specificDate)) return false;
        if (!term) return true;
        const haystack = [item.title, item.url, item.name, item.projectName, item.fileName, item.sender]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        return haystack.includes(term);
      });

  const meta = (item) => [item.sender, fmtDate(item.date)].filter(Boolean).join(" • ");
  const countOf = (key) => (key === "members" ? members.length : items[key].length);

  const showList = !loading && !error;

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

        <div style={{ minWidth: 0 }}>
          <div className="fw-semibold" style={{ fontSize: "13px" }}>
            Search & Filters
          </div>
          {group?.name && (
            <div className="text-truncate" style={{ fontSize: "10px", opacity: 0.7 }}>
              {group.name}
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
              setKeyword("");
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
            {tab.label} ({countOf(tab.key)})
          </button>
        ))}
      </div>

      {/* KEYWORD */}
      <div className="px-3 pt-2 pb-2" style={{ backgroundColor: "#FFFFFF" }}>
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
            placeholder={isMembers ? "Search members..." : "Search in this tab..."}
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

      {/* DATE FILTER (not for members) */}
      {!isMembers && (
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
      )}

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
            <div key={item.id} className="d-flex align-items-center gap-2 p-2 mb-1" style={rowStyle}>
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
              <div key={item.id} className="d-flex align-items-center gap-2 p-2 mb-1" style={rowStyle}>
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

        {/* PROJECTS */}
        {showList &&
          searchTab === "projects" &&
          activeData.map((item) => (
            <div key={item.id} className="d-flex align-items-center gap-2 p-2 mb-1" style={rowStyle}>
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

        {/* MEMBERS */}
        {showList && isMembers && (
          <>
            {activeData.length > 0 && (
              <div
                className="d-flex align-items-center gap-1 mb-2"
                style={{ fontSize: "11px", color: "#8A7C6F" }}
              >
                <Users size={12} />
                {activeData.length} member{activeData.length > 1 ? "s" : ""}
              </div>
            )}

            {activeData.map((member) => (
              <div key={member.id} className="d-flex align-items-center gap-2 p-2 mb-1" style={rowStyle}>
                <div
                  className="d-flex align-items-center justify-content-center"
                  style={{
                    width: "34px",
                    height: "34px",
                    minWidth: "34px",
                    borderRadius: "50%",
                    backgroundColor: member.color,
                    color: "#FFFFFF",
                    fontWeight: "600",
                    fontSize: "11px",
                  }}
                >
                  {member.avatar}
                </div>

                <div className="flex-grow-1" style={{ minWidth: 0 }}>
                  <div className="text-truncate" style={titleStyle}>
                    {member.name}
                  </div>
                </div>

                {member.role === "Admin" && (
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
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}

export default GroupSearch;