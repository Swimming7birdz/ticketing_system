import React, { useEffect, useMemo, useState } from "react";
import Button from "@mui/material/Button";
import Cookies from "js-cookie";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import "./GroupShareTicket.css";

const baseURL = process.env.REACT_APP_API_BASE_URL;

const GroupShareTicket = ({
  handleOpen,
  handleClose,
  ticketIDs = [],
  onComplete,
  assignmentPath = "ticketassignments",
}) => {
  const [selectedTA, setSelectedTA] = useState("");
  const [tas, setTAs] = useState([]);
  const [loadingTAs, setLoadingTAs] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resultMessage, setResultMessage] = useState("");
  const token = Cookies.get("token");

  const uniqueTicketIDs = useMemo(
    () => [...new Set(ticketIDs.map(Number).filter(Number.isInteger))],
    [ticketIDs]
  );

  useEffect(() => {
    if (!handleOpen) {
      setSelectedTA("");
      setResultMessage("");
      return;
    }

    let cancelled = false;
    const loadTAs = async () => {
      setLoadingTAs(true);
      try {
        const response = await fetch(`${baseURL}/api/users/role/TA`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) throw new Error("Unable to load TA accounts.");

        const users = await response.json();
        if (!cancelled) setTAs(users.filter((user) => user.is_enabled !== false));
      } catch (error) {
        if (!cancelled) {
          setTAs([]);
          setResultMessage(error.message || "Unable to load TA accounts.");
        }
      } finally {
        if (!cancelled) setLoadingTAs(false);
      }
    };

    loadTAs();
    return () => {
      cancelled = true;
    };
  }, [handleOpen, token]);

  const closeDialog = () => {
    if (!isSubmitting) handleClose();
  };

  const shareTicket = async (ticketId) => {
    const response = await fetch(`${baseURL}/api/${assignmentPath}/ticket/${ticketId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ user_id: Number(selectedTA) }),
    });

    if (response.ok) return { ticketId, status: "shared" };
    if (response.status === 409) return { ticketId, status: "duplicate" };

    const body = await response.json().catch(() => ({}));
    return { ticketId, status: "failed", message: body.error || `Request failed (${response.status})` };
  };

  const handleSubmit = async () => {
    if (!selectedTA || uniqueTicketIDs.length === 0) return;

    setIsSubmitting(true);
    setResultMessage("");
    const settled = await Promise.allSettled(uniqueTicketIDs.map(shareTicket));
    const results = settled.map((result, index) => (
      result.status === "fulfilled"
        ? result.value
        : { ticketId: uniqueTicketIDs[index], status: "failed", message: "Network error" }
    ));
    const shared = results.filter((result) => result.status === "shared");
    const duplicates = results.filter((result) => result.status === "duplicate");
    const failures = results.filter((result) => result.status === "failed");
    setIsSubmitting(false);

    if (failures.length === 0) {
      onComplete?.({ shared: shared.length, duplicates: duplicates.length });
      handleClose();
      return;
    }

    const succeeded = shared.length + duplicates.length;
    const failureDetails = failures.map((result) => `#${result.ticketId}: ${result.message}`).join("; ");
    setResultMessage(`${succeeded} of ${results.length} tickets were shared or already shared. Failed: ${failureDetails}`);
  };

  return (
    <Dialog open={handleOpen} onClose={closeDialog}>
      <DialogContent>
        <DialogContentText variant="body1" sx={{ fontWeight: 500, color: "black" }}>
          Share {uniqueTicketIDs.length} selected ticket{uniqueTicketIDs.length === 1 ? "" : "s"}
        </DialogContentText>
        <DialogContentText sx={{ mt: 1 }}>
          Pick a TA account to add to every selected ticket. Existing assignments are kept.
        </DialogContentText>
        {resultMessage && (
          <DialogContentText color="error" sx={{ mt: 1 }}>
            {resultMessage}
          </DialogContentText>
        )}
        <DialogActions className="dropdown">
          <select
            value={selectedTA}
            disabled={loadingTAs || isSubmitting}
            onChange={(event) => setSelectedTA(event.target.value)}
          >
            <option value="" disabled>{loadingTAs ? "Loading TAs…" : "Select a TA"}</option>
            {tas.map((ta) => (
              <option key={ta.user_id} value={ta.user_id}>{ta.name}</option>
            ))}
          </select>
        </DialogActions>
        <DialogActions className="buttons">
          <Button onClick={closeDialog} disabled={isSubmitting}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={!selectedTA || loadingTAs || isSubmitting || uniqueTicketIDs.length === 0}
          >
            {isSubmitting ? "Sharing…" : "Confirm"}
          </Button>
        </DialogActions>
      </DialogContent>
    </Dialog>
  );
};

export default GroupShareTicket;
