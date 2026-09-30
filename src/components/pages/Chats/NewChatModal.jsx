
import { Search, X } from "lucide-react";
import { useEffect, useState } from "react";

function NewChatModal({ show, onClose, onSelectUser }) {
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch users when modal opens
  useEffect(() => {
    if (!show) return;

    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError("");

        const token = localStorage.getItem("token");

        const response = await fetch(
          "http://localhost:8081/api/users/search",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              ...(token && {
                Authorization: `Bearer ${token}`,
              }),
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch users");
        }

        const data = await response.json();

        console.log("Users search response:", data);

        // Handle different common response formats
        let apiUsers = [];

        if (Array.isArray(data)) {
          apiUsers = data;
        } else if (Array.isArray(data.data)) {
          apiUsers = data.data;
        } else if (Array.isArray(data.users)) {
          apiUsers = data.users;
        }

        const formattedUsers = apiUsers.map((user, index) => {
          const name =
            user.name ||
            user.fullName ||
            user.username ||
            user.email ||
            "Unknown User";

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
            color:
              user.color ||
              ["#7C6FE8", "#2E9E6D", "#D9822B"][index % 3],
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

  // Local search
  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(search.toLowerCase())
  );

  if (!show) return null;

  const handleSelectUser = (user) => {
    if (onSelectUser) {
      onSelectUser(user);
    }

    onClose();
    setSearch("");
  };

  const handleClose = () => {
    onClose();
    setSearch("");
  };

  return (
    <>
      {/* BACKDROP */}
      <div
        className="position-fixed top-0 start-0 w-100 h-100"
        style={{
          backgroundColor: "rgba(0, 0, 0, 0.35)",
          zIndex: 1040,
        }}
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
          style={{
            borderBottom: "1px solid #F1E7DC",
          }}
        >
          <div
            className="fw-semibold"
            style={{
              color: "#1E2328",
              fontSize: "15px",
            }}
          >
            Start New Chat
          </div>

          <button
            onClick={handleClose}
            className="btn p-1 border-0"
            style={{
              color: "#8A7C6F",
            }}
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
          }}
        >
          {/* LOADING */}
          {loading && (
            <div
              className="text-center py-4"
              style={{
                color: "#8A7C6F",
                fontSize: "12px",
              }}
            >
              Loading users...
            </div>
          )}

          {/* ERROR */}
          {!loading && error && (
            <div
              className="text-center py-4"
              style={{
                color: "#D9534F",
                fontSize: "12px",
              }}
            >
              {error}
            </div>
          )}

          {/* USERS */}
          {!loading && !error && filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <div
                key={user.id}
                onClick={() => handleSelectUser(user)}
                className="d-flex align-items-center gap-2 px-3 py-2"
                style={{
                  cursor: "pointer",
                  transition: "background-color 0.15s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#FFF7F2";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "#FFFFFF";
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
                  <div
                    style={{
                      color: "#1E2328",
                      fontSize: "13px",
                      fontWeight: "500",
                    }}
                  >
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
              </div>
            ))
          ) : (
            !loading &&
            !error && (
              <div
                className="text-center py-4"
                style={{
                  color: "#8A7C6F",
                  fontSize: "12px",
                }}
              >
                No users found
              </div>
            )
          )}
        </div>
      </div>
    </>
  );
}

export default NewChatModal;
