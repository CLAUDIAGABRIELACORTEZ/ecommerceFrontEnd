
import  { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { MoreVertical, Pencil, Plus, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"; 
import DeleteUserDialog from "./DeleteUser";
import EditUserDialog from "./EditUser";
import CreateUserDialog from "./CreateUser";import { toast } from "react-hot-toast";


interface Role {
  id: number;
  name: string;
}

interface User {
  role?: Role;
  id: number;
  username: string;
  password: string;
  firstname: string;
  lastname: string;
  country: string;
  role_id: number;
}

export default function UsersTable() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [openDelete, setOpenDelete] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [editedUser, setEditedUser] = useState<User | null>(null);
  const [openCreate, setOpenCreate] = useState(false);
  const [roles, setRoles] = useState<Role[]>([]);

  // const [open, setOpen] = useState(false); // 🔹 Estado para abrir/cerrar el diálogo

  const [newUser, setNewUser] = useState<User>({
    id: 0,
    username: "",
    password: "",
    firstname: "",
    lastname: "",
    country: "",
    role_id: 0,
  });

  useEffect(() => {
    fetch("http://localhost:8080/auth") // 🔹 Endpoint correcto
      .then((response) => response.json())
      .then((data: User[]) => {
        console.log("Usuarios obtenidos:", data);
        setUsers(data);
      })
      .catch((error) => console.error("Error al obtener usuarios:", error))
      .finally(() => setLoading(false));
  }, []);
;
  // 🔹 Obtener roles cuando se abre el formulario de creación
  useEffect(() => {
    if (openCreate || openEdit) {
      fetch("http://localhost:8080/api/roles") // 🔹 Endpoint para obtener roles
        .then((response) => response.json())
        .then((data: Role[]) => setRoles(data))
        .catch((error) => console.error("Error al obtener roles:", error));
    }
  }, [openCreate, openEdit]);

  // 🔹 Función para abrir el diálogo de confirmación
  const handleDeleteClick = (user: User) => {
    setSelectedUser(null); // 🔹 Reinicia el usuario seleccionado para evitar errores previos
    setTimeout(() => {
      setSelectedUser(user);
      setOpenDelete(true); // 🔹 Asegura que el diálogo se abra correctamente
    }, 0); // 🔹 Pequeño delay para asegurarse de que el estado se actualiza correctamente
  };
  
  const handleEditClick = (user: User) => {
    setEditedUser(null); // 🔹 Reinicia el estado antes de asignar el nuevo usuario
    setTimeout(() => {
      setEditedUser(user);
      setOpenEdit(true); // 🔹 Asegura que el diálogo se abra correctamente
    }, 0);
  };
  

  // 🔹 Función para eliminar el usuario
  const handleDeleteConfirm = () => {
    if (!selectedUser) return;
    
    setOpenDelete(false);
    fetch(`http://localhost:8080/auth/${selectedUser.id}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (!response.ok) throw new Error("Error al eliminar el usuario");
  
        setUsers(users.filter((user) => user.id !== selectedUser.id));
  
        // 🔹 Notificación de éxito
        toast.success("Usuario eliminado exitosamente");
      })
      .catch((error) => {
        console.error("Error:", error);
        toast.error("No se pudo eliminar el usuario");
      })
      .finally(() => {
        setTimeout(() => setSelectedUser(null), 300); // 🔹 Reiniciar usuario después de cerrar el diálogo
      });
  };
  //PARA EDITAR
  const handleEditConfirm = () => {
    if (!editedUser) return;
    const userUpdate = editedUser
    delete userUpdate.role
    console.log(userUpdate)
    fetch(`http://localhost:8080/auth/${editedUser.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(
        editedUser
      ),
    })
      .then((response) => {
        if (!response.ok) throw new Error("Error al actualizar el usuario");
  
        setUsers(users.map((user) => (user.id === editedUser.id ? editedUser : user)));
  
        // 🔹 Notificación de éxito
        toast.success("Usuario actualizado exitosamente");
      })
      .catch((error) => {
        console.error("Error:", error);
        toast.error("No se pudo actualizar el usuario");
      })
      .finally(() => {
        setOpenEdit(false);
        setTimeout(() => setEditedUser(null), 300);
      });
  };

// 🔹 Función para abrir el diálogo de creación de usuario
  const handleCreateConfirm = () => {
    fetch("http://localhost:8080/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newUser),
    })
      .then((response) => {
        if (!response.ok) throw new Error("Error al crear el usuario");
        return response.json();
      })
      .then((createdUser) => {
        setUsers([...users, createdUser]);
        toast.success("Usuario creado exitosamente");
        setOpenCreate(false);
        setNewUser({
          id: 0,
          username: "",
          password: "",
          firstname: "",
          lastname: "",
          country: "",
          role_id: 0,
        });
      })      
      .catch((error) => {
        console.error("Error:", error);
        toast.error("No se pudo crear el usuario");
      });
  };


  return (
    <div className="p-6">
        {/* 🔹 Botón para abrir el diálogo de creación de usuario */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Lista de Usuarios</h2>
        <Button variant="default" onClick={() => setOpenCreate(true)}>
          <Plus className="w-4 h-4 mr-2" /> Crear Usuario
        </Button>
      </div>
      {loading ? (
        <p>Cargando usuarios...</p>
      ) : (
        <Table className="w-full border">
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Usuario</TableHead>
              <TableHead>Contrasena</TableHead>
              <TableHead>Apellido</TableHead>
              <TableHead>Nombre</TableHead>
              <TableHead>País</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length > 0 ? (
              users.map((user) => (
                <TableRow key={user.id ?? Math.random()}>
                  <TableCell>{user.id ?? "Sin ID"}</TableCell>
                  <TableCell>{user.username ?? "Sin Usuario"}</TableCell>
                  <TableCell>{user.password ?? "Sin Contrasena"}</TableCell>
                  <TableCell>{user.lastname ?? "Sin Apellido"}</TableCell>
                  <TableCell>{user.firstname ?? "Sin Nombre"}</TableCell>
                  <TableCell>{user.country ?? "Sin País"}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                    <Button variant="ghost">
                          <MoreVertical size={20} />
                    </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                       <DropdownMenuItem onClick={() => handleEditClick(user)}>
                          <Pencil className="w-4 h-4 mr-2" /> Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDeleteClick(user)}>
                          <Trash2 className="w-4 h-4 mr-2 text-red-500" /> Eliminar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center">
                  No hay usuarios disponibles
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      )}



      {/* Diálogos Importados */}
      <DeleteUserDialog open={openDelete} onClose={() => setOpenDelete(false)} onDelete={handleDeleteConfirm} username={selectedUser?.username} />
      <EditUserDialog open={openEdit} onClose={() => setOpenEdit(false)} onSave={handleEditConfirm} user={editedUser} setUser={setEditedUser} roles={roles} />
      <CreateUserDialog open={openCreate} onClose={() => setOpenCreate(false)} onCreate={handleCreateConfirm} user={newUser} setUser={()=>setNewUser} roles={roles} />
    </div>
  );
}
