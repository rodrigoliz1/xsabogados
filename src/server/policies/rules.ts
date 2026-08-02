export type PolicyActor = {
  id: string;
  role: "CLIENT" | "LAWYER" | "ADMIN";
  clientProfileId?: string | null;
  lawyerProfileId?: string | null;
};

export type MatterPolicyResource = {
  clientId: string;
  assignedLawyerIds: string[];
};

export function canAccessMatter(
  actor: PolicyActor,
  matter: MatterPolicyResource,
) {
  if (actor.role === "ADMIN") return true;
  if (actor.role === "CLIENT") {
    return Boolean(
      actor.clientProfileId && actor.clientProfileId === matter.clientId,
    );
  }
  return Boolean(
    actor.lawyerProfileId &&
    matter.assignedLawyerIds.includes(actor.lawyerProfileId),
  );
}

export function canSeeInternalContent(actor: PolicyActor) {
  return actor.role === "ADMIN" || actor.role === "LAWYER";
}

export function canManageFirmSettings(actor: PolicyActor) {
  return actor.role === "ADMIN";
}
