import { downloadEmployeeTemplateService } from "@/services/user/import-users/downloadEmployeeTemplate.service";

export async function downloadEmployeeTemplateController() {
  const template = await downloadEmployeeTemplateService();

  return new Response(template.buffer, {
    status: 200,
    headers: {
      "Content-Type": template.contentType,
      "Content-Disposition": `attachment; filename="${template.fileName}"`,
    },
  });
}
