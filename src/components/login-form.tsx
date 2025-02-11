import { useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function LoginForm({ className, ...props }: React.ComponentPropsWithoutRef<"div">) {
  const [email, setEmail] = useState("") // Estado para el email
  const [password, setPassword] = useState("") // Estado para la contraseña
  console.log('email antes del submit: ', email)
console.log('entro')
  // Función que maneja el envío del formulario
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault() // Evita que la página se recargue

    fetch('http://localhost:8080/auth/login', {
      method: 'POST', // Método de envío
      headers: {
        'Content-Type': 'application/json' // Tipo de contenido
      },
      body: JSON.stringify({ 
        username: email, 
        password: password 
      }) // Convierte los datos a JSON
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Error en la autenticación'); // Manejo de error si la respuesta no es exitosa
      }
      return response.json(); // Convierte la respuesta en JSON
    })
    .then(data => {
      console.log("Respuesta del servidor:", data); // Maneja la respuesta del servidor
    })
    .catch(error => {
      console.error("Hubo un error:", error.message); // Manejo de errores
    });
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>Enter your email below to login to your account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  value={email} // Conecta el input con el estado
                  onChange={(e) => setEmail(e.target.value)} // Actualiza el estado cuando se escribe
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <a href="#" className="ml-auto inline-block text-sm underline-offset-4 hover:underline">
                    Forgot your password?
                  </a>
                </div>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password} // Conecta el input con el estado
                  onChange={(e) => setPassword(e.target.value)} // Actualiza el estado cuando se escribe
                />
              </div>
              <Button type="submit" className="w-full">
                Login
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{" "}
              <a href="#" className="underline underline-offset-4">
                Sign up
              </a>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
