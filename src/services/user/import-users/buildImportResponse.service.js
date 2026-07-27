export function buildImportResponse({
  totalRows,
  processed,
  inserted,
  failed,
  skipped,
  errorReport = null,
}) {
  const summary = {
    totalRows,
    processed,
    inserted,
    failed,
    skipped,
  };

  // All rows imported successfully
  if (inserted === totalRows && failed === 0) {
    return {
      statusCode: 201,
      body: {
        success: true,
        message: "All employees imported successfully.",
        data: {
          summary,
        },
      },
    };
  }

  // Partial success
  if (inserted > 0 && failed > 0) {
    return {
      statusCode: 200,
      body: {
        success: true,
        message: "Employee import completed with some errors.",
        data: {
          summary,
          errorReport,
        },
      },
    };
  }

  // Nothing imported
  if (inserted === 0) {
    return {
      statusCode: 400,
      body: {
        success: false,
        message: "Employee import failed. No employees were imported.",
        errors: {
          summary,
          errorReport,
        },
      },
    };
  }

  // Fallback
  return {
    statusCode: 200,
    body: {
      success: true,
      message: "Employee import completed.",
      data: {
        summary,
      },
    },
  };
}
