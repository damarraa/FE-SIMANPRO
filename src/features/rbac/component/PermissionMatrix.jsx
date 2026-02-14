import React, { useMemo } from "react";

// Helper untuk merapikan text (ex: 'project_work_item' -> 'Project Work Item')
const formatLabel = (str) => {
  if (!str) return "";
  return str.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
};

const PermissionMatrix = ({
  allPermissions,
  selectedPermissions,
  onChange,
}) => {
  const grouped = useMemo(() => {
    return allPermissions.reduce((groups, perm) => {
      const parts = perm.name.split("::");
      if (parts.length < 2) return groups;

      const action = parts[0];
      const resource = parts[1];

      if (!groups[resource]) groups[resource] = [];
      groups[resource].push({
        ...perm,
        cleanAction: formatLabel(action),
      });

      return groups;
    }, {});
  }, [allPermissions]);

  const handleCheck = (permName) => {
    if (selectedPermissions.includes(permName)) {
      onChange(selectedPermissions.filter((p) => p !== permName));
    } else {
      onChange([...selectedPermissions, permName]);
    }
  };

  const handleSelectAllGroup = (permsInGroup) => {
    const permNames = permsInGroup.map((p) => p.name);
    const allSelected = permNames.every((name) =>
      selectedPermissions.includes(name)
    );

    if (allSelected) {
      onChange(selectedPermissions.filter((p) => !permNames.includes(p)));
    } else {
      onChange([...new Set([...selectedPermissions, ...permNames])]);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Object.keys(grouped).map((group) => {
        const permsInGroup = grouped[group];
        const allSelected = permsInGroup.every((p) =>
          selectedPermissions.includes(p.name)
        );

        return (
          <div
            key={group}
            className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex justify-between items-center">
              <h3 className="font-bold text-[#0D47A1] text-sm">
                {formatLabel(group)} Module
              </h3>

              <button
                type="button"
                onClick={() => handleSelectAllGroup(permsInGroup)}
                className={`text-xs font-medium px-2 py-1 rounded transition-colors ${
                  allSelected
                    ? "bg-red-100 text-red-600 hover:bg-red-200"
                    : "bg-blue-100 text-blue-600 hover:bg-blue-200"
                }`}
              >
                {allSelected ? "Uncheck All" : "Check All"}
              </button>
            </div>

            <div className="p-4 grid grid-cols-2 gap-y-3 gap-x-2">
              {permsInGroup.map((perm) => (
                <label
                  key={perm.id}
                  className="flex items-start space-x-2 cursor-pointer group"
                >
                  <div className="relative flex items-center mt-0.5">
                    <input
                      type="checkbox"
                      checked={selectedPermissions.includes(perm.name)}
                      onChange={() => handleCheck(perm.name)}
                      className="h-4 w-4 text-[#2196F3] border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                    />
                  </div>
                  <span className="text-xs text-gray-600 group-hover:text-[#0D47A1] transition-colors leading-tight">
                    {perm.cleanAction}
                  </span>
                </label>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default PermissionMatrix;
