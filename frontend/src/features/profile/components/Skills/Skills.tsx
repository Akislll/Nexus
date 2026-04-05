import { useState } from "react";
import { EditableSection } from "../EditableSection/EditableSection";

interface SkillsProps {
  isOwner?: boolean;
}

export function Skills({ isOwner = false }: SkillsProps) {
  const [skills, setSkills] = useState("");

  return (
    <EditableSection
      title="Skills"
      value={skills}
      placeholder="Add your skills."
      onSave={setSkills}
      isOwner={isOwner}
    />
  );
}