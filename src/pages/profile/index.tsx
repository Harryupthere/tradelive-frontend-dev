import React, { useEffect, useState } from "react";
import Pagination from "../../components/common/Pagination";
import {
  ArrowLeft,
  User,
  Camera,
  Eye,
  EyeOff,
  Save,
  CreditCard as Edit3,
  ArrowUpCircle,
  Notebook,
  ChevronDown
} from "lucide-react";
import "./Profile.scss";
import { useForm, SubmitHandler, get } from "react-hook-form";
import { allCountries } from "country-telephone-data";
import { api } from "../../api/Service";
import { API_ENDPOINTS } from "../../constants/ApiEndPoints";
import { successMsg, errorMsg } from "../../utils/customFn";
import { getUser } from "../../utils/tokenUtils";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../utils/redux/typedHook";
import { setUserProfile } from "../../utils/redux/slice";
import { setUser as persistUser } from "../../utils/tokenUtils";

type ProfileDto = {
  first_name: string;
  last_name: string;
  profile?: string | null;
  country_code?: string;
  phone_number?: string;
  country?: string;
  email?: string;
  telegram_id?: string;
};

type PasswordDto = {
  current_password: string;
  new_password: string;
  confirm_password: string;
};

const base = import.meta.env.VITE_BASE || "/";

