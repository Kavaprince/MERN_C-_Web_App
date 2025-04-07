import { createUser } from "@/api";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function CreateUser() {
  const [user, setUser] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "Admin", // Default role is 'Admin'
  });

  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    if (user.password !== user.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const response = await createUser(user);
      if (response.message === "The email is taken") {
        alert("The email is already taken.");
      } else {
        alert("Account created successfully!");
        navigate("/");
      }
    } catch (error) {
      alert(error.message || "Error creating Account");
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
      <div className="w-full mb-4">
        <Label>Create a new account:</Label>
      </div>

      <Input
        placeholder="Username"
        onChange={handleChange}
        name="username"
        required
        maxLength={20}
        className="mb-2"
      />
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
      <Input
        placeholder="Confirm Password"
        onChange={handleChange}
        name="confirmPassword"
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
      <div className="flex justify-center w-full">
        <Button className="w-full" type="submit">
          Create account
        </Button>
      </div>
    </form>
  );
}
