// src/hooks/useDeleteLp.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteLp } from "../api/lp";

export const useDeleteLp = (lpId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => deleteLp(lpId),
    onSuccess: () => {
      alert("LP가 삭제되었습니다!");

      // 리스트 갱신
      queryClient.invalidateQueries({ queryKey: ["lps"] });
      queryClient.invalidateQueries({ queryKey: ["my-lps"] });
    },
    onError: () => {
      alert("LP 삭제 실패 ❗");
    },
  });
};
