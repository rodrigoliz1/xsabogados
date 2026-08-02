import { describe, expect, it } from "vitest";

import {
  canAccessMatter,
  canManageFirmSettings,
  canSeeInternalContent,
  type PolicyActor,
} from "@/server/policies/rules";

const matter = { clientId: "client-a", assignedLawyerIds: ["lawyer-a"] };

describe("políticas de autorización", () => {
  it("permite al cliente únicamente su propio asunto", () => {
    const owner: PolicyActor = {
      id: "u1",
      role: "CLIENT",
      clientProfileId: "client-a",
    };
    const outsider: PolicyActor = {
      id: "u2",
      role: "CLIENT",
      clientProfileId: "client-b",
    };
    expect(canAccessMatter(owner, matter)).toBe(true);
    expect(canAccessMatter(outsider, matter)).toBe(false);
    expect(canSeeInternalContent(owner)).toBe(false);
  });

  it("permite al abogado asignado, pero no a otro abogado", () => {
    expect(
      canAccessMatter(
        { id: "u3", role: "LAWYER", lawyerProfileId: "lawyer-a" },
        matter,
      ),
    ).toBe(true);
    expect(
      canAccessMatter(
        { id: "u4", role: "LAWYER", lawyerProfileId: "lawyer-b" },
        matter,
      ),
    ).toBe(false);
  });

  it("reserva la configuración institucional para ADMIN", () => {
    const admin: PolicyActor = { id: "u5", role: "ADMIN" };
    const lawyer: PolicyActor = {
      id: "u6",
      role: "LAWYER",
      lawyerProfileId: "lawyer-a",
    };
    expect(canAccessMatter(admin, matter)).toBe(true);
    expect(canSeeInternalContent(admin)).toBe(true);
    expect(canManageFirmSettings(admin)).toBe(true);
    expect(canManageFirmSettings(lawyer)).toBe(false);
  });
});
