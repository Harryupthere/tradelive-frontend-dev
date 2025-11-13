import React, { useState, useEffect } from "react";
import {
  Gift,
  Calendar,
  User,
  Check,
  X,
  Clock,
  Sparkles,
  UserPlus,
  Zap,
  Crown,
  Star,
  ArrowLeft,
  TicketPlus
} from "lucide-react";
import "./ActivationCoupons.scss";
import { api } from "../../api/Service";
import { API_ENDPOINTS } from "../../constants/ApiEndPoints";
import { getUser } from "../../utils/tokenUtils";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../utils/redux/typedHook";
import { setUserProfile } from "../../utils/redux/slice";
import { setUser as persistUser } from "../../utils/tokenUtils";

const base = import.meta.env.VITE_BASE;

interface CouponData {
  id: number;
  code: string;
  is_used: boolean;
    is_expired: boolean;  // Add this line

  created_at: string;
  used_at: string | null;
  purchase: {
    id: number;
    transaction_id: string;
  };
  used_by: {
    id: string;
    first_name: string;
    email: string;
    created_at: string;
    profile: string | null;
    used_at: string;
  } | null;
}

interface FriendActivationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onActivate: (friendId: string) => void;
  couponCode: string;
  loading: boolean;
}

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: "self" | "friend";
  couponCode: string;
  friendName?: string;
}

const FriendActivationModal: React.FC<FriendActivationModalProps> = ({
  isOpen,
  onClose,
  onActivate,
  couponCode,
  loading,
}) => {
  const [friendId, setFriendId] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (friendId.trim()) {
      onActivate(friendId.trim());
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleBackdropClick}>
      <div className="friend-modal">
        <div className="friend-modal__header">
          <div className="friend-modal__icon">
            <UserPlus size={32} />
          </div>
          <h2 className="friend-modal__title">Activate for Friend</h2>
          <button className="friend-modal__close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="friend-modal__content">
          <div className="coupon-preview">
            <div className="coupon-preview__icon">
              <Gift size={24} />
            </div>
            <div className="coupon-preview__code">{couponCode}</div>
          </div>

          <form onSubmit={handleSubmit} className="friend-form">
            <div className="form-group">
              <label htmlFor="friendId" className="form-label">
                Friend's Unique ID
              </label>
              <input
                type="text"
                id="friendId"
                value={friendId}
                onChange={(e) => setFriendId(e.target.value)}
                placeholder="Enter friend's Unique ID"
                className="form-input"
                disabled={loading}
                required
              />
            </div>

            <div className="form-actions">
              <button
                type="button"
                onClick={onClose}
                className="btn btn--secondary"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className={`btn btn--primary ${loading ? "btn--loading" : ""}`}
                disabled={loading || !friendId.trim()}
              >
                {loading ? (
                  <>
                    <div className="loading-spinner"></div>
                    Activating...
                  </>
                ) : (
                  <>
                    <Zap size={18} />
                    Activate Now
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

const SuccessModal: React.FC<SuccessModalProps> = ({
  isOpen,
  onClose,
  type,
  couponCode,
  friendName,
}) => {
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleBackdropClick}>
      <div className="success-modal">
        {/* Celebration particles */}
        <div className="celebration-particles">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className={`particle particle-${i + 1}`}>
              <Star size={12} />
            </div>
          ))}
        </div>

        <div className="success-modal__content">
          <div className="success-modal__icon">
            <div className="success-circle">
              <Crown size={48} />
            </div>
            <div className="success-sparkle sparkle-1">
              <Sparkles size={16} />
            </div>
            <div className="success-sparkle sparkle-2">
              <Sparkles size={20} />
            </div>
            <div className="success-sparkle sparkle-3">
              <Sparkles size={14} />
            </div>
          </div>

          <h2 className="success-modal__title">🎉 Congratulations! 🎉</h2>

          <p className="success-modal__message">
            {type === "self"
              ? "You've successfully activated your premium membership!"
              : `Coupon successfully sent to ${friendName || "your friend"}!`}
          </p>

          <div className="success-modal__details">
            <div className="detail-row">
              <span className="detail-label">Coupon Code:</span>
              <span className="detail-value">{couponCode}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Status:</span>
              <span className="detail-value success">
                {type === "self" ? "Activated" : "Sent"}
              </span>
            </div>
          </div>

          <button onClick={onClose} className="btn btn--success">
            <Check size={18} />
            Awesome!
          </button>
        </div>
      </div>
    </div>
  );
};

