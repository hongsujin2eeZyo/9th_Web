import React from "react";
import { Search } from "lucide-react"; 

type SidebarProps = {
  isOpen: boolean;
};

const Sidebar = ({ isOpen }: SidebarProps) => {
  return (
    <div
      className={`fixed left-0 top-16 bottom-0 bg-zinc-900 text-white w-64 p-5 transition-transform duration-300 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <ul className="space-y-4">
        <li className="hover:text-pink-400 cursor-pointer flex items-center space-x-2">
          <Search size={16} className="text-pink-400" />
          <span>찾기</span>
        </li>
        <li className="hover:text-pink-400 cursor-pointer">마이페이지</li>
      </ul>
       
      <ul className="absolute bottom-10 left-1/2 transform -translate-x-1/2">
        <li className="hover:text-pink-400 cursor-pointer text-xs text-center">
          탈퇴하기
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
