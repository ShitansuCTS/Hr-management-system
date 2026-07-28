export function createEmptyBatch() {
  return {
    data: {
      employees: [],
    },

    statistics: {
      processed: 0,
      inserted: 0,
      failed: 0,
      skipped: 0,
    },
  };
}
