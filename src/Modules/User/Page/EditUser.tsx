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
  id: number;
  username: string;
  password: string;
  firstname: string;
  lastname: string;
  country: string;
  role_id: number;
}

interface EditUserDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: () => void;
  user: User | null;
  setUser: (user: User) => void;
  roles: Role[];
}

const EditUserDialog: React.FC<EditUserDialogProps> = ({ open, onClose, onSave, user, setUser, roles }) => {
  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar usuario</DialogTitle>
          <DialogDescription>Modifica los datos y guarda los cambios.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <label className="block">
            <span className="text-sm font-medium">ID</span>
            <Input type="text" value={user.id} disabled />
          </label>

          <label className="block">
            <span className="text-sm font-medium">Usuario</span>
            <Input type="text" value={user.username} onChange={(e) => setUser({ ...user, username: e.target.value })} />
          </label>

          <label className="block">
            <span className="text-sm font-medium">Contraseña</span>
            <Input
              type="password"
              placeholder="Dejar en blanco para no cambiar"
              value={user.password}
              onChange={(e) => setUser({ ...user, password: e.target.value })}
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium">Nombre</span>
            <Input type="text" value={user.firstname} onChange={(e) => setUser({ ...user, firstname: e.target.value })} />
          </label>

          <label className="block">
            <span className="text-sm font-medium">Apellido</span>
            <Input type="text" value={user.lastname} onChange={(e) => setUser({ ...user, lastname: e.target.value })} />
          </label>

          <label className="block">
            <span className="text-sm font-medium">País</span>
            <Input type="text" value={user.country} onChange={(e) => setUser({ ...user, country: e.target.value })} />
          </label>

          <label className="block">
            <span className="text-sm font-medium">Rol</span>
            <Select
              value={String(user.role_id)}
              onValueChange={(value) => setUser({ ...user, role_id: parseInt(value) })}
            >
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
          </label>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button variant="default" onClick={onSave}>
            Guardar cambios
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditUserDialog;
