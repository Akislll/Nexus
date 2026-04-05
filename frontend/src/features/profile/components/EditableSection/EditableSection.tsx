import { useEffect, useState } from "react";
import styles from "./EditableSection.module.scss";

interface EditableSectionProps {
  title: string;
  value: string;
  placeholder?: string;
  isOwner?: boolean;
  onSave: (value: string) => void;
}

export function EditableSection({
  title,
  value,
  placeholder = "No information provided.",
  isOwner = false,
  onSave,
}: EditableSectionProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(value || "");

  useEffect(() => {
    setDraft(value || "");
  }, [value]);

  const handleSave = () => {
    onSave(draft.trim());
    setIsEditing(false);
  };

  const handleCancel = () => {
    setDraft(value || "");
    setIsEditing(false);
  };

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <h2>{title}</h2>

        {isOwner && !isEditing && (
          <button
            type="button"
            className={styles.iconButton}
            onClick={() => setIsEditing(true)}
            aria-label={`Edit ${title}`}
          >
            ✎
          </button>
        )}
      </div>

      {!isEditing ? (
        <p className={styles.content}>{value?.trim() ? value : placeholder}</p>
      ) : (
        <div className={styles.editor}>
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder={`Write your ${title.toLowerCase()} here...`}
          />

          <div className={styles.actions}>
            <button type="button" className={styles.saveButton} onClick={handleSave}>
              Save
            </button>
            <button type="button" className={styles.cancelButton} onClick={handleCancel}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </section>
  );
}