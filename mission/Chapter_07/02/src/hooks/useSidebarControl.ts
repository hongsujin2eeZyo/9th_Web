import { useEffect, useRef, useState } from "react";

export const useSidebarControl = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const sidebarRef = useRef<HTMLDivElement | null>(null);
  const toggleButtonRef = useRef<HTMLButtonElement | null>(null);


  // 외부 클릭 감지
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        isSidebarOpen &&
        sidebarRef.current &&
        !sidebarRef.current.contains(target) &&
        !(toggleButtonRef.current && toggleButtonRef.current.contains(target)) // 🔥 버튼 예외
      ) {
        setIsSidebarOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isSidebarOpen]);

  // 화면 크기에 따라 자동 열림/닫힘
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };

    handleResize(); // 초기 로드 시 한번 실행
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  return { isSidebarOpen, setIsSidebarOpen, toggleSidebar, sidebarRef, toggleButtonRef };
};
