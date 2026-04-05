import { useState } from "react";
import styles from "./EditableSection.module.scss";

interface EditableSectionProps {
  title: string;
  value: string;
  placeholder?: string;
  onSave: (value: string) => void;
  isOwner?: boolean;
}

export function EditableSection({
  title,
  value,
  placeholder = "No information provided.",
  onSave,
  isOwner = false,
}: EditableSectionProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(value || "");

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
          <button className={styles.iconButton} onClick={() => setIsEditing(true)} type="button">
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
            <button className={styles.saveButton} type="button" onClick={handleSave}>
              Save
            </button>
            <button className={styles.cancelButton} type="button" onClick={handleCancel}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </section>
  );
}