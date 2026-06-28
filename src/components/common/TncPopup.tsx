import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./TncPopup.scss";
import { setUser as persistUser } from "../../utils/tokenUtils";
import { getUser } from "../../utils/tokenUtils";
import { API_ENDPOINTS } from "../../constants/ApiEndPoints";
import { api } from "../../api/Service";
import { errorMsg } from "../../utils/customFn";
import { removeToken, removeUser } from "../../utils/tokenUtils";
import Dialog from "@mui/material/Dialog";
import IconButton from "@mui/material/IconButton";
  import {Cross,FolderClosed} from "lucide-react";
import TermsPage from "../../pages/term-and-condition/index";
const base = import.meta.env.VITE_BASE;

interface TermsAcceptanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  termsPath: string;
  redirectPath?: string;
  sourcePath?: string;

  // onAccept: () => Promise<void>;
}

const TermsAcceptanceModal: React.FC<TermsAcceptanceModalProps> = ({
  isOpen,
  onClose,
  termsPath,
  redirectPath,
  sourcePath,
  // onAccept,
}) => {
  const [accepted, setAccepted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showTermsDialog, setShowTermsDialog] = useState(false);
  const navigate = useNavigate();

  if (!isOpen) return null;

  const onAccept = async () => {
    try {
      const res = await api.patch(API_ENDPOINTS.userstermsAndConditionUpdate);

      if (res.data.status) {
        const storedUser = getUser() || {};

        const mergedUser = {
          ...storedUser,
          tnc_accepted: 1,
        };
        persistUser(mergedUser as any);
        if (sourcePath == "dashboard") {
          window.location.reload();
        }
        return true;
      }
      return false;
    } catch (error) {
      return false;
    }
  };
  const handleLogout = () => {
    errorMsg(
      "To proceed further, acceptance of the Terms and Conditions is mandatory.",
    );
    removeToken();
    removeUser();
    navigate(`${base}login`);
  };

  const handleSubmit = async () => {
    if (!accepted)
      if (sourcePath == "login" || "dashboard") {
        handleLogout();
      } else {
        return null;
      }

    try {
      setLoading(true);

      let result = await onAccept();

      if (!result) {
        errorMsg("Something went wrong. Try again later");
        return;
      }

      onClose();

      if (redirectPath) {
        navigate(redirectPath);
      }
    } finally {
      setLoading(false);
    }
  };

  const openPopupTerms = () => {
    setShowTermsDialog(true);
  };

  return (
    <div className="terms-modal-overlay">
      {" "}
      <div
        className="terms-modal"
        style={{
          visibility: showTermsDialog ? "hidden" : "visible",
        }}
      >
        <h2>Terms & Conditions Required</h2>

        <p>
          Before proceeding, please carefully read our{" "}
          {/* <Link to={termsPath} target="_blank">
            Terms & Conditions
          </Link> */}
          <span className="terms-link" onClick={() => openPopupTerms()}>
            Terms & Conditions
          </span>
          .
        </p>

        <p>You must accept the Terms & Conditions before continuing.</p>

        <label className="terms-modal__checkbox">
          <input
            type="checkbox"
            checked={accepted}
            onChange={(e) => setAccepted(e.target.checked)}
          />

          <span>I have read and accept the Terms & Conditions.</span>
        </label>

        <div className="terms-modal__actions">
          <button className="cancel-btn" onClick={handleLogout}>
            Logout
          </button>

          <button
            className="accept-btn"
            disabled={!accepted || loading}
            onClick={handleSubmit}
          >
            {loading ? "Submitting..." : "Accept & Continue"}
          </button>
        </div>
      </div>
      <Dialog
        open={showTermsDialog}
        onClose={() => setShowTermsDialog(false)}
        maxWidth="lg"
        fullWidth
        sx={{
          zIndex: 9999999,
        }}
        PaperProps={{
          sx: {
            background: "#111",
            borderRadius: "20px",
            border: "1px solid rgba(213,255,46,.2)",
            maxHeight: "90vh",
            zIndex: 9999999,
          },
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "20px 24px",
            borderBottom: "1px solid rgba(213,255,46,.15)",
          }}
        >
          <h2
            style={{
              color: "#d5ff2e",
              margin: 0,
            }}
          >
            Terms & Conditions
          </h2>

          <IconButton
            onClick={() => setShowTermsDialog(false)}
            sx={{ color: "#fff" }}
          >
            <Cross />
          </IconButton>
        </div>

        <div
          style={{
            overflowY: "auto",
            padding: "24px",
            color: "#fff",
            maxHeight: "75vh",
          }}
        >
          <TermsPage />
        </div>
      </Dialog>
    </div>
  );
};

export default TermsAcceptanceModal;
