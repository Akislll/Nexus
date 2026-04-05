import { useState } from "react";
import { EditableSection } from "../EditableSection/EditableSection";

interface EducationProps {
  isOwner?: boolean;
}

export function Education({ isOwner = false }: EducationProps) {
  const [education, setEducation] = useState("");

  return (
    <EditableSection
      title="Education"
      value={education}
      placeholder="Add your education details."
      onSave={setEducation}
      isOwner={isOwner}
    />
  );
}