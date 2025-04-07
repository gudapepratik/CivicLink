import { RiSearchLine } from "@remixicon/react";
import React, { useState } from "react";

function UserManagementSearchBar({ setUsers, userCopy }) {
  const [query, setQuery] = useState("");

  const handleSearchInput = (e) => {
    const value = e.target.value;
    setQuery(value);

    const filtered = userCopy.filter((item) =>
      item?.name?.toLowerCase().includes(value.toLowerCase())
    );

    setUsers(filtered);
  };

  return (
    <div className="p-2">
      <div className="relative">
        <RiSearchLine className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18}/>
        <input
          type="text"
          placeholder="Search users by name..."
          className="w-full rounded-md border border-gray-300 dark:bg-zinc-800 dark:border-zinc-700 dark:focus:border-white px-4 py-2 pl-10 focus:border-zinc-800 focus:outline-none focus:ring-1 focus:ring-zinc-800 focus:ring-opacity-50"
          value={query}
          onChange={handleSearchInput}
        />
      </div>
    </div>
  );
}

export default UserManagementSearchBar;
