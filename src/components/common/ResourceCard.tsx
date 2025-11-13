import { useNavigate } from "react-router-dom";
import { formatDate } from "../../utils/customFn";
const base = import.meta.env.VITE_BASE;

export interface Resource {
  id: number;
  name: string;
  description: string;
  metadata: string[];
  updated_at: string;
  preview_image_url: string;
  file_url: string;
}

interface ResourceCardProps {
  resource: Resource;
}

const ResourceCard: React.FC<ResourceCardProps> = ({ resource }) => {
  const navigate = useNavigate();
  return (
    <div className="course-card">
      <div className="course-card-img">
        <img src={resource.preview_image_url} alt={resource.name} />
      </div>
      <div className="card-content">
        <h3 className="title">{resource.name}</h3>
        <p>{resource.description}</p>
        {/* metadata badges/tags */}
        {(() => {
          // normalize metadata: could be array, JSON string, or object
          let items: Array<string> = [];
          try {
            if (Array.isArray(resource.metadata))
              items = resource.metadata as any;
            else if (typeof resource.metadata === "string") {
              const parsed = JSON.parse(resource.metadata);
              if (Array.isArray(parsed)) items = parsed;
              else if (parsed && typeof parsed === "object")
                items = Object.entries(parsed).map(([k, v]) => `${k}: ${v}`);
            } else if (
              resource.metadata &&
              typeof resource.metadata === "object"
            ) {
              items = Object.entries(resource.metadata as any).map(
                ([k, v]) => `${k}: ${v}`
              );
            }
          } catch (e) {
            // fallback: try to coerce to string list
            if (resource.metadata) items = [String(resource.metadata)];
          }

          if (!items || items.length === 0) return null;

          return (
            <div
              className="resource-card__meta"
              aria-hidden={items.length === 0}
            >
              {items.map((m, i) => (
                <span className="resource-card__meta-item" key={i}>
                  {m},
                </span>
              ))}
            </div>
          );
        })()}
        <div className="rating-align">
          <div className="rating">
            <span>Date</span>
          </div>
          <div className="total-enroll">{formatDate(resource.updated_at)}</div>
        </div>
        <button type="button" className="border-btn">
          <a
            href={resource.file_url}
            download
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "inherit", textDecoration: "none" }}
          >
            Download
          </a>
        </button>
      </div>
    </div>
  );
};

export default ResourceCard;
