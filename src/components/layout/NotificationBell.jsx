import { Bell, CheckCheck } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import {
  getMyNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
} from "../../api/notificationsApi";

const isRead = (n) => n.read ?? n.isRead ?? false;

const timeAgo = (v) => {
  const t = new Date(v).getTime();
  if (!t) return "";
  const m = Math.floor((Date.now() - t) / 60000);
  if (m < 1) return "now";
  if (m < 60) return `${m}m`;
  if (m < 1440) return `${Math.floor(m / 60)}h`;
  return `${Math.floor(m / 1440)}d`;
};

function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [count, setCount] = useState(0);
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadCount = useCallback(async () => {
    try {
      setCount(await getUnreadCount());
    } catch (e) {
      console.error("Unread count error:", e);
    }
  }, []);

  const loadList = useCallback(async () => {
    setLoading(true);
    try {
      setList(await getMyNotifications());
    } catch (e) {
      console.error("Load notifications error:", e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCount();
    const timer = setInterval(loadCount, 10000);
    return () => clearInterval(timer);
  }, [loadCount]);

  const toggle = () => {
    if (!open) loadList();
    setOpen((o) => !o);
  };

  const readOne = async (n) => {
    if (isRead(n)) return;
    setList((prev) => prev.map((x) => (x.id === n.id ? { ...x, read: true, isRead: true } : x)));
    setCount((c) => Math.max(0, c - 1));
    try {
      await markAsRead(n.id);
    } catch (e) {
      console.error("Mark read error:", e);
      loadList();
      loadCount();
    }
  };

  const readAll = async () => {
    try {
      await markAllAsRead();
      setList((prev) => prev.map((x) => ({ ...x, read: true, isRead: true })));
      setCount(0);
    } catch (e) {
      alert("Failed to mark all as read.");
    }
  };

  return (
    <div className="position-relative">
      <button
        className="btn border-0 p-1 position-relative"
        onClick={toggle}
        aria-label="Notifications"
      >
        <Bell size={18} color="#1E2328" />
        {count > 0 && (
          <span
            className="position-absolute d-flex align-items-center justify-content-center"
            style={{
              top: -2,
              right: -2,
              minWidth: 16,
              height: 16,
              padding: "0 4px",
              borderRadius: 8,
              backgroundColor: "#F4712B",
              color: "#FFF",
              fontSize: 9,
              fontWeight: 600,
            }}
          >
            {count > 99 ? "99+" : count}
          </span>
        )}
      </button>

      {open && (
        <>
          <div onClick={() => setOpen(false)} style={{ position: "fixed", inset: 0, zIndex: 25 }} />
          <div
            className="position-absolute bg-white shadow-sm"
            style={{
              right: 0,
              top: 32,
              zIndex: 30,
              width: 290,
              maxWidth: "calc(100vw - 30px)",
              borderRadius: 12,
              border: "1px solid #F1E7DC",
              overflow: "hidden",
            }}
          >
            <div
              className="d-flex align-items-center justify-content-between px-3 py-2"
              style={{ borderBottom: "1px solid #F1E7DC" }}
            >
              <div className="fw-semibold" style={{ fontSize: 13, color: "#1E2328" }}>
                Notifications
              </div>
              {count > 0 && (
                <button
                  className="btn btn-sm border-0 d-flex align-items-center gap-1 p-0"
                  onClick={readAll}
                  style={{ color: "#F4712B", fontSize: 11 }}
                >
                  <CheckCheck size={13} />
                  Mark all read
                </button>
              )}
            </div>

            <div style={{ maxHeight: 320, overflowY: "auto" }}>
              {loading && (
                <div className="text-center py-3" style={{ fontSize: 12, color: "#8A7C6F" }}>
                  Loading...
                </div>
              )}

              {!loading && list.length === 0 && (
                <div className="text-center py-3" style={{ fontSize: 12, color: "#8A7C6F" }}>
                  No notifications
                </div>
              )}

              {!loading &&
                list.map((n) => (
                  <div
                    key={n.id}
                    onClick={() => readOne(n)}
                    className="d-flex gap-2 px-3 py-2"
                    style={{
                      cursor: "pointer",
                      backgroundColor: isRead(n) ? "#FFFFFF" : "#FFF8F3",
                      borderBottom: "1px solid #F8F1E9",
                    }}
                  >
                    <span
                      style={{
                        width: 7,
                        height: 7,
                        minWidth: 7,
                        marginTop: 6,
                        borderRadius: "50%",
                        backgroundColor: isRead(n) ? "transparent" : "#F4712B",
                      }}
                    />
                    <div className="flex-grow-1" style={{ minWidth: 0 }}>
                      {n.title && (
                        <div className="fw-medium text-truncate" style={{ fontSize: 12, color: "#1E2328" }}>
                          {n.title}
                        </div>
                      )}
                      <div style={{ fontSize: 11, color: "#8A7C6F" }}>
                        {n.message ?? n.content ?? n.body}
                      </div>
                    </div>
                    <small style={{ fontSize: 10, color: "#B9AFA5", flexShrink: 0 }}>
                      {timeAgo(n.createdAt ?? n.timestamp)}
                    </small>
                  </div>
                ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default NotificationBell;