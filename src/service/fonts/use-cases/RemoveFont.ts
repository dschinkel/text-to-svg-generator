export const RemoveFont = async (repository: any, id: string): Promise<void> => {
  await repository.remove(id);
};
