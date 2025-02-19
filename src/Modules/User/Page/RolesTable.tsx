import  { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { MoreVertical, Pencil, Plus, Trash2 } from "lucide-react";

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { toast } from "react-hot-toast";

import CreateRoleDialog from "./CreateRole";
import EditRoleDialog from "./EditRole";
import DeleteRoleDialog from "./DeleteRole";

// 🔹 Definir interfaces
interface Permission {
  id: number;
  name: string;
}

interface Role {
  id: number;
  name: string;
  permissions: Permission[];
}

export default function RolesTable() {
  const [roles, setRoles] = useState<Role[]>([]); // Lista de roles
  const [loading, setLoading] = useState(true); // Estado de carga
  const [openCreate, setOpenCreate] = useState(false); // Diálogo de creación
  const [openEdit, setOpenEdit] = useState(false); // Diálogo de edición
  const [openDelete, setOpenDelete] = useState(false); // Diálogo de eliminación
  const [, setPermissions] = useState<Permission[]>([]);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);

  const handleEditClick = (role: Role) => {
    setSelectedRole(null); // 🔹 Reinicia para evitar errores previos
    setTimeout(() => {
      setSelectedRole(role);
      setOpenEdit(true); // 🔹 Asegura que el modal se abra correctamente
    }, 0);
  };
  // 🔹 Función para abrir el diálogo de eliminación de rol
  const handleDeleteClick = (role: Role) => {
    setSelectedRole(null); // 🔹 Reinicia para evitar errores previos
    setTimeout(() => {
      setSelectedRole(role);
      setOpenDelete(true); // 🔹 Asegura que el modal se abra correctamente
    }, 0);
  };

   
  useEffect(() => {
    fetch("http://localhost:8080/api/permissions") // 🔹 Endpoint correcto
      .then((response) => response.json())
      .then((data: Permission[]) => setPermissions(data))
      .catch((error) => console.error("Error al obtener permisos:", error));
  }, []);

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = () => {
    fetch("http://localhost:8080/api/roles")
      .then((response) => response.json())
      .then((data: Role[]) => {
        setRoles(data);
      })
      .catch((error) => console.error("Error al obtener roles:", error))
      .finally(() => setLoading(false));
  };

  const handleDeleteRole = () => {
    if (!selectedRole) return;

    fetch(`http://localhost:8080/api/roles/${selectedRole.id}`, {
      method: "DELETE",
    })

      .then((response) => {
       
        if (!response.ok) throw new Error("Error al eliminar el rol");
        setRoles(roles.filter((role) => role.id !== selectedRole.id));
        toast.success("Rol eliminado exitosamente");
      })
      .catch((error) => {
        console.error("Error:", error);
        toast.error("No se pudo eliminar el rol");
      })
      .finally(() => {
        setOpenDelete(false);
        setSelectedRole(null);
      });
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Lista de Roles</h2>
        <Button variant="default" onClick={() => setOpenCreate(true)}>
          <Plus className="w-4 h-4 mr-2" /> Crear Rol
        </Button>
      </div>

      {loading ? (
        <p>Cargando roles...</p>
      ) : (
        <Table className="w-full border">
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Nombre</TableHead>
              <TableHead>Permisos</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {roles.length > 0 ? (
              roles.map((role) => (
                <TableRow key={role.id}>
                  <TableCell>{role.id}</TableCell>
                  <TableCell>{role.name}</TableCell>
                  <TableCell>{role.permissions.map((p) => p.name).join(", ")}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost">
                          <MoreVertical size={20} />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => handleEditClick(role)}>
                          <Pencil className="w-4 h-4 mr-2" /> Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDeleteClick(role)}>
                          <Trash2 className="w-4 h-4 mr-2 text-red-500" /> Eliminar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center">No hay roles disponibles</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      )}

<CreateRoleDialog 
  open={openCreate} 
  onClose={() => setOpenCreate(false)} 
  onRoleCreated={(newRole) => setRoles([...roles, newRole])}
/>     
<EditRoleDialog 
  open={openEdit} 
  onClose={() => setOpenEdit(false)} 
  role={selectedRole} 
  fetchRoles={fetchRoles} // ✅ Usamos fetchRoles para recargar la tabla
/>
 
      <DeleteRoleDialog open={openDelete} onClose={() => setOpenDelete(false)} onDelete={handleDeleteRole} />
    </div>
  );
}