const CouponCard: React.FC<{
  coupon: CouponData;
  onSelfActivate: (couponId: number) => void;
  onFriendActivate: (couponId: number, code: string) => void;
  loading: number | null;
}> = ({ coupon, onSelfActivate, onFriendActivate, loading }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const isLoading = loading === coupon.id;

  return (
    <div
      className={`coupon-card ${
        coupon.is_used 
          ? "coupon-card--used" 
          : coupon.is_expired 
            ? "coupon-card--expired" 
            : "coupon-card--available"
      }`}
    >
      <div className="coupon-card__header">
        <div className="coupon-card__status">
          {coupon.is_used ? (
            <div className="status-badge status-badge--used">
              <Check size={16} />
              Used
            </div>
          ) : coupon.is_expired ? (
            <div className="status-badge status-badge--expired">
              <X size={16} />
              Expired
            </div>
          ) : (
            <div className="status-badge status-badge--available">
              <Clock size={16} />
              Available
            </div>
          )}
        </div>
        <div className="coupon-card__type">
          <Gift size={20} />
        </div>
      </div>

      <div className="coupon-card__code">
        <div className="code-label">Activation Code</div>
        <div className="code-value">{coupon.code}</div>
      </div>

      <div className="coupon-card__details">
        <div className="detail-item">
          <Calendar size={16} />
          <span>Created: {formatDate(coupon.created_at)}</span>
        </div>

        {coupon.is_used && coupon.used_by && (
          <>
            <div className="detail-item">
              <User size={16} />
              <span>Used by: {coupon.used_by.first_name}</span>
            </div>
            <div className="detail-item">
              <Clock size={16} />
              <span>Activated: {formatDate(coupon.used_at!)}</span>
            </div>
          </>
        )}
      </div>

      {!coupon.is_used && !coupon.is_expired && (
        <div className="coupon-card__actions">
          {getUser().userType.id == 1 && (
            <button
              onClick={() => onSelfActivate(coupon.id)}
              className={`btn btn--primary ${isLoading ? "btn--loading" : ""}`}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="loading-spinner"></div>
                  Activating...
                </>
              ) : (
                <>
                  <Zap size={16} />
                  Self Activate
                </>
              )}
            </button>
          )}
          <button
            onClick={() => onFriendActivate(coupon.id, coupon.code)}
            className={
              getUser().userType.id == 1
                ? "btn btn--secondary"
                : "btn btn--primary"
            }
            disabled={isLoading}
          >
            <UserPlus size={16} />
            Send to Friend
          </button>
        </div>
      )}

      {(coupon.is_used || coupon.is_expired) && (
        <div className="coupon-card__overlay">
          <div className={`${coupon.is_expired ? 'expired-stamp' : 'used-stamp'}`}>
            {coupon.is_expired ? (
              <>
                <X size={32} />
                <span>EXPIRED</span>
              </>
            ) : (
              <>
                <Check size={32} />
                <span>USED</span>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const ActivationCoupons: React.FC = () => {
    const navigate = useNavigate();
  
  const [coupons, setCoupons] = useState<CouponData[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [friendModalOpen, setFriendModalOpen] = useState(false);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState<{
    id: number;
    code: string;
  } | null>(null);
  const [successType, setSuccessType] = useState<"self" | "friend">("self");
  const [friendName, setFriendName] = useState<string>("");

  useEffect(() => {
    fetchCoupons();
  }, []);

  const dispatch = useAppDispatch();

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      fetchProfile();
      const response = await api.get(API_ENDPOINTS.getActivationCoupons);
      const data1 = response?.data?.data || [];
      setCoupons(data1);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching coupons:", error);
      setLoading(false);
    }
  };
  const fetchProfile = async () => {
    try {
      const res = await api.get(API_ENDPOINTS.usersProfile);
      const data = res?.data?.data || res?.data || {};

      const storedUser = getUser() || {};
      // API might return a full user object (data.user) or just profile fields (data)
      const apiUser = res?.data?.data?.user ? res.data.data.user : data;
      const mergedUser = {
        ...storedUser,
        userType:
          (data as any).userType || apiUser.userType || storedUser.userType,
      };
      // persist to local storage and update redux
      persistUser(mergedUser as any);
      dispatch(setUserProfile(mergedUser as any));
    } catch (e) {
      // non-fatal: continue without crashing if redux update fails
      console.warn("Could not update user in redux/localStorage", e);
    }
  };

  const handleSelfActivate = async (couponId: number) => {
    try {
      setActionLoading(couponId);

      // Find the coupon code from the coupons array
      const coupon = coupons.find((c) => c.id === couponId);
      if (!coupon) {
        throw new Error("Coupon not found");
      }

      // Call self activation API
      const response = await api.post(API_ENDPOINTS.selfActivationCoupon, {
        code: coupon.code,
      });

      if (response?.data?.status) {
        // Refresh coupons list after successful activation
        await fetchCoupons();
        setSuccessType("self");
        setSelectedCoupon({ id: couponId, code: coupon.code });
        setSuccessModalOpen(true);
      } else {
        throw new Error(response?.data?.message || "Activation failed");
      }
    } catch (error: any) {
      console.error("Self activation failed:", error);
      // You may want to show an error toast/message here
      alert(
        error?.response?.data?.message || "Activation failed. Please try again."
      );
    } finally {
      setActionLoading(null);
    }
  };

  const handleFriendActivate = (couponId: number, code: string) => {
    setSelectedCoupon({ id: couponId, code });
    setFriendModalOpen(true);
  };

  const handleFriendActivateSubmit = async (friendId: string) => {
    if (!selectedCoupon) return;

    try {
      setActionLoading(selectedCoupon.id);

      // Call friend activation API
      const response = await api.post(API_ENDPOINTS.friendActivationCoupon, {
        code: selectedCoupon.code,
        targetUserUniqueId: friendId,
      });

      if (response?.data?.status) {
        // Refresh coupons list after successful activation
        await fetchCoupons();

        // Set friend name from API response if available
        const friendName =
          response?.data?.data?.targetUser?.first_name || friendId;
        setFriendName(friendName);

        setSuccessType("friend");
        setFriendModalOpen(false);
        setSuccessModalOpen(true);
      } else {
        throw new Error(response?.data?.message || "Activation failed");
      }
    } catch (error: any) {
      console.error("Friend activation failed:", error);
      // You may want to show an error toast/message here
      alert(
        error?.response?.data?.message || "Activation failed. Please try again."
      );
    } finally {
      setActionLoading(null);
    }
  };

  const availableCoupons = coupons.filter(coupon => !coupon.is_used && !coupon.is_expired);
  const usedCoupons = coupons.filter(coupon => coupon.is_used);
  const expiredCoupons = coupons.filter(coupon => coupon.is_expired && !coupon.is_used);
      const handleBackToCalculators = () => {
    navigate(`${base}profile`);
  };

  // Update the stats section
  return (
    <div className="activation-coupons">
      <div className="activation-coupons__container">
         <button className="purchase-button" >
                        <TicketPlus size={20} />
                        Purchase
                      </button> 
        <div className="activation-coupons__header">
          <div className="header-content">
            {/* <button className="back-button" onClick={handleBackToCalculators}>
                        <ArrowLeft size={20} />
                        Back to Calculators
                      </button> */}
            <h1 className="page-title">
              <Gift size={32} />
              Activation Coupons
            </h1>
            <p className="page-subtitle">
              Manage your premium activation coupons and share them with friends
            </p>
          </div>



          <div className="stats-summary">
            <div className="stat-card">
              <div className="stat-value">{availableCoupons.length}</div>
              <div className="stat-label">Available</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{usedCoupons.length}</div>
              <div className="stat-label">Used</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{expiredCoupons.length}</div>
              <div className="stat-label">Expired</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{coupons.length}</div>
              <div className="stat-label">Total</div>
            </div>
          </div>
        </div>

        {coupons.length === 0 ? (
          <div className="empty-state">
            <Gift size={64} />
            <h2>No Coupons Available</h2>
            <p>
              You don't have any activation coupons yet. Purchase a premium plan
              to get started!
            </p>
          </div>
        ) : (
          <>
            {availableCoupons.length > 0 && (
              <section className="coupons-section">
                <h2 className="section-title">
                  <Sparkles size={24} />
                  Available Coupons
                </h2>
                <div className="coupons-grid">
                  {availableCoupons.map((coupon) => (
                    <CouponCard
                      key={coupon.id}
                      coupon={coupon}
                      onSelfActivate={handleSelfActivate}
                      onFriendActivate={handleFriendActivate}
                      loading={actionLoading}
                    />
                  ))}
                </div>
              </section>
            )}

            {usedCoupons.length > 0 && (
              <section className="coupons-section">
                <h2 className="section-title">
                  <Check size={24} />
                  Used Coupons
                </h2>
                <div className="coupons-grid">
                  {usedCoupons.map((coupon) => (
                    <CouponCard
                      key={coupon.id}
                      coupon={coupon}
                      onSelfActivate={handleSelfActivate}
                      onFriendActivate={handleFriendActivate}
                      loading={actionLoading}
                    />
                  ))}
                </div>
              </section>
            )}

            {expiredCoupons.length > 0 && (
              <section className="coupons-section">
                <h2 className="section-title">
                  <X size={24} />
                  Expired Coupons
                </h2>
                <div className="coupons-grid">
                  {expiredCoupons.map((coupon) => (
                    <CouponCard
                      key={coupon.id}
                      coupon={coupon}
                      onSelfActivate={handleSelfActivate}
                      onFriendActivate={handleFriendActivate}
                      loading={actionLoading}
                    />
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </div>

      <FriendActivationModal
        isOpen={friendModalOpen}
        onClose={() => {
          setFriendModalOpen(false);
          window.location.reload();
        }}
        onActivate={handleFriendActivateSubmit}
        couponCode={selectedCoupon?.code || ""}
        loading={actionLoading !== null}
      />

      <SuccessModal
        isOpen={successModalOpen}
        onClose={() => {
          setSuccessModalOpen(false);
          window.location.reload();
        }}
        type={successType}
        couponCode={selectedCoupon?.code || ""}
        friendName={friendName}
      />
    </div>
  );
};

export default ActivationCoupons;
