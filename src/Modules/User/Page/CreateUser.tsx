import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Role {
  id: number;
  name: string;
}

interface User {
  username: string;
  password: string;
  firstname: string;
  lastname: string;
  country: string;
  role_id: number;
}

interface CreateUserDialogProps {
  open: boolean;
  onClose: () => void;
  onCreate: () => void;
  user: User;
  setUser: (user: User) => void;
  roles: Role[];
}

const CreateUserDialog: React.FC<CreateUserDialogProps> = ({ open, onClose, onCreate, user, setUser, roles }) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Crear Usuario</DialogTitle>
          <DialogDescription>Ingresa los datos para registrar un nuevo usuario.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <Input type="text" placeholder="Usuario" value={user.username} onChange={(e) => setUser({ ...user, username: e.target.value })} />
          <Input type="password" placeholder="Contraseña" value={user.password} onChange={(e) => setUser({ ...user, password: e.target.value })} />
          <Input type="text" placeholder="Nombre" value={user.firstname} onChange={(e) => setUser({ ...user, firstname: e.target.value })} />
          <Input type="text" placeholder="Apellido" value={user.lastname} onChange={(e) => setUser({ ...user, lastname: e.target.value })} />
          <Input type="text" placeholder="País" value={user.country} onChange={(e) => setUser({ ...user, country: e.target.value })} />

          <Select value={String(user.role_id)} onValueChange={(value) => setUser({ ...user, role_id: parseInt(value) })}>
            <SelectTrigger>
              <SelectValue placeholder="Selecciona un rol" />
            </SelectTrigger>
            <SelectContent>
              {roles.map((role) => (
                <SelectItem key={role.id} value={String(role.id)}>
                  {role.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button variant="default" onClick={onCreate}>
            Crear usuario
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateUserDialog;
