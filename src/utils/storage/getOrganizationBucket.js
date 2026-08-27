export function getOrganizationBucket(organizationId) {
  if (!organizationId) {
    const error = new Error("Organization ID is required for storage.");

    error.statusCode = 500;

    throw error;
  }

  return `organization-${organizationId}`;
}
