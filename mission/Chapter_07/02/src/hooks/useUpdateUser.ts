import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateUser } from "../api/user";

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateUser,
    onSuccess: () => {
      // 내 정보 다시 불러오게 함
      queryClient.invalidateQueries({ queryKey: ["my-info"] });
    },
  });
};