// small helper to convert iso2 to emoji flag
const iso2ToFlag = (iso2: string) => {
  if (!iso2) return "";
  return iso2
    .toUpperCase()
    .split("")
    .map((c) => String.fromCodePoint(127397 + c.charCodeAt(0)))
    .join("");
};

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewSrc, setPreviewSrc] = useState<string | null>(null);
  const [meetings, setMeetings] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [meetingsPagination, setMeetingsPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    total_pages: 0
  });
  const [transactionsPagination, setTransactionsPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    total_pages: 0
  });
  // static sample sections remain unchanged
  // const transactions = [
  //   {
  //     id: "TXN001",
  //     date: "2025-01-15",
  //     type: "Subscription",
  //     amount: 299,
  //     status: "Completed",
  //     description: "Pro Member Annual Subscription",
  //   },
  //   {
  //     id: "TXN002",
  //     date: "2025-01-10",
  //     type: "Course Purchase",
  //     amount: 199,
  //     status: "Completed",
  //     description: "Advanced Trading Strategies",
  //   },
  //   {
  //     id: "TXN003",
  //     date: "2025-01-05",
  //     type: "Refund",
  //     amount: -99,
  //     status: "Processed",
  //     description: "Course Refund - Basic Trading",
  //   },
  // ];
  const userActions = [
    {
      id: "ACT001",
      timestamp: "2025-01-15 14:30:25",
      action: "Login",
      details: "Successful login via mobile",
      ip_address: "192.168.1.100",
    },
    {
      id: "ACT002",
      timestamp: "2025-01-15 14:25:10",
      action: "Profile Update",
      details: "Updated phone number",
      ip_address: "192.168.1.100",
    },
    {
      id: "ACT003",
      timestamp: "2025-01-14 09:15:45",
      action: "Password Change",
      details: "Password successfully changed",
      ip_address: "192.168.1.100",
    },
    {
      id: "ACT004",
      timestamp: "2025-01-13 16:20:30",
      action: "Course Access",
      details: "Accessed Advanced Trading Module",
      ip_address: "192.168.1.100",
    },
  ];

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ProfileDto>({
    defaultValues: {
      first_name: "",
      last_name: "",
      profile: "",
      country_code: "",
      phone_number: "",
      country: "",
      email: "",
      telegram_id: "",
    },
  });

  const {
    register: registerPwd,
    handleSubmit: handleSubmitPwd,
    watch: watchPwd,
    formState: { errors: pwdErrors, isSubmitting: isSubmittingPwd },
    reset: resetPwdForm,
  } = useForm<PasswordDto>({
    defaultValues: {
      current_password: "",
      new_password: "",
      confirm_password: "",
    },
  });

  const newPassword = watchPwd("new_password");

  // fetch profile
  useEffect(() => {
    const fetchProfile = async () => {
      setLoadingProfile(true);
      try {
        const res = await api.get(API_ENDPOINTS.usersProfile);
        const data: ProfileDto = res?.data?.data || res?.data || {};

        // update user object in redux (merge existing stored user with any returned user/userType)
        try {
          const storedUser = getUser() || {};
          // API might return a full user object (data.user) or just profile fields (data)
          const apiUser = res?.data?.data?.user ? res.data.data.user : data;
          const mergedUser = {
            ...storedUser,
            userType:
              (data as any).userType ||
              apiUser?.userType ||
              storedUser?.userType,
          };
          // persist to local storage and update redux
          persistUser(mergedUser as any);
          dispatch(setUserProfile(mergedUser as any));
        } catch (e) {
          // non-fatal: continue without crashing if redux update fails
          console.warn("Could not update user in redux/localStorage", e);
        }

        // build local countries map from allCountries
        const countriesLocal = allCountries.map((c: any) => ({
          name: c.name,
          iso2: c.iso2,
          dialCode: c.dialCode,
        }));

        const findCountry = (raw?: string) => {
          if (!raw) return null;
          const v = String(raw).trim();
          // try name match
          let found = countriesLocal.find(
            (c) => c.name.toLowerCase() === v.toLowerCase()
          );
          if (found) return found;
          // try iso2 match
          found = countriesLocal.find(
            (c) => c.iso2.toLowerCase() === v.toLowerCase()
          );
          if (found) return found;
          // try dial code match (strip non-digits)
          const digits = v.replace(/\D/g, "");
          found = countriesLocal.find(
            (c) => c.dialCode.replace(/\D/g, "") === digits
          );
          return found || null;
        };

        const matchedCountry = findCountry(data.country || data.country_code);
        const countryValue = matchedCountry
          ? matchedCountry.name
          : data.country || "";
        const countryCodeValue = matchedCountry
          ? matchedCountry.dialCode
          : data.country_code || "";

        reset({
          first_name: data.first_name || "",
          last_name: data.last_name || "",
          profile: data.profile || "",
          country_code: countryCodeValue,
          phone_number: data.phone_number || "",
          country: countryValue,
          email: data.email || getUser()?.email || "",
          telegram_id: data.telegram_id || "",
        });
        if (data.profile) setPreviewSrc(data.profile as string);
      } catch (err: any) {
        console.error("Profile fetch failed", err);
        errorMsg(err?.response?.data?.message || "Failed to fetch profile");
      } finally {
        setLoadingProfile(false);
      }
    };

    fetchProfile();
    fetchMeetings(1);
    fetchTransactions(1);
  }, [reset]);

  const fetchMeetings = async (page = 1) => {
    try {
      const res = await api.get(`${API_ENDPOINTS.instructors}?page=${page}&limit=${meetingsPagination.limit}`);
      if (res.data.status) {
        setMeetings(res.data.data.data);
        console.log(res.data.data)
        setMeetingsPagination({
          ...meetingsPagination,
          page,
          total: res.data.data.pagination.total || 0,
          total_pages: res.data.data.pagination.total_pages || Math.ceil((res.data.data.pagination.total || 0) / meetingsPagination.limit)
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchTransactions = async (page = 1) => {
    try {
      const res = await api.get(`${API_ENDPOINTS.transactions}?page=${page}&limit=${transactionsPagination.limit}`);
      if (res.data.status) {
        // Add showMetadata property to each transaction
        const transactionsWithMetadata = res.data.data.data.map(t => ({
          ...t,
          showMetadata: false
        }));
        setTransactions(transactionsWithMetadata);
        setTransactionsPagination({
          ...transactionsPagination,
          page,
          total: res.data.data.pagination.total || 0,
          total_pages: res.data.data.pagination.total_pages || Math.ceil((res.data.data.pagination.total || 0) / transactionsPagination.limit)
        });
      }
    } catch (error) {
      console.log(error)
    }
  }  // S3 presigned upload helper
  const uploadFileToS3 = async (file: File) => {
    try {
      // 1. request presigned url
      const res = await api.post(API_ENDPOINTS.uploadRequest, {
        filename: file.name,
        fileType: file.type,
      });
      const { uploadUrl, fileUrl } = res?.data.data || {};
      if (!uploadUrl || !fileUrl) throw new Error("Invalid upload response");

      // 2. upload to S3 (PUT). If CORS errors occur, backend S3 CORS must be configured.
      await fetch(uploadUrl, {
        method: "PUT",
        body: file,
        headers: {
          "Content-Type": file.type,
        },
      });

      // 3. return final file url (CloudFront or S3 path) to save in DB
      return fileUrl;
    } catch (err) {
      console.error("S3 upload failed", err);
      return null;
    }
  };

  // profile update handler
  const onSubmit: SubmitHandler<ProfileDto> = async (data) => {
    setUploading(true);
    try {
      let finalProfileUrl = data.profile || previewSrc || "";

      if (selectedFile) {
        const uploaded = await uploadFileToS3(selectedFile);
        if (!uploaded) {
          errorMsg(
            "File upload failed. Please check CORS / presigned settings."
          );
          setUploading(false);
          return;
        }
        finalProfileUrl = uploaded;
      }

      // prepare patch payload - only send fields present in form (email is read-only, not sent)
      const payload: any = {
        first_name: data.first_name,
        last_name: data.last_name,
        profile: finalProfileUrl || null,
      };

      if (data.country) payload.country = data.country;
      if (data.country_code) payload.country_code = data.country_code;
      if (data.phone_number) payload.phone_number = data.phone_number;
      if (data.telegram_id) payload.telegram_id = data.telegram_id;

      await api.patch(API_ENDPOINTS.updateProfile, payload);
      successMsg("Profile updated successfully");
      // refresh profile
      const fresh = await api.get(API_ENDPOINTS.usersProfile);
      const updated: ProfileDto = fresh?.data?.data || fresh?.data || {};
      reset({
        first_name: updated.first_name || "",
        last_name: updated.last_name || "",
        profile: updated.profile || "",
        country_code: updated.country_code || "",
        phone_number: updated.phone_number || "",
        country: updated.country || "",
        email: updated.email || getUser()?.email || "",
        telegram_id: updated.telegram_id || "",
      });
      setPreviewSrc(updated.profile || null);
      setSelectedFile(null);
      setIsEditing(false);
    } catch (err: any) {
      console.error("Update profile failed", err);
      errorMsg(err?.response?.data?.message || "Failed to update profile");
    } finally {
      setUploading(false);
    }
  };

  // password update handler
  const onSubmitPassword: SubmitHandler<PasswordDto> = async (d) => {
    if (d.new_password !== d.confirm_password) {
      errorMsg("Passwords do not match");
      return;
    }
    try {
      await api.patch(API_ENDPOINTS.updatePassword, {
        currentPassword: d.current_password,
        newPassword: d.new_password,
      });
      successMsg("Password updated");
      resetPwdForm();
    } catch (err: any) {
      console.error("Password update failed", err);
      errorMsg(err?.response?.data?.message || "Failed to update password");
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (!file) return;
    setSelectedFile(file);
    const reader = new FileReader();
    reader.onload = () => setPreviewSrc(reader.result as string);
    reader.readAsDataURL(file);
  };

  const getStatusClass = (status: string) => {
    switch (status.toLowerCase()) {
      case "scheduled":
        return "status-completed";
      case "completed":
        return "status-completed";
      case "processed":
        return "status-processed";
      case "pending":
        return "status-pending";
      case "failed":
        return "status-failed";
      default:
        return "status-default";
    }
  };

  // countries list for select (map to {name, iso2, dialCode})
  const countries = allCountries.map((c: any) => ({
    name: c.name,
    iso2: c.iso2,
    dialCode: c.dialCode,
  }));

  const handleInstructor = async (id) => {
    navigate(`${base}instructor/${id}`);
  };
  const handleTransactionPageChange = (page: number) => {
    fetchTransactions(page);
  };

  const handleMeetingPageChange = (page: number) => {
    fetchMeetings(page);
  };

  return (
    <div className="profile-page">
      <div className="profile-page__title-section">
        <div>
          <h1 className="profile-page__title">Profile Settings</h1>
          <p className="profile-page__subtitle">
            Manage your account information and preferences
          </p>
        </div>
        {getUser()?.userType.id == 1 && (
          <button
            className="profile-page__save-btn"
            onClick={() => navigate(`${base}checkout`)}
          >
            <ArrowUpCircle size={16} /> Upgrade
          </button>
        )}
        <button
          className="profile-page__save-btn"
          onClick={() => navigate(`${base}activation-coupons`)}
        >
          <ArrowUpCircle size={16} /> Activation Coupons
        </button>
      </div>

      <div className="profile-page__section">
        <div className="profile-page__section-header">
          <h2>Personal Information</h2>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="profile-page__edit-btn"
          >
            <Edit3 size={16} /> {isEditing ? "Cancel" : "Edit"}
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="profile-page__form">
          <div className="profile-page__image-section">
            <div className="profile-page__image-container">
              {previewSrc ? (
                <img
                  src={previewSrc}
                  alt="Profile"
                  className="profile-page__image"
                />
              ) : (
                <div className="profile-page__image-placeholder">
                  <User size={40} />
                </div>
              )}
              {isEditing && (
                <label className="profile-page__image-upload">
                  <Camera size={16} />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageSelect}
                    style={{ display: "none" }}
                  />
                </label>
              )}
            </div>
          </div>

          <div className="profile-page__form-grid">
            <div className="profile-page__form-group">
              <label>First Name</label>
              <input
                type="text"
                {...register("first_name", {
                  required: "First name is required",
                })}
                disabled={!isEditing}
                className="profile-page__input"
              />
              {errors.first_name && (
                <p className="profile-page__error">
                  {errors.first_name.message}
                </p>
              )}
            </div>

            <div className="profile-page__form-group">
              <label>Last Name</label>
              <input
                type="text"
                {...register("last_name", {
                  required: "Last name is required",
                })}
                disabled={!isEditing}
                className="profile-page__input"
              />
              {errors.last_name && (
                <p className="profile-page__error">
                  {errors.last_name.message}
                </p>
              )}
            </div>

            <div className="profile-page__form-group">
              <label>Email</label>
              <input
                type="email"
                {...register("email")}
                disabled
                className="profile-page__input profile-page__input--disabled"
              />
              <span className="profile-page__input-note">
                Email cannot be changed
              </span>
            </div>

            <div className="profile-page__form-group">
              <label>Country</label>
              <select
                {...register("country")}
                disabled={!isEditing}
                className="profile-page__input"
              >
                <option value="">Select country</option>
                {countries.map((c) => (
                  <option key={c.iso2} value={c.name}>
                    {iso2ToFlag(c.iso2)} {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="profile-page__form-group profile-page__form-group--phone">
              <label>Phone Number</label>
              <div className="profile-page__phone-input">
                <select
                  {...register("country_code")}
                  disabled={!isEditing}
                  className="profile-page__country-code"
                >
                  <option value="">Code</option>
                  {countries.map((c) => (
                    <option key={c.iso2} value={c.dialCode}>
                      {iso2ToFlag(c.iso2)} {c.dialCode}
                    </option>
                  ))}
                </select>
                <input
                  type="tel"
                  {...register("phone_number")}
                  disabled={!isEditing}
                  className="profile-page__input"
                />
              </div>
            </div>

            <div className="profile-page__form-group">
              <label>Telegram ID</label>
              <input
                type="text"
                {...register("telegram_id")}
                disabled={!isEditing}
                className="profile-page__input"
                placeholder="@username"
              />
            </div>
          </div>

          {isEditing && (
            <button
              type="submit"
              className="profile-page__save-btn"
              disabled={uploading}
            >
              <Save size={16} /> {uploading ? "Saving..." : "Save Changes"}
            </button>
          )}
        </form>
      </div>

      <div className="profile-page__section">
        <div className="profile-page__section-header">
          <h2>Change Password</h2>
        </div>

        <form
          onSubmit={handleSubmitPwd(onSubmitPassword)}
          className="profile-page__password-form"
        >
          <div className="profile-page__profile-flex">
            <div className="profile-page__form-group">
              <label>Current Password</label>
              <div className="profile-page__password-input">
                <input
                  type={showCurrentPassword ? "text" : "password"}
                  {...registerPwd("current_password", {
                    required: "Current password is required",
                  })}
                  className="profile-page__input"
                  placeholder="Enter current password"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="profile-page__password-toggle"
                >
                  {showCurrentPassword ? (
                    <EyeOff size={16} />
                  ) : (
                    <Eye size={16} />
                  )}
                </button>
              </div>
              {pwdErrors.current_password && (
                <p className="profile-page__error">
                  {pwdErrors.current_password.message}
                </p>
              )}
            </div>

            <div className="profile-page__form-group">
              <label>New Password</label>
              <div className="profile-page__password-input">
                <input
                  type={showNewPassword ? "text" : "password"}
                  {...registerPwd("new_password", {
                    required: "New password is required",
                    minLength: { value: 6, message: "At least 6 characters" },
                  })}
                  className="profile-page__input"
                  placeholder="Enter new password"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="profile-page__password-toggle"
                >
                  {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {pwdErrors.new_password && (
                <p className="profile-page__error">
                  {pwdErrors.new_password.message}
                </p>
              )}
            </div>

            <div className="profile-page__form-group">
              <label>Confirm New Password</label>
              <div className="profile-page__password-input">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  {...registerPwd("confirm_password", {
                    required: "Confirm password is required",
                    validate: (v) =>
                      v === newPassword || "Passwords do not match",
                  })}
                  className="profile-page__input"
                  placeholder="Confirm new password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="profile-page__password-toggle"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={16} />
                  ) : (
                    <Eye size={16} />
                  )}
                </button>
              </div>
              {pwdErrors.confirm_password && (
                <p className="profile-page__error">
                  {pwdErrors.confirm_password.message}
                </p>
              )}
            </div>
          </div>

          <button
            type="submit"
            className="profile-page__save-btn"
            disabled={isSubmittingPwd}
          >
            <Save size={16} />{" "}
            {isSubmittingPwd ? "Updating..." : "Update Password"}
          </button>
        </form>
      </div>

      <div className="profile-page__section">
        <div className="profile-page__section-header">
          <h2>Transaction History</h2>
        </div>
        <div className="profile-page__table-container">
          <table className="profile-page__table">
            <thead>
              <tr>
                <th>Transaction ID</th>
                <th>Date</th>
                <th>Type</th>
                <th>Amount</th>
                <th>Payment Gateway</th>

                <th>Status</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((t) => {
                // Parse metadata if it's a string
                let metadata: Record<string, any> = {};
                try {
                  metadata =
                    typeof t.metadata === "string"
                      ? JSON.parse(t.metadata)
                      : t.metadata || {};
                } catch (e) {
                  console.error("Failed to parse metadata:", e);
                  metadata = {};
                }

                // only show these keys (case-insensitive)
                const allowed = ["baseprice", "fees", "quantity"];
                const entriesToShow = Object.entries(metadata).filter(
                  ([k]) => allowed.includes(k.replace(/\W/g, "").toLowerCase())
                );

                // Get transaction ID display
                const txId = t.transaction_id?.toString() || "";
                const displayId = txId
                  ? `${txId.substring(0, 5)}...${txId.substring(
                      txId.length - 5
                    )}`
                  : "";

                return (
                  <tr key={t.id}>
                    <td className="profile-page__table-id">{displayId}</td>
                    <td>{new Date(t.created_at).toLocaleString()}</td>
                    <td>{t.transaction_type}</td>
                    <td
                      className={
                        t.amount < 0
                          ? "profile-page__amount--negative"
                          : "profile-page__amount--positive"
                      }
                    >
                      ${Math.abs(t.amount)}
                    </td>
                    <td>{t.payment_gateway}</td>
                    <td>
                      <span
                        className={`profile-page__status ${getStatusClass(
                          t.status
                        )}`}
                      >
                        {t.status}
                      </span>
                    </td>
                    <td className="metadata-cell">
                      {entriesToShow.length > 0 ? (
                        <>
                          <button
                            className={`toggle-btn ${t.showMetadata ? "active" : ""}`}
                            onClick={() => {
                              setTransactions((prev) =>
                                prev.map((trans) =>
                                  trans.id === t.id
                                    ? { ...trans, showMetadata: !trans.showMetadata }
                                    : trans
                                )
                              );
                            }}
                          >
                            <span>Details</span>
                            <ChevronDown size={14} />
                          </button>
                          <div className={`metadata-content ${t.showMetadata ? "open" : ""}`}>
                            <div className="metadata-list">
                              {entriesToShow.map(([key, value]) => {
                                const normalized = key.replace(/\W/g, "").toLowerCase();
                                const label =
                                  normalized === "baseprice"
                                    ? "Base Price"
                                    : normalized === "fees"
                                    ? "Fees"
                                    : normalized === "quantity"
                                    ? "Quantity"
                                    : key;

                                const displayValue =
                                  normalized === "baseprice" || normalized === "fees"
                                    ? `$${value}`
                                    : value;

                                return (
                                  <div key={key} className="metadata-item">
                                    <span className="label">{label}:</span>
                                    <span className="value">{displayValue}</span>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </>
                      ) : (
                        "No details available"
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {transactions.length > 0 && transactionsPagination.total_pages > 1 && (
            <Pagination
              currentPage={transactionsPagination.page}
              totalPages={transactionsPagination.total_pages}
              onPageChange={handleTransactionPageChange}
            />
          )}
        </div>
      </div>

      {/* <div className="profile-page__section">
        <div className="profile-page__section-header">
          <h2>Recent Activity</h2>
        </div>
        <div className="profile-page__table-container">
          <table className="profile-page__table">
            <thead>
              <tr>
                <th>Action ID</th>
                <th>Timestamp</th>
                <th>Action</th>
                <th>Details</th>
                <th>IP Address</th>
              </tr>
            </thead>
            <tbody>
              {userActions.map((a) => (
                <tr key={a.id}>
                  <td className="profile-page__table-id">{a.id}</td>
                  <td>{a.timestamp}</td>
                  <td>
                    <span className="profile-page__action-type">
                      {a.action}
                    </span>
                  </td>
                  <td>{a.details}</td>
                  <td className="profile-page__ip-address">{a.ip_address}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {transactions.length > 0 && transactionsPagination.total_pages > 1 && (
            <Pagination
              currentPage={transactionsPagination.page}
              totalPages={transactionsPagination.total_pages}
              onPageChange={handleTransactionPageChange}
            />
          )}
        </div>
      </div>
      */}

      <div className="profile-page__section">
        <div className="profile-page__section-header">
          <h2>Instructor meetings</h2>
        </div>
        <div className="profile-page__table-container">
          <table className="profile-page__table">
            <thead>
              <tr>
                <th>Sr No.</th>
                <th>Instructor Name</th>
                <th>Instructor Designation</th>
                <th>Instructor Email</th>
                <th>Meeting Date & time</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {meetings.map((a, index) => (
                <tr key={a.id}>
                  <td className="profile-page__table-id">{index + 1}</td>
                  <td
                    onClick={() => {
                      handleInstructor(a.instructor.id);
                    }}
                  >
                    {a.instructor.name}
                  </td>
                  <td>{a.instructor.designation}</td>
                  <td>{a.instructor.email}</td>
                  <td>
                    {a.availability.available_date} {a.availability.start_time}
                  </td>
                  <td>
                    <span className="profile-page__action-type">
                      {new Date(a.availability.available_date) < new Date()?"completed":a.meeting_status}
                      
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {meetings.length > 0 && meetingsPagination.total_pages > 1 && (
            <Pagination
              currentPage={meetingsPagination.page}
              totalPages={meetingsPagination.total_pages}
              onPageChange={handleMeetingPageChange}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
