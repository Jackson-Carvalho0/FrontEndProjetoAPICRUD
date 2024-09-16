import { useEffect, useState, useRef, FormEvent } from 'react';
import { FiTool, FiTrash } from 'react-icons/fi';
import { api } from './service/api';

interface EmployeesProps {
  id: string;
  name: string;
  email: string;
  phone: string;
  salary: string;
  created_at: string;
}

export default function App() {
  const [employees, setEmployees] = useState<EmployeesProps[]>([]);
  const [editingEmployee, setEditingEmployee] = useState<EmployeesProps | null>(
    null
  );
  const nameRef = useRef<HTMLInputElement | null>(null);
  const emailRef = useRef<HTMLInputElement | null>(null);
  const phoneRef = useRef<HTMLInputElement | null>(null);
  const salaryRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    loadEmployees();
  }, []);

  async function loadEmployees() {
    try {
      const response = await api.get('/api/Employees');
      setEmployees(response.data);
    } catch (error) {
      console.error('Error loading employees:', error);
    }
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    const name = nameRef.current?.value;
    const email = emailRef.current?.value;
    const phone = phoneRef.current?.value;
    const salary = salaryRef.current?.value;

    if (!name || !email || !phone || !salary) return;

    try {
      if (editingEmployee) {
        await api.put(`/api/Employees/${editingEmployee.id}`, {
          name,
          email,
          phone,
          salary,
        });
        setEmployees(prevEmployees =>
          prevEmployees.map(employee =>
            employee.id === editingEmployee.id
              ? { ...employee, name, email, phone, salary }
              : employee
          )
        );
        setEditingEmployee(null);
      } else {
        const response = await api.post('/api/Employees', {
          name,
          email,
          phone,
          salary,
        });
        setEmployees(prevEmployees => [...prevEmployees, response.data]);
      }

      if (nameRef.current) nameRef.current.value = '';
      if (emailRef.current) emailRef.current.value = '';
      if (phoneRef.current) phoneRef.current.value = '';
      if (salaryRef.current) salaryRef.current.value = '';
    } catch (error) {
      console.error('Error submitting employee data:', error);
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/api/Employees/${id}`);
      setEmployees(prevEmployees =>
        prevEmployees.filter(employee => employee.id !== id)
      );
    } catch (error) {
      console.error('Error deleting employee:', error);
    }
  };

  const handleUpdate = async (id: string) => {
    try {
      const response = await api.get(`/api/Employees/${id}`);
      const employeeToEdit = response.data;
      setEditingEmployee(employeeToEdit);
      if (nameRef.current) nameRef.current.value = employeeToEdit.name;
      if (emailRef.current) emailRef.current.value = employeeToEdit.email;
      if (phoneRef.current) phoneRef.current.value = employeeToEdit.phone;
      if (salaryRef.current) salaryRef.current.value = employeeToEdit.salary;
    } catch (error) {
      console.error('Error fetching employee data:', error);
    }
  };

  return (
    <div className="w-full min-h-screen bg-gray-900 flex justify-center px-4">
      <main className="my-10 w-full max-w-screen-md">
        <h1 className="text-4xl font-medium text-white">
          Cadastro de funcionários
        </h1>

        <form className="flex flex-col my-6" onSubmit={handleSubmit}>
          <label className="font-medium text-white">Nome:</label>
          <input
            type="text"
            placeholder="Digite o nome completo do funcionário..."
            className="w-full mb-5 p-2 rounded"
            ref={nameRef}
          />

          <label className="font-medium text-white">Email:</label>
          <input
            type="email"
            placeholder="Digite o email do funcionário..."
            className="w-full mb-5 p-2 rounded"
            ref={emailRef}
          />

          <label className="font-medium text-white">Telefone:</label>
          <input
            type="text"
            placeholder="Digite o número de telefone do funcionário..."
            className="w-full mb-5 p-2 rounded"
            ref={phoneRef}
          />

          <label className="font-medium text-white">Salário:</label>
          <input
            type="text"
            placeholder="Digite o salário bruto do funcionário..."
            className="w-full mb-5 p-2 rounded"
            ref={salaryRef}
          />

          <input
            type="submit"
            value={editingEmployee ? 'Atualizar' : 'Cadastrar'}
            className="cursor-pointer w-full p-2 bg-green-500 rounded font-medium"
          />
        </form>

        <section className="flex flex-col gap-4">
          {employees.map(employee => (
            <article
              key={employee.id}
              className="w-full bg-white rounded p-2 relative hover:scale-105 duration-200"
            >
              <p>
                <span className="font-medium">Nome:</span> {employee.name}
              </p>
              <p>
                <span className="font-medium">Email:</span> {employee.email}
              </p>
              <p>
                <span className="font-medium">Telefone:</span> {employee.phone}
              </p>
              <p>
                <span className="font-medium">Salário:</span> {employee.salary}
              </p>

              <button
                className="bg-red-500 w-7 h-7 flex items-center justify-center rounded-lg absolute right-0 top-0 hover:scale-50 duration-200"
                onClick={() => handleDelete(employee.id)}
              >
                <FiTrash size={18} color="#FFF" />
              </button>

              <button
                className="bg-blue-500 w-7 h-7 flex items-center justify-center rounded-lg absolute right-10 top-0 hover:scale-50 duration-200"
                onClick={() => handleUpdate(employee.id)}
              >
                <FiTool size={18} color="#FFF" />
              </button>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
}
