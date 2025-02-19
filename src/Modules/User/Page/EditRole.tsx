import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "react-hot-toast";

interface Permission {
  id: number;
  name: string;
}

interface Role {
  id: number;
  name: string;
  permissions: Permission[];
}

interface EditRoleDialogProps {
  open: boolean;
  onClose: () => void;
  role: Role | null;
  fetchRoles: () => void; // ✅ Ahora usamos fetchRoles en vez de onRoleUpdated
}

export default function EditRoleDialog({ open, onClose, role, fetchRoles }: EditRoleDialogProps) {
  const [roleName, setRoleName] = useState("");
  const [selectedPermissions, setSelectedPermissions] = useState<number[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);

  
  // Cargar datos del rol cuando se abre el modal
  useEffect(() => {
    if (role) {
      setRoleName(role.name);
      setSelectedPermissions(role.permissions.map((perm) => perm.id));
    }
  }, [role]);

  // Obtener lista de permisos desde el backend cuando se abre el modal
  useEffect(() => {
    if (open) {
      fetch("http://localhost:8080/api/permissions")
        .then((response) => response.json())
        .then((data: Permission[]) => setPermissions(data))
        .catch((error) => console.error("Error al obtener permisos:", error));
    }
  }, [open]);

  // Manejar selección de permisos
  const togglePermission = (id: number) => {
    setSelectedPermissions((prev) =>
      prev.includes(id) ? prev.filter((perm) => perm !== id) : [...prev, id]
    );
  };

  // Guardar los cambios del rol
  const handleSaveRole = () => {
    if (!role) return;
    if (!roleName.trim() || selectedPermissions.length === 0) {
      toast.error("El rol y al menos un permiso son obligatorios.");
      return;
    }

    const updatedRole = { id: role.id, name: roleName, permission_id: selectedPermissions };
     console.log(updatedRole);
    fetch(`http://localhost:8080/api/roles/${role.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedRole),

    })
      .then((response) => {
        if (!response.ok) throw new Error("Error al actualizar el rol");
        return response.json();
      })
      .then(() => {
        toast.success("Rol actualizado exitosamente");
        fetchRoles(); // ✅ Llamamos a fetchRoles para actualizar la tabla
        onClose();
      })
      .catch((error) => {
        console.error("Error:", error);
        toast.error("No se pudo actualizar el rol");
      });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Rol</DialogTitle>
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
          <Button variant="default" onClick={handleSaveRole}>Guardar Cambios</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
