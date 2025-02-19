import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "react-hot-toast";

interface Permission {
  id: number;
  name: string;
}

interface CreateRoleDialogProps {
  open: boolean;
  onClose: () => void;
  onRoleCreated: (newRole: any) => void;
}

export default function CreateRole({ open, onClose, onRoleCreated }: CreateRoleDialogProps) {
  const [roleName, setRoleName] = useState("");
  const [selectedPermissions, setSelectedPermissions] = useState<number[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);

  // 🔹 Obtener permisos desde el backend
  useEffect(() => {
    if (open) {
      fetch("http://localhost:8080/api/permissions")
        .then((response) => response.json())
        .then((data: Permission[]) => setPermissions(data))
        .catch((error) => console.error("Error al obtener permisos:", error));
    }
  }, [open]);

  // 🔹 Manejar selección de permisos
  const togglePermission = (id: number) => {
    setSelectedPermissions((prev) =>
      prev.includes(id) ? prev.filter((perm) => perm !== id) : [...prev, id]
    );
  };

  // 🔹 Crear rol con permisos
  const handleCreateRole = () => {
    if (!roleName.trim() || selectedPermissions.length === 0) {
      toast.error("El rol y al menos un permiso son obligatorios.");
      return;
    }

    const newRole = { name: roleName, permission_id: selectedPermissions };

    fetch("http://localhost:8080/api/roles", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newRole),
    })
      .then((response) => {
        if (!response.ok) throw new Error("Error al crear el rol");
        return response.json();
      })
      .then((createdRole) => {
        onRoleCreated(createdRole);
        toast.success("Rol creado exitosamente");
        onClose();
        setRoleName("");
        setSelectedPermissions([]);
      })
      .catch((error) => {
        console.error("Error:", error);
        toast.error("No se pudo crear el rol");
      });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Crear Rol</DialogTitle>
        </DialogHeader>

        {/* Nombre del Rol */}
        <label className="block">
          <span className="text-sm font-medium">Nombre del Rol</span>
          <Input
            type="text"
            value={roleName}
            onChange={(e) => setRoleName(e.target.value)}
          />
        </label>

        {/* Selección de Permisos */}
        <div className="mt-4">
          <span className="text-sm font-medium">Permisos</span>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {permissions.map((perm) => (
              <label key={perm.id} className="flex items-center space-x-2">
                <Checkbox
                  checked={selectedPermissions.includes(perm.id)}
                  onCheckedChange={() => togglePermission(perm.id)}
                />
                <span>{perm.name}</span>
              </label>
            ))}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button variant="default" onClick={handleCreateRole}>Guardar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
