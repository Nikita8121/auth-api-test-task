export const getPaginationSkip = (page: number, limit: number): number => {
  return (page - 1) * limit;
};
