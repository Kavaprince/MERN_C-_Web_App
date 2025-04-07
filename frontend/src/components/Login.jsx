import { verifyUSer } from "@/api";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export function Login() {
  const [user, setUser] = useState({
    email: "",
    password: "",

    role: "Admin", // Default role is 'Admin'
  });
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    const response = await verifyUSer(user);
    if (response) {
      navigate("/dashboard");
      sessionStorage.setItem("User", response);
      axios.defaults.headers.common["Authorization"] = `Bearer ${response}`;
    } else {
      alert("Login failed");
    }
  }

  function handleChange(e) {
    setUser({ ...user, [e.target.name]: e.target.value });
  }

  function handleRoleChange(value) {
    setUser({ ...user, role: value });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-secondary p-8 rounded-lg shadow-lg flex flex-col items-center justify-center w-96 hover:cursor-pointer z-10 animate-slide-up"
    >
      <div className="w-full mb-4 ">
        <Label>Sign in:</Label>
      </div>

      <Input
        placeholder="Email"
        onChange={handleChange}
        name="email"
        required
        maxLength={40}
        type="email"
        className="mb-2"
      />
      <Input
        placeholder="Password"
        onChange={handleChange}
        name="password"
        required
        maxLength={20}
        type="password"
        className="mb-2"
      />

      {/* Display role selection for all users */}
      <div className="mb-10 w-full">
        <Select
          name="role"
          value={user.role}
          onValueChange={handleRoleChange}
          required
        >
          <SelectTrigger className="create-new-user">
            <SelectValue placeholder="Select role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="User">User</SelectItem>
            <SelectItem value="Admin">Admin</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex-col w-full">
        <Button className="w-full">Log in</Button>
      </div>
    </form>
  );
}
